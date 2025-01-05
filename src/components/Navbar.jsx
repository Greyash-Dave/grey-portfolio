import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Navbar.css';

const NavItem = ({ children, onClick, activeView, view }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovering(true);
    setIsHovered(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(true);
    setIsHovering(false);
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 300);
  }, []);

  return (
    <p 
      onClick={onClick} 
      className={`navbar-item ${activeView === view ? 'active' : ''} ${isHovering ? 'hovering' : ''} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </p>
  );
};

const Navbar = ({ onWorkClick, onAboutClick, activeView }) => {
  const [hidden, setHidden] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const lastScrollY = useRef(0);
  const iframeRef = useRef(null);
  const playerReadyRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (window.innerWidth <= 480) {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastScrollY.current = currentScrollY;
    }
  }, []);

  const handleLogoClick = () => {
    if (iframeRef.current && playerReadyRef.current) {
      if (isPlaying) {
        iframeRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      } else {
        iframeRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    // Handle YouTube player events
    const handleMessage = (event) => {
      if (event.data && typeof event.data === 'string') {
        try {
          const data = JSON.parse(event.data);
          if (data.event === 'onReady') {
            playerReadyRef.current = true;
          }
        } catch (e) {
          // Ignore parsing errors from other messages
        }
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <>
      <div className={`navbar ${hidden ? 'hidden' : ''}`}>
        <div className="container">
          <div className="a">Gresham Dave</div>
          <div className="b">
            <NavItem 
              onClick={onWorkClick} 
              activeView={activeView}
              view="work"
            >
              WORK
            </NavItem>
            <NavItem 
              onClick={onAboutClick} 
              activeView={activeView}
              view="about"
            >
              ABOUT
            </NavItem>
          </div>
          <div className="c">
            <img 
              src='/Grey-Red-Logo.webp' 
              alt="Back" 
              onClick={handleLogoClick}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>
      <iframe
        ref={iframeRef}
        src="https://www.youtube.com/embed/Gcm6gpuxlfY?enablejsapi=1&autoplay=1&playlist=Gcm6gpuxlfY&loop=1"
        allow="autoplay"
        style={{ 
          position: 'absolute',
          visibility: 'hidden',
          height: 0,
          width: 0 
        }}
      />
    </>
  );
};

export default Navbar;