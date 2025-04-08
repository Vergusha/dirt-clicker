import { useState } from 'react';
import { PurchaseQuantity, UpgradeType } from '../../types';
import { UpgradeButton } from './UpgradeButton';
import { PurchaseQuantitySelector } from './PurchaseQuantitySelector';
import { InfoPanel } from '../InfoPanel';
import { useGameStore } from '../../store/gameStore';

/**
 * Component that combines all upgrade-related functionality
 */
export const UpgradesPanel: React.FC = () => {
  // Get autoClickerCount from game store to check if player has Wood Shovels
  const { autoClickerCount } = useGameStore();
  
  // State for purchase quantity selector
  const [purchaseQuantity, setPurchaseQuantity] = useState<PurchaseQuantity>(1);
  
  // State for info panel
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [infoType, setInfoType] = useState<UpgradeType>('clickPower');
  
  // Handle showing info panel
  const handleInfoClick = (type: UpgradeType) => {
    setInfoType(type);
    setShowInfoPanel(true);
  };
  
  // Handle closing info panel
  const handleCloseInfoPanel = () => {
    setShowInfoPanel(false);
  };
  
  return (
    <div className="upgrades-panel">
      <h2>Upgrades</h2>
      
      <PurchaseQuantitySelector
        purchaseQuantity={purchaseQuantity}
        setPurchaseQuantity={setPurchaseQuantity}
      />
      
      <div className="upgrades-grid">
        <UpgradeButton 
          type="clickPower"
          title="Click Power"
          description="Increases the power of each click by 1"
          purchaseQuantity={purchaseQuantity}
          onInfoClick={handleInfoClick}
        />
        
        <UpgradeButton 
          type="autoClicker"
          title="Wood Shovel"
          description="Automatically mines dirt once per second"
          purchaseQuantity={purchaseQuantity}
          onInfoClick={handleInfoClick}
        />
        
        <UpgradeButton 
          type="multiClick"
          title="Multi-Click"
          description="Multiplies the power of each click (+0.1x)"
          purchaseQuantity={purchaseQuantity}
          onInfoClick={handleInfoClick}
        />
        
        {/* Only show Enchanted Wood Shovel if player has at least one Wood Shovel */}
        {autoClickerCount > 0 && (
          <UpgradeButton 
            type="multiAutoClick"
            title="Enchanted Wood Shovel"
            description="Multiplies auto-clicker efficiency (+0.1x)"
            purchaseQuantity={purchaseQuantity}
            onInfoClick={handleInfoClick}
          />
        )}
      </div>
      
      {showInfoPanel && (
        <div className="info-overlay" onClick={handleCloseInfoPanel}>
          <div onClick={(e) => e.stopPropagation()}>
            <InfoPanel 
              type={infoType} 
              onClose={handleCloseInfoPanel} 
            />
          </div>
        </div>
      )}
    </div>
  );
};