import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Lenis from '@studio-freight/lenis'
import WorkDescCard from './WorkDescCard'
import ScrollVideo from './ScrollVideo' // Import the new ScrollVideo component
import { useModal } from './ModalContext' // Adjust import path as needed
import './Experience.css'

const Experience = () => {
  const { openExperienceModal, experienceDetails } = useModal();
  const ref = useRef(null);
  const cardContainerRef = useRef(null);
  const cardsRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);

  // Intersection Observer to detect component visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        
        // Add or remove 'in-view' class based on intersection
        if (cardContainerRef.current) {
          if (entry.isIntersecting) {
            cardContainerRef.current.classList.add('in-view');
          } else {
            cardContainerRef.current.classList.remove('in-view');
          }
        }
      },
      { 
        threshold: 0.1 // Trigger when at least 10% of the component is visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  // Calculate container and card dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (cardContainerRef.current) {
        setContainerWidth(cardContainerRef.current.clientWidth);
      }
      // Assuming first card represents all cards
      const firstCard = document.querySelector('.workdesc-card');
      if (firstCard) {
        setCardWidth(firstCard.clientWidth);
      }
    };

    // Initial calculation
    updateDimensions();

    // Recalculate on window resize
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Detect center card
  useEffect(() => {
    const handleCenterCardDetection = () => {
      if (!cardsRef.current) return;

      const cards = cardsRef.current.querySelectorAll('.workdesc-card');
      const centerX = window.innerWidth / 2;

      cards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const cardOverlay = card.querySelector('.card-overlay');
        
        // Check if card is near the center of the screen
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const isNearCenter = Math.abs(cardCenterX - centerX) < cardRect.width / 2;

        if (cardOverlay) {
          if (isNearCenter) {
            cardOverlay.classList.add('active');
            setActiveCardIndex(index);
          } else {
            cardOverlay.classList.remove('active');
          }
        }
      });
    };

    // Add scroll and resize event listeners
    window.addEventListener('scroll', handleCenterCardDetection);
    window.addEventListener('resize', handleCenterCardDetection);

    // Initial check
    handleCenterCardDetection();

    return () => {
      window.removeEventListener('scroll', handleCenterCardDetection);
      window.removeEventListener('resize', handleCenterCardDetection);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["end end", "start start"]
  });

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
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

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Dynamic centering calculation
  const calculateCenterOffset = () => {
    // If no dimensions calculated yet, return 0
    if (containerWidth === 0 || cardWidth === 0) return 0;
    
    // Calculate the center offset dynamically
    const centerPosition = (containerWidth - cardWidth) / 2;
    return centerPosition;
  };

  // Transform scroll progress for horizontal movement
  const x = useTransform(scrollYProgress, [0, 1], [
    calculateCenterOffset() + 100, 
    calculateCenterOffset() - (experienceDetails.length * (cardWidth + 32)) // 32 is the gap between cards
  ]);

  // Opacity transformation for cards
  const cardsOpacity = useTransform(
    scrollYProgress, 
    [0, 0], // Opacity becomes 1 after initial 10% scroll
    [0, 1]
  );

  // Title animation variants
  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: 50 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="home1-container">
      <div className="home1" ref={ref}>
        <p>EXPERIENCE</p>
        <div className="video-container">
          {/* <ScrollVideo 
            videoSrc="/assets/coding-stock-footage2.mp4" 
            className="absolute inset-0 z-[-1]" 
          /> */}
        </div>
        <motion.div 
          ref={cardContainerRef}
          className="workdesc-card-container"
          style={{
            x: useTransform(scrollYProgress, [1, 0], [
              calculateCenterOffset() -1200, 
              calculateCenterOffset() - 700
            ])
          }}
        >
          <motion.div 
            ref={cardsRef}
            className="workdesc-cards"
            style={{
              x,
              opacity: cardsOpacity // Apply opacity transformation
            }}
          >
            {experienceDetails.map((experience, index) => (
              <motion.div 
                key={index} 
                className="workdesc-card"
                onClick={() => openExperienceModal(experience)} // Add click handler to open modal
                style={{
                  // Add some scaling and opacity effects
                  scale: useTransform(
                    scrollYProgress, 
                    [index/experienceDetails.length, (index+1)/experienceDetails.length], 
                    [1, 0.8]
                  ),
                  opacity: useTransform(
                    scrollYProgress, 
                    [index/experienceDetails.length, (index+1)/experienceDetails.length], 
                    [1, 0.6]
                  ),
                  cursor: 'pointer' // Add pointer cursor to indicate clickability
                }}
              >
                {/* Black opacity overlay with animated title */}
                <div className="card-overlay">
                  <AnimatePresence>
                    <motion.div 
                      className="card-title"
                      key={`title-${index}`}
                      variants={titleVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <h2>{experience.title}</h2>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <WorkDescCard src={experience.src} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        <div className="end">
        </div>
      </div>
    </div>
  )
}

export default Experience