import React from 'react';
import { PurchaseQuantity } from '../../types';
import buttonImage from '../../assets/button.png';

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
    <div className="quantity-selector">
      <div className="quantity-label">Purchase Quantity:</div>
      <div className="quantity-buttons">
        {quantities.map(quantity => (
          <button
            key={quantity}
            className={`quantity-btn ${purchaseQuantity === quantity ? 'active' : ''}`}
            onClick={() => setPurchaseQuantity(quantity)}
          >
            <img src={buttonImage} alt="Button" className="button-image" />
            <span className="quantity-btn-text">x{quantity}</span>
          </button>
        ))}
      </div>
    </div>
  );
};