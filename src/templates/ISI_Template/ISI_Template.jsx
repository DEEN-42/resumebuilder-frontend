import React from 'react';
import { usePageBreak, PageBreakWrapper } from '../../components/ResumeLayout/ResumeLayout';
import './ISI_Template.css';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const ISITemplate = ({ data, styles = {} }) => {
  // Default global styles if not provided
  const defaultGlobalStyles = {
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
      fontSize: `${style.fontSize || 12}px`,
      fontFamily: style.fontFamily || 'Arial',
      color: style.color || '#000000',
      fontWeight: style.bold ? 'bold' : 'normal',
      fontStyle: style.italic ? 'italic' : 'normal',
      textDecoration: style.underline ? 'underline' : 'none'
    };
  };

  const renderContent = () => {
    const allElements = [];

    // Header with Logo, Name, and Profile - only if data exists
    if (data.personalInfo && (data.personalInfo.name || data.personalInfo.program || data.personalInfo.institute || data.personalInfo.contact || data.personalInfo.email)) {
      allElements.push(
        <div key="header" className="isi-header">
          {(data.personalInfo.institutelogo ) && (
            <div className="isi-logo">
              <img 
                src={data.personalInfo.institutelogo }
                alt="Institute Logo" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
          )}
          
          <div className="isi-center-info">
            {data.personalInfo.name && (
              <h1 className="isi-name" style={getTextStyle('heading')}>
                {data.personalInfo.name}
              </h1>
            )}
            {data.personalInfo.program && (
              <p className="isi-program" style={getTextStyle('description')}>
                {data.personalInfo.program}
              </p>
            )}
            {data.personalInfo.institute && (
              <p className="isi-institute" style={getTextStyle('description')}>
                {data.personalInfo.institute}
              </p>
            )}
          </div>
          
          <div className="isi-contact-info">
            {data.personalInfo.contact && (
              <p style={getTextStyle('description')}>
                <strong>Mob.</strong> {data.personalInfo.contact}
              </p>
            )}
            {data.personalInfo.email && (
              <p style={getTextStyle('description')}>
                {data.personalInfo.email}
              </p>
            )}
            {data.personalInfo.linkedin && (
            <p style={{ ...getTextStyle('description'), display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaLinkedin size={14} />
                <a
                href={data.personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none' }}
                >
                {data.personalInfo.linkedin}
                </a>
            </p>
            )}
            {data.personalInfo.github && (
            <p style={{ ...getTextStyle('description'), display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaGithub size={14} />
                <a
                href={data.personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none' }}
                >
                {data.personalInfo.github}
                </a>
            </p>
            )}

          </div>
        </div>
      );
    }

    // Education Table - only if data exists
    if (data.education && data.education.length > 0) {
      allElements.push(
        <div key="education-section" className="isi-section">
          <table className="isi-education-table">
            <thead>
              <tr>
                <th style={getTextStyle('heading')}>Course</th>
                <th style={getTextStyle('heading')}>College/University</th>
                <th style={getTextStyle('heading')}>Year</th>
                <th style={getTextStyle('heading')}>CGPA/%</th>
              </tr>
            </thead>
            <tbody>
              {data.education.map((edu, idx) => (
                <tr key={idx}>
                  <td style={getTextStyle('description')}>{edu.degree || edu.course || ''}</td>
                  <td style={getTextStyle('description')}>{edu.institute || edu.university || ''}</td>
                  <td style={getTextStyle('description')}>{edu.year || ''}</td>
                  <td style={getTextStyle('description')}>{edu.cgpa || edu.marks || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Scholastic Achievements - only if data exists
    if (data.awards && data.awards.length > 0) {
      allElements.push(
        <div key="scholastic-section" className="isi-gray-section" style={getTextStyle('heading')}>
          SCHOLASTIC ACHIEVEMENTS
        </div>
      );
      allElements.push(
        <ul key="scholastic-list" className="isi-bullet-list">
          {data.awards.map((award, idx) => (
            <li key={idx} style={getTextStyle('description')}>
              {award.title ? `${award.title} - ${award.description}` : award.description}
              {award.year && <span className="isi-date"> [{award.year}]</span>}
            </li>
          ))}
        </ul>
      );
    }

    // Work Experience - only if data exists
    if (data.internships && data.internships.length > 0) {
      allElements.push(
        <div key="work-section" className="isi-gray-section" style={getTextStyle('heading')}>
          WORK EXPERIENCE
        </div>
      );
      
      data.internships.forEach((internship, idx) => {
        allElements.push(
          <div key={`work-${idx}`} className="isi-work-item">
            <div className="isi-work-header">
              <span style={getTextStyle('heading')}>
                {internship.position || internship.title} | {internship.company}
              </span>
              <span className="isi-date" style={getTextStyle('description')}>
                [{internship.duration}]
              </span>
            </div>
            {internship.description && (
              <ul className="isi-bullet-list">
                {internship.description.split('\n').filter(point => point.trim() !== '').map((point, pIdx) => (
                  <li key={pIdx} style={getTextStyle('description')}>{point}</li>
                ))}
              </ul>
            )}
          </div>
        );
      });
    }

    // Skills & Interests - only if data exists
    if (data.skills && data.skills.length > 0) {
      allElements.push(
        <div key="skills-section" className="isi-gray-section" style={getTextStyle('heading')}>
          SKILLS & INTERESTS
        </div>
      );
      
      data.skills.forEach((skill, idx) => {
        allElements.push(
          <div key={`skill-${idx}`} className="isi-skill-item">
            <span style={getTextStyle('heading')}>{skill.title}: </span>
            <span style={getTextStyle('description')}>
              {skill.description ? skill.description.split('\n').join(', ') : ''}
            </span>
          </div>
        );
      });
    }

    // Projects - only if data exists
    if (data.projects && data.projects.length > 0) {
      allElements.push(
        <div key="projects-section" className="isi-gray-section" style={getTextStyle('heading')}>
          PROJECTS
        </div>
      );
      
      data.projects.forEach((project, idx) => {
        allElements.push(
          <div key={`project-${idx}`} className="isi-project-item">
            <div className="isi-work-header">
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
              <span className="isi-date" style={getTextStyle('description')}>
                [{project.duration}]
              </span>
            </div>
            {project.description && (
              <ul className="isi-bullet-list">
                {project.description.split('\n').filter(point => point.trim() !== '').map((point, pIdx) => (
                  <li key={pIdx} style={getTextStyle('description')}>{point}</li>
                ))}
              </ul>
            )}
          </div>
        );
      });
    }

    // Relevant Courses - only if data exists
    if (data.coursework && data.coursework.length > 0) {
      allElements.push(
        <div key="courses-section" className="isi-gray-section" style={getTextStyle('heading')}>
          RELEVANT COURSES
        </div>
      );
      data.coursework.forEach((course, idx) => {
        allElements.push(
          <div key={`course-${idx}`} className="isi-course-item">
            <span style={getTextStyle('heading')}>{course.title}: </span>
            <span style={getTextStyle('description')}>
              {course.description ? course.description.split('\n').join(' | ') : ''}
            </span>
            {course.grade && (
              <span className="isi-grade" style={getTextStyle('description')}>
                {` [${course.grade}]`}
              </span>
            )}
          </div>
        );
      });
    }

    // Positions of Responsibility - only if data exists
    if (data.position && data.position.length > 0) {
      allElements.push(
        <div key="position-section" className="isi-gray-section" style={getTextStyle('heading')}>
          POSITIONS OF RESPONSIBILITY
        </div>
      );
      data.position.forEach((pos, idx) => {
        allElements.push(
          <div key={`position-${idx}`} className="isi-position-item">
            <div className="isi-work-header">
              <span style={getTextStyle('heading')}>{pos.title}</span>
              <span className="isi-date" style={getTextStyle('description')}>
                [{pos.time || pos.duration}]
              </span>
            </div>
            {pos.description && (
              <ul className="isi-bullet-list">
                {pos.description.split('\n').filter(line => line.trim() !== '').map((point, pIdx) => (
                  <li key={pIdx} style={getTextStyle('description')}>{point}</li>
                ))}
              </ul>
            )}
          </div>
        );
      });
    }

    // Extracurricular Activities - only if data exists
    if (data.extraAcademicActivities && data.extraAcademicActivities.length > 0) {
      allElements.push(
        <div key="extra-section" className="isi-gray-section" style={getTextStyle('heading')}>
          EXTRACURRICULAR ACTIVITIES
        </div>
      );
      allElements.push(
        <ul key="extra-list" className="isi-bullet-list">
          {data.extraAcademicActivities.map((activity, idx) => (
            <li key={idx} style={getTextStyle('description')}>
              {activity.description || activity.title}
            </li>
          ))}
        </ul>
      );
    }

    return allElements;
  };

  const allElements = renderContent();
  const { containerRef, pages, A4_HEIGHT } = usePageBreak(data);

  return (
    <div className="isi-resume">
      <PageBreakWrapper
        pages={pages}
        A4_HEIGHT={A4_HEIGHT}
        containerRef={containerRef}
        allElements={allElements}
      />
    </div>
  );
};

export default ISITemplate;