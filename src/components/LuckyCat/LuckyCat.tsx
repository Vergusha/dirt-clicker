import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import catImage from '../../assets/cat.webp';
import { useEffect, useState, useCallback } from 'react';

/**
 * Component for displaying a Lucky Cat on screen when the player has the upgrade
 * Lucky Cat doubles random dirt drops and increases luck
 */
export const LuckyCat: React.FC = () => {
  const { luckyCatCount } = useGameStore();
  
  // Animation parameters
  const [animationDuration, setAnimationDuration] = useState(4.0);
  const [catSize, setCatSize] = useState(55);

  // Update responsive values based on screen size
  const updateResponsiveValues = useCallback(() => {
    if (window.innerWidth <= 480) {
      // Mobile devices
      setAnimationDuration(4.2);
      setCatSize(45);
    } else if (window.innerWidth <= 768) {
      // Tablets
      setAnimationDuration(4.0);
      setCatSize(50);
    } else {
      // Desktop
      setAnimationDuration(3.8);
      setCatSize(55);
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
  
  // Don't render if no Lucky Cats
  if (luckyCatCount <= 0) return null;
  
  return (
    <div className="lucky-cat-container">
      <motion.div
        className="lucky-cat"
        style={{
          pointerEvents: 'none',
          zIndex: 7, // Higher than Enderman but lower than Allay
        }}
      >
        <motion.img
          src={catImage} 
          alt="Lucky Cat" 
          className="lucky-cat-image" 
          style={{
            width: window.innerWidth <= 480 ? '45px' : '55px',
            height: 'auto',
            filter: 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.6))' // Golden glow
          }}
          animate={{
            // Slow head nod animation with a paw-waving effect
            rotate: [0, 3, 0, -3, 0],
            // Subtle scaling for "breathing" effect
            scale: [1, 1.03, 1],
            // Golden luck glow pulsing
            filter: [
              'drop-shadow(0 0 5px rgba(255, 215, 0, 0.6))', 
              'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))', 
              'drop-shadow(0 0 5px rgba(255, 215, 0, 0.6))'
            ]
          }}
          transition={{
            duration: animationDuration,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
}