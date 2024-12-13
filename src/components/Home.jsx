import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Lenis from '@studio-freight/lenis'
import WorkDescCard from './WorkDescCard'
import ScrollVideo from './ScrollVideo' // Import the new ScrollVideo component
import { useModal } from '../components/ModalContext'
import './Home.css'

const Home = () => {
  const { openProjectModal, projectDetails } = useModal();
  const ref = useRef(null);
  const cardContainerRef = useRef(null);
  const cardsRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

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
    offset: ["start start", "end end"]
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
    calculateCenterOffset() + 300, 
    calculateCenterOffset() - (projectDetails.length * (cardWidth + 32)) - 96 // 32 is the gap between cards
  ]);

  // Opacity transformation for cards
  const cardsOpacity = useTransform(
    scrollYProgress, 
    [0, 0, 0, 0, 0.9, 1], // Opacity becomes 1 after initial 10% scroll
    [0, 1, 1, 1, 1, 0]
  );

  // const cardsOpacity = useTransform(
  //   scrollYProgress, 
  //   [0, 0.1], // Opacity becomes 1 after initial 10% scroll
  //   [0, 1]
  // );

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
    <div className="home" ref={ref}>
      {/* Add ScrollVideo component as a background */}
      <div className="end">
      <p>PROJECTS</p>
      </div>
      <div className="video-container">
      <ScrollVideo 
        videoSrc="./src/assets/coding-stock-footage.mp4" 
        className="absolute inset-0 z-[-1]" 
      />
      </div>
      <motion.div 
        ref={cardContainerRef}
        className="workdesc-card-container"
        style={{
          x: useTransform(scrollYProgress, [0, 1], [
            calculateCenterOffset(), 
            calculateCenterOffset() - 300 //900
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
          {projectDetails.map((project, index) => (
            <motion.div 
              key={index} 
              className="workdesc-card"
              onClick={() => openProjectModal(project)} // Add click handler to open modal
              style={{
                scale: useTransform(
                  scrollYProgress, 
                  [index/projectDetails.length, (index+1)/projectDetails.length], 
                  [0.8, 1]
                ),
                opacity: useTransform(
                  scrollYProgress, 
                  [index/projectDetails.length, (index+1)/projectDetails.length], 
                  [0.6, 1]
                ),
                cursor: 'pointer', // Add pointer cursor to indicate clickability
                position: 'relative', // Ensure cards are above the background video
                zIndex: 10 // Make sure cards are above the video
              }}
            >
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
                    <h2>{project.title}</h2>
                  </motion.div>
                </AnimatePresence>
              </div>
              <WorkDescCard src={project.src} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Home