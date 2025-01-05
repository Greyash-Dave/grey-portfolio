import React, { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis';
import Home from './Home'
import Experience from './Experience'

const Work = () => {
  const lenisRef = useRef(null);
  const lastTouchX = useRef(null);

  useEffect(() => {
    // Create a new Lenis instance for this page
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Smooth scroll to top with Lenis
    lenisRef.current?.scrollTo(0, { 
      duration: 1.2, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
    });

    // Handle horizontal touch gestures and convert to vertical scroll
    const handleTouchStart = (e) => {
      lastTouchX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
      if (!lastTouchX.current) return;

      const touchDeltaX = lastTouchX.current - e.touches[0].clientX;
      // Convert horizontal movement to vertical scroll
      // Positive deltaX (right to left) = scroll down
      // Negative deltaX (left to right) = scroll up
      if (Math.abs(touchDeltaX) > 10) { // Add threshold to prevent accidental triggers
        const scrollAmount = touchDeltaX * 2; // Adjust multiplier for sensitivity
        window.scrollBy(0, scrollAmount);
        e.preventDefault(); // Prevent horizontal scrolling
      }

      lastTouchX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      lastTouchX.current = null;
    };

    // Animate Lenis scroll
    function raf(time) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Add event listeners
    window.addEventListener('load', () => {
      lenisRef.current?.scrollTo(0, { 
        duration: 1.2, 
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
      });
    });
    
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    // Cleanup
    return () => {
      lenisRef.current?.destroy();
      window.removeEventListener('load', () => {});
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <>
        <Home />
        <Experience />
    </>
  )
}

export default Work