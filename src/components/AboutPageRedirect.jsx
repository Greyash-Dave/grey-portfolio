import React from 'react';
import { motion } from 'framer-motion';
import './AboutPageRedirect.css'

const AboutPageRedirect = ({ onAboutClick }) => {
  return (
    <div className="about-page-redirect-container">
      <div className="redirect-content">
        <motion.div 
          className="redirect-text"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2>Want to Know More About Me?</h2>
          <p>Discover the person behind the work</p>
        </motion.div>
        
        <motion.button 
          className="redirect-button"
          onClick={onAboutClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 10 
          }}
        >
          View About Page
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="redirect-icon"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </motion.button>
      </div>
    </div>
  );
};

export default AboutPageRedirect;