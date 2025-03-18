import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const GalaxyBackground = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const galaxyRef = useRef(null);
  const codeSpritesRef = useRef(null);
  const starsRef = useRef(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('rgb(2, 19, 45)', 0.035);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor('rgb(2, 19, 45)', 1);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Galaxy parameters tailored to your color scheme
    const parameters = {
      count: 12000,
      size: 0.02,
      radius: 6,
      branches: 5,
      spin: 1.2,
      randomness: 0.65,
      randomnessPower: 3,
      insideColor: 'rgb(249, 122, 89)', // --yang: Vibrant Coral Orange
      outsideColor: 'rgb(2, 19, 45)',   // --yin: Deep Midnight Blue
      secondaryColor: 'rgb(253, 204, 94)' // --neutral: Bright Yellow
    };

    // Programming keywords and ASCII characters (selected shorter ones for performance)
    const codeElements = [
      // Short programming keywords
      'if', 'for', 'let', 'var', 'try', 'async', 'void', 'new', 'this', 'map',
      
      // ASCII symbols - common in programming
      '{', '}', '[', ']', '(', ')', '<', '>', '=', '+', '-', '*', '/', '%', '!',
      
      // Short HTML tags
      '<div>', '<h1>', '<p>', '<a>', '<img>',
      
      // Math symbols
      '∑', '∏', '∫', '√', '∞', 'π', 'θ', 'λ'
    ];

    // Create text sprite function
    const createTextSprite = (text, color = 0xffffff) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 128;
      canvas.height = 64;

      context.font = '14px monospace';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = new THREE.Color(color).getStyle();
      context.fillText(text, canvas.width / 2, canvas.height / 2);

      // Canvas contents will be used for a texture
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;

      // Create sprite material and sprite
      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.1
      });

      return spriteMaterial;
    };

    // Create galaxy particles (main component)
    const generateGalaxy = () => {
      // Create new geometry
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(parameters.count * 3);
      const colors = new Float32Array(parameters.count * 3);

      const colorInside = new THREE.Color(parameters.insideColor);
      const colorOutside = new THREE.Color(parameters.outsideColor);
      const colorSecondary = new THREE.Color(parameters.secondaryColor);

      for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        // Position
        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin;
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY * 0.5; // Flatter galaxy
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        // Color
        let mixedColor;
        // Add some secondary color (yellow) particles randomly
        if (Math.random() > 0.92) {
          mixedColor = colorSecondary.clone();
        } else {
          mixedColor = colorInside.clone();
          mixedColor.lerp(colorOutside, radius / parameters.radius);
        }

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      // Material
      const material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        transparent: true,
        alphaMap: new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/disc.png'),
      });

      // Points
      const points = new THREE.Points(geometry, material);
      scene.add(points);
      galaxyRef.current = points;
      
      return { geometry, material, points };
    };
    
    // Add code sprites (sparingly)
    const addCodeSprites = () => {
      const codeSpritesGroup = new THREE.Group();
      // Only add ~200 code sprites for performance (much less than particles)
      const codeSpritesCount = 100;
      
      for (let i = 0; i < codeSpritesCount; i++) {
        // Determine text element
        const textIndex = Math.floor(Math.random() * codeElements.length);
        const text = codeElements[textIndex];
        
        // Position - following same galaxy pattern as particles
        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin;
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

        const x = Math.cos(branchAngle + spinAngle) * radius + randomX;
        const y = randomY * 0.5; // Flatter galaxy
        const z = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        // Color
        let color;
        // Add some secondary color particles randomly
        if (Math.random() > 0.5) {
          color = parameters.secondaryColor; // More yellow code characters for visibility
        } else {
          color = parameters.insideColor; // Coral color
        }

        // Create text sprite with determined color
        const spriteMaterial = createTextSprite(text, color);
        const sprite = new THREE.Sprite(spriteMaterial);
        
        // Set position
        sprite.position.set(x, y, z);
        
        // Scale sprites
        const scale = 0.15 + Math.random() * 0.1;
        sprite.scale.set(scale, scale/2, scale);
        
        codeSpritesGroup.add(sprite);
      }
      
      scene.add(codeSpritesGroup);
      codeSpritesRef.current = codeSpritesGroup;
      return codeSpritesGroup;
    };

    // Add distant stars backdrop
    const addDistantStars = () => {
      const starsGeometry = new THREE.BufferGeometry();
      const starsCount = 2000;
      const starPositions = new Float32Array(starsCount * 3);
      const starColors = new Float32Array(starsCount * 3);
      
      for (let i = 0; i < starsCount * 3; i += 3) {
        // Position stars in a larger sphere around the scene
        const radius = 30 + Math.random() * 70;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
        starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        starPositions[i + 2] = radius * Math.cos(phi);
        
        // Vary star colors between white and slightly blue/yellow
        const colorChoice = Math.random();
        if (colorChoice > 0.95) {
          // Yellow/warm stars (using --neutral)
          starColors[i] = 1;
          starColors[i + 1] = 0.8;
          starColors[i + 2] = 0.4;
        } else if (colorChoice > 0.9) {
          // Blueish stars
          starColors[i] = 0.6;
          starColors[i + 1] = 0.8;
          starColors[i + 2] = 1;
        } else {
          // White/neutral stars
          const brightness = 0.5 + Math.random() * 0.5;
          starColors[i] = brightness;
          starColors[i + 1] = brightness;
          starColors[i + 2] = brightness;
        }
      }
      
      starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      starsGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
      
      const starsMaterial = new THREE.PointsMaterial({
        size: 0.015,
        transparent: true,
        opacity: 0.8,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });
      
      const stars = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(stars);
      starsRef.current = stars;
      
      return { geometry: starsGeometry, material: starsMaterial, points: stars };
    };

    // Create all scene elements
    const galaxy = generateGalaxy();
    const codeSprites = addCodeSprites();
    const distantStars = addDistantStars();

    // Handle mouse movement
    const handleMouseMove = (event) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Rotate galaxy
      if (galaxyRef.current) {
        galaxyRef.current.rotation.y = elapsedTime * 0.03;
        
        // Subtle movement based on mouse position
        const targetX = mousePosition.current.x * 0.1;
        const targetY = mousePosition.current.y * 0.1;
        galaxyRef.current.rotation.x += (targetY - galaxyRef.current.rotation.x) * 0.01;
        galaxyRef.current.rotation.z += (targetX - galaxyRef.current.rotation.z) * 0.01;
      }
      
      // Sync code sprites rotation with regular particle galaxy
      if (codeSpritesRef.current && galaxyRef.current) {
        codeSpritesRef.current.rotation.copy(galaxyRef.current.rotation);
      }
      
      // Rotate stars very slowly
      if (starsRef.current) {
        starsRef.current.rotation.y = elapsedTime * 0.005;
        starsRef.current.rotation.x = elapsedTime * 0.002;
      }

      // Render
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Handle scroll effect - subtle camera movement
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollFraction = scrollY / maxScroll;
      
      if (cameraRef.current) {
        cameraRef.current.position.y = -scrollFraction * 2; // Subtle vertical movement
      }
    };
    
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Clean up galaxy
      if (galaxy.geometry) galaxy.geometry.dispose();
      if (galaxy.material) galaxy.material.dispose();
      if (galaxy.points) scene.remove(galaxy.points);
      
      // Clean up code sprites
      if (codeSpritesRef.current) {
        codeSpritesRef.current.traverse((child) => {
          if (child instanceof THREE.Sprite) {
            child.material.map.dispose();
            child.material.dispose();
          }
        });
        scene.remove(codeSpritesRef.current);
      }
      
      // Clean up stars
      if (distantStars.geometry) distantStars.geometry.dispose();
      if (distantStars.material) distantStars.material.dispose();
      if (distantStars.points) scene.remove(distantStars.points);
      
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

export default GalaxyBackground;