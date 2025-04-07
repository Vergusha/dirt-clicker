import React from 'react';
import { PurchaseQuantity } from '../../types';

interface PurchaseQuantitySelectorProps {
  purchaseQuantity: PurchaseQuantity;
  setPurchaseQuantity: (quantity: PurchaseQuantity) => void;
}

/**
 * Component for selecting purchase quantity for upgrades
 */
export const PurchaseQuantitySelector: React.FC<PurchaseQuantitySelectorProps> = ({
  purchaseQuantity,
  setPurchaseQuantity
}) => {
  // Available purchase quantities
  const quantities: PurchaseQuantity[] = [1, 10, 50, 100];
  
  return (
    <div className="purchase-quantity-selector">
      <span className="purchase-quantity-label">Purchase quantity:</span>
      <div className="quantity-buttons">
        {quantities.map(quantity => (
          <button
            key={quantity}
            className={`quantity-button ${purchaseQuantity === quantity ? 'active' : ''}`}
            onClick={() => setPurchaseQuantity(quantity)}
          >
            x{quantity}
          </button>
        ))}
      </div>
    </div>
  );
};