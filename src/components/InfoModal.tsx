import React, { useEffect, useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { UpgradeType } from '../types/UpgradeType';

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
    // Implement the logic to fetch upgrade information
  }, []);

  return (
    <div>
      {/* Render your component content here */}
    </div>
  );
};

export default InfoModal; 