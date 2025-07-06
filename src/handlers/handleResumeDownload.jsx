import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useState } from 'react';
import { showSuccess, showError, showWarning, showInfo } from '../utils/toast.jsx';
// First, install the required dependencies:
// npm install html2canvas jspdf

// or

// yarn add html2canvas jspdf

/**
 * Extract all links from the HTML and their positions
 * @param {HTMLElement} element - Root element to search for links
 * @returns {Array} Array of link objects with position data
 */
const extractAllLinks = (element) => {
  const links = [];
  const linkElements = element.querySelectorAll('a[href]');
  
  linkElements.forEach((linkEl, index) => {
    const href = linkEl.getAttribute('href');
    if (!href || href.startsWith('#')) return; // Skip empty links and internal anchors
    
    // Make sure we have a full URL
    let fullUrl = href;
    if (href.startsWith('mailto:')) {
      fullUrl = href;
    } else if (href.includes('@') && !href.startsWith('http')) {
      fullUrl = `mailto:${href}`;
    } else if (!href.startsWith('http')) {
      fullUrl = href.startsWith('www.') ? `https://${href}` : `https://${href}`;
    }
    
    const rect = linkEl.getBoundingClientRect();
    const containerRect = element.getBoundingClientRect();
    
    links.push({
      id: `link-${index}`,
      url: fullUrl,
      text: linkEl.textContent.trim(),
      element: linkEl,
      // Position relative to container
      x: rect.left - containerRect.left,
      y: rect.top - containerRect.top,
      width: rect.width,
      height: rect.height,
      // Store original position for later calculation
      originalRect: rect,
      containerRect: containerRect
    });
  });
  
  return links;
};

/**
 * Create a pure text-based PDF with proper links
 * This approach reconstructs the resume content as text with working links
 */
export const createTextBasedPDF = async (resumeContainerSelector = '.preview-container', filename = 'resume') => {
  try {
    const container = document.querySelector(resumeContainerSelector);
    if (!container) {
      throw new Error(`Container not found: ${resumeContainerSelector}`);
    }

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    let currentY = margin;
    const lineHeight = 5;
    const sectionSpacing = 8;

    // Helper function to check if we need a new page
    const checkNewPage = (requiredSpace = lineHeight) => {
      if (currentY + requiredSpace > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
        return true;
      }
      return false;
    };

    // Process each page container
    const pageContainers = container.querySelectorAll('.page-break-container');
    
    for (let pageIndex = 0; pageIndex < pageContainers.length; pageIndex++) {
      const pageContainer = pageContainers[pageIndex];
      
      if (pageIndex > 0) {
        pdf.addPage();
        currentY = margin;
      }

      // Process sections in order
      const sections = pageContainer.querySelectorAll('section, .section, .resume-section, .header, .personal-info');
      
      for (const section of sections) {
        // Section headers
        const headers = section.querySelectorAll('h1, h2, h3, h4, .section-title, .name, .title');
        headers.forEach(header => {
          checkNewPage(lineHeight + 2);
          const fontSize = header.tagName === 'H1' || header.classList.contains('name') ? 16 : 
                          header.tagName === 'H2' ? 14 : 12;
          pdf.setFontSize(fontSize);
          pdf.setFont(undefined, 'bold');
          pdf.text(header.textContent.trim(), margin, currentY);
          currentY += lineHeight + 2;
        });

        // Process content elements
        const contentElements = section.querySelectorAll('p, li, div, span');
        
        for (const element of contentElements) {
          // Skip if this element is a header or already processed
          if (element.matches('h1, h2, h3, h4, .section-title, .name, .title')) continue;
          
          const text = element.textContent.trim();
          if (!text) continue;

          checkNewPage();
          pdf.setFontSize(10);
          pdf.setFont(undefined, 'normal');

          // Check if this element contains links
          const links = element.querySelectorAll('a[href]');
          
          if (links.length > 0) {
            // Process text with links
            let processedText = text;
            let xPosition = margin;
            
            // Split text by links and process each part
            const linkData = Array.from(links).map(link => ({
              text: link.textContent.trim(),
              url: link.getAttribute('href'),
              start: text.indexOf(link.textContent.trim()),
              end: text.indexOf(link.textContent.trim()) + link.textContent.trim().length
            }));

            // Sort links by position
            linkData.sort((a, b) => a.start - b.start);

            let lastIndex = 0;
            
            linkData.forEach(linkInfo => {
              // Add text before link
              const beforeText = text.substring(lastIndex, linkInfo.start);
              if (beforeText) {
                pdf.text(beforeText, xPosition, currentY);
                xPosition += pdf.getTextWidth(beforeText);
              }

              // Add the link
              let fullUrl = linkInfo.url;
              if (linkInfo.url.includes('@') && !linkInfo.url.startsWith('mailto:')) {
                fullUrl = `mailto:${linkInfo.url}`;
              } else if (!linkInfo.url.startsWith('http') && !linkInfo.url.startsWith('mailto:')) {
                fullUrl = linkInfo.url.startsWith('www.') ? `https://${linkInfo.url}` : `https://${linkInfo.url}`;
              }

              pdf.setTextColor(0, 0, 255); // Blue for links
              pdf.textWithLink(linkInfo.text, xPosition, currentY, { url: fullUrl });
              pdf.setTextColor(0, 0, 0); // Reset to black
              xPosition += pdf.getTextWidth(linkInfo.text);

              lastIndex = linkInfo.end;
            });

            // Add remaining text after last link
            const remainingText = text.substring(lastIndex);
            if (remainingText) {
              pdf.text(remainingText, xPosition, currentY);
            }
          } else {
            // Regular text without links
            const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
            lines.forEach(line => {
              checkNewPage();
              pdf.text(line, margin, currentY);
              currentY += lineHeight;
            });
            continue; // Skip the currentY increment below
          }

          currentY += lineHeight;
        }

        currentY += sectionSpacing;
      }
    }

    // Save the PDF
    pdf.save(`${filename}.pdf`);

    return {
      success: true,
      message: 'PDF generated successfully with working links',
      pages: pdf.internal.getNumberOfPages()
    };

  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};

/**
 * Hybrid approach: Image-based PDF with overlay links
 * This creates an image-based PDF but adds precise link annotations
 */
export const createHybridPDF = async (resumeContainerSelector = '.preview-container', filename = 'resume', options = {}) => {
  try {
    const defaultOptions = {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      letterRendering: true,
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    const previewContainer = document.querySelector(resumeContainerSelector);
    if (!previewContainer) {
      throw new Error(`Preview container not found: ${resumeContainerSelector}`);
    }

    // Reset any transforms for accurate measurements
    const originalTransform = previewContainer.style.transform;
    const originalTransformOrigin = previewContainer.style.transformOrigin;
    
    previewContainer.style.transform = 'scale(1)';
    previewContainer.style.transformOrigin = 'top left';
    previewContainer.offsetHeight; // Force reflow
    
    await new Promise(resolve => setTimeout(resolve, 300));

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageContainers = previewContainer.querySelectorAll('.page-break-container');
    if (pageContainers.length === 0) {
      throw new Error('No pages found');
    }

    for (let i = 0; i < pageContainers.length; i++) {
      const pageContainer = pageContainers[i];
      
      // Extract all links from this page BEFORE taking screenshot
      const pageLinks = extractAllLinks(pageContainer);
      
      // Prepare container for screenshot
      const originalStyles = {
        boxShadow: pageContainer.style.boxShadow,
        margin: pageContainer.style.margin,
        transform: pageContainer.style.transform,
        position: pageContainer.style.position
      };
      
      pageContainer.style.boxShadow = 'none';
      pageContainer.style.margin = '0';
      pageContainer.style.transform = 'none';
      pageContainer.style.position = 'relative';
      pageContainer.offsetHeight; // Force reflow

      try {
        // Take screenshot
        const canvas = await html2canvas(pageContainer, {
          ...finalOptions,
          width: pageContainer.scrollWidth,
          height: pageContainer.scrollHeight,
          scrollX: 0,
          scrollY: 0,
          windowWidth: pageContainer.scrollWidth,
          windowHeight: pageContainer.scrollHeight,
          imageTimeout: 0,
          removeContainer: false
        });

        const imgData = canvas.toDataURL('image/png', 1.0);
        
        // Calculate PDF dimensions
        const canvasWidth = canvas.width / finalOptions.scale;
        const canvasHeight = canvas.height / finalOptions.scale;
        const mmPerPx = 25.4 / 96;
        const imgWidthMM = canvasWidth * mmPerPx;
        const imgHeightMM = canvasHeight * mmPerPx;

        // PDF page dimensions
        const pdfWidth = 210;
        const pdfHeight = 297;
        const marginMM = 5;
        const usableWidth = pdfWidth - (2 * marginMM);
        const usableHeight = pdfHeight - (2 * marginMM);

        // Scale to fit
        const scaleToFitWidth = usableWidth / imgWidthMM;
        const scaleToFitHeight = usableHeight / imgHeightMM;
        const scale = Math.min(scaleToFitWidth, scaleToFitHeight);

        const finalWidth = imgWidthMM * scale;
        const finalHeight = imgHeightMM * scale;
        const xOffset = marginMM;
        const yOffset = marginMM;

        // Add page
        if (i > 0) {
          pdf.addPage();
        }

        // Add image
        pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight, '', 'MEDIUM');

        // Add link annotations with precise positioning
        pageLinks.forEach(link => {
          try {
            // Calculate link position in PDF coordinates
            const containerRect = pageContainer.getBoundingClientRect();
            const linkRect = link.element.getBoundingClientRect();
            
            // Position relative to container
            const relativeX = linkRect.left - containerRect.left;
            const relativeY = linkRect.top - containerRect.top;
            
            // Convert to PDF coordinates
            const pdfX = xOffset + (relativeX * mmPerPx * scale);
            const pdfY = yOffset + (relativeY * mmPerPx * scale);
            const pdfLinkWidth = linkRect.width * mmPerPx * scale;
            const pdfLinkHeight = linkRect.height * mmPerPx * scale;

            // Ensure URL is properly formatted
            let fullUrl = link.url;
            if (link.url.includes('@') && !link.url.startsWith('mailto:')) {
              fullUrl = `mailto:${link.url}`;
            } else if (!link.url.startsWith('http') && !link.url.startsWith('mailto:')) {
              fullUrl = link.url.startsWith('www.') ? `https://${link.url}` : `https://${link.url}`;
            }

            // Add link annotation
            pdf.link(pdfX, pdfY, pdfLinkWidth, pdfLinkHeight, { url: fullUrl });
            
            // console.log(`Added link: ${link.text} -> ${fullUrl} at (${pdfX.toFixed(2)}, ${pdfY.toFixed(2)})`);
          } catch (linkError) {
            console.warn(`Failed to add link: ${link.text}`, linkError);
          }
        });

      } finally {
        // Restore original styles
        Object.keys(originalStyles).forEach(key => {
          if (originalStyles[key] !== null && originalStyles[key] !== undefined) {
            pageContainer.style[key] = originalStyles[key];
          } else {
            pageContainer.style[key] = '';
          }
        });
      }
    }

    // Restore original transform
    previewContainer.style.transform = originalTransform;
    previewContainer.style.transformOrigin = originalTransformOrigin;

    // Save PDF
    pdf.save(`${filename}.pdf`);

    return {
      success: true,
      message: `PDF generated with ${pageContainers.length} page(s) and working links`,
      pages: pageContainers.length
    };

  } catch (error) {
    console.error('Hybrid PDF generation failed:', error);
    throw new Error(`Hybrid PDF generation failed: ${error.message}`);
  }
};

/**
 * Main download function with multiple approaches
 * @param {string} resumeContainerSelector - CSS selector for resume container
 * @param {string} filename - PDF filename
 * @param {string} method - 'text' for text-based, 'hybrid' for image+links, 'auto' for best choice
 * @param {Object} options - Additional options
 */
export const handleDownload = async (resumeContainerSelector = '.preview-container', filename = 'resume', method = 'hybrid', options = {}) => {
  try {
    switch (method) {
      case 'text':
        return await createTextBasedPDF(resumeContainerSelector, filename);
      case 'hybrid':
        return await createHybridPDF(resumeContainerSelector, filename, options);
      case 'auto':
        // Try hybrid first, fall back to text if it fails
        try {
          return await createHybridPDF(resumeContainerSelector, filename, options);
        } catch (hybridError) {
          console.warn('Hybrid method failed, trying text-based:', hybridError);
          return await createTextBasedPDF(resumeContainerSelector, filename);
        }
      default:
        throw new Error(`Unknown method: ${method}. Use 'text', 'hybrid', or 'auto'`);
    }
  } catch (error) {
    console.error('PDF download failed:', error);
    throw error;
  }
};

/**
 * React hook for resume download
 */
export const useResumeDownload = (resumeData, filename = 'resume', method = 'hybrid') => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  
  const downloadResume = async (customFilename = null, customMethod = null, options = {}) => {
    setIsDownloading(true);
    setDownloadError(null);
    
    try {
      const finalFilename = customFilename || 
        (resumeData?.personalInfo?.name ? 
          `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume` : 
          filename);
      
      const finalMethod = customMethod || method;
      
      const result = await handleDownload('.preview-container', finalFilename, finalMethod, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        ...options
      });
      
      return result;
      
    } catch (error) {
      setDownloadError(error.message);
      throw error;
    } finally {
      setIsDownloading(false);
    }
  };
  
  return {
    downloadResume,
    isDownloading,
    downloadError
  };
};

/**
 * Simple download function for onClick handlers
 */
export const handleResumeDownload = async (setIsDownloading, resumeData = null, currentZoom = null, method = 'hybrid') => {
  setIsDownloading(true);
  
  try {
    const filename = resumeData?.personalInfo?.name ? 
      `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume` : 
      'resume';
    
    // Reset zoom if provided
    const previewContainer = document.querySelector('.preview-container');
    let originalTransform = null;
    
    if (currentZoom && previewContainer) {
      originalTransform = previewContainer.style.transform;
      previewContainer.style.transform = 'scale(1)';
      previewContainer.style.transformOrigin = 'top left';
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    try {
      const result = await handleDownload('.preview-container', filename, method, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        letterRendering: true
      });
      showNotification("Download Successful", 'success');
      return result;
      
    } finally {
      if (originalTransform && previewContainer) {
        previewContainer.style.transform = originalTransform;
      }
    }
    
  } catch (error) {
    console.error('Download failed:', error);
    showNotification("Download failed",'error');
    throw error;
  } finally {
    setIsDownloading(false);
  }
};

const showNotification = (message, type) => {
  if(type === 'error'){
    showError(message);
  } else if(type === 'success'){
    showSuccess(message);
  } else if(type === 'warning'){
    showWarning(message);
  } else if(type === 'info'){
    showInfo(message);
  } else {
    alert(message); // Fallback only
  }
};