import React, { useState, useRef, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ModalProvider } from './components/ModalContext';
import Work from './components/Work';
import About from "./components/About";
import Navbar from "./components/Navbar";
import PageLoader from './components/PageLoader';
import AboutPageRedirect from './components/AboutPageRedirect';
import Footer from './components/Footer';
import ScrollVideo from './components/ScrollVideo';

// Main App component that handles routes
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  
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
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* PageLoader that will create the transition effect and then remove itself */}
      <PageLoader isLoading={isLoading} />

      {/* Render content with routing */}
      <div style={{ 
        visibility: isLoading ? 'hidden' : 'visible',
        opacity: isLoading ? 0 : 1,
        transition: 'opacity 1s ease-in-out'
      }}>
        <Routes>
          <Route path="/" element={<MainContent view="work" />} />
          <Route path="/work" element={<MainContent view="work" />} />
          <Route path="/about" element={<MainContent view="about" />} />
        </Routes>
      </div>
    </div>
  );
}


// Content component with Lenis scroll handling
function MainContent({ view }) {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [contentLoaded, setContentLoaded] = useState(false);
  
  // Rest of your MainContent function unchanged...
  
  // Setup Lenis and handle route changes
  useEffect(() => {
    // Initialize or reset scroll position when route changes
    window.scrollTo(0, 0);
    
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
    
    // Set content as loaded after route change
    setContentLoaded(true);
  }, [location.pathname]);

  // Smooth auto-scroll effect for work page
  useEffect(() => {
    if (contentLoaded && view === 'work') {
      // Wait 3 seconds after content is loaded
      const scrollTimeout = setTimeout(() => {
        // Determine scroll distance - adjust this value as needed
        const scrollDistance = window.innerHeight * 0.55; // Scroll down 30% of viewport height
        
        // Improved smooth scrolling using Lenis if available
        const lenis = window?.Lenis || window?.lenis;
        if (lenis) {
          try {
            // Use a longer duration and smoother easing for more gentle scroll
            lenis.scrollTo(scrollDistance, { 
              duration: 2.8, // Longer duration for smoother scroll
              easing: (t) => { 
                // Custom easing function for a gentler start and finish
                // This is a modified ease-in-out cubic function
                return t < 0.5 
                  ? 4 * t * t * t 
                  : 1 - Math.pow(-2 * t + 2, 3) / 2;
              }
            });
          } catch (error) {
            console.warn('Lenis auto-scroll failed:', error);
            // Fallback to standard window scroll with custom animation
            smoothScrollTo(scrollDistance, 2800); // 2.8 seconds
          }
        } else {
          // Custom smooth scroll implementation as fallback
          smoothScrollTo(scrollDistance, 2800); // 2.8 seconds
        }
      }, 1000); // 3 second delay
      
      // Clean up
      return () => clearTimeout(scrollTimeout);
    }
  }, [contentLoaded, view]);

  // Custom smooth scroll function with requestAnimationFrame for smoother animation
  const smoothScrollTo = (targetPosition, duration) => {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function - cubic ease-in-out for smoother movement
      const easeInOutCubic = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      window.scrollTo(0, startPosition + distance * easeInOutCubic);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }
    
    requestAnimationFrame(animation);
  };

  const handleNavigation = (path) => {
    // Use navigate from react-router-dom
    navigate(path);
  };

  return (
    <div ref={scrollContainerRef}>
      <Navbar 
        onWorkClick={() => handleNavigation('/work')}
        onAboutClick={() => handleNavigation('/about')}
        activeView={view}
      />

      {view === 'work' && (
        <>
          <Work />
          <AboutPageRedirect onAboutClick={() => handleNavigation('/about')} />
        </>
      )}
      
      {view === 'about' && (
        <>
          <About />
          <ScrollVideo />
          <Footer />
        </>
      )}
    </div>
  );
}

// Wrap the app with necessary providers
export default function AppWrapper() {
  return (
    <ModalProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </ModalProvider>
  );
}