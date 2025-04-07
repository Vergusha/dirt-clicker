import React from 'react';
import { useGameStore } from '../../store/gameStore';
import dirtImage from '../../assets/dirt.webp';

/**
 * Component displaying the game header with dirt count
 */
export const GameHeader: React.FC = () => {
  const { dirtCount } = useGameStore();
  
  // Форматируем число с разделителями тысяч
  const formattedCount = dirtCount.toLocaleString();
  
  return (
    <div className="game-header">
      <div className="dirt-counter">
        <img src={dirtImage} alt="Dirt" className="dirt-icon" />
        <span className="dirt-count">{formattedCount}</span>
      </div>
    </div>
  );
};