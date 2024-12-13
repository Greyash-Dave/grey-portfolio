import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './WorkDescModal.css';

const WorkDescModal = ({ isOpen, onClose, children }) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const [preventOpen, setPreventOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // If the modal is opened, set it as visible immediately
      if (!preventOpen) {
        setIsVisible(true);
        setIsClosing(false);
      }
    } else {
      // If the modal is being closed, trigger the closing animation
      setIsClosing(true);
      // Prevent opening the modal again before the closing animation is done
      setPreventOpen(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);

    // Wait for the CSS animation to complete before closing the modal
    const timer = setTimeout(() => {
      onClose();
      setIsVisible(false);
      setPreventOpen(false);  // Allow the modal to open again after it is fully closed
    }, 300); // Match the CSS animation duration

    return () => clearTimeout(timer);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`work-desc-modal-overlay ${isClosing ? 'closing' : ''}`}
    >
      <div 
        className={`work-desc-modal-container ${isClosing ? 'closing' : ''}`}
      >
        <button 
          onClick={handleClose} 
          className="work-desc-modal-close"
        >
          <X size={24} />
        </button>
        <div className="work-desc-modal-wrapper">{children}</div>
      </div>
    </div>
  );
};

export default WorkDescModal;
