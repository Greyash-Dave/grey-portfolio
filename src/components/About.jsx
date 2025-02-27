import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Code, 
  Book, 
  GraduationCap,
  Linkedin, 
  Github, 
  X,
  FileText
} from 'lucide-react';
import PFP from '../assets/pf.webp';
import './About.css';

const About = () => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Create a new Lenis instance for this page
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Slightly modified easing
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Smooth scroll to top with Lenis
    lenisRef.current?.scrollTo(0, { 
      duration: 1.2, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
    });

    // Animate Lenis scroll
    function raf(time) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Add event listener to ensure top of page on mount
    window.addEventListener('load', () => {
      lenisRef.current?.scrollTo(0, { 
        duration: 1.2, 
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
      });
    });

    // Cleanup Lenis instance when component unmounts
    return () => {
      lenisRef.current?.destroy();
      window.removeEventListener('load', () => {});
    };
  }, []);
    
  const skills = {
    languages: ['JavaScript', 'Python', 'Java', 'Rust', 'C', 'C# (Unity)', 'Bash/Shell', 'HTML', 'CSS'],
    databases: ['PostgreSQL', 'Supabase', 'MySQL'],
    frameworks: ['React.js', 'Node.js', 'Express.js', 'Axios', 'Sequelize', 'Tailwindcss', 'Framer Motion', 'Lenis', 'Three.js', 'Pygame', 'Ren\'Py', 'OpenCV'],
    technologies: ['Pandas', 'Numpy', 'Matplotlib', 'Scikit-learn', 'Selenium', 'Linux', 'NixOS', 'FFmpeg', 'Whisper'],
    tools: ['Git', 'Docker', 'Vim', 'Postman', 'Notion', 'Canva', 'Ollama', 'VS Code', 'Unity', 'Blender', 'DaVinci Resolve'],
    coursework: ['Data Structures', 'Algorithms', 'Python', 'Web Development', 'Object-Oriented Programming', 'Database Management System', 'Software Design', 'Software Engineering']
  };
    const socialLinks = [
        {
            icon: Mail,
            href: 'mailto:greyashdave@gmail.com',
            color: '#EA4335'
        },
        {
            icon: Linkedin,
            href: 'https://www.linkedin.com/in/gresham-dave',
            color: '#0A66C2'
        },
        {
            icon: X,
            href: 'https://x.com/greyashdave',
            color: 'white'
        },
        {
            icon: Github,
            href: 'https://github.com/Greyash-Dave/',
            color: 'yellow'
        },
        {
            icon: FileText,
            href: 'https://drive.google.com/file/d/1YmFAbKg7uQ-iPyiDD7xe1ASCwqlf94yM/view',
            color: 'green'
        }
    ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  const renderSkillCategory = (title, skills) => (
    <motion.div 
      className="skill-category"
      variants={itemVariants}
      key={title}
    >
      <h3>{title}</h3>
      <div className="skill-tags-container">
        {skills.map((skill, index) => (
          <motion.span 
            key={index} 
            className="skill-tag"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );

  return (
    <>
      <motion.div 
      className="about-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="about-card-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
      
      <motion.div 
        className="about-card"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
      
        {/* Enhanced Header Section with More Spacing */}
        <motion.div 
          className="about-header"
          variants={itemVariants}
        >
            <div className="about-header-info">
            <h1 className="name-title">Gresham Dave C</h1>
            <p className="professional-tagline">
                Software Engineer | Full-Stack Developer | AI Enthusiast
            </p>

                <div className="social-links-container">
                {socialLinks.map((social, index) => (
                    <a 
                      key={index} 
                      href={social.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                        <social.icon 
                        size={24} 
                        color={social.color} 
                        className="social-icon"
                    />
                    </a>
                ))}
                </div>
            </div>
          <motion.img 
            src={PFP} 
            alt="Gresham Dave" 
            className="profile-image"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20 
            }}
          />
        </motion.div>

        {/* About Me Section with Enhanced Typography */}
        <motion.div 
          className="about-content"
          variants={itemVariants}
        >
          <h2 className="section-title">About Me</h2>
          <div className="text-block">
            <p>
              I'm a passionate tech enthusiast with a deep commitment to advancing technology through innovative 
              software development and artificial intelligence. With over ten months of hands-on experience in 
              full-stack development, I've cultivated a robust skill set that spans web technologies, machine learning, 
              and computer vision.
            </p>
            <p>
              My technical journey is driven by an insatiable curiosity and a strategic approach to problem-solving. 
              I specialize in leveraging modern frameworks like React.js and Node.js, combined with AI technologies 
              in Python, to create scalable and intelligent solutions that push the boundaries of what's possible.
            </p>
            <p>
              As an emerging professional, I'm committed to continuous learning and collaborative growth. My goal is 
              to contribute meaningfully to projects that blend cutting-edge technology with user-centric design, 
              ultimately making a positive impact in the tech ecosystem.
            </p>
          </div>
        </motion.div>

        {/* Contact Information with Enhanced Layout */}
        <motion.div 
          className="contact-section"
          variants={itemVariants}
        >
          <h2 className="section-title">Contact Information</h2>
          <div className="contact-grid">
            <motion.div 
              className="contact-item"
              whileHover={{ x: 5 }}
            >
              <Mail className="contact-icon" /> 
              <span className="contact-text">greyashdave@gmail.com</span>
            </motion.div>
            <motion.div 
              className="contact-item"
              whileHover={{ x: 5 }}
            >
              <Phone className="contact-icon" /> 
              <span className="contact-text">+91 72002 58064</span>
            </motion.div>
            <motion.div 
              className="contact-item"
              whileHover={{ x: 5 }}
            >
              <MapPin className="contact-icon" /> 
              <span className="contact-text">Chennai, Tamil Nadu, India</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Skills Section with Enhanced Grid */}
        <motion.div 
          className="skills-section"
          variants={itemVariants}
        >
          <h2 className="section-title">
            <Code className="section-title-icon" />
            Skills
          </h2>
          <div className="skills-grid">
            {renderSkillCategory('Languages', skills.languages)}
            {renderSkillCategory('Databases', skills.databases)}
            {renderSkillCategory('Frameworks', skills.frameworks)}
            {renderSkillCategory('Technologies', skills.technologies)}
            {renderSkillCategory('Tools', skills.tools)}
            {renderSkillCategory('Coursework', skills.coursework)}
          </div>
        </motion.div>

        {/* Education Section with Refined Typography */}
        <motion.div 
          className="education-section"
          variants={itemVariants}
        >
          <h2 className="section-title">
            <GraduationCap className="section-title-icon" />
            Education
          </h2>
          <div className="education-list">
            <motion.div 
              className="education-item"
              whileHover={{ scale: 1.02 }}
            >
              <div className="education-header">
                <Book className="education-icon" />
                <h3>Bachelor of Technology (B.Tech) in Information Technology</h3>
              </div>
              <div className="education-details">
                <p className="institution">Panimalar Engineering College</p>
                <p className="duration">July 2022 - Present</p>
                <p className="achievement">Current CGPA: 8.025/10 (Till 5th Semester)</p>
              </div>
            </motion.div>
            <motion.div 
              className="education-item"
              whileHover={{ scale: 1.02 }}
            >
              <div className="education-header">
                <Book className="education-icon" />
                <h3>Senior Secondary Examination (XII)</h3>
              </div>
              <div className="education-details">
                <p className="institution">Velammal Vidyalaya, Chennai</p>
                <p className="duration">CBSE - June 2022</p>
                <p className="achievement">Percentage: 84.6%</p>
              </div>
            </motion.div>
            <motion.div 
              className="education-item"
              whileHover={{ scale: 1.02 }}
            >
              <div className="education-header">
                <Book className="education-icon" />
                <h3>Secondary School Examination (X)</h3>
              </div>
              <div className="education-details">
                <p className="institution">Velammal Vidyalaya, Chennai</p>
                <p className="duration">CBSE - June 2020</p>
                <p className="achievement">Percentage: 91.4%</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
    </motion.div>
    </>
  );
};

export default About;