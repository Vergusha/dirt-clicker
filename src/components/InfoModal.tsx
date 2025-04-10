import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { UpgradeType } from '../types';

const getDefaultTitle = (type: UpgradeType): string => {
  switch (type) {
    case 'clickPower':
      return 'Click Power';
    case 'autoClicker':
      return 'Auto Clicker';
    case 'multiAutoClick':
      return 'Multi Auto Click';
    case 'friendlyEnderman':
      return 'Friendly Enderman';
    case 'allay':
      return 'Allay';
    case 'luckyCat':
      return 'Lucky Cat';
    case 'pirateParrot':
      return 'Pirate Parrot';
    case 'fox':
      return 'Fox';
    default:
      return 'Unknown Upgrade';
  }
};

const getDefaultDescription = (type: UpgradeType): string => {
  switch (type) {
    case 'clickPower':
      return 'Increases the amount of dirt you get per click';
    case 'autoClicker':
      return 'Automatically clicks for you';
    case 'multiAutoClick':
      return 'Increases the power of auto clickers';
    case 'friendlyEnderman':
      return 'A friendly enderman that helps you dig';
    case 'allay':
      return 'An allay that helps you collect dirt';
    case 'luckyCat':
      return 'A lucky cat that brings you fortune';
    case 'pirateParrot':
      return 'A pirate parrot that helps you find treasure';
    case 'fox':
      return 'A fox that helps you dig faster';
    default:
      return 'Unknown upgrade effect';
  }
};

const InfoModal: React.FC = () => {
  const [upgradeInfo, setUpgradeInfo] = useState<{ title: string; description: string } | null>(null);

  const getUpgradeInfo = (type: UpgradeType) => {
    const state = useGameStore.getState();
    
    // Для лопаты определяем текущий тип на основе уровня
    if (type === 'autoClicker') {
      if (state.autoClickerCount >= 1000) {
        return {
          title: 'Netherite Shovel',
          description: 'The ultimate shovel forged from ancient debris.'
        };
      } else if (state.autoClickerCount >= 500) {
        return {
          title: 'Diamond Shovel',
          description: 'A premium diamond-tipped shovel for efficient digging.'
        };
      } else if (state.autoClickerCount >= 300) {
        return {
          title: 'Golden Shovel',
          description: 'A golden shovel that brings fortune while digging.'
        };
      } else if (state.autoClickerCount >= 200) {
        return {
          title: 'Iron Shovel',
          description: 'A durable iron shovel for serious dirt collection.'
        };
      } else if (state.autoClickerCount >= 100) {
        return {
          title: 'Stone Shovel',
          description: 'An upgraded stone shovel for better digging.'
        };
      }
      return {
        title: 'Wooden Shovel',
        description: 'Basic wooden shovel for digging.'
      };
    }
    
    // Для остальных улучшений возвращаем стандартную информацию
    return {
      title: getDefaultTitle(type),
      description: getDefaultDescription(type)
    };
  };

  useEffect(() => {
    const info = getUpgradeInfo('autoClicker');
    setUpgradeInfo(info);
  }, []);

  return (
    <div>
      {upgradeInfo && (
        <div>
          <h3>{upgradeInfo.title}</h3>
          <p>{upgradeInfo.description}</p>
        </div>
      )}
    </div>
  );
};

export default InfoModal; 