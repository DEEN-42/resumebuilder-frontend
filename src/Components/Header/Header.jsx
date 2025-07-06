// Components/Header/Header.jsx
import React from 'react';
import { Home, Wand2, Download, Plus, Minus, Share2, BarChart3 } from 'lucide-react';
import { SaveStatusIndicator, ConnectionStatusIndicator, ConnectedUsersIndicator } from '../StatusComponents/StatusComponents.jsx';
import './Header.css';

const Header = ({
  // UI handlers
  returnHandler,
  handleTemplateChange,
  handleAISuggestions,
  handleZoomIn,
  handleZoomOut,
  handleZoomReset,
  handleDownload,
  handleShare,
  handleATSscore,
  
  // Save handlers
  saveResumeData,
  
  // State
  selectedTemplate,
  templates,
  zoomLevel,
  isDownloading,
  saveStatus,
  lastSaved,
  lastUpdatedBy,
  isConnected,
  connectedUsers
}) => {
  return (
    <div className="resume-header">
      <div className="header-left">
        <button 
          onClick={returnHandler}
          className="home-button"
          title="Return to Home"
        >
          <Home size={20} />
        </button>
        <h1>RESUME BUILDER</h1>
        <SaveStatusIndicator 
          saveStatus={saveStatus}
          lastSaved={lastSaved}
          lastUpdatedBy={lastUpdatedBy}
          onRetry={saveResumeData}
        />
        <ConnectionStatusIndicator isConnected={isConnected} />
        <ConnectedUsersIndicator 
          isConnected={isConnected}
          connectedUsers={connectedUsers}
        />
      </div>
      
      <div className="header-actions">
        <select
          value={selectedTemplate}
          onChange={(e) => handleTemplateChange(e.target.value)}
          className="template-selector"
        >
          {Object.entries(templates).map(([key, template]) => (
            <option key={key} value={key}>{template.name}</option>
          ))}
        </select>
        
        <button
          onClick={handleAISuggestions}
          className="ai-suggestions-btn"
        >
          <Wand2 size={18} />
          AI Update
        </button>
        
        <div className="zoom-controls">
          <button
            onClick={handleZoomOut}
            className="zoom-btn"
            title="Zoom Out"
          >
            <Minus size={16} stroke="#64748b" />
          </button>
          <span className="zoom-level">{zoomLevel}%</span>
          <button
            onClick={handleZoomIn}
            className="zoom-btn"
            title="Zoom In"
          >
            <Plus size={16} stroke="#64748b" />
          </button>
          <button
            onClick={handleZoomReset}
            className="zoom-reset-btn"
            title="Reset Zoom"
          >
            Reset
          </button>
        </div>
        
        <button
          onClick={handleShare}
          className="share-btn"
        >
          <Share2 size={16} />
          Share
        </button>
        <button
          onClick={handleATSscore}
          className="share-btn"
        >
          <BarChart3 size={16} />
          ATS
        </button>
        

        <button 
          className="download-btn"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          <Download size={16} />
          {isDownloading ? 'Generating PDF...' : 'Download'}
        </button>
      </div>
    </div>
  );
};

export default Header;