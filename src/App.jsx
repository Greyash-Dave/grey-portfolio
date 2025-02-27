import React, { useState, useRef, useEffect } from 'react';
import { HashRouter , Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
  }, [location.pathname]);

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