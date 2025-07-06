import React from 'react';
import { usePageBreak, PageBreakWrapper } from '../../Components/FormSections/ResumeLayout/ResumeLayout';
import './JohnDoeTemplate.css';

const JohnDoeTemplate = ({ data, styles = {} }) => {
  // Default global styles if not provided
  const defaultGlobalStyles = {
    heading: {
      fontSize: 14,
      fontFamily: 'Times New Roman',
      color: '#000000',
      bold: true,
      italic: false,
      underline: false
    },
    description: {
      fontSize: 11,
      fontFamily: 'Times New Roman',
      color: '#000000',
      bold: false,
      italic: false,
      underline: false
    }
  };

  // Use styles as globalStyles and merge with defaults
  const mergedGlobalStyles = {
    heading: { ...defaultGlobalStyles.heading, ...(styles.heading || {}) },
    description: { ...defaultGlobalStyles.description, ...(styles.description || {}) }
  };

  // Helper function to apply text styles
  const getTextStyle = (styleType) => {
    const style = mergedGlobalStyles[styleType] || defaultGlobalStyles[styleType] || {};
    return {
      fontSize: `${style.fontSize || 11}px`,
      fontFamily: style.fontFamily || 'Times New Roman',
      color: style.color || '#000000',
      fontWeight: style.bold ? 'bold' : 'normal',
      fontStyle: style.italic ? 'italic' : 'normal',
      textDecoration: style.underline ? 'underline' : 'none'
    };
  };

  const renderContent = () => {
    const allElements = [
      // Header with Name and Contact Info - Left aligned
      <div key="header" className="johndoe-header">
        <h1 className="johndoe-name" style={getTextStyle('heading')}>
          {data.personalInfo.name || 'John Doe'}
        </h1>
        <div className="johndoe-contact-info" style={getTextStyle('description')}>
          {data.personalInfo.address && (
            <span>{data.personalInfo.address}</span>
          )}
          {data.personalInfo.email && (
            <span>{data.personalInfo.email}</span>
          )}
          {data.personalInfo.contact && (
            <span>{data.personalInfo.contact}</span>
          )}
          {data.personalInfo.website && (
            <span>{data.personalInfo.website}</span>
          )}
        </div>
        <div className="johndoe-links" style={getTextStyle('description')}>
          {data.personalInfo.linkedin && (
            <span>linkedin.com/in/{data.personalInfo.linkedin}</span>
          )}
          {data.personalInfo.github && (
            <span>github.com/{data.personalInfo.github}</span>
          )}
        </div>
      </div>
    ];

    // Welcome/Objective Section
    if (data.objective) {
      allElements.push(
        <div key="objective-section" className="johndoe-section">
          <h2 className="johndoe-section-title" style={getTextStyle('heading')}>Welcome to RenderCV!</h2>
          <div className="johndoe-section-content" style={getTextStyle('description')}>
            <p>{data.objective}</p>
          </div>
        </div>
      );
    }

    // Education
    if (data.education.length > 0) {
      allElements.push(
        <div key="education-section" className="johndoe-section">
          <h2 className="johndoe-section-title" style={getTextStyle('heading')}>Education</h2>
          <div className="johndoe-section-content">
            {data.education.map((edu, idx) => (
              <div key={idx} className="johndoe-education-item">
                <div className="johndoe-item-header">
                  <span style={getTextStyle('heading')}>
                    {edu.institute}, {edu.degree}
                  </span>
                  <span style={getTextStyle('heading')}>{edu.year}</span>
                </div>
                {edu.cgpa && (
                  <div style={getTextStyle('description')}>
                    • CGPA/Marks: {edu.cgpa}
                  </div>
                )}
                {edu.coursework && (
                  <div style={getTextStyle('description')}>
                    • <strong>Coursework:</strong> {edu.coursework}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Experience/Internships
    if (data.internships.length > 0) {
      allElements.push(
        <div key="experience-section" className="johndoe-section">
          <h2 className="johndoe-section-title" style={getTextStyle('heading')}>Experience</h2>
          <div className="johndoe-section-content">
            {data.internships.map((exp, idx) => (
              <div key={idx} className="johndoe-experience-item">
                <div className="johndoe-item-header">
                  <span style={getTextStyle('heading')}>
                    {exp.title}, {exp.company} – {exp.location}
                  </span>
                  <span style={getTextStyle('heading')}>{exp.duration}</span>
                </div>
                <ul className="johndoe-bullet-list">
                  {exp.description.split('\n').filter(line => line.trim()).map((point, pIdx) => (
                    <li key={pIdx} style={getTextStyle('description')}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Publications
    if (data.publications && data.publications.length > 0) {
      allElements.push(
        <div key="publications-section" className="johndoe-section">
          <h2 className="johndoe-section-title" style={getTextStyle('heading')}>Publications</h2>
          <div className="johndoe-section-content">
            {data.publications.map((pub, idx) => (
              <div key={idx} className="johndoe-publication-item">
                <div className="johndoe-item-header">
                  <span style={getTextStyle('heading')}>{pub.title}</span>
                  <span style={getTextStyle('heading')}>{pub.date}</span>
                </div>
                <div style={getTextStyle('description')}>
                  <em>{pub.authors}</em>, {pub.conference}
                </div>
                <div style={getTextStyle('description')}>
                  {pub.doi && `DOI: ${pub.doi}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Projects
    if (data.projects.length > 0) {
      allElements.push(
        <div key="projects-section" className="johndoe-section">
          <h2 className="johndoe-section-title" style={getTextStyle('heading')}>Projects</h2>
          <div className="johndoe-section-content">
            {data.projects.map((project, idx) => (
              <div key={idx} className="johndoe-project-item">
                <div className="johndoe-item-header">
                <span style={getTextStyle('heading')}>
                    {project.title}
                    {project.url && (
                        <>
                        {" | "}
                        <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'inherit', textDecoration: 'none' }} // Optional styling
                        >
                            GitHub Repository
                        </a>
                        </>
                    )}
                    </span>
                  <span style={getTextStyle('heading')}>
                    {project.duration}
                  </span>
                </div>
                <ul className="johndoe-bullet-list">
                  {project.description.split('\n').filter(line => line.trim()).map((point, pIdx) => (
                    <li key={pIdx} style={getTextStyle('description')}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Skills
    if (data.skills && data.skills.length > 0) {
      allElements.push(
        <div key="skills-section" className="johndoe-section">
          <h2 className="johndoe-section-title" style={getTextStyle('heading')}>Technical Skills</h2>
          <div className="johndoe-section-content">
            {data.skills.map((skill, idx) => (
              <div key={idx} className="johndoe-skill-item" style={getTextStyle('description')}>
                <strong style={getTextStyle('heading')}>{skill.title}:</strong> {skill.description.split('\n').join(', ')}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Awards
    if (data.awards.length > 0) {
      allElements.push(
        <div key="awards-section" className="johndoe-section">
          <h2 className="johndoe-section-title" style={getTextStyle('heading')}>Awards and Achievements</h2>
          <div className="johndoe-section-content">
            <ul className="johndoe-bullet-list">
              {data.awards.map((award, idx) => (
                <li key={idx} style={getTextStyle('description')}>
                  {award.title ? `${award.title} - ${award.description}` : award.description}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    // Competitions
    if (data.competitions && data.competitions.length > 0) {
      allElements.push(
        <div key="competitions-section" className="johndoe-section">
          <h2 className="johndoe-section-title" style={getTextStyle('heading')}>Competitions</h2>
          <div className="johndoe-section-content">
            {data.competitions.map((comp, idx) => (
              <div key={idx} className="johndoe-competition-item">
                <div className="johndoe-item-header">
                  <span style={getTextStyle('heading')}>{comp.title}</span>
                  <span style={getTextStyle('heading')}>{comp.date}</span>
                </div>
                <ul className="johndoe-bullet-list">
                  {comp.points.map((point, pIdx) => (
                    <li key={pIdx} style={getTextStyle('description')}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Positions of Responsibility
    if (data.position && data.position.length > 0) {
      allElements.push(
        <div key="position-section" className="johndoe-section">
          <h2 className="johndoe-section-title" style={getTextStyle('heading')}>Leadership Experience</h2>
          <div className="johndoe-section-content">
            {data.position.map((pos, idx) => (
              <div key={idx} className="johndoe-position-item">
                <div className="johndoe-item-header">
                  <span style={getTextStyle('heading')}>{pos.title}</span>
                  <span style={getTextStyle('heading')}>{pos.time}</span>
                </div>
                <ul className="johndoe-bullet-list">
                  {pos.description && pos.description.split('\n').filter(line => line.trim()).map((point, pIdx) => (
                    <li key={pIdx} style={getTextStyle('description')}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Extra Academic Activities
    if (data.extraAcademicActivities && data.extraAcademicActivities.length > 0) {
      allElements.push(
        <div key="extra-activities-section" className="johndoe-section">
          <h2 className="johndoe-section-title" style={getTextStyle('heading')}>Additional Activities</h2>
          <div className="johndoe-section-content">
            <ul className="johndoe-bullet-list">
              {data.extraAcademicActivities.map((activity, idx) => (
                <li key={idx} style={getTextStyle('description')}>
                  {activity.title && <strong style={getTextStyle('heading')}>{activity.title}: </strong>}
                  {activity.description}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    // Coursework Information
    if (data.coursework.length > 0) {
      allElements.push(
        <div key="coursework-section" className="johndoe-section">
          <h2 className="johndoe-section-title" style={getTextStyle('heading')}>Relevant Coursework</h2>
          <div className="johndoe-section-content">
            <ul className="johndoe-bullet-list">
              {data.coursework.map((course, idx) => (
                <li key={idx} style={getTextStyle('description')}>
                  {course.title && <strong style={getTextStyle('heading')}>{course.title}: </strong>}
                  {course.description.split('\n').join(', ')}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    return allElements;
  };

  const allElements = renderContent();
  const { containerRef, pages, A4_HEIGHT } = usePageBreak(data);

  return (
    <div className="johndoe-resume">
      <PageBreakWrapper
        pages={pages}
        A4_HEIGHT={A4_HEIGHT}
        containerRef={containerRef}
        allElements={allElements}
      />
    </div>
  );
};

export default JohnDoeTemplate;