import React, { useEffect, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import { motion } from 'framer-motion';

const ScrollVideo = ({ videoSrc, className }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;

    if (!video || !container) return;

    // Ensure video is loaded and get its dimensions
    const loadVideo = () => {
      // Set video properties
      video.muted = true;
      video.playsInline = true;
      video.autoplay = false;
      video.preload = 'auto';
      video.pause();
      
      // Get video's natural dimensions
      setVideoDimensions({
        width: video.videoWidth,
        height: video.videoHeight
      });

      setIsVideoLoaded(true);
      console.log('Video loaded:', video.src, 'Duration:', video.duration);
    };

    // Log errors
    const handleVideoError = (e) => {
      console.error('Video error:', e);
      console.log('Video source:', videoSrc);
    };

    // Handle scroll-based video scrubbing
    const handleVideoScrub = (lenis) => {
      if (!video) return;

      // Calculate scroll progress (0 to 1)
      const scrollProgress = lenis.progress;
      
      // Calculate video duration and current time
      const duration = video.duration;
      const currentTime = scrollProgress * duration;

      // Set video currentTime
      if (!isNaN(duration)) {
        video.currentTime = Math.min(Math.max(currentTime, 0), duration);
      }
    };

    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 2,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Setup scroll event listener
    lenis.on('scroll', () => handleVideoScrub(lenis));

    // Animation frame for Lenis
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    // Start Lenis
    requestAnimationFrame(raf);

    // Load video
    video.addEventListener('loadedmetadata', loadVideo);
    video.addEventListener('error', handleVideoError);

    // Cleanup
    return () => {
      lenis.destroy();
      video.removeEventListener('loadedmetadata', loadVideo);
      video.removeEventListener('error', handleVideoError);
    };
  }, [videoSrc]);

  // Calculate video style to maintain aspect ratio while filling the container
  const calculateVideoStyle = () => {
    if (!isVideoLoaded || videoDimensions.width === 0) return {};

    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    const videoAspectRatio = videoDimensions.width / videoDimensions.height;
    const containerAspectRatio = containerWidth / containerHeight;

    let width, height, marginLeft = 0, marginTop = 0;

    if (videoAspectRatio > containerAspectRatio) {
      // Video is wider relative to its height
      height = containerHeight;
      width = height * videoAspectRatio;
      marginLeft = -(width - containerWidth) / 2;
    } else {
      // Video is taller relative to its width
      width = containerWidth;
      height = width / videoAspectRatio;
      marginTop = -(height - containerHeight) / 2;
    }

    return {
      position: 'absolute',
      width: `${width}px`,
      height: `${height}px`,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      opacity: 0.3,
      zIndex: -1
    };
  };

  return (
    <>
    <div 
      ref={containerRef} 
      className={`scroll-video-container ${className || ''}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '300vh',
        zIndex: -1,
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.5)' // Fallback background
      }}
    >
      {!isVideoLoaded && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white'
          }}
        >
          Loading video...
        </div>
      )}
      <motion.video
        ref={videoRef}
        src={videoSrc}
        style={{
        //   ...calculateVideoStyle(),
        //   display: isVideoLoaded ? 'block' : 'none'
            position: 'fixed',
            width: '100%',
            height: '107.5%',
            top: 0,
            zIndex: -1,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
    </div>
    </>
  );
};

export default ScrollVideo;