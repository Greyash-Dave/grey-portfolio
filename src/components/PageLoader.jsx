import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PageLoader.css'; // Ensure you have this CSS file
import LogoImage from '/Grey-Red-Logo.webp'; // Update this path to your logo

const PageLoader = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing');
  const [isComplete, setIsComplete] = useState(false);

  const loadingTexts = [
    'Initializing',
    'Preparing resources',
    'Loading components',
    'Setting up environment',
    'Almost ready'
  ];

  useEffect(() => {
    let animationFrame = null;
    let minTimeElapsed = false;
    
    if (isLoading) {
      let startTime = Date.now();
      const minLoadTime = 5000; // 1 second minimum
      let currentProgress = 0;
      
      const updateProgress = () => {
        const elapsedTime = Date.now() - startTime;
        const progressPercentage = (elapsedTime / minLoadTime) * 100;
        
        // Ensure smooth progress that always takes at least the minimum time
        currentProgress = Math.min(progressPercentage, 100);
        
        // Update loading text based on progress
        const textIndex = Math.floor((currentProgress / 100) * (loadingTexts.length - 1));
        setLoadingText(loadingTexts[textIndex]);
        
        setProgress(currentProgress);
  
        if (currentProgress < 100) {
          animationFrame = requestAnimationFrame(updateProgress);
        } else {
          minTimeElapsed = true;
          // If isLoading is already false when min time elapses, trigger the transition
          if (!isLoading && !isComplete) {
            startTransition();
          }
        }
      };
  
      animationFrame = requestAnimationFrame(updateProgress);
    } else if (!isComplete) {
      // Only transition if minimum time has elapsed
      if (progress >= 100 || minTimeElapsed) {
        startTransition();
      }
    }
    
    function startTransition() {
      // Start the transition to the navbar position
      setTimeout(() => {
        // Mark as complete after the transition animation is done
        setTimeout(() => {
          setIsComplete(true);
        }, 1500); // Time for the transition + a bit extra
      }, 200); // Short delay before starting transition
    }
    
    // Cleanup function
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isLoading, isComplete, progress]);

  // If complete, don't render anything
  if (isComplete) return null;

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        // Full screen loader
        <motion.div 
          className="page-loader"
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgb(2, 19, 45)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            pointerEvents: 'none'
          }}
        >
          <div className="loader-container" style={{ width: '80%', maxWidth: '500px' }}>
            <div className="loader-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <motion.div 
                className="loader-logo-container"
                layoutId="logo"
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center' 
                }}
              >
                <img 
                  src={LogoImage} 
                  alt="Logo" 
                  className="loader-logo"
                  style={{ width: '100%', height: 'auto' }}
                />
              </motion.div>
              <div className="loader-progress-container" style={{ 
                width: '100%', 
                height: '6px', 
                backgroundColor: 'grey', 
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div 
                  className="loader-progress-bar" 
                  style={{ 
                    width: `${progress}%`, 
                    height: '100%',
                    backgroundColor: 'rgb(253, 204, 94)',
                    transition: 'width 0.2s ease-out'
                  }}
                />
              </div>
              <div className="loader-text" style={{ 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '14px',
                color: '#666'
              }}>
                <span className="loader-text-dynamic">{loadingText}</span>
                <span className="loader-text-progress">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        // Transitioning logo that will be removed after animation
        <motion.div 
          className="navbar-logo"
          key="navbar-logo"
          layoutId="logo"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ 
            scale: 0.4,
            opacity: 0,
            transition: { duration: 0.5 }
          }}
          style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            width: '60px',
            height: 'auto',
            zIndex: 100,
            pointerEvents: 'none' // Ensure it doesn't interfere with clicks
          }}
        >
          <img 
            src={LogoImage} 
            alt="Logo" 
            className="nav-logo"
            style={{ width: '100%', height: 'auto' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;