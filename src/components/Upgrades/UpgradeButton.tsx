import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { UpgradeType, PurchaseQuantity } from '../../types';
import { formatNumber } from '../../utils/formatNumber';
import slotImage from '../../assets/slot.webp';
import woodenShovelNormalImage from '../../assets/wooden_shovel_normal.webp';
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
    dirtCount,
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
    calculateTotalPrice
  } = useGameStore();

  // Get the cost of the upgrade based on its type
  const getCost = () => {
    switch (type) {
      case 'clickPower':
        // Расчет для Click Power с учетом прогрессии
        return calculateTotalPrice(5, purchaseQuantity, 0.08);

      case 'autoClicker':
        // Расчет для Wood Shovel с учетом прогрессии
        return calculateTotalPrice(15, purchaseQuantity, 0.10);

      case 'multiAutoClick':
        // Расчет для Enchanted Wood Shovel с учетом прогрессии
        return calculateTotalPrice(100, purchaseQuantity, 0.15);
        
      case 'friendlyEnderman':
        // Расчет для Friendly Enderman с учетом прогрессии
        return calculateTotalPrice(500, purchaseQuantity, 0.15);
        
      case 'allay':
        // Расчет для Allay с учетом прогрессии
        return calculateTotalPrice(1000, purchaseQuantity, 0.20);
        
      case 'luckyCat':
        // Расчет для Lucky Cat с учетом прогрессии 
        return calculateTotalPrice(2000, purchaseQuantity, 0.25);
        
      case 'pirateParrot':
        // Расчет для Pirate Parrot с учетом прогрессии
        return calculateTotalPrice(3500, purchaseQuantity, 0.30);
        
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
  const canAfford = dirtCount >= cost;
  const upgradeImage = getUpgradeImage();

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
              {title}
              {upgradeCount > 0 && (
                <span className="upgrade-count-header"> ({formatNumber(upgradeCount)})</span>
              )}
            </h3>
            <button 
              className="info-button"
              onClick={() => onInfoClick(type)}
            >
              i
            </button>
          </div>
          <p className="upgrade-description">{description}</p>
          <div className="upgrade-footer">
            <span className="cost">
              Cost: {formattedCost}
            </span>
            <button 
              onClick={buyUpgrade}
              disabled={!canAfford}
              className={`buy-button ${!canAfford ? 'disabled' : ''}`}
            >
              Buy{purchaseQuantity > 1 ? ` x${purchaseQuantity}` : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};