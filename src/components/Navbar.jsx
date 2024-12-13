import React, { useState, useEffect, useRef, useCallback } from 'react'
import './Navbar.css'

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
  return (
    <>
      <div className="navbar">
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
            <img src='/Grey-Red-Logo.png' alt="Back" />
          </div>
        </div>
      </div>    
    </>
  )
}

export default Navbar