import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { formatNumber } from '../../utils/formatNumber';

/**
 * Компонент для отображения настроек и статистики игры
 */
export const SettingsPanel: React.FC = () => {
  const { 
    totalDirtCollected, 
    applyPromoCode,
    musicEnabled,
    musicVolume,
    soundEffectsEnabled,
    shovelSoundsEnabled,
    shovelSoundsVolume,
    endermanSoundsEnabled,
    endermanSoundsVolume,
    setMusicEnabled,
    setMusicVolume,
    setSoundEffectsEnabled,
    setShovelSoundsEnabled,
    setShovelSoundsVolume,
    setEndermanSoundsEnabled,
    setEndermanSoundsVolume
  } = useGameStore();
  
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

  // Обработчик изменения громкости музыки
  const handleMusicVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setMusicVolume(newVolume);
  };
  
  // Обработчик изменения громкости звуков лопаты
  const handleShovelVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setShovelSoundsVolume(newVolume);
  };
  
  // Обработчик изменения громкости звуков эндермена
  const handleEndermanVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setEndermanSoundsVolume(newVolume);
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
          <span className="setting-label">Background Music:</span>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={musicEnabled}
              onChange={(e) => setMusicEnabled(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        
        <div className="setting-item">
          <span className="setting-label">Music Volume:</span>
          <div className="volume-slider-container">
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={musicVolume}
              onChange={handleMusicVolumeChange}
              className="volume-slider"
              disabled={!musicEnabled}
            />
            <div className="volume-value">{Math.round(musicVolume * 100)}%</div>
          </div>
        </div>
        
        <div className="setting-title">Sound Effects</div>
        
        <div className="setting-item">
          <span className="setting-label">Enabled:</span>
          <label className="toggle-switch">
            <input 
              type="checkbox"
              checked={soundEffectsEnabled}
              onChange={(e) => setSoundEffectsEnabled(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        
        <div className="setting-item sound-subitem">
          <span className="setting-label">Shovel Sounds:</span>
          <label className="toggle-switch">
            <input 
              type="checkbox"
              checked={shovelSoundsEnabled}
              onChange={(e) => setShovelSoundsEnabled(e.target.checked)}
              disabled={!soundEffectsEnabled}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        
        <div className="setting-item sound-subitem">
          <span className="setting-label">Shovel Volume:</span>
          <div className="volume-slider-container">
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={shovelSoundsVolume}
              onChange={handleShovelVolumeChange}
              className="volume-slider"
              disabled={!soundEffectsEnabled || !shovelSoundsEnabled}
            />
            <div className="volume-value">{Math.round(shovelSoundsVolume * 100)}%</div>
          </div>
        </div>
        
        {/* New Enderman sound settings */}
        <div className="setting-item sound-subitem">
          <span className="setting-label">Enderman Sounds:</span>
          <label className="toggle-switch">
            <input 
              type="checkbox"
              checked={endermanSoundsEnabled}
              onChange={(e) => setEndermanSoundsEnabled(e.target.checked)}
              disabled={!soundEffectsEnabled}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        
        <div className="setting-item sound-subitem">
          <span className="setting-label">Enderman Volume:</span>
          <div className="volume-slider-container">
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={endermanSoundsVolume}
              onChange={handleEndermanVolumeChange}
              className="volume-slider"
              disabled={!soundEffectsEnabled || !endermanSoundsEnabled}
            />
            <div className="volume-value">{Math.round(endermanSoundsVolume * 100)}%</div>
          </div>
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