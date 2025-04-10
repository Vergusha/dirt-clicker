import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import foxImage from '../../assets/sleeping_fox.webp';

export const Fox: React.FC = () => {
  const { foxCount } = useGameStore();

  if (foxCount <= 0) return null;

  return (
    <div className="fox-container">
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
            repeatType: "reverse"
          }}
        />
      </motion.div>
    </div>
  );
}; 