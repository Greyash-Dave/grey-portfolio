import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const MatrixBackground = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const raindropGroupsRef = useRef([]);
  const mousePosition = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('rgb(2, 19, 45)', 0.15);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5; // Start with camera further away
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance' // Request high performance GPU
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Use a lower pixel ratio for better performance
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor('rgb(2, 19, 45)', 1); // Deep Midnight Blue background
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Matrix parameters - with updated color scheme and increased clarity
    const parameters = {
      columns: Math.min(50, Math.floor(window.innerWidth / 25)), // Reduced column count for clarity
      rows: 40, // Reduced row count
      columnWidth: 0.25, // Slightly wider columns for better spacing
      fallingSpeed: 0.03,
      mainColor: 'rgb(249, 122, 89)', // Vibrant Coral Orange (yang)
      highlightColor: 'rgb(253, 204, 94)', // Vibrant Yellow (neutral)
      dimColor: 'rgba(249, 122, 89, 0.7)', // Less transparency for better visibility
      characterChangeSpeed: 0.02,
      characterSize: 0.32, // Increased size for larger, more visible characters
      particleSize: 0.08, // Size for trailing particles
      particlesPerDrop: 3, // Number of particles per raindrop
      particleSpacing: 0.2 // Spacing between particles
    };

    // Reduced set of programming keywords - fewer unique textures
    const codeElements = [
      // Languages
      'JavaScript', 'Python', 'Java', 'Rust', 'C', 'C#', 'Bash', 'Shell', 'HTML', 'CSS',
      
      // Databases
      'PostgreSQL', 'Supabase', 'MySQL',
    
      // Frameworks
      'React.js', 'Node.js', 'Express.js', 'Axios', 
      'Lenis', 'Three.js', 'Pygame', 
      'Ren\'Py', 'OpenCV',
    
      // Technologies
      'Pandas', 'Numpy', 'Selenium', 
      'Linux', 'NixOS', 'FFmpeg', 'Whisper',
    
      // Tools
      'Git', 'Docker', 'Vim', 'Postman', 'Notion', 'Canva', 'Ollama', 
      'VS Code', 'Unity', 'Blender',
    
      // Common symbols and operators
      '{', '}', '[', ']', '(', ')', '<', '>', '=', '==', '!=', '+=', '-=', 
      '&&', '||', '=>', ';', '.', ',',
    
      // HTML/CSS basics
      '<div>', '</div>', '<p>', '</p>', '<span>', 'style', 'flex', 'grid'
    ];
    

    // Texture atlas approach - pre-create and reuse textures
    const textureCache = {};
    
    const getTextTexture = (text, color = parameters.mainColor) => {
      const key = `${text}_${color}`;
      
      if (textureCache[key]) {
        return textureCache[key];
      }
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 256; // Increased for higher resolution textures
      canvas.height = 128; // Increased for higher resolution textures
      
      context.fillStyle = 'rgba(0, 0, 0, 0)'; // Transparent background
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Use a bolder font with increased size
      context.font = 'bold 46px monospace'; // Increased font size and made bold
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      
      // Add slight text shadow for better contrast against background
      context.shadowColor = 'rgba(0, 0, 0, 0.8)';
      context.shadowBlur = 8;
      context.shadowOffsetX = 1;
      context.shadowOffsetY = 1;
      
      // Fill with color
      context.fillStyle = color;
      
      // Draw text twice for extra boldness
      context.fillText(text, canvas.width / 2, canvas.height / 2);
      context.fillText(text, canvas.width / 2, canvas.height / 2);
      
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      
      // Store in cache
      textureCache[key] = texture;
      
      return texture;
    };

    // Create particle texture (dot)
    const getParticleTexture = (color = parameters.mainColor) => {
      const key = `particle_${color}`;
      
      if (textureCache[key]) {
        return textureCache[key];
      }
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 64;
      canvas.height = 64;
      
      context.fillStyle = 'rgba(0, 0, 0, 0)'; // Transparent background
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw a circular dot
      context.beginPath();
      context.arc(canvas.width / 2, canvas.height / 2, canvas.width / 4, 0, Math.PI * 2);
      context.fillStyle = color;
      context.fill();
      
      // Add glow effect
      context.shadowColor = color;
      context.shadowBlur = 10;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.beginPath();
      context.arc(canvas.width / 2, canvas.height / 2, canvas.width / 4 - 2, 0, Math.PI * 2);
      context.fill();
      
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      
      // Store in cache
      textureCache[key] = texture;
      
      return texture;
    };

    // Create a more efficient raindrop material with stronger contrast
    const createDropMaterial = (text, color = parameters.mainColor) => {
      return new THREE.SpriteMaterial({
        map: getTextTexture(text, color),
        transparent: true,
        alphaTest: 0.05, // Higher alpha test for crisper edges
        blending: THREE.AdditiveBlending
      });
    };

    // Create material for particles
    const createParticleMaterial = (color = parameters.mainColor) => {
      return new THREE.SpriteMaterial({
        map: getParticleTexture(color),
        transparent: true,
        alphaTest: 0.1,
        blending: THREE.AdditiveBlending
      });
    };

    // Use instanced mesh approach for better performance
    const createEfficientRaindrops = () => {
      const raindropGroups = [];
      const totalColumns = parameters.columns;
      
      // Pre-compute some column properties for more efficiency
      for (let col = 0; col < totalColumns; col++) {
        // Create a group for each column - but with fewer sprites
        const columnGroup = new THREE.Group();
        columnGroup.position.x = (col - totalColumns / 2) * parameters.columnWidth;
        
        // Optimize: fewer raindrops per column for better visibility
        const density = 0.25 + Math.random() * 0.35; // Less density (25-60%)
        const dropCount = Math.floor(parameters.rows * density * 0.5); // Fewer drops for clarity
        const columnSpeed = parameters.fallingSpeed * (0.8 + Math.random() * 0.5);
        
        // Create an array to hold the raindrops in this column
        const raindrops = [];
        
        // Add optimized number of raindrops per column
        for (let i = 0; i < dropCount; i++) {
          // Choose from a smaller set of text elements
          const textIndex = Math.floor(Math.random() * codeElements.length);
          const text = codeElements[textIndex];
          
          // Color distribution - more vibrant colors for better visibility
          let color;
          const colorRandom = Math.random();
          if (colorRandom > 0.85) {
            // Brighter highlight color
            color = parameters.highlightColor; // Neutral/Yellow for highlights (15%)
          } else if (colorRandom > 0.65) {
            color = parameters.dimColor; // Dimmed coral for variation (20%)
          } else {
            // Increase brightness of main color for better visibility
            color = parameters.mainColor; // Main coral color (65%)
          }
          
          // Create sprite with cached material
          const spriteMaterial = createDropMaterial(text, color);
          const sprite = new THREE.Sprite(spriteMaterial);
          
          // Position sprite in column with more spacing
          const rowPos = Math.floor(Math.random() * parameters.rows);
          sprite.position.y = (rowPos - parameters.rows / 2) * parameters.columnWidth * 1.5;
          
          // Reduce z-variation for better batching
          sprite.position.z = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1 only
          
          // Use larger scale for the sprite
          const scale = parameters.characterSize;
          sprite.scale.set(scale, scale, scale);
          
          // Simplified userData for better performance
          sprite.userData = {
            speed: columnSpeed * (0.85 + Math.random() * 0.3),
            changeTimer: 20 + Math.random() * 40, // Less frequent changes
            color: color,
            delay: i * 3,
            particles: []
          };
          
          columnGroup.add(sprite);
          
          // Add trailing particles above each raindrop
          for (let p = 0; p < parameters.particlesPerDrop; p++) {
            const particleMaterial = createParticleMaterial(color);
            const particle = new THREE.Sprite(particleMaterial);
            
            // Position particles above the raindrop
            particle.position.y = sprite.position.y + (p + 1) * parameters.particleSpacing;
            particle.position.z = sprite.position.z;
            
            // Smaller scale for particles
            particle.scale.set(
              parameters.particleSize,
              parameters.particleSize,
              parameters.particleSize
            );
            
            // Set decreasing opacity for higher particles
            const opacity = 1 - (p / parameters.particlesPerDrop) * 0.7;
            particle.material.opacity = opacity;
            
            columnGroup.add(particle);
            sprite.userData.particles.push(particle);
          }
          
          raindrops.push(sprite);
        }
        
        scene.add(columnGroup);
        
        raindropGroups.push({
          group: columnGroup,
          raindrops,
          speed: columnSpeed
        });
      }
      
      raindropGroupsRef.current = raindropGroups;
      return raindropGroups;
    };

    // Create optimized matrix rain
    const raindrops = createEfficientRaindrops();

    // Throttled mouse handler for better performance
    let mouseMoveTimeout;
    const handleMouseMove = (event) => {
      if (mouseMoveTimeout) return; // Skip if already waiting
      
      mouseMoveTimeout = setTimeout(() => {
        mousePosition.current = {
          x: (event.clientX / window.innerWidth) * 2 - 1,
          y: -(event.clientY / window.innerHeight) * 2 + 1
        };
        mouseMoveTimeout = null;
      }, 50); // Only update every 50ms
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Add camera animation after 5 seconds
    let cameraAnimated = false;
    const animateCamera = () => {
      setTimeout(() => {
        cameraAnimated = true;
      }, 3000); // 3 seconds delay
    };
    
    animateCamera();

    // More efficient animation loop
    const clock = new THREE.Clock();
    let lastUpdateTime = 0;
    const UPDATE_INTERVAL = 1/30; // 30 fps target for character updates
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - lastUpdateTime;
      
      // Camera animation (move closer after 3 seconds)
      if (cameraAnimated && camera.position.z > 2.5) {
        camera.position.z -= 0.05; // Gradually move camera closer
        if (camera.position.z <= 2.5) {
          camera.position.z = 2.5; // Ensure it stops exactly at 2.5
        }
      }

      // Tilt entire scene based on mouse position
      if (cameraAnimated) {
        const targetRotationX = mousePosition.current.y * 0.2; // Tilt up/down based on mouse Y
        const targetRotationY = mousePosition.current.x * 0.2; // Tilt left/right based on mouse X
        
        // Smoothly interpolate current rotation to target rotation
        scene.rotation.x += (targetRotationX - scene.rotation.x) * 0.03;
        scene.rotation.y += (targetRotationY - scene.rotation.y) * 0.03;
      }
      
      // Only update character positions at fixed intervals
      if (deltaTime > UPDATE_INTERVAL) {
        lastUpdateTime = elapsedTime;
        
        // Update raindrop positions
        raindropGroupsRef.current.forEach((column) => {
          column.raindrops.forEach((raindrop) => {
            if (raindrop.userData.delay > 0) {
              raindrop.userData.delay--;
              return;
            }
            
            // Previous position
            const prevY = raindrop.position.y;
            
            // Move raindrop down
            raindrop.position.y -= raindrop.userData.speed * deltaTime * 10;
            
            // Reset position when out of view
            if (raindrop.position.y < -parameters.rows / 2 * parameters.columnWidth * 1.5) {
              raindrop.position.y = parameters.rows / 2 * parameters.columnWidth * 1.5;
              
              // Also reset particle positions when raindrop resets
              raindrop.userData.particles.forEach((particle, index) => {
                particle.position.y = raindrop.position.y + (index + 1) * parameters.particleSpacing;
              });
            } else {
              // Update trailing particles
              raindrop.userData.particles.forEach((particle, index) => {
                // Make particles follow the raindrop with the same speed
                particle.position.y -= raindrop.userData.speed * deltaTime * 10;
              });
            }
            
            // Less frequent character changes
            raindrop.userData.changeTimer -= deltaTime;
            if (raindrop.userData.changeTimer <= 0) {
              // Only change about 10% of chars per update for performance
              if (Math.random() > 0.9) {
                const textIndex = Math.floor(Math.random() * codeElements.length);
                const newText = codeElements[textIndex];
                
                // Replace sprite material with new text from cache
                raindrop.material.dispose();
                raindrop.material = createDropMaterial(newText, raindrop.userData.color);
              }
              
              // Reset timer with longer interval for less frequent changes
              raindrop.userData.changeTimer = 20 + Math.random() * 40;
            }
          });
        });
      }

      // Render scene
      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Debounced window resize handler
    let resizeTimeout;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      
      resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    
    // Thorough cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Clean up raindrops and materials
      raindropGroupsRef.current.forEach((column) => {
        column.raindrops.forEach((raindrop) => {
          // Clean up particle materials
          raindrop.userData.particles.forEach(particle => {
            particle.material.dispose();
          });
          
          raindrop.material.dispose();
        });
        scene.remove(column.group);
      });
      
      // Clean up texture cache
      Object.values(textureCache).forEach(texture => {
        texture.dispose();
      });
      
      renderer.dispose();
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2.5 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    >
      <style>
        {`
          canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          
          @media (prefers-reduced-motion) {
            canvas {
              animation-duration: 0s !important;
              transition-duration: 0s !important;
            }
          }
        `}
      </style>
    </motion.div>
  );
};

export default MatrixBackground;