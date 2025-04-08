import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import allayImage from '../../assets/allay.webp';
import { useEffect, useState, useCallback } from 'react';

interface AllayHelperProps {
  blockPosition: { x: number, y: number, width: number, height: number } | null;
}

/**
 * Component for animating an Allay helper positioned at the top-right, above the Enderman
 * Allays increase passive income from all sources
 */
export const AllayHelper: React.FC<AllayHelperProps> = ({ }) => {
  const { allayCount } = useGameStore();
  
  // Animation duration for floating
  const [animationDuration, setAnimationDuration] = useState(3.0);

  // Update responsive values based on screen size
  const updateResponsiveValues = useCallback(() => {
    if (window.innerWidth <= 480) {
      // Mobile devices
      setAnimationDuration(3.2);
    } else if (window.innerWidth <= 768) {
      // Tablets
      setAnimationDuration(3.0);
    } else {
      // Desktop
      setAnimationDuration(2.8);
    }
  }, []);

  // Listen for window resize events
  useEffect(() => {
    updateResponsiveValues();
    
    const handleResize = () => {
      updateResponsiveValues();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateResponsiveValues]);

  // Don't render if no allays
  if (allayCount <= 0) return null;

  return (
    <div className="allay-container">
      <motion.div
        className="allay-helper"
        style={{
          pointerEvents: 'none',
          zIndex: 6, // Higher than Enderman to appear above it
        }}
      >
        <motion.img
          src={allayImage}
          alt="Allay Helper"
          className="allay-image"
          style={{
            width: window.innerWidth <= 480 ? '38px' : '48px',
            height: 'auto',
            filter: 'drop-shadow(0 0 5px rgba(165, 220, 255, 0.7))'
          }}
          animate={{
            // Floating animation - vertical bobbing
            y: [-10, 10, -10],
            // Slight rotation for a more lively appearance
            rotate: [-5, 5, -5],
            // Subtle pulsing glow effect
            filter: [
              'drop-shadow(0 0 5px rgba(165, 220, 255, 0.7))', 
              'drop-shadow(0 0 10px rgba(165, 220, 255, 0.9))', 
              'drop-shadow(0 0 5px rgba(165, 220, 255, 0.7))'
            ]
          }}
          transition={{
            duration: animationDuration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
}