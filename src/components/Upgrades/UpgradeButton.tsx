import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { UpgradeType, PurchaseQuantity } from '../../types';
import { formatNumber } from '../../utils/formatNumber';
import slotImage from '../../assets/slot.webp';
import woodenShovelNormalImage from '../../assets/wooden_shovel_normal.webp';
import enchantedWoodShovelImage from '../../assets/enchanted_wooden_shovel.webp';
import cursorImage from '../../assets/cursor.webp';
import enderPearlImage from '../../assets/Ender_Pearl.webp';

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
    clickPower,
    autoClickerCount,
    multiAutoClickPower,
    friendlyEndermanCount,
    calculateTotalPrice // Добавляем импорт функции calculateTotalPrice из gameStore
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