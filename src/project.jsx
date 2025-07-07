// project.jsx - Fixed version with proper socket management
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { handleResumeDownload } from './handlers/handleResumeDownload.jsx';
import './project.css';

// Configuration imports
import { getInitialGlobalStyles } from './config/globalStyles.jsx';
import { getInitialResumeData } from './config/resumeData.jsx';
import { getTemplatesConfig } from './config/templates.jsx';

// Separated Components
import Header from './Components/Header/Header.jsx';
import Loading from './Components/Loading/Loading.jsx';
import Error from './Components/Error/Error.jsx';
import RightPanel from './Components/RightPanel/RightPanel.jsx';

// Form Components
import PersonalInfoForm from './Components/FormSections/PersonalInfoForm/PersonalInfoForm.jsx';
import EducationForm from './Components/FormSections/EducationForm/EducationForm.jsx';
import InternshipsForm from './Components/FormSections/InternshipsForm/InternshipsForm.jsx';
import ProjectsForm from './Components/FormSections/ProjectsForm/ProjectsForm.jsx';
import SkillsForm from './Components/FormSections/SkillsForm/SkillsForm.jsx';
import AwardsForm from './Components/FormSections/AwardsForm/AwardsForm.jsx';
import ExtraAcademicActivitiesForm from './Components/FormSections/ExtraCurricularForm/ExtraAcademicActivitiesForm.jsx';
import CourseworkForm from './Components/FormSections/CourseworkForm/CourseworkForm.jsx';
import PositionsOfResponsibilityForm from './Components/FormSections/PositionsOfResponsibilityForm/PositionsOfResponsibilityForm.jsx';

// Handler imports
import { createResumeDataHandlers } from './handlers/resumeDataHandlers.jsx';
import { createUIHandlers } from './handlers/uiHandlers.jsx';
import { createSocketHandlers } from './handlers/socketHandlers.jsx';
import { createSaveHandlers } from './handlers/saveHandlers.jsx';
import { createDataLoader } from './handlers/dataLoader.jsx';

// Main Application
const ResumeBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // UI States
  const [selectedTemplate, setSelectedTemplate] = useState('iitkg');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Socket.IO states
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [lastUpdatedBy, setLastUpdatedBy] = useState(null);
  
  // Save status states
  const [saveStatus, setSaveStatus] = useState('saved');
  const [lastSaved, setLastSaved] = useState(null);
  
  // Refs for debouncing and preventing unnecessary saves
  const saveTimeoutRef = useRef(null);
  const lastSaveDataRef = useRef(null);
  const isSavingRef = useRef(false);
  const isUpdatingFromSocketRef = useRef(false);
  
  // **CRITICAL FIX**: Ref to track if socket is initialized
  const socketInitializedRef = useRef(false);
  const socketCleanupRef = useRef(null);

  // Configuration states - initialized from config modules
  const [globalStyles, setGlobalStyles] = useState(getInitialGlobalStyles());
  const [resumeData, setResumeData] = useState(getInitialResumeData());
  const templates = getTemplatesConfig();

  // SidePanel
  const [activeSideTab, setActiveSideTab] = useState('share');
  
  // Initialize handlers
  const dataHandlers = createResumeDataHandlers(setResumeData);
  
  const saveHandlers = createSaveHandlers(
    id,
    selectedTemplate,
    globalStyles,
    resumeData,
    setSaveStatus,
    setLastSaved,
    setError,
    isSavingRef,
    isUpdatingFromSocketRef,
    lastSaveDataRef
  );

  const socketHandlers = createSocketHandlers(
    id,
    setSocket,
    setIsConnected,
    setConnectedUsers,
    setLastUpdatedBy,
    setResumeData,
    setGlobalStyles,
    setSelectedTemplate,
    isUpdatingFromSocketRef
  );

  const uiHandlers = createUIHandlers(
    setZoomLevel,
    setSelectedTemplate,
    setGlobalStyles,
    navigate,
    handleResumeDownload,
    setIsDownloading,
    resumeData,
    saveHandlers.saveResumeData,
    setActiveSideTab,
    activeSideTab
  );

  const dataLoader = createDataLoader(
    id,
    setIsLoading,
    setError,
    setResumeData,
    setGlobalStyles,
    setSelectedTemplate,
    setSaveStatus,
    setLastSaved,
    lastSaveDataRef,
    templates,
    globalStyles,
    resumeData,
    // **CRITICAL FIX**: Pass the socket initialization function
    () => {
      if (!socketInitializedRef.current && id) {
        console.log('Initializing socket from data loader');
        socketInitializedRef.current = true;
        socketCleanupRef.current = socketHandlers.initializeSocket();
      }
    }
  );

  const handleGoHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Create debounced save function
  const debouncedSave = useCallback(
    saveHandlers.debouncedSave(saveTimeoutRef),
    [saveHandlers.debouncedSave]
  );

  // **CRITICAL FIX**: Proper socket cleanup effect
  useEffect(() => {
    return () => {
      console.log('Component unmounting - cleaning up socket');
      if (socketCleanupRef.current) {
        socketCleanupRef.current();
      }
      if (socket) {
        socket.disconnect();
      }
      socketInitializedRef.current = false;
    };
  }, []); // Empty dependency array - only run on mount/unmount

  // **CRITICAL FIX**: Load resume data and initialize socket only once
  useEffect(() => {
    if (id && !socketInitializedRef.current) {
      console.log('Loading resume data and initializing socket for ID:', id);
      dataLoader.loadResumeData();
    }
  }, [id]); // Only depend on id

  // **CRITICAL FIX**: Handle ID changes (when navigating to different resumes)
  useEffect(() => {
    // If ID changes, cleanup current socket and reinitialize
    if (id && socketInitializedRef.current) {
      console.log('Resume ID changed, reinitializing socket');
      
      // Cleanup current socket
      if (socketCleanupRef.current) {
        socketCleanupRef.current();
      }
      
      // Reset flag and reinitialize
      socketInitializedRef.current = false;
      setIsLoading(true);
      
      // Small delay to ensure cleanup is complete
      setTimeout(() => {
        dataLoader.loadResumeData();
      }, 100);
    }
  }, [id]);

  // Effect to update institute logo when template changes
  useEffect(() => {
    const selectedTemplateData = templates[selectedTemplate];
    if (selectedTemplateData) {
      setResumeData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          institutelogo: selectedTemplateData.logo
        }
      }));
    }
  }, [selectedTemplate]);

  // Auto-save when data changes (modified to ignore socket updates)
  useEffect(() => {
    if (!isLoading && id && !isUpdatingFromSocketRef.current) {
      debouncedSave();
    }
  }, [resumeData, globalStyles, selectedTemplate, debouncedSave, isLoading, id]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const TemplateComponent = templates[selectedTemplate].component;

  // Show loading state
  if (isLoading) {
    return <Loading message="Loading resume..." />;
  }

  // Show error state
  if (error && !resumeData.personalInfo.name) {
    return (
      <Error
        error={`Error loading resume: ${error}`}
        onRetry={dataLoader.loadResumeData}
        onGoHome={handleGoHome}
        title="Failed to load resume"
      />
    );
  }

  return (
    <div className="resume-builder-container">
      {/* Header - Extended to full width */}
      <Header
        // UI handlers
        returnHandler={uiHandlers.returnHandler}
        handleTemplateChange={uiHandlers.handleTemplateChange}
        handleAISuggestions={uiHandlers.handleAISuggestions}
        handleZoomIn={uiHandlers.handleZoomIn}
        handleZoomOut={uiHandlers.handleZoomOut}
        handleZoomReset={uiHandlers.handleZoomReset}
        handleDownload={uiHandlers.handleDownload}
        handleShare={uiHandlers.handleShare}
        handleATSscore={uiHandlers.handleATSscore}
        
        // Save handlers
        saveResumeData={saveHandlers.saveResumeData}
        
        // State
        selectedTemplate={selectedTemplate}
        templates={templates}
        zoomLevel={zoomLevel}
        isDownloading={isDownloading}
        saveStatus={saveStatus}
        lastSaved={lastSaved}
        lastUpdatedBy={lastUpdatedBy}
        isConnected={isConnected}
        connectedUsers={connectedUsers}
      />

      <div className="builder-content-with-sharing">
        {/* Left Panel - Form */}
        <div className="form-panel">
          <PersonalInfoForm
            id={id}
            data={resumeData.personalInfo}
            onChange={dataHandlers.handlePersonalInfoChange}
            styles={globalStyles}
            onStyleChange={uiHandlers.handleStyleChange}
          />
          <EducationForm 
            data={resumeData.education} 
            onChange={dataHandlers.handleEducationChange} 
          />
          <InternshipsForm 
            data={resumeData.internships} 
            onChange={dataHandlers.handleInternshipsChange} 
          />
          <ProjectsForm 
            data={resumeData.projects} 
            onChange={dataHandlers.handleProjectsChange} 
          />
          <SkillsForm 
            data={resumeData.skills} 
            onChange={dataHandlers.handleSkillsChange} 
          />
          <AwardsForm 
            data={resumeData.awards} 
            onChange={dataHandlers.handleAwardsChange} 
          />
          <ExtraAcademicActivitiesForm 
            data={resumeData.extraAcademicActivities} 
            onChange={dataHandlers.handleExtraAcademicActivitiesChange} 
          />
          <CourseworkForm 
            data={resumeData.coursework} 
            onChange={dataHandlers.handleCourseworkChange} 
          />
          <PositionsOfResponsibilityForm 
            data={resumeData.position} 
            onChange={dataHandlers.handlePositionsOfResponsibilityChange} 
          />
        </div>

        {/* Middle Panel - Preview */}
        <div className="preview-panel">
          <div 
            className="preview-container"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            <div>
              <TemplateComponent data={resumeData} styles={globalStyles} />
            </div>
          </div>
        </div>

        {/* Right Panel*/}
        <RightPanel
          id={id}
          resumeData={resumeData}
          activeTab={activeSideTab}
          dataHandlers={dataHandlers}
          connectedUsers= {connectedUsers}
        />
      </div>
    </div>
  );
};

export default ResumeBuilder;