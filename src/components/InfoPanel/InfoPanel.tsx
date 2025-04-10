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
import foxImage from '../../assets/sleeping_fox.webp';
import enchantedNetheriteShovelImage from '../../assets/enchanted_netherite_shovel.webp';
import enchantedDiamondShovelImage from '../../assets/enchanted_diamond_shovel.webp';
import enchantedGoldenShovelImage from '../../assets/enchanted_golden_shovel.webp';
import enchantedIronShovelImage from '../../assets/enchanted_iron_shovel.webp';
import enchantedStoneShovelImage from '../../assets/enchanted_stone_shovel.webp';

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
    musicEnabled,
    musicVolume,
    foxCount
  } = useGameStore();
  
  // Функция для получения информации о текущей лопате
  const getCurrentShovelInfo = () => {
    let currentShovel = {
      name: 'Wooden Shovel',
      description: 'Wood shovels that automatically dig dirt for you. Each shovel generates one dirt per second, with a 15% increase in production for each level.',
      count: autoClickerCount
    };

    if (autoClickerCount >= 1000) {
      currentShovel = {
        name: 'Netherite Shovel',
        description: 'The ultimate shovel forged from ancient debris. Each shovel generates one dirt per second, with a 15% increase in production for each level.',
        count: autoClickerCount
      };
    } else if (autoClickerCount >= 500) {
      currentShovel = {
        name: 'Diamond Shovel',
        description: 'A premium diamond-tipped shovel for efficient digging. Each shovel generates one dirt per second, with a 15% increase in production for each level.',
        count: autoClickerCount
      };
    } else if (autoClickerCount >= 300) {
      currentShovel = {
        name: 'Golden Shovel',
        description: 'A golden shovel that brings fortune while digging. Each shovel generates one dirt per second, with a 15% increase in production for each level.',
        count: autoClickerCount
      };
    } else if (autoClickerCount >= 200) {
      currentShovel = {
        name: 'Iron Shovel',
        description: 'A durable iron shovel for serious dirt collection. Each shovel generates one dirt per second, with a 15% increase in production for each level.',
        count: autoClickerCount
      };
    } else if (autoClickerCount >= 100) {
      currentShovel = {
        name: 'Stone Shovel',
        description: 'An upgraded stone shovel for better digging. Each shovel generates one dirt per second, with a 15% increase in production for each level.',
        count: autoClickerCount
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
      description = 'Increases the power of each click. Each level adds +1 to your base click power, and your total click power increases by 15% for each level. Base cost: 10 dirt, increasing by 15% with each level.';
      image = cursorImage; // Always show the regular cursor image regardless of click power
      const currentClickPower = clickPower * (1 + 0.15 * clickPower);
      stats = [
        { label: 'Current Level', value: formatNumber(clickPower) },
        { label: 'Base Click Power', value: formatNumber(clickPower) },
        { label: 'Actual Click Power', value: formatNumber(currentClickPower) },
        { 
          label: 'Next Level Bonus', 
          value: `+${formatNumber(1 + 0.15 * (clickPower + 1))} dirt per click` 
        }
      ];
      break;
      
    case 'autoClicker':
      const currentShovelInfo = getCurrentShovelInfo();
      title = currentShovelInfo.name;
      description = `${currentShovelInfo.description} Base cost: 50 dirt, increasing by 15% with each level.`;
      image = getShovelImage();
      const currentShovelPower = autoClickerCount * (1 + 0.15 * autoClickerCount);
      stats = [
        { label: 'Total Shovels', value: formatNumber(autoClickerCount) },
        { label: 'Current Type', value: currentShovelInfo.name },
        { 
          label: 'Base Production', 
          value: `${formatNumber(autoClickerCount)} dirt/s` 
        },
        { 
          label: 'Actual Production', 
          value: `${formatNumber(currentShovelPower)} dirt/s` 
        },
        { 
          label: 'Next Level Bonus', 
          value: `+${formatNumber(1 + 0.15 * (autoClickerCount + 1))} dirt per second` 
        }
      ];
      break;
      
    case 'multiAutoClick':
      // Определяем текущий уровень Enchanted Shovel
      let enchantedShovelTitle = 'Enchanted Wood Shovel';
      let enchantedShovelDescription = 'Magical enchantments that make your wood shovels more efficient. Gives a ×1.15 multiplier to your shovels production.';
      let enchantedShovelMultiplier = '×1.15';
      let enchantedShovelImage = enchantedWoodShovelImage;
      
      if (multiAutoClickPower >= 2.1) {
        enchantedShovelTitle = 'Enchanted Netherite Shovel';
        enchantedShovelDescription = 'The most powerful enchanted shovel, forged from ancient debris. Gives a ×2.1 multiplier to your shovels production.';
        enchantedShovelMultiplier = '×2.1';
        enchantedShovelImage = enchantedNetheriteShovelImage;
      } else if (multiAutoClickPower >= 1.9) {
        enchantedShovelTitle = 'Enchanted Diamond Shovel';
        enchantedShovelDescription = 'A premium enchanted diamond shovel. Gives a ×1.9 multiplier to your shovels production.';
        enchantedShovelMultiplier = '×1.9';
        enchantedShovelImage = enchantedDiamondShovelImage;
      } else if (multiAutoClickPower >= 1.7) {
        enchantedShovelTitle = 'Enchanted Golden Shovel';
        enchantedShovelDescription = 'A magical golden shovel with powerful enchantments. Gives a ×1.7 multiplier to your shovels production.';
        enchantedShovelMultiplier = '×1.7';
        enchantedShovelImage = enchantedGoldenShovelImage;
      } else if (multiAutoClickPower >= 1.5) {
        enchantedShovelTitle = 'Enchanted Iron Shovel';
        enchantedShovelDescription = 'A durable enchanted iron shovel. Gives a ×1.5 multiplier to your shovels production.';
        enchantedShovelMultiplier = '×1.5';
        enchantedShovelImage = enchantedIronShovelImage;
      } else if (multiAutoClickPower >= 1.3) {
        enchantedShovelTitle = 'Enchanted Stone Shovel';
        enchantedShovelDescription = 'A stronger enchanted shovel. Gives a ×1.3 multiplier to your shovels production.';
        enchantedShovelMultiplier = '×1.3';
        enchantedShovelImage = enchantedStoneShovelImage;
      } else if (multiAutoClickPower >= 1.15) {
        enchantedShovelTitle = 'Enchanted Wood Shovel';
        enchantedShovelDescription = 'A magical enchanted wooden shovel. Gives a ×1.15 multiplier to your shovels production.';
        enchantedShovelMultiplier = '×1.15';
        enchantedShovelImage = enchantedWoodShovelImage;
      }
      
      title = enchantedShovelTitle;
      description = enchantedShovelDescription;
      image = enchantedShovelImage;
      const isEnchantedPurchased = multiAutoClickPower > 1.0;
      const isMaxLevel = multiAutoClickPower >= 2.1;
      
      stats = [
        { 
          label: 'Status', 
          value: isEnchantedPurchased ? (isMaxLevel ? 'Maximum Level' : 'Purchased') : 'Not purchased' 
        },
        { 
          label: 'Multiplier', 
          value: isEnchantedPurchased ? enchantedShovelMultiplier : '×1.0 (not active)' 
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
      description = 'Friendly Endermen that teleport dirt to you from the End dimension. Each Enderman produces 5 dirt per second, with a 15% increase in production for each level. Base cost: 1000 dirt, increasing by 15% with each level.';
      image = endermanDefaultImage;
      const currentEndermanPower = friendlyEndermanCount * 5 * (1 + 0.15 * friendlyEndermanCount);
      stats = [
        { label: 'Endermen', value: formatNumber(friendlyEndermanCount) },
        { label: 'Base Production per Enderman', value: '5 dirt/s' },
        { 
          label: 'Actual Production per Enderman', 
          value: `${formatNumber(5 * (1 + 0.15 * friendlyEndermanCount))} dirt/s` 
        },
        { 
          label: 'Total Production', 
          value: `${formatNumber(currentEndermanPower)} dirt/s` 
        },
        { 
          label: 'Next Level Bonus', 
          value: `+${formatNumber(5 * (1 + 0.15 * (friendlyEndermanCount + 1)))} dirt per second` 
        }
      ];
      break;

    case 'allay':
      title = 'Allay';
      description = 'These helpful flying creatures boost your passive dirt generation. Each Allay increases all passive dirt generation by 20%. Base cost: 5000 dirt, increasing by 15% with each level.';
      image = allayImage;
      stats = [
        { label: 'Allays', value: formatNumber(allayCount) },
        { label: 'Boost per Allay', value: '20%' },
        { 
          label: 'Total Multiplier', 
          value: `${formatNumber((1 + allayCount * 0.2))}x` 
        },
        { 
          label: 'Next Level Bonus', 
          value: '+0.2x to all passive generation' 
        }
      ];
      break;

    case 'luckyCat':
      title = 'Lucky Cat';
      description = 'This cute feline brings good luck to you! Each cat adds a 10% chance for your clicks to produce x10 more dirt. The chance stacks with each Lucky Cat you own, up to a maximum of 10 cats. Base cost: 10,000 dirt, increasing by 15% with each level.';
      image = luckyCatImage;
      stats = [
        { label: 'Cats Owned', value: `${formatNumber(luckyCatCount)} / 10` },
        { 
          label: 'Luck Chance', 
          value: `${formatNumber(luckyCatCount * 10)}%` 
        },
        { 
          label: 'Luck Bonus', 
          value: `x10 dirt per click when activated` 
        },
        { 
          label: 'Next Level Bonus', 
          value: luckyCatCount >= 10 ? 'Maximum level reached!' : '+10% chance for lucky clicks' 
        }
      ];
      break;

    case 'pirateParrot':
      title = 'Pirate Parrot';
      description = 'This colorful avian companion has a knack for finding buried treasures! Each Pirate Parrot adds 10 dirt per second to your collection, with a 15% increase in production for each level. Base cost: 20,000 dirt, increasing by 15% with each level. The parrot dances when music is playing and volume is above minimum, showing its excitement for treasure hunting!';
      image = parrotImage;
      // Определяем, танцует ли попугай (музыка включена И громкость больше минимального порога)
      const isParrotDancing = musicEnabled && musicVolume > 0.05;
      const currentParrotPower = pirateParrotCount * 10 * (1 + 0.15 * pirateParrotCount);
      stats = [
        { label: 'Parrots Owned', value: formatNumber(pirateParrotCount) },
        { 
          label: 'Base Production per Parrot', 
          value: '10 dirt/s' 
        },
        { 
          label: 'Actual Production per Parrot', 
          value: `${formatNumber(10 * (1 + 0.15 * pirateParrotCount))} dirt/s` 
        },
        { 
          label: 'Total Production', 
          value: `${formatNumber(currentParrotPower)} dirt/s` 
        },
        { 
          label: 'With Allay Bonus', 
          value: `${formatNumber(currentParrotPower * (1 + allayCount * 0.2))} dirt/s` 
        },
        { 
          label: 'Next Level Bonus', 
          value: `+${formatNumber(10 * (1 + 0.15 * (pirateParrotCount + 1)))} dirt per second` 
        }
      ];
      break;

    case 'fox':
      title = 'Fox';
      description = 'A clever fox that helps you collect dirt. Each fox adds +20 dirt per second to your collection.';
      image = foxImage;
      const currentFoxPower = foxCount * 20;
      stats = [
        { label: 'Foxes Owned', value: formatNumber(foxCount) },
        { label: 'Base Production', value: `${formatNumber(20)} dirt/s per fox` },
        { label: 'Total Production', value: `${formatNumber(currentFoxPower)} dirt/s` },
        { label: 'Next Fox Bonus', value: `+${formatNumber(20)} dirt per second` }
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