import React, { useState, useEffect } from 'react';
import { Home, Wand2, Download, Eye, Plus, Minus } from 'lucide-react';
import iitkgplogo from './assets/iitkgp_logo.png';
import isikolkatalogo from './assets/isikolkata_logo.png';
import IITKGPTemplate from './templates/IIT_KGP/IITKGPTemplate.jsx';
import ISITemplate from './templates/ISI_Template/ISI_Template.jsx';
import JohnDoeTemplate from './templates/JohnDoe/JohnDoeTemplate.jsx';
import { handleResumeDownload } from './handleResumeDownload.jsx';
import './project.css';
// Form Components
import PersonalInfoForm from './Components/PersonalInfoForm/PersonalInfoForm.jsx';
import EducationForm from './Components/EducationForm/EducationForm.jsx';
import InternshipsForm from './Components/InternshipsForm/InternshipsForm.jsx';
import ProjectsForm from './Components/ProjectsForm/ProjectsForm.jsx';
import SkillsForm from './Components/SkillsForm/SkillsForm.jsx';
import AwardsForm from './Components/AwardsForm/AwardsForm.jsx';
import ExtraAcademicActivitiesForm from './Components/ExtraCurricularForm/ExtraAcademicActivitiesForm.jsx';
import CourseworkForm from './Components/CourseworkForm/CourseworkForm.jsx';
import PositionsOfResponsibilityForm from './Components/PositionsOfResponsibilityForm/PositionsOfResponsibilityForm.jsx';

// Main Application
const ResumeBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('iitkg');
  const [zoomLevel, setZoomLevel] = useState(70); // Default zoom level as percentage
  const [isDownloading, setIsDownloading] = useState(false);
  const [globalStyles, setGlobalStyles] = useState({
    heading: {
      fontSize: 16,
      fontFamily: 'Arial',
      color: '#000000',
      bold: true,
      italic: false,
      underline: false
    },
    description: {
      fontSize: 12,
      fontFamily: 'Arial',
      color: '#000000',
      bold: false,
      italic: false,
      underline: false
    }
  });

  const [resumeData, setResumeData] = useState({
    personalInfo: {
        name: '',
        rollNo: '',
        program: '',
        specialization: '',
        email: '',
        contact: '',
        linkedin: '',
        github: '',
        profilePicture: null,
        institutelogo: iitkgplogo, // Default to IIT KGP logo
      },
    
    education: [],
    internships: [],
    projects: [],
    skills: [],
    awards: [],
    extraAcademicActivities: [],
    coursework: [],
    competitions: [],
    position: [],
    publications: [],
    extracurricular: [],
  });

  const templates = {
    iitkg: { name: 'IIT KGP Template', component: IITKGPTemplate, logo: iitkgplogo },
    isikolkata: { name: 'ISI Template', component: ISITemplate, logo: isikolkatalogo },
    JohnDoe: { name: 'John Doe Template', component: JohnDoeTemplate, logo: null }
  };

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

  const handlePersonalInfoChange = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const handleEducationChange = (index, field, value) => {
    if (index === 'add') {
      setResumeData(prev => ({
        ...prev,
        education: [...prev.education, { year: '', degree: '', institute: '', cgpa: '' }]
      }));
    } else if (field === 'remove') {
      setResumeData(prev => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== index)
      }));
    } else {
      setResumeData(prev => ({
        ...prev,
        education: prev.education.map((edu, i) => 
          i === index ? { ...edu, [field]: value } : edu
        )
      }));
    }
  };

  const handleInternshipsChange = (index, field, value) => {
    if (index === 'add') {
      setResumeData(prev => ({
        ...prev,
        internships: [...prev.internships, { title: '', company: '', duration: '', description: '' }]
      }));
    } else if (field === 'remove') {
      setResumeData(prev => ({
        ...prev,
        internships: prev.internships.filter((_, i) => i !== index)
      }));
    } else {
      setResumeData(prev => ({
        ...prev,
        internships: prev.internships.map((intern, i) => 
          i === index ? { ...intern, [field]: value } : intern
        )
      }));
    }
  };

  const handleProjectsChange = (index, field, value) => {
    if (index === 'add') {
      setResumeData(prev => ({
        ...prev,
        projects: [...prev.projects, { title: '', duration: '', description: '' }]
      }));
    } else if (field === 'remove') {
      setResumeData(prev => ({
        ...prev,
        projects: prev.projects.filter((_, i) => i !== index)
      }));
    } else {
      setResumeData(prev => ({
        ...prev,
        projects: prev.projects.map((project, i) => 
          i === index ? { ...project, [field]: value } : project
        )
      }));
    }
  };

  const handleSkillsChange = (index, field, value) => {
    if (index === 'add') {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, { title: '', description: '' }]
      }));
    } else if (field === 'remove') {
      setResumeData(prev => ({
        ...prev,
        skills: prev.skills.filter((_, i) => i !== index)
      }));
    } else {
      setResumeData(prev => ({
        ...prev,
        skills: prev.skills.map((skill, i) => 
          i === index ? { ...skill, [field]: value } : skill
        )
      }));
    }
    console.log(resumeData.skills);
  };

  const handleAwardsChange = (index, field, value) => {
    if (index === 'add') {
      setResumeData(prev => ({
        ...prev,
        awards: [...prev.awards, { title: '', description: '' }]
      }));
    } else if (field === 'remove') {
      setResumeData(prev => ({
        ...prev,
        awards: prev.awards.filter((_, i) => i !== index)
      }));
    } else {
      setResumeData(prev => ({
        ...prev,
        awards: prev.awards.map((award, i) => 
          i === index ? { ...award, [field]: value } : award
        )
      }));
    }
  };

  const handleExtraAcademicActivitiesChange = (index, field, value) => {
    if (index === 'add') {
      setResumeData(prev => ({
        ...prev,
        extraAcademicActivities: [...prev.extraAcademicActivities, { title: '', description: '' }]
      }));
    } else if (field === 'remove') {
      setResumeData(prev => ({
        ...prev,
        extraAcademicActivities: prev.extraAcademicActivities.filter((_, i) => i !== index)
      }));
    } else {
      setResumeData(prev => ({
        ...prev,
        extraAcademicActivities: prev.extraAcademicActivities.map((activity, i) => 
          i === index ? { ...activity, [field]: value } : activity
        )
      }));
    }
  };

  const handleCourseworkChange = (index, field, value) => {
    if (index === 'add') {
      setResumeData(prev => ({
        ...prev,
        coursework: [...prev.coursework, { title: '', description: '' }]
      }));
    } else if (field === 'remove') {
      setResumeData(prev => ({
        ...prev,
        coursework: prev.coursework.filter((_, i) => i !== index)
      }));
    } else {
      setResumeData(prev => ({
        ...prev,
        coursework: prev.coursework.map((course, i) => 
          i === index ? { ...course, [field]: value } : course
        )
      }));
    }
  };

  const handlePositionsOfResponsibilityChange = (index, field, value) => {
    if (index === 'add') {
      setResumeData(prev => ({
        ...prev,
        position: [...prev.position, { title: '', time: '', description: '' }] // Changed 'duration' to 'time'
      }));
    } else if (field === 'remove') {
      setResumeData(prev => ({
        ...prev,
        position: prev.position.filter((_, i) => i !== index)
      }));
    } else {
      setResumeData(prev => ({
        ...prev,
        position: prev.position.map((pos, i) => 
          i === index ? { ...pos, [field]: value } : pos
        )
      }));
    }
  };

  const handleStyleChange = (category, property, value) => {
    setGlobalStyles(prev => ({
      ...prev,
      [category]: { ...prev[category], [property]: value }
    }));
    console.log(globalStyles);
  };

  const handleAISuggestions = () => {
    console.log('Resume Data:', resumeData);
    console.log('Global Styles:', globalStyles);
    console.log('Selected Template:', selectedTemplate);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 150)); // Max zoom 150%
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 30)); // Min zoom 30%
  };

  const handleZoomReset = () => {
    setZoomLevel(70); // Reset to default
  };

  const handleDownload = async () => {
    try {
      await handleResumeDownload(setIsDownloading, resumeData);
    } catch (error) {
      console.error('Download failed:', error);
    }
  }
  
  const returnHandler = () => {
    console.log("Return handler called");
    // You can add navigation logic here later
  };
  
  const TemplateComponent = templates[selectedTemplate].component;

  return (
    <div className="resume-builder-container">
      {/* Header */}
      <div className="resume-header">
      <div className="header-left">
        <button 
          onClick={returnHandler}
          className="home-button"
          title="Return to Home"
          style={{
            background: 'red',
            border: '2px solid black',
            padding: '10px'
          }}
        >
          <Home size={20} />
        </button>
        <h1>Resume Builder</h1>
      </div>
        <div className="header-actions">
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
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
            <Wand2 size={16} />
            AI Suggestions
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
            className="download-btn"
            onClick={handleDownload}
            disabled={isDownloading}
            style={{
              opacity: isDownloading ? 0.6 : 1,
              cursor: isDownloading ? 'not-allowed' : 'pointer'
            }}
          >
            <Download size={16} />
            {isDownloading ? 'Generating PDF...' : 'Download'}
          </button>
        </div>
      </div>

      <div className="builder-content">
        {/* Left Panel - Form */}
        <div className="form-panel">
          <PersonalInfoForm
            data={resumeData.personalInfo}
            onChange={handlePersonalInfoChange}
            styles={globalStyles}
            onStyleChange={handleStyleChange}
          />
          <EducationForm data={resumeData.education} onChange={handleEducationChange} />
          <InternshipsForm data={resumeData.internships} onChange={handleInternshipsChange} />
          <ProjectsForm data={resumeData.projects} onChange={handleProjectsChange} />
          <SkillsForm data={resumeData.skills} onChange={handleSkillsChange} />
          <AwardsForm data={resumeData.awards} onChange={handleAwardsChange} />
          <ExtraAcademicActivitiesForm 
            data={resumeData.extraAcademicActivities} 
            onChange={handleExtraAcademicActivitiesChange} 
          />
          <CourseworkForm 
            data={resumeData.coursework} 
            onChange={handleCourseworkChange} 
          />
          <PositionsOfResponsibilityForm 
            data={resumeData.position} 
            onChange={handlePositionsOfResponsibilityChange} 
          />
        </div>

        {/* Right Panel - Preview */}
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
      </div>
    </div>
  );
};

export default ResumeBuilder;