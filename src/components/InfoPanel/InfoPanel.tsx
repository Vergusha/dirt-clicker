import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { UpgradeType } from '../../types';
import { formatNumber } from '../../utils/formatNumber';
import buttonImage from '../../assets/button.png';
import cursorImage from '../../assets/cursor.webp';
import enchantedCursorImage from '../../assets/enchanted_cursor.png';
import woodShovelImage from '../../assets/wood_shovel.webp';
import enchantedWoodShovelImage from '../../assets/enchanted_wooden_shovel.webp';
import enderPearlImage from '../../assets/Ender_Pearl.webp';

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
    autoClickerCount,
    multiAutoClickPower,
    friendlyEndermanCount
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
  
  // Define content based on upgrade type
  let title = '';
  let description = '';
  let image = '';
  let stats: Array<{ label: string, value: string }> = [];
  
  switch (type) {
    case 'clickPower':
      title = 'Stronger Click';
      description = 'Increases the power of each click, allowing you to collect more dirt with each tap.';
      image = clickPower >= 10 ? enchantedCursorImage : cursorImage;
      stats = [
        { label: 'Current Level', value: formatNumber(clickPower) },
        { label: 'Dirt Per Click', value: formatNumber(clickPower) },
        { 
          label: 'Total Click Power', 
          value: formatNumber(clickPower) 
        }
      ];
      break;
      
    case 'autoClicker':
      title = 'Wood Shovel';
      description = 'Wood shovels that automatically dig dirt for you. Each shovel generates one dirt per second.';
      image = woodShovelImage;
      stats = [
        { label: 'Wood Shovels', value: formatNumber(autoClickerCount) },
        { label: 'Base Production', value: `${formatNumber(autoClickerCount)} dirt/s` },
        { 
          label: 'Total Production', 
          value: `${formatNumber(autoClickerCount * multiAutoClickPower)} dirt/s` 
        }
      ];
      break;
      
    case 'multiAutoClick':
      title = 'Enchanted Wood Shovel';
      description = 'Magical enchantments that make your wood shovels more efficient, multiplying their dirt production rate.';
      image = enchantedWoodShovelImage;
      stats = [
        { 
          label: 'Current Multiplier', 
          value: `${multiAutoClickPower.toFixed(1)}x` 
        },
        { 
          label: 'Base Production', 
          value: `${formatNumber(autoClickerCount)} dirt/s` 
        },
        { 
          label: 'Enhanced Production', 
          value: `${formatNumber(autoClickerCount * multiAutoClickPower)} dirt/s` 
        }
      ];
      break;
      
    case 'friendlyEnderman':
      title = 'Friendly Enderman';
      description = 'Friendly Endermen that teleport dirt to you from the End dimension. Each Enderman produces 5 dirt per second.';
      image = enderPearlImage;
      stats = [
        { label: 'Endermen', value: formatNumber(friendlyEndermanCount) },
        { label: 'Production per Enderman', value: '5 dirt/s' },
        { 
          label: 'Total Production', 
          value: `${formatNumber(friendlyEndermanCount * 5)} dirt/s` 
        }
      ];
      break;
  }
  
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
        <div className="info-panel-header">
          <h3>{title}</h3>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="info-content">
          <div className="info-image-container">
            <img src={image} alt={title} className="info-image" />
          </div>
          <div className="info-description">
            {description}
          </div>
          <div className="info-stats">
            <h3>Statistics</h3>
            {stats.map((stat, index) => (
              <div key={`stat-${index}`} className="stat-row">
                <span className="stat-label">{stat.label}:</span>
                <span className="stat-value">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="info-panel-footer">
          <button className="close-button-large" onClick={onClose}>
            <img src={buttonImage} alt="Button" className="button-image" />
            <span className="button-text">Close</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};