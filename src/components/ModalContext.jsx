import React, { createContext, useState, useContext, useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import WorkDescModal from "./WorkDescModal";
import WorkDesc from "./WorkDesc";

// Project details with additional modal information
const projectDetails = [
  {
    title: "Pokemon Battle Game",
    description: "Interactive web-based Pokémon battle simulator using PokeAPI. Developed using technologies like React.js Node.js and PostgreSQL.",
    src: "/public/assets/pokemon-game.png",
    timeline: "Jul 2024 - Sep 2024",
    youtubeLink: "https://www.youtube.com/watch?v=v021D_MnzvY",
    images: ['/public/assets/pokemon-game.png', '/public/assets/pbg.png']
  },
  { 
    title: 'Citizen & Constitution', 
    description: "Gamified learning platform featuring a Renpy-based visual novel game and MVP Gamified Learning Web Platform",
    src: '/public/assets/c-and-c.png',
    timeline: 'Sep 2024 - Sep 2024',
    liveLink: 'https://grey-citizen-and-constitution.vercel.app',
    // demoLink: 'https://demo.com/username/citizen-constitution',
    youtubeLink: 'https://studio.youtube.com/watch?v=OO9dnwtZrN4',
    images: ['/public/assets/cac_1.png', '/public/assets/cac_2.png']
  },
  { 
    title: 'Space Y', 
    description: "Recreation of SpaceX's Homepage using React.js.",
    src: '/public/assets/space-y.png',
    timeline: 'Aug 2024 - Aug 2024',
    liveLink: 'https://space-y-delta.vercel.app',
    demoLink: 'https://www.linkedin.com/posts/gresham-dave_frontenddevelopment-spacex-webdevelopment-activity-7233333524634746880-KlJu?utm_source=share&utm_medium=member_desktop',
    youtubeLink: 'https://studio.youtube.com/watch?v=EqA1cD5CtJM',
    images: ['/public/assets/space-y.png', '/public/assets/sy.png']
  },
  { 
    title: 'PEC Homepage', 
    description: "PEC Homepage redesign with features like announcements and event updates using React.js.",
    src: '/public/assets/panimalar.png',
    timeline: 'Aug 2024 - Aug 2024',
    liveLink: 'https://pec-home-page.vercel.app',
    demoLink: 'https://www.linkedin.com/posts/gresham-dave_webdevelopment-reactjs-css-activity-7227708134973157376-zOV1?utm_source=share&utm_medium=member_desktop',
    youtubeLink: 'https://youtube.com/watch?v=khY8_HCry00/edit',
    images: ['/public/assets/panimalar.png', '/public/assets/ph.png']
  },
  { 
    title: 'ACE', 
    description: "Gesture-based interactive gameplay system using Python, OpenCV, and Unity, featuring a Flappy Bird integration.",
    src: '/public/assets/flappy.jpeg',
    timeline: 'Apr 2023 - Apr 2023',
    // liveLink: 'https://ace-game.com',
    demoLink: 'https://www.linkedin.com/posts/gresham-dave_computervision-flappybird-gestureinput-activity-7225515334332506112-d_Gy?utm_source=share&utm_medium=member_desktop',
    youtubeLink: 'https://studio.youtube.com/watch?v=EIRNBOqlXN0',
    images: ['/public/assets/flappy.jpeg', '/public/assets/a.png']
  },
  { 
    title: '...', 
    description: '...upcoming',
    src: '/public/assets/upcoming.jpg',
    timeline: '...',
    images: ['/public/assets/upcoming.jpg']
  }
];

// Experience details for modal
const experienceDetails = [
  { 
    title: 'Other Participated Hackathons',
    description: 'Participated in multiple hackathons, showcasing interest in problem-solving skills and innovative thinking.',
    src: '/public/assets/oph_1.png',
    timeline: '2022 - 2024',
    // liveLink: null,
    // demoLink: null,
    // youtubeLink: null,
    images: ['/public/assets/oph_1.png', '/public/assets/oph_2.png', '/public/assets/oph_3.png']
  },
  { 
    title: 'Open Source Contributor', 
    description: 'Contributed to the Openpedia project, focusing on enhancing functionality and user experience.',
    src: '/public/assets/osc.png', 
    timeline: 'Aug 2024 - Aug 2024',
    liveLink: 'https://github.com/Sriparno08/Openpedia',
    // demoLink: null,
    // youtubeLink: null,
    images: ['/public/assets/openpedia.png', '/public/assets/osc.png']
  },
  { 
    title: 'Yesist12 Finalist', 
    description: 'Recognized as a finalist in the Yesist12 innovation competition, demonstrating technical excellence.',
    src: '/public/assets/yesist.png', 
    timeline: 'Sep 2023',
    demoLink: 'https://www.linkedin.com/posts/gresham-dave_yesist12-innovation-outdooradvertising-activity-7225732844503846912-ZkI0?utm_source=share&utm_medium=member_desktop',
    // liveLink: null,
    youtubeLink: 'https://studio.youtube.com/watch?v=lgkoDlln6TU/edit',
    images: ['/public/assets/y12_1.png', '/public/assets/y12_2.png']
  },
  { 
    title: 'Software Engineer Intern', 
    description: '@OpenTurf_Technologies Built responsive web apps using the PERN stack (PostgreSQL, Express, React, Node.js). Developed frontend with React, backend APIs with Node.js, and managed databases using Sequelize. Implemented secure user authentication with bcrypt and managed sessions with Express Session.',
    src: '/public/assets/openturf-logo.png', 
    timeline: 'Mar 2024 - Sep 2024',
    // liveLink: null,
    // demoLink: null,
    // youtubeLink: null,
    images: ['/public/assets/openturf-logo.png', '/public/assets/sei_1.png', '/public/assets/sei_2.png']
  }
];


// Extend the context to include new functionalities
const ModalContext = createContext({
  isModalOpen: false,
  modalContent: null,
  projectDetails: [],
  experienceDetails: [],
  currentProject: null,
  currentExperience: null,
  lenis: null,
  openModal: () => {},
  closeModal: () => {},
  setModalContent: () => {},
  openProjectModal: () => {},
  openExperienceModal: () => {},
  closeProjectModal: () => {},
  closeExperienceModal: () => {}
});

// Create a provider component
export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const [currentExperience, setCurrentExperience] = useState(null);
  
  // Lenis instance to manage global scroll
  const [lenis, setLenis] = useState(null);

  // Initialize Lenis on component mount
  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
    setLenis(lenisInstance);

    return () => {
      lenisInstance.destroy();
    };
  }, []);

  // Manage scroll lock when modal is open
  useEffect(() => {
    if (!lenis) return;
    if (isModalOpen) {
      // Disable smooth scrolling when modal is open
      lenis.stop();
      
      // Optional: add a class to body for additional styling
      document.body.classList.add('modal-open');
    } else {
      // Re-enable smooth scrolling when modal closes
      lenis.start();
      
      // Remove body class
      document.body.classList.remove('modal-open');
    }
  }, [isModalOpen, lenis]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setCurrentProject(null);
    setCurrentExperience(null);
  };

  const openProjectModal = (project) => {
    // Set modal content with WorkDesc component for the specific project
    setCurrentProject(project);
    setModalContent(
      <WorkDesc 
        title={project.title}
        description={project.description}
        timeline={project.timeline}
        liveLink={project.liveLink}
        demoLink={project.demoLink}
        youtubeLink={project.youtubeLink}
        images={project.images}
      />
    );
    openModal();
  };

  const closeProjectModal = () => {
    setCurrentProject(null);
    closeModal();
  };

  const openExperienceModal = (experience) => {
    // Set modal content with WorkDesc component for the specific experience
    setCurrentExperience(experience);
    setModalContent(
      <WorkDesc 
        title={experience.title}
        description={experience.description}
        timeline={experience.timeline}
        liveLink={experience.liveLink}
        demoLink={experience.demoLink}
        youtubeLink={experience.youtubeLink}
        images={experience.images}
      />
    );
    openModal();
  };

  const closeExperienceModal = () => {
    setCurrentExperience(null);
    closeModal();
  };

  // Context value with all necessary functions and states
  const value = {
    isModalOpen,
    modalContent,
    projectDetails,
    experienceDetails,
    currentProject,
    currentExperience,
    lenis,
    openModal,
    closeModal,
    setModalContent,
    openProjectModal,
    openExperienceModal,
    closeProjectModal,
    closeExperienceModal
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      
      {/* Modal wrapper that can be used globally */}
      {isModalOpen && modalContent && (
        <WorkDescModal isOpen={isModalOpen} onClose={closeModal}>
          {modalContent}
        </WorkDescModal>
      )}
    </ModalContext.Provider>
  );
};

// Custom hook to use the modal context
export const useModal = () => {
  const context = useContext(ModalContext);
  
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  
  return context;
};

export { projectDetails, experienceDetails };