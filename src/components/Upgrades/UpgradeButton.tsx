import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { UpgradeType, PurchaseQuantity } from '../../types';
import { formatNumber } from '../../utils/formatNumber';
import slotImage from '../../assets/slot.webp';
import woodShovelNormalImage from '../../assets/wooden_shovel_normal.webp';
import enchantedWoodShovelImage from '../../assets/enchanted_wooden_shovel.webp';

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
    purchaseMultiClick,
    purchaseMultiAutoClick,
    clickPower,
    autoClickerCount,
    multiClickPower,
    multiAutoClickPower,
    clickPowerCost,
    autoClickerCost,
    multiClickCost,
    multiAutoClickCost
  } = useGameStore();

  // Get the cost of the upgrade based on its type
  const getCost = () => {
    switch (type) {
      case 'clickPower':
        const clickLevel = clickPower - 1;
        const clickBaseCost = 5;
        const clickGrowthRate = 0.08;
        return Math.floor(clickBaseCost * Math.pow(1 + clickGrowthRate, clickLevel) * purchaseQuantity);

      case 'autoClicker':
        const autoLevel = autoClickerCount;
        const autoBaseCost = 15;
        const autoGrowthRate = 0.10;
        return Math.floor(autoBaseCost * Math.pow(1 + autoGrowthRate, autoLevel) * purchaseQuantity);

      case 'multiClick':
        const multiClickLevel = Math.round((multiClickPower - 1) * 10);
        const multiClickBaseCost = 50;
        const multiClickGrowthRate = 0.15;
        return Math.floor(multiClickCost * purchaseQuantity);

      case 'multiAutoClick':
        const multiAutoLevel = Math.round((multiAutoClickPower - 1) * 10);
        const multiAutoBaseCost = 100;
        const multiAutoGrowthRate = 0.15;
        return Math.floor(multiAutoClickCost * purchaseQuantity);
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
      case 'multiClick':
        purchaseMultiClick(purchaseQuantity);
        break;
      case 'multiAutoClick':
        purchaseMultiAutoClick(purchaseQuantity);
        break;
    }
  };

  // Get the appropriate slot image based on upgrade type
  const getUpgradeImage = () => {
    switch (type) {
      case 'autoClicker':
        return woodShovelNormalImage; // Используем wood_shovel_normal.webp
      case 'multiAutoClick':
        return enchantedWoodShovelImage;
      default:
        return slotImage;
    }
  };

  const cost = getCost();
  const formattedCost = formatNumber(cost);
  const canAfford = dirtCount >= cost;
  const upgradeImage = getUpgradeImage();

  return (
    <div className={`upgrade-button ${!canAfford ? 'disabled' : ''}`}>
      <div className="upgrade-content-wrapper">
        <div className="upgrade-slot-wrapper">
          <img src={slotImage} alt="slot" className="slot-image" />
          <img src={upgradeImage} alt="upgrade" className="upgrade-icon" />
        </div>
        <div className="upgrade-info">
          <div className="upgrade-header">
            <h3>{title}</h3>
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