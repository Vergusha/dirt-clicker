import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { UpgradeType, PurchaseQuantity } from '../../types';
import { formatNumber } from '../../utils/formatNumber';
import slotImage from '../../assets/slot.webp';
import woodenShovelNormalImage from '../../assets/wooden_shovel_normal.webp';
import stoneShovelImage from '../../assets/stone_shovel.webp';
import ironShovelImage from '../../assets/iron_shovel.webp';
import goldenShovelImage from '../../assets/golden_shovel.webp';
import diamondShovelImage from '../../assets/diamond_shovel.webp';
import netheriteShovelImage from '../../assets/netherite_shovel.webp';
import enchantedWoodShovelImage from '../../assets/enchanted_wooden_shovel.webp';
import cursorImage from '../../assets/cursor.webp';
import enderPearlImage from '../../assets/invicon_enderman.webp';
import allayImage from '../../assets/invicon_allay.webp';
import catImage from '../../assets/invicon_cat.webp';
import parrotImage from '../../assets/invicon_parrot.webp'; // Добавляем изображение попугая

interface UpgradeButtonProps {
  type: UpgradeType;
  title: string;
  description: string;
  purchaseQuantity: PurchaseQuantity;
  onInfoClick: (type: UpgradeType) => void;
}

/**
 * Component representing a single upgrade button
 */
export const UpgradeButton: React.FC<UpgradeButtonProps> = ({
  type,
  title,
  description,
  purchaseQuantity,
  onInfoClick
}) => {
  const {
    purchaseClickPower,
    purchaseAutoClicker,
    purchaseMultiAutoClick,
    purchaseFriendlyEnderman,
    purchaseAllay,
    purchaseLuckyCat,
    purchasePirateParrot, // Добавляем метод для покупки попугая
    clickPower,
    autoClickerCount,
    multiAutoClickPower,
    friendlyEndermanCount,
    allayCount,
    luckyCatCount,
    pirateParrotCount, // Добавляем счетчик для попугая
    calculateTotalPrice,
    canAfford,
    recalculateShovelCosts
  } = useGameStore();

  // Добавляем useEffect для пересчета цен при монтировании
  useEffect(() => {
    recalculateShovelCosts();
  }, [recalculateShovelCosts]);

  // Функция для получения информации об улучшении лопаты
  const getShovelUpgradeInfo = (count: number) => {
    if (count === 99) return { level: 100, name: 'Stone Shovel' };
    if (count === 199) return { level: 200, name: 'Iron Shovel' };
    if (count === 299) return { level: 300, name: 'Golden Shovel' };
    if (count === 499) return { level: 500, name: 'Diamond Shovel' };
    if (count === 999) return { level: 1000, name: 'Netherite Shovel' };
    return null;
  };

  // Get the cost of the upgrade based on its type
  const getCost = () => {
    switch (type) {
      case 'clickPower':
        return calculateTotalPrice(5, purchaseQuantity, 0.15);
      case 'autoClicker':
        // Рассчитываем стоимость с учетом текущего уровня
        let baseCost = 15;
        return calculateTotalPrice(baseCost, purchaseQuantity, 0.15);
      case 'multiAutoClick':
        // Расчет для Enchanted Wood Shovel с учетом прогрессии
        return calculateTotalPrice(100, purchaseQuantity, 0.15);
        
      case 'friendlyEnderman':
        // Расчет для Friendly Enderman с учетом прогрессии
        return calculateTotalPrice(500, purchaseQuantity, 0.15);
        
      case 'allay':
        // Расчет для Allay с учетом прогрессии
        return calculateTotalPrice(1000, purchaseQuantity, 0.15);
        
      case 'luckyCat':
        // Расчет для Lucky Cat с учетом прогрессии 
        return calculateTotalPrice(2000, purchaseQuantity, 0.15);
        
      case 'pirateParrot':
        // Расчет для Pirate Parrot с учетом прогрессии
        return calculateTotalPrice(3500, purchaseQuantity, 0.15);
        
      default:
        return 0;
    }
  };

  // Get the level or count of the upgrade
  const getUpgradeCount = () => {
    switch (type) {
      case 'clickPower':
        return clickPower - 1; // -1 потому что начальное значение 1
      case 'autoClicker':
        return autoClickerCount;
      case 'multiAutoClick':
        return Math.round((multiAutoClickPower - 1) * 10); // Преобразуем множитель в уровни
      case 'friendlyEnderman':
        return friendlyEndermanCount;
      case 'allay':
        return allayCount;
      case 'luckyCat':
        return luckyCatCount;
      case 'pirateParrot':
        return pirateParrotCount;
      default:
        return 0;
    }
  };

  // Handle purchasing the upgrade
  const buyUpgrade = () => {
    switch (type) {
      case 'clickPower':
        purchaseClickPower(purchaseQuantity);
        break;
      case 'autoClicker':
        purchaseAutoClicker(purchaseQuantity);
        break;
      case 'multiAutoClick':
        purchaseMultiAutoClick(purchaseQuantity);
        break;
      case 'friendlyEnderman':
        purchaseFriendlyEnderman(purchaseQuantity);
        break;
      case 'allay':
        purchaseAllay(purchaseQuantity);
        break;
      case 'luckyCat':
        purchaseLuckyCat(purchaseQuantity);
        break;
      case 'pirateParrot':
        purchasePirateParrot(purchaseQuantity);
        break;
    }
  };

  // Get the appropriate slot image and determine if it needs the cursor class
  const getUpgradeImage = () => {
    switch (type) {
      case 'clickPower':
        return cursorImage;
      case 'autoClicker':
        if (autoClickerCount >= 1000) return netheriteShovelImage;
        if (autoClickerCount >= 500) return diamondShovelImage;
        if (autoClickerCount >= 300) return goldenShovelImage;
        if (autoClickerCount >= 200) return ironShovelImage;
        if (autoClickerCount >= 100) return stoneShovelImage;
        return woodenShovelNormalImage;
      case 'multiAutoClick':
        return enchantedWoodShovelImage;
      case 'friendlyEnderman':
        return enderPearlImage;
      case 'allay':
        return allayImage;
      case 'luckyCat':
        return catImage;
      case 'pirateParrot':
        return parrotImage;
      default:
        return slotImage;
    }
  };

  // Check if the current upgrade type is a cursor type that needs rotation
  const isCursorType = type === 'clickPower';
  const upgradeCount = getUpgradeCount();

  const cost = getCost();
  const formattedCost = formatNumber(cost);
  const upgradeImage = getUpgradeImage();

  // Определяем, показывать ли кнопку Upgrade вместо Buy
  const showUpgradeButton = type === 'autoClicker' && getShovelUpgradeInfo(autoClickerCount) !== null;

  const getShovelTitle = () => {
    if (type !== 'autoClicker') return title;
    
    // Определяем текущий тип лопаты
    if (autoClickerCount >= 1000) return 'Netherite Shovel';
    if (autoClickerCount >= 500) return 'Diamond Shovel';
    if (autoClickerCount >= 300) return 'Golden Shovel';
    if (autoClickerCount >= 200) return 'Iron Shovel';
    if (autoClickerCount >= 100) return 'Stone Shovel';
    return 'Wooden Shovel';
  };

  const getShovelDescription = () => {
    if (type !== 'autoClicker') return description;
    
    // Определяем следующий тип лопаты
    if (autoClickerCount >= 1000) {
      return 'Maximum level reached!';
    } else if (autoClickerCount >= 500) {
      return 'Upgrade your shovel to Netherite Shovel!';
    } else if (autoClickerCount >= 300) {
      return 'Upgrade your shovel to Diamond Shovel!';
    } else if (autoClickerCount >= 200) {
      return 'Upgrade your shovel to Golden Shovel!';
    } else if (autoClickerCount >= 100) {
      return 'Upgrade your shovel to Iron Shovel!';
    } else if (autoClickerCount >= 0) {
      return 'Upgrade your shovel to Stone Shovel!';
    }
    return description;
  };

  const getCurrentShovelInfo = () => {
    if (type !== 'autoClicker') return { name: title, description };
    
    let currentShovel = {
      name: 'Wooden Shovel',
      description: 'Basic wooden shovel for digging.'
    };
    
    if (autoClickerCount >= 1000) {
      currentShovel = {
        name: 'Netherite Shovel',
        description: 'The ultimate shovel forged from ancient debris.'
      };
    } else if (autoClickerCount >= 500) {
      currentShovel = {
        name: 'Diamond Shovel',
        description: 'A premium diamond-tipped shovel for efficient digging.'
      };
    } else if (autoClickerCount >= 300) {
      currentShovel = {
        name: 'Golden Shovel',
        description: 'A golden shovel that brings fortune while digging.'
      };
    } else if (autoClickerCount >= 200) {
      currentShovel = {
        name: 'Iron Shovel',
        description: 'A durable iron shovel for serious dirt collection.'
      };
    } else if (autoClickerCount >= 100) {
      currentShovel = {
        name: 'Stone Shovel',
        description: 'An upgraded stone shovel for better digging.'
      };
    }
    
    return currentShovel;
  };

  return (
    <div className={`upgrade-button ${!canAfford ? 'disabled' : ''}`}>
      <div className="upgrade-content-wrapper">
        <div className="upgrade-slot-wrapper">
          <img src={slotImage} alt="slot" className="slot-image" />
          <img 
            src={upgradeImage} 
            alt="upgrade" 
            className={`upgrade-icon ${isCursorType ? 'cursor-icon' : ''}`} 
          />
        </div>
        <div className="upgrade-info">
          <div className="upgrade-header">
            <h3>
              {getShovelTitle()}
              {upgradeCount > 0 && (
                <span className="upgrade-count-header"> ({formatNumber(upgradeCount)})</span>
              )}
            </h3>
            <button 
              className="info-button"
              onClick={() => onInfoClick(type)}
              title={getCurrentShovelInfo().name}
              aria-label={`Show information about ${getCurrentShovelInfo().name}`}
            >
              i
            </button>
          </div>
          <p className="upgrade-description">{getShovelDescription()}</p>
          <div className="upgrade-footer">
            <span className="cost">
              Cost: {formattedCost}
            </span>
            <button 
              onClick={buyUpgrade}
              disabled={!canAfford}
              className={`buy-button ${!canAfford ? 'disabled' : ''}`}
            >
              {showUpgradeButton ? 'Upgrade' : `Buy${purchaseQuantity > 1 ? ` x${purchaseQuantity}` : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};