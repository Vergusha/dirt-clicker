import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatNumber } from '../../utils/formatNumber';

interface OfflineProgressProps {
  earnedDirt: number;
  timeAwayInSeconds: number;
  onClose: () => void;
}

export const OfflineProgress: React.FC<OfflineProgressProps> = ({
  earnedDirt,
  timeAwayInSeconds,
  onClose
}) => {
  // Форматируем время отсутствия
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} секунд`;
    if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} ${minutes === 1 ? 'минуту' : 'минут'}`;
    }
    const hours = Math.floor(seconds / 3600);
    return `${hours} ${hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        className="offline-progress-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="offline-progress-panel"
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
        >
          <h2>С возвращением!</h2>
          <p>Вас не было {formatTime(timeAwayInSeconds)}</p>
          <p className="earned-dirt">
            Ваши лопаты накопали:
            <span className="dirt-amount">{formatNumber(earnedDirt)}</span>
            земли
          </p>
          <button className="collect-button" onClick={onClose}>
            Забрать
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}; 