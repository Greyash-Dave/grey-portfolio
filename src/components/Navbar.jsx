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
  const lastScrollY = useRef(0);

  const handleScroll = useCallback(() => {
    if (window.innerWidth <= 480) {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current) {
        setHidden(true); // Hide navbar on scroll down
      } else {
        setHidden(false); // Show navbar on scroll up
      }

      lastScrollY.current = currentScrollY;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
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
            <img src='/Grey-Red-Logo.webp' alt="Back" />
          </div>
        </div>
      </div>    
    </>
  );
}

export default Navbar;
