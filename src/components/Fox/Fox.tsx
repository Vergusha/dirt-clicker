import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { useSoundEffect } from '../SoundEffects/useSoundEffect';
import foxImage from '../../assets/sleeping_fox.webp';
import foxSound1 from '../../audio/Fox_idle1.ogg';
import foxSound2 from '../../audio/Fox_idle2.ogg';
import foxSound3 from '../../audio/Fox_idle3.ogg';

export const Fox: React.FC = () => {
  const { foxCount, foxSoundsEnabled, foxSoundsVolume, soundEffectsEnabled } = useGameStore();
  const playSound = useSoundEffect([foxSound1, foxSound2, foxSound3], foxSoundsVolume);

  if (foxCount <= 0) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (soundEffectsEnabled && foxSoundsEnabled) {
      playSound();
    }
  };

  return (
    <div className="fox-container" onClick={handleClick}>
      <motion.div
        className="fox"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          src={foxImage}
          alt="Fox"
          className="fox-image"
          animate={{
            y: [0, -3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          style={{ willChange: 'transform' }}
        />
      </motion.div>
    </div>
  );
}; 