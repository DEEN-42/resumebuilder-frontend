import React from 'react';
import { Plus } from 'lucide-react';
import ResumeDetails from './ResumeDetails';
import ResumeGrid from './ResumeGrid';

const MainContent = ({
  activeSection,
  selectedResume,
  setSelectedResume,
  expandedResume,
  showShareInput,
  shareEmail,
  setShareEmail,
  setShowCreateForm,
  getResumes,
  handleResumeClick,
  handleOpenResume,
  handleShareClick,
  handleDeleteResume,
  handleShareResume
}) => {
  return (
    <div className="main-content">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <div>
            <h2 className="header-title">
              {activeSection} Resumes
            </h2>
            <p className="header-subtitle">
              {activeSection === 'owned' ? 'Create and manage your resumes' : 'Resumes shared with you'}
            </p>
          </div>
          {activeSection === 'owned' && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="create-button"
            >
              <Plus className="create-icon" />
              <span className="create-text">Create Resume</span>
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="content-area">
        {selectedResume ? (
          <ResumeDetails
            selectedResume={selectedResume}
            setSelectedResume={setSelectedResume}
            handleOpenResume={handleOpenResume}
            handleDeleteResume={handleDeleteResume}
          />
        ) : (
          <ResumeGrid
            activeSection={activeSection}
            resumes={getResumes(activeSection)}
            expandedResume={expandedResume}
            showShareInput={showShareInput}
            shareEmail={shareEmail}
            setShareEmail={setShareEmail}
            handleResumeClick={handleResumeClick}
            handleOpenResume={handleOpenResume}
            handleShareClick={handleShareClick}
            handleDeleteResume={handleDeleteResume}
            handleShareResume={handleShareResume}
          />
        )}
      </div>
    </div>
  );
};

export default MainContent;