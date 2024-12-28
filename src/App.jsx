import React, { useState, useRef, useEffect } from 'react';
import { ModalProvider } from './components/ModalContext';
import Work from './components/Work';
import About from "./components/About";
import Navbar from "./components/Navbar";
import PageLoader from './components/PageLoader';
import AboutPageRedirect from './components/AboutPageRedirect';
import Footer from './components/Footer';

function App() {
  const [currentView, setCurrentView] = useState('work');
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  const scrollContainerRef = useRef(null);
  
  const handleNavigation = (view) => {
    setCurrentView(view);
    
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    const lenis = window?.Lenis || window?.lenis;
    if (lenis) {
      try {
        lenis.scrollTo(0, { 
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      } catch (error) {
        console.warn('Lenis scroll failed:', error);
      }
    }

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  useEffect(() => {
    if (!hasInitiallyLoaded) {
      const preloadComponents = async () => {
        // Add a minimum loading time
        const minimumLoadTime = new Promise(resolve => 
          setTimeout(resolve, 2000)
        );

        // Preload your components and assets here
        try {
          // You can add specific asset preloading here
          await Promise.all([
            // Example: Preload critical images
            ...document.querySelectorAll('img').forEach(img => {
              if (img.src) {
                new Promise((resolve, reject) => {
                  img.onload = resolve;
                  img.onerror = reject;
                });
              }
            }),
            minimumLoadTime
          ]);
        } catch (error) {
          console.warn('Asset preloading error:', error);
        }

        setIsLoading(false);
        setHasInitiallyLoaded(true);
      };

      preloadComponents();
    }
  }, [hasInitiallyLoaded]);

  return (
    <div 
      ref={scrollContainerRef}
      style={{ 
        position: 'relative',
        minHeight: '100vh'
      }}
    >
      {/* Render all components but keep them hidden during loading */}
      <div style={{ 
        visibility: isLoading ? 'hidden' : 'visible',
        opacity: isLoading ? 0 : 1,
        transition: 'opacity 1s ease-in-out'
      }}>
        {currentView === 'work' && (
          <>
            <Navbar 
              onWorkClick={() => handleNavigation('work')}
              onAboutClick={() => handleNavigation('about')}
              activeView={currentView}
            />
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
            <Footer />
          </>
        )}
      </div>

      {/* Page Loader */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999
        }}>
          <PageLoader />
        </div>
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