import iitkgplogo from '../assets/iitkgp_logo.png';

export const getInitialResumeData = () => ({
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
    institutelogo: iitkgplogo,
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