import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import allayImage from '../../assets/allay.webp';
import { useEffect, useState, useCallback } from 'react';
import { useSoundEffect } from '../SoundEffects/useSoundEffect';
import allaySound1 from '../../audio/Allay_item_given1.ogg';
import allaySound2 from '../../audio/Allay_item_given2.ogg';
import allaySound3 from '../../audio/Allay_item_given3.ogg';
import allaySound4 from '../../audio/Allay_item_given4.ogg';

interface AllayHelperProps {
  blockPosition: { x: number, y: number, width: number, height: number } | null;
}

/**
 * Component for animating an Allay helper positioned at the top-right, above the Enderman
 * Allays increase passive income from all sources
 */
export const AllayHelper: React.FC<AllayHelperProps> = ({ blockPosition }) => {
  const { allayCount } = useGameStore();
  const playSound = useSoundEffect([allaySound1, allaySound2, allaySound3, allaySound4], 0.5);
  
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

  // Add debug console log
  useEffect(() => {
    console.log('Allay count:', allayCount);
    console.log('Block position:', blockPosition);
  }, [allayCount, blockPosition]);

  // Don't render if no allays
  if (allayCount <= 0 || !blockPosition) return null;

  return (
    <div className="allay-container">
      <motion.div
        className="allay-helper"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        onClick={playSound}
        style={{ 
          cursor: 'pointer',
          pointerEvents: 'auto',
          zIndex: 10
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