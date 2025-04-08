import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { formatNumber } from '../../utils/formatNumber';

/**
 * Компонент для отображения настроек и статистики игры
 */
export const SettingsPanel: React.FC = () => {
  const { totalDirtCollected, applyPromoCode } = useGameStore();
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; success: boolean } | null>(null);
  
  // Обработчик применения промокода
  const handlePromoCodeApply = () => {
    if (promoCode.trim()) {
      const result = applyPromoCode(promoCode);
      setPromoMessage({
        text: result.message,
        success: result.success
      });
      
      // Очистить поле ввода после успешного применения
      if (result.success) {
        setPromoCode('');
      }
      
      // Очистить сообщение через 5 секунд
      setTimeout(() => {
        setPromoMessage(null);
      }, 5000);
    }
  };
  
  return (
    <div className="settings-panel">
      <h2>Settings</h2>
      
      <div className="settings-section">
        <h3>Statistics</h3>
        <div className="stat-item">
          <span className="stat-label">Total Dirt Collected:</span>
          <span className="stat-value">{formatNumber(totalDirtCollected)}</span>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>Sound Settings</h3>
        <div className="setting-item">
          <span className="setting-label">Sound Effects:</span>
          <label className="toggle-switch">
            <input type="checkbox" disabled />
            <span className="toggle-slider"></span>
          </label>
          <span className="coming-soon">Coming Soon</span>
        </div>
        
        <div className="setting-item">
          <span className="setting-label">Background Music:</span>
          <label className="toggle-switch">
            <input type="checkbox" disabled />
            <span className="toggle-slider"></span>
          </label>
          <span className="coming-soon">Coming Soon</span>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>Promo Codes</h3>
        <div className="promo-code-container">
          <input 
            type="text" 
            className="promo-input"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePromoCodeApply()}
          />
          <button className="promo-button" onClick={handlePromoCodeApply}>Apply</button>
        </div>
        {promoMessage && (
          <div className={`promo-message ${promoMessage.success ? 'success' : 'error'}`}>
            {promoMessage.text}
          </div>
        )}
      </div>
      
      <div className="settings-section">
        <h3>Game Version</h3>
        <div className="version-info">v0.1.0 Alpha</div>
      </div>
    </div>
  );
};