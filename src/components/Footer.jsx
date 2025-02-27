// Footer.jsx
import React, { useEffect, useState } from 'react';
import './Footer.css';

const Footer = () => {
  const [scroll, setScroll] = useState(0);
  
  useEffect(() => {
    const animate = () => {
      setScroll(prev => (prev + 0.25) % 100);
      requestAnimationFrame(animate);
    };
    const animation = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animation);
  }, []);

  const content = [
    { text: '© 2024 Grey.' },
    { text: 'Gresham Dave | Portfolio' },
    { text: 'Last Updated 27-02-2024' }
  ];

  const repeatedContent = [...content, ...content, ...content];

  return (
    <div className="footer">
      <div 
        className="scroll-container"
        style={{
          transform: `translateX(-${scroll}%)`,
          transition: 'transform 0.05s linear'
        }}
      >
        {repeatedContent.map((item, index) => (
          <div key={index} className="content-item">
            <span className="separator">+-+-+-</span>
            <p>{item.text}</p>
            <span className="separator">-+-+-+</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Footer;