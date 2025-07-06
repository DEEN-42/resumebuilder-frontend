import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import CreateResumeModal from './CreateResumeModal';
import { useResumeDataforDashboard } from '../../hooks/useResumeData';
import { useResumeActions } from '../../hooks/useResumeActions';
import './dashboard.css';

const Dashboard = ({ logout }) => {
  const [activeSection, setActiveSection] = useState('owned');
  const [selectedResume, setSelectedResume] = useState(null);
  const [expandedResume, setExpandedResume] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [showShareInput, setShowShareInput] = useState(null);
  const navigate = useNavigate();
  
  const { resumeData, setResumeData } = useResumeDataforDashboard();
  const { handleCreateResume, handleDeleteResume, handleShareResume } = useResumeActions(
    setResumeData,
    setShowCreateForm,
    setShareEmail,
    setShowShareInput,
    setExpandedResume
  );

  const handleResumeClick = (resume) => {
    if (expandedResume?.id === resume.id) {
      setExpandedResume(null);
      setShowShareInput(null);
      setShareEmail('');
    } else {
      setExpandedResume(resume);
      setShowShareInput(null);
      setShareEmail('');
    }
  };

  const handleOpenResume = (id) => {
    navigate(`/project/${id}`);
  };

  const handleShareClick = (e, resumeId) => {
    e.stopPropagation();
    setShowShareInput(showShareInput === resumeId ? null : resumeId);
    setShareEmail('');
  };

  const getResumeCount = (section) => {
    return resumeData && resumeData[section] ? resumeData[section].length : 0;
  };

  const getResumes = (section) => {
    return resumeData && resumeData[section] ? resumeData[section] : [];
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        getResumeCount={getResumeCount}
        logout={logout}
      />
      
      <MainContent
        activeSection={activeSection}
        selectedResume={selectedResume}
        setSelectedResume={setSelectedResume}
        expandedResume={expandedResume}
        showShareInput={showShareInput}
        shareEmail={shareEmail}
        setShareEmail={setShareEmail}
        setShowCreateForm={setShowCreateForm}
        getResumes={getResumes}
        handleResumeClick={handleResumeClick}
        handleOpenResume={handleOpenResume}
        handleShareClick={handleShareClick}
        handleDeleteResume={handleDeleteResume}
        handleShareResume={handleShareResume}
      />
      
      {showCreateForm && (
        <CreateResumeModal
          showCreateForm={showCreateForm}
          setShowCreateForm={setShowCreateForm}
          handleCreateResume={handleCreateResume}
        />
      )}
    </div>
  );
};

export default Dashboard;