import React, { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis';
import Home from './Home'
import Experience from './Experience'

const Work = () => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Create a new Lenis instance for this page
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Slightly modified easing
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

    // Animate Lenis scroll
    function raf(time) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Add event listener to ensure top of page on mount
    window.addEventListener('load', () => {
      lenisRef.current?.scrollTo(0, { 
        duration: 1.2, 
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
      });
    });

    // Cleanup Lenis instance when component unmounts
    return () => {
      lenisRef.current?.destroy();
      window.removeEventListener('load', () => {});
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