import React, { useState, useEffect } from 'react';
import './PageLoader.css';
import LogoImage from '/Grey-Red-Logo.webp';

const PageLoader = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing');

  const loadingTexts = [
    'Initializing',
    'Preparing resources',
    'Loading components',
    'Setting up environment',
    'Almost ready'
  ];

  useEffect(() => {
    let startTime = Date.now();
    const minLoadTime = 3000; // 3 seconds minimum
    let currentProgress = 0;
    
    const updateProgress = () => {
      const elapsedTime = Date.now() - startTime;
      const progressPercentage = (elapsedTime / minLoadTime) * 100;
      
      // Ensure smooth progress that always takes at least 3 seconds
      currentProgress = Math.min(progressPercentage, 100);
      
      // Update loading text based on progress
      const textIndex = Math.floor((currentProgress / 100) * (loadingTexts.length - 1));
      setLoadingText(loadingTexts[textIndex]);
      
      setProgress(currentProgress);

      if (currentProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        // Only call onLoadingComplete when animation is fully complete
        setTimeout(() => {
          onLoadingComplete?.();
        }, 500); // Add slight delay after reaching 100%
      }
    };

    requestAnimationFrame(updateProgress);
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