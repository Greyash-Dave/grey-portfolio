import React, { useState, useEffect } from 'react';
import './PageLoader.css'; // Ensure this matches your CSS file name

// Import your logo image
import LogoImage from '/Grey-Red-Logo.webp'; // Replace with your actual logo path

const PageLoader = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing');

  const loadingTexts = [
    'Preparing resources',
    'Loading components',
    'Setting up environment',
    'Almost ready'
  ];

  useEffect(() => {
    const simulateLoading = () => {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.random() * 20;
        
        // Update loading text dynamically
        const textIndex = Math.floor(currentProgress / 25);
        if (textIndex < loadingTexts.length) {
          setLoadingText(loadingTexts[textIndex]);
        }

        if (currentProgress >= 100) {
          clearInterval(interval);
          setProgress(100);
          // Optional: Add a callback to remove loader
          return;
        }
        setProgress(currentProgress);
      }, 500);

      return () => clearInterval(interval);
    };

    const cleanup = simulateLoading();
    return cleanup;
  }, []);

  return (
    <div className="page-loader">
      <div className="loader-container">
        <div className="loader-content">
          <div className="loader-logo-container">
            <img 
              src={LogoImage} 
              alt="Logo" 
              className="loader-logo"
            />
          </div>
          <div className="loader-progress-container">
            <div 
              className="loader-progress-bar" 
              style={{ width: `${progress}%`, backgroundColor: 'rgb(253, 204, 94)' }}
            />
          </div>
          <div className="loader-text">
            <span className="loader-text-dynamic">{loadingText}</span>
            <span className="loader-text-progress">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;