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
    clickPower,
    autoClickerCount,
    multiClickPower,
    multiAutoClickPower,
    clickPowerCost,
    autoClickerCost,
    multiClickCost,
    multiAutoClickCost
  } = useGameStore();
  
  // Получаем актуальную стоимость для отображения с учетом текущего прогресса
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