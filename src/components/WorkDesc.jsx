import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ChevronLeft, ChevronRight, Linkedin, X } from 'lucide-react';
import './WorkDesc.css';

const WorkDesc = ({ 
  title, 
  description, 
  timeline, 
  liveLink, 
  demoLink, 
  youtubeLink, 
  images 
}) => {
  // Function to convert YouTube watch URL to embed URL
  const transformYoutubeLink = (link) => {
    if (!link) return null;
    
    // Check if it's already an embed URL
    if (link.includes('/embed/')) return link;
    
    // Extract video ID from watch URL
    const videoIdMatch = link.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    
    return link; // Return original link if no match found
  };

  // Memoize the transformed YouTube link
  const embedLink = useMemo(() => transformYoutubeLink(youtubeLink), [youtubeLink]);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleFullScreenImage = (img) => {
    setFullScreenImage(img);
  };

  const closeFullScreenImage = () => {
    setFullScreenImage(null);
  };

  // Calculate slider pagination
  const imagesPerPage = 2;
  const totalPages = Math.ceil(images.length / imagesPerPage);
  const currentPage = Math.floor(currentImageIndex / imagesPerPage);

  // Determine what to show in the video container
  const videoContainerContent = embedLink ? (
    <iframe 
      src={embedLink}
      title="Project Demo"
      className="work-desc-video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  ) : images.length > 0 ? (
    <img 
      src={images[0]} 
      alt="Project first image" 
      className="work-desc-video"
      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
    />
  ) : null;

  return (
    <div className="work-desc-container">
      <div className="work-desc-wrapper">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="work-desc-details"
        >
          <div className="work-desc-content">
            <h1 className="work-desc-title">{title}</h1>
            
            <div className="work-desc-timeline">
              <h3 className="work-desc-section-title">Project Timeline</h3>
              <p className="work-desc-timeline-text">
                <svg xmlns="http://www.w3.org/2000/svg" className="timeline-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {timeline}
              </p>
            </div>
            
            <div className="work-desc-links">
              {liveLink && (
                <a 
                  href={liveLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="work-desc-live-link"
                >
                  <ExternalLink className="link-icon"/> Live Site
                </a>
              )}
              
              {demoLink && (
                <a 
                  href={demoLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="work-desc-github-link"
                >
                  <Linkedin className="link-icon"/> LinkedIn Post
                </a>
              )}
            </div>

            <div className="work-desc-section">
              <h3 className="work-desc-section-title">Description</h3>
              <p className="work-desc-description">{description}</p>
            </div>
            
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="work-desc-media"
        >
          {videoContainerContent && (
            <div className="work-desc-video-container">
              {videoContainerContent}
            </div>
          )}
          
          <div className="work-desc-image-slider">
            {images.length > 2 && (
              <div className="image-slider-navigation">
                <button 
                  onClick={handlePrevImage} 
                  className="slider-nav-button"
                  disabled={images.length <= imagesPerPage}
                >
                  <ChevronLeft />
                </button>
                <button 
                  onClick={handleNextImage} 
                  className="slider-nav-button"
                  disabled={images.length <= imagesPerPage}
                >
                  <ChevronRight />
                </button>
              </div>
            )}
            
            <div className="work-desc-image-grid">
              {images
                .slice(embedLink ? currentPage * imagesPerPage : (currentPage * imagesPerPage + 1), 
                       embedLink ? (currentPage + 1) * imagesPerPage : (currentPage + 1) * imagesPerPage + 1)
                .map((img, index) => (
                  <motion.div 
                    key={index}
                    className="work-desc-image-wrapper"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => handleFullScreenImage(img)}
                  >
                    <img 
                      src={img} 
                      alt={`Project screenshot ${embedLink ? currentPage * imagesPerPage + index + 1 : currentPage * imagesPerPage + index + 2}`}
                      className="work-desc-image"
                      draggable="false"
                    />
                  </motion.div>
                ))
              }
            </div>
            
            {images.length > 2 && (
              <div className="image-slider-pagination">
                {Array.from({ length: embedLink ? totalPages : totalPages - 1 }).map((_, index) => (
                  <span 
                    key={index}
                    className={`pagination-dot ${index === currentPage ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index * imagesPerPage)}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Full Screen Image Modal */}
      {fullScreenImage && (
        <div 
          className="full-screen-image-overlay"
          onClick={closeFullScreenImage}
        >
          <motion.div 
            className="full-screen-image-container"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="full-screen-close-button"
              onClick={closeFullScreenImage}
            >
              <X size={24} />
            </button>
            <div className="full-screen-image-scroll-container">
              <img 
                src={fullScreenImage} 
                alt="Full screen project image" 
                className="full-screen-image"
                draggable="false"
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default WorkDesc;