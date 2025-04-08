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
  // Get counts from game store to check if player has Wood Shovels and Enchanted Wood Shovels
  const { autoClickerCount, multiAutoClickPower, friendlyEndermanCount, allayCount, luckyCatCount } = useGameStore();
  
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

  // Check if player can see the Friendly Enderman upgrade
  // Player needs both Wood Shovel and Enchanted Wood Shovel
  const canSeeEndermanUpgrade = autoClickerCount > 0 && multiAutoClickPower > 1.0;
  
  // Check if player can see the Allay upgrade
  // Player needs to have at least one Friendly Enderman
  const canSeeAllayUpgrade = friendlyEndermanCount > 0;
  
  // Check if player can see the Lucky Cat upgrade
  // Player needs to have at least one Allay
  const canSeeLuckyCatUpgrade = allayCount > 0;

  // Check if player can see the Pirate Parrot upgrade
  // Player needs to have at least one Lucky Cat
  const canSeePirateParrotUpgrade = luckyCatCount > 0;
  
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

        {/* Only show Friendly Enderman if player has both Wood Shovel and Enchanted Wood Shovel */}
        {canSeeEndermanUpgrade && (
          <UpgradeButton 
            type="friendlyEnderman"
            title="Friendly Enderman"
            description="Teleports in dirt from the End dimension (5 dirt/s)"
            purchaseQuantity={purchaseQuantity}
            onInfoClick={handleInfoClick}
          />
        )}
        
        {/* Only show Allay if player has at least one Friendly Enderman */}
        {canSeeAllayUpgrade && (
          <UpgradeButton 
            type="allay"
            title="Allay"
            description="Multiplies all passive dirt income by 1.2x"
            purchaseQuantity={purchaseQuantity}
            onInfoClick={handleInfoClick}
          />
        )}
        
        {/* Only show Lucky Cat if player has at least one Allay */}
        {canSeeLuckyCatUpgrade && (
          <UpgradeButton 
            type="luckyCat"
            title="Lucky Cat"
            description="Increases luck and doubles random dirt drops"
            purchaseQuantity={purchaseQuantity}
            onInfoClick={handleInfoClick}
          />
        )}

        {/* Only show Pirate Parrot if player has at least one Lucky Cat */}
        {canSeePirateParrotUpgrade && (
          <UpgradeButton 
            type="pirateParrot"
            title="Pirate Parrot"
            description="Adds +30 dirt per second to your treasure"
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