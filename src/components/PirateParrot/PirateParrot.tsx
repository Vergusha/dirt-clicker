import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import parrotImage from '../../assets/parrot.webp';
import dancingParrotImage from '../../assets/dancing_parrot.webp';
import { useEffect, useState, useCallback } from 'react';

/**
 * Component for displaying a Pirate Parrot on screen when the player has the upgrade
 * Parrot adds +30 dirt per second
 * When music is enabled, it shows a dancing parrot
 */
export const PirateParrot: React.FC = () => {
  const { pirateParrotCount, musicEnabled } = useGameStore();
  
  // Animation parameters
  const [animationDuration, setAnimationDuration] = useState(4.0);
  const [parrotSize, setParrotSize] = useState(55);

  // Update responsive values based on screen size
  const updateResponsiveValues = useCallback(() => {
    if (window.innerWidth <= 480) {
      // Mobile devices
      setAnimationDuration(4.2);
      setParrotSize(45);
    } else if (window.innerWidth <= 768) {
      // Tablets
      setAnimationDuration(4.0);
      setParrotSize(50);
    } else {
      // Desktop
      setAnimationDuration(3.8);
      setParrotSize(55);
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

  // Don't render if no Pirate Parrots
  if (pirateParrotCount <= 0) return null;

  // Choose image based on music state
  const currentImage = musicEnabled ? dancingParrotImage : parrotImage;

  return (
    <div className="pirate-parrot-container">
      <motion.div
        className="pirate-parrot"
        style={{
          pointerEvents: 'none',
          zIndex: 8, // Higher than LuckyCat (7) but lower than other important UI
        }}
      >
        <motion.img
          src={currentImage}
          alt="Pirate Parrot"
          className="pirate-parrot-image"
          style={{
            width: window.innerWidth <= 480 ? '45px' : '55px',
            height: 'auto',
            filter: musicEnabled 
              ? 'drop-shadow(0 0 5px rgba(255, 0, 0, 0.7))' // Red glow for dancing
              : 'drop-shadow(0 0 5px rgba(0, 255, 255, 0.5))' // Cyan glow for static
          }}
          animate={{
            // Different animations based on music status
            ...(musicEnabled
              ? {
                  // Dancing animation with more movement
                  rotate: [0, 10, 0, -10, 0],
                  y: [0, -10, 0, -5, 0],
                  scale: [1, 1.05, 1, 1.03, 1],
                }
              : {
                  // Subtle floating animation when not dancing
                  y: [0, -5, 0],
                  rotate: [0, 3, 0, -3, 0],
                  scale: [1, 1.03, 1],
                }),
          }}
          transition={{
            duration: musicEnabled ? animationDuration * 0.8 : animationDuration, // Faster when dancing
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
};