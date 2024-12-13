import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModalProvider } from './components/ModalContext';
// import Hero from './components/Hero';
import Work from './components/Work';
import About from "./components/About";
import Navbar from "./components/Navbar";
import PageLoader from './components/PageLoader';
import AboutPageRedirect from './components/AboutPageRedirect';

function App() {
  const [currentView, setCurrentView] = useState('work');
  const [isWorkLoading, setIsWorkLoading] = useState(true);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  const scrollContainerRef = useRef(null);
  
  const handleNavigation = (view) => {
    setCurrentView(view);
    
    // Attempt multiple methods to ensure scroll to top
    // 1. Native window scroll
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    // 2. Lenis scroll (if available)
    const lenis = window?.Lenis || window?.lenis;
    if (lenis) {
      try {
        // Try different scroll methods
        lenis.scrollTo(0, { 
          duration: 1.2,  // Smooth scroll duration
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // Soft easing
        });
      } catch (error) {
        console.warn('Lenis scroll failed:', error);
      }
    }

    // 3. Fallback scrolling method for any refs
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  useEffect(() => {
    // Only show loading on first visit to work section
    if (currentView === 'work' && !hasInitiallyLoaded) {
      setIsWorkLoading(true);
      
      // Simulate loading completion
      const loadTimer = setTimeout(() => {
        setIsWorkLoading(false);
        setHasInitiallyLoaded(true);
      }, 2000);

      return () => clearTimeout(loadTimer);
    }
  }, [currentView, hasInitiallyLoaded]);

  return (
    <div ref={scrollContainerRef}>
      
      {currentView === 'work' && isWorkLoading && !hasInitiallyLoaded && (
        <PageLoader />
      )}
      
      {currentView === 'work' && !isWorkLoading && (
        <>
          <Navbar 
            onWorkClick={() => handleNavigation('work')}
            onAboutClick={() => handleNavigation('about')}
            activeView={currentView}
          />
          {/* <Hero /> */}
          <Work />
          <AboutPageRedirect onAboutClick={() => handleNavigation('about')} />
        </>
      )}
      
      {currentView === 'about' && (
        <>
        <Navbar 
          onWorkClick={() => handleNavigation('work')}
          onAboutClick={() => handleNavigation('about')}
          activeView={currentView}
        />
        <About />
        </>
      )}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <ModalProvider>
      <App />
    </ModalProvider>
  );
}