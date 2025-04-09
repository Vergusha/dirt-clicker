import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { UpgradeType } from '../../types';
import { formatNumber } from '../../utils/formatNumber';
import buttonImage from '../../assets/button.png';
import cursorImage from '../../assets/cursor.webp';
import woodShovelImage from '../../assets/wood_shovel.webp';
import stoneShovelImage from '../../assets/stone_shovel.webp';
import ironShovelImage from '../../assets/iron_shovel.webp';
import goldenShovelImage from '../../assets/golden_shovel.webp';
import diamondShovelImage from '../../assets/diamond_shovel.webp';
import netheriteShovelImage from '../../assets/netherite_shovel.webp';
import enchantedWoodShovelImage from '../../assets/enchanted_wooden_shovel.webp';
import endermanDefaultImage from '../../assets/enderman_default.webp';
import allayImage from '../../assets/allay.webp';
import luckyCatImage from '../../assets/cat.webp';
import parrotImage from '../../assets/parrot.webp';

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
    friendlyEndermanCount,
    allayCount,
    luckyCatCount,
    pirateParrotCount,
    musicEnabled
  } = useGameStore();
  
  // Функция для получения информации о текущей лопате
  const getCurrentShovelInfo = () => {
    let currentShovel = {
      name: 'Wooden Shovel',
      description: 'Wood shovels that automatically dig dirt for you. Each shovel generates one dirt per second.'
    };

    if (autoClickerCount >= 1000) {
      currentShovel = {
        name: 'Netherite Shovel',
        description: 'The ultimate shovel forged from ancient debris. Each shovel generates one dirt per second.'
      };
    } else if (autoClickerCount >= 500) {
      currentShovel = {
        name: 'Diamond Shovel',
        description: 'A premium diamond-tipped shovel for efficient digging. Each shovel generates one dirt per second.'
      };
    } else if (autoClickerCount >= 300) {
      currentShovel = {
        name: 'Golden Shovel',
        description: 'A golden shovel that brings fortune while digging. Each shovel generates one dirt per second.'
      };
    } else if (autoClickerCount >= 200) {
      currentShovel = {
        name: 'Iron Shovel',
        description: 'A durable iron shovel for serious dirt collection. Each shovel generates one dirt per second.'
      };
    } else if (autoClickerCount >= 100) {
      currentShovel = {
        name: 'Stone Shovel',
        description: 'An upgraded stone shovel for better digging. Each shovel generates one dirt per second.'
      };
    }

    return currentShovel;
  };

  // Функция для получения изображения текущей лопаты
  const getShovelImage = () => {
    if (autoClickerCount >= 1000) return netheriteShovelImage;
    if (autoClickerCount >= 500) return diamondShovelImage;
    if (autoClickerCount >= 300) return goldenShovelImage;
    if (autoClickerCount >= 200) return ironShovelImage;
    if (autoClickerCount >= 100) return stoneShovelImage;
    return woodShovelImage;
  };
  
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
      image = cursorImage; // Always show the regular cursor image regardless of click power
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
      const currentShovelInfo = getCurrentShovelInfo();
      title = currentShovelInfo.name;
      description = currentShovelInfo.description;
      image = getShovelImage();
      stats = [
        { label: `${currentShovelInfo.name}s`, value: formatNumber(autoClickerCount) },
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
      image = endermanDefaultImage;
      stats = [
        { label: 'Endermen', value: formatNumber(friendlyEndermanCount) },
        { label: 'Production per Enderman', value: '5 dirt/s' },
        { 
          label: 'Total Production', 
          value: `${formatNumber(friendlyEndermanCount * 5)} dirt/s` 
        }
      ];
      break;

    case 'allay':
      title = 'Allay';
      description = 'These helpful flying creatures boost your passive dirt generation. Each Allay increases all passive dirt generation by 20%.';
      image = allayImage;
      stats = [
        { label: 'Allays', value: formatNumber(allayCount) },
        { label: 'Boost per Allay', value: '20%' },
        { 
          label: 'Total Multiplier', 
          value: `${formatNumber((1 + allayCount * 0.2))}x` 
        }
      ];
      break;

    case 'luckyCat':
      title = 'Lucky Cat';
      description = 'This golden lucky cat brings fortune to your digging adventures! Each Lucky Cat increases the chance of getting double dirt from clicks by 5% and improves the chance of finding rare treasures while digging.';
      image = luckyCatImage;
      stats = [
        { label: 'Lucky Cats', value: formatNumber(luckyCatCount) },
        { label: 'Double Dirt Chance', value: `${formatNumber(luckyCatCount * 5)}%` },
        { 
          label: 'Treasure Find Chance', 
          value: `${formatNumber(luckyCatCount * 2)}%` 
        }
      ];
      break;

    case 'pirateParrot':
      title = 'Pirate Parrot';
      description = 'This colorful avian companion has a knack for finding buried treasures! Each Pirate Parrot adds 30 dirt per second to your collection. The parrot dances when music is playing, showing its excitement for treasure hunting!';
      image = parrotImage;
      stats = [
        { label: 'Parrots Owned', value: formatNumber(pirateParrotCount) },
        { 
          label: 'Base Production', 
          value: `${formatNumber(pirateParrotCount * 30)} dirt/s` 
        },
        { 
          label: 'With Allay Bonus', 
          value: `${formatNumber(pirateParrotCount * 30 * (1 + allayCount * 0.2))} dirt/s` 
        },
        {
          label: 'Current State',
          value: musicEnabled ? 'Dancing (Music On)' : 'Resting (Music Off)'
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
            <img 
              src={image} 
              alt={title} 
              className="info-image" 
              style={{ 
                maxWidth: '100%', 
                height: 'auto', 
                display: 'block'
              }} 
            />
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