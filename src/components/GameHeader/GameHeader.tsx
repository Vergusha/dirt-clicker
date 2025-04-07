import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { formatNumber } from '../../utils/formatNumber';
import dirtImage from '../../assets/dirt.webp';

export const GameHeader: React.FC = () => {
  const { dirtCount, autoClickerCount, multiAutoClickPower } = useGameStore();
  
  const formattedCount = formatNumber(dirtCount);
  const perSecond = Math.floor(autoClickerCount * multiAutoClickPower);
  const formattedPerSecond = formatNumber(perSecond);
  
  return (
    <div className="game-header">
      <div className="dirt-counter">
        <img src={dirtImage} alt="Dirt" className="dirt-icon" />
        <span className="dirt-count">{formattedCount}</span>
        {autoClickerCount > 0 && (
          <span className="dirt-per-second">({formattedPerSecond}/s)</span>
        )}
      </div>
    </div>
  );
};