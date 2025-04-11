import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import parrotImage from '../../assets/parrot.webp';
import dancingParrotImage from '../../assets/dancing_parrot.webp';
import { useEffect, useState, useCallback } from 'react';
import { useSoundEffect } from '../SoundEffects/useSoundEffect';
import parrotSound1 from '../../audio/Parrot_idle1.ogg';
import parrotSound2 from '../../audio/Parrot_idle2.ogg';

/**
 * Component for displaying a Pirate Parrot on screen when the player has the upgrade
 * Parrot adds +30 dirt per second
 * When music is enabled and volume is above minimum threshold, it shows a dancing parrot
 */
export const PirateParrot: React.FC = () => {
  const { pirateParrotCount, parrotSoundsEnabled, parrotSoundsVolume } = useGameStore();
  const playSound = useSoundEffect([parrotSound1, parrotSound2], parrotSoundsVolume);
  
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

  // Определяем, танцует ли попугай (музыка включена И громкость больше минимального порога)
  const isParrotDancing = parrotSoundsEnabled && parrotSoundsVolume > 0.05;

  // Choose image based on music state and volume
  const currentImage = isParrotDancing ? dancingParrotImage : parrotImage;

  return (
    <div className="pirate-parrot-container">
      <motion.div
        className="pirate-parrot"
        style={{
          pointerEvents: 'auto',
          zIndex: 8,
        }}
      >
        <motion.div 
          className="parrot-image-container"
          style={{
            width: `${parrotSize}px`,
            height: `${parrotSize}px`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            position: 'relative',
            cursor: 'pointer'
          }}
          onClick={() => parrotSoundsEnabled && playSound()}
          initial={{ scale: 0 }}
          animate={{ 
            // Different animations based on music status and volume
            ...(isParrotDancing
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
            duration: isParrotDancing ? animationDuration * 0.8 : animationDuration,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        >
          <motion.img
            src={currentImage}
            alt="Pirate Parrot"
            className="pirate-parrot-image"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: isParrotDancing 
                ? 'drop-shadow(0 0 5px rgba(255, 0, 0, 0.7))'
                : 'drop-shadow(0 0 5px rgba(0, 255, 255, 0.5))'
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};