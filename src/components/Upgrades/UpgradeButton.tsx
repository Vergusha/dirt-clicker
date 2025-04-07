import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { UpgradeType, PurchaseQuantity } from '../../types';

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
    clickPowerCost,
    autoClickerCost,
    multiClickCost,
    multiAutoClickCost
  } = useGameStore();
  
  // Определяем стоимость улучшения в зависимости от типа
  const getCost = () => {
    switch (type) {
      case 'clickPower': 
        return clickPowerCost * purchaseQuantity;
      case 'autoClicker':
        return autoClickerCost * purchaseQuantity;
      case 'multiClick':
        return multiClickCost * purchaseQuantity;
      case 'multiAutoClick':
        return multiAutoClickCost * purchaseQuantity;
    }
  };
  
  // Получаем функцию для покупки улучшения в зависимости от типа
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
  
  const cost = getCost();
  const canAfford = dirtCount >= cost;
  
  return (
    <div className={`upgrade-button ${!canAfford ? 'disabled' : ''}`}>
      <div className="upgrade-header">
        <h3>{title}</h3>
        <button 
          className="info-button"
          onClick={() => onInfoClick(type)}
        >
          ?
        </button>
      </div>
      <p className="upgrade-description">{description}</p>
      <div className="upgrade-footer">
        <span className="cost">
          Cost: {cost.toLocaleString()}
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
  );
};