import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { UpgradeType } from '../../types';

interface InfoPanelProps {
  type: UpgradeType;
  onClose: () => void;
}

/**
 * Component for displaying detailed information about upgrades
 */
export const InfoPanel: React.FC<InfoPanelProps> = ({ type, onClose }) => {
  const { 
    clickPower,
    multiClickPower,
    autoClickerCount,
    multiAutoClickPower,
    clickPowerCost,
    autoClickerCost,
    multiClickCost,
    multiAutoClickCost
  } = useGameStore();
  
  // Блокировка прокрутки страницы при открытии инфопанели
  useEffect(() => {
    // Сохраняем текущую позицию прокрутки
    const scrollY = window.scrollY;
    
    // Блокируем прокрутку и устанавливаем стили для body
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    
    // При закрытии панели возвращаем прокрутку в исходное состояние
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, []);
  
  // Контент в зависимости от типа улучшения
  const renderContent = () => {
    switch(type) {
      case 'clickPower':
        return (
          <>
            <h3>Click Power</h3>
            <p>Increases the power of each click by 1.</p>
            <p>Current level: {clickPower}</p>
            <p>Current effect: +{clickPower} dirt per click</p>
            <p>Cost: {clickPowerCost} dirt</p>
            <p>Each level increases the base cost by 15%</p>
          </>
        );
      case 'autoClicker':
        return (
          <>
            <h3>Auto Clicker</h3>
            <p>Automatically mines dirt once per second.</p>
            <p>Current count: {autoClickerCount}</p>
            <p>Current effect: +{Math.floor(autoClickerCount * multiAutoClickPower)} dirt per second</p>
            <p>Cost: {autoClickerCost} dirt</p>
            <p>Each auto-clicker increases the base cost by 15%</p>
          </>
        );
      case 'multiClick':
        return (
          <>
            <h3>Multi-Click</h3>
            <p>Multiplies the power of each click.</p>
            <p>Current multiplier: {multiClickPower.toFixed(1)}x</p>
            <p>Current effect: Your clicks are {multiClickPower.toFixed(1)}x more effective</p>
            <p>Cost: {multiClickCost} dirt</p>
            <p>Each level adds +0.1x to the multiplier and increases the base cost by 30%</p>
          </>
        );
      case 'multiAutoClick':
        return (
          <>
            <h3>Multi-AutoClick</h3>
            <p>Multiplies the power of auto-clickers.</p>
            <p>Current multiplier: {multiAutoClickPower.toFixed(1)}x</p>
            <p>Current effect: Your auto-clickers are {multiAutoClickPower.toFixed(1)}x more effective</p>
            <p>Cost: {multiAutoClickCost} dirt</p>
            <p>Each level adds +0.1x to the multiplier and increases the base cost by 30%</p>
          </>
        );
    }
  };
  
  return (
    <motion.div 
      className="info-panel-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="info-panel"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="info-content">
          {renderContent()}
        </div>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </motion.div>
    </motion.div>
  );
};