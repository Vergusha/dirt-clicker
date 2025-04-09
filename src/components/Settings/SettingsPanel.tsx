import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { formatNumber } from '../../utils/formatNumber';
import { motion } from 'framer-motion';

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
    allaySoundsEnabled,
    allaySoundsVolume,
    catSoundsEnabled,
    catSoundsVolume,
    parrotSoundsEnabled,
    parrotSoundsVolume,
    setMusicEnabled,
    setMusicVolume,
    setSoundEffectsEnabled,
    setShovelSoundsEnabled,
    setShovelSoundsVolume,
    setEndermanSoundsEnabled,
    setEndermanSoundsVolume,
    setAllaySoundsEnabled,
    setAllaySoundsVolume,
    setCatSoundsEnabled,
    setCatSoundsVolume,
    setParrotSoundsEnabled,
    setParrotSoundsVolume
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
      
      if (result.success) {
        setPromoCode('');
      }
      
      setTimeout(() => {
        setPromoMessage(null);
      }, 5000);
    }
  };

  return (
    <motion.div 
      className="settings-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="settings-section stats-section">
        <div className="section-header">
          <i className="fas fa-chart-bar"></i>
          <h3>Statistics</h3>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Dirt Collected:</span>
          <span className="stat-value highlight">{formatNumber(totalDirtCollected)}</span>
        </div>
      </div>
      
      <div className="settings-section audio-section">
        <div className="section-header">
          <i className="fas fa-volume-up"></i>
          <h3>Sound Settings</h3>
        </div>
        
        <div className="setting-item">
          <div className="setting-row">
            <span className="setting-label">
              <i className="fas fa-music"></i>
              Background Music
            </span>
            <div className="volume-slider-container">
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={musicVolume}
                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                className="volume-slider"
                disabled={!musicEnabled}
                title="Background Music Volume"
                aria-label="Music Volume Slider"
              />
            </div>
            <label className="toggle-switch" htmlFor="background-music-toggle">
              <input 
                id="background-music-toggle"
                type="checkbox" 
                checked={musicEnabled}
                onChange={(e) => setMusicEnabled(e.target.checked)}
                title="Enable/Disable Background Music"
                aria-label="Background Music Toggle"
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-row">
            <span className="setting-label">
              <i className="fas fa-drum"></i>
              Sound Effects
            </span>
            <label className="toggle-switch" htmlFor="sound-effects-toggle">
              <input 
                id="sound-effects-toggle"
                type="checkbox"
                checked={soundEffectsEnabled}
                onChange={(e) => setSoundEffectsEnabled(e.target.checked)}
                title="Enable/Disable All Sound Effects"
                aria-label="Sound Effects Toggle"
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="setting-item sub-setting">
          <div className="setting-row">
            <span className="setting-label">
              <i className="fas fa-shovel"></i>
              Shovel Sounds
            </span>
            <div className="volume-slider-container">
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={shovelSoundsVolume}
                onChange={(e) => setShovelSoundsVolume(parseFloat(e.target.value))}
                className="volume-slider"
                disabled={!soundEffectsEnabled || !shovelSoundsEnabled}
                title="Shovel Sounds Volume"
                aria-label="Shovel Sounds Volume Slider"
              />
            </div>
            <label className="toggle-switch" htmlFor="shovel-sounds-toggle">
              <input 
                id="shovel-sounds-toggle"
                type="checkbox"
                checked={shovelSoundsEnabled}
                onChange={(e) => setShovelSoundsEnabled(e.target.checked)}
                disabled={!soundEffectsEnabled}
                title="Enable/Disable Shovel Sounds"
                aria-label="Shovel Sounds Toggle"
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="setting-item sub-setting">
          <div className="setting-row">
            <span className="setting-label">
              <i className="fas fa-ghost"></i>
              Enderman Sounds
            </span>
            <div className="volume-slider-container">
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={endermanSoundsVolume}
                onChange={(e) => setEndermanSoundsVolume(parseFloat(e.target.value))}
                className="volume-slider"
                disabled={!soundEffectsEnabled || !endermanSoundsEnabled}
                title="Enderman Sounds Volume"
                aria-label="Enderman Sounds Volume Slider"
              />
            </div>
            <label className="toggle-switch" htmlFor="enderman-sounds-toggle">
              <input 
                id="enderman-sounds-toggle"
                type="checkbox"
                checked={endermanSoundsEnabled}
                onChange={(e) => setEndermanSoundsEnabled(e.target.checked)}
                disabled={!soundEffectsEnabled}
                title="Enable/Disable Enderman Sounds"
                aria-label="Enderman Sounds Toggle"
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="setting-item sub-setting">
          <div className="setting-row">
            <span className="setting-label">
              <i className="fas fa-wind"></i>
              Allay Sounds
            </span>
            <div className="volume-slider-container">
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={allaySoundsVolume}
                onChange={(e) => setAllaySoundsVolume(parseFloat(e.target.value))}
                className="volume-slider"
                disabled={!soundEffectsEnabled || !allaySoundsEnabled}
                title="Allay Sounds Volume"
                aria-label="Allay Sounds Volume Slider"
              />
            </div>
            <label className="toggle-switch" htmlFor="allay-sounds-toggle">
              <input 
                id="allay-sounds-toggle"
                type="checkbox"
                checked={allaySoundsEnabled}
                onChange={(e) => setAllaySoundsEnabled(e.target.checked)}
                disabled={!soundEffectsEnabled}
                title="Enable/Disable Allay Sounds"
                aria-label="Allay Sounds Toggle"
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="setting-item sub-setting">
          <div className="setting-row">
            <span className="setting-label">
              <i className="fas fa-cat"></i>
              Lucky Cat Sounds
            </span>
            <div className="volume-slider-container">
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={catSoundsVolume}
                onChange={(e) => setCatSoundsVolume(parseFloat(e.target.value))}
                className="volume-slider"
                disabled={!soundEffectsEnabled || !catSoundsEnabled}
                title="Lucky Cat Sounds Volume"
                aria-label="Lucky Cat Sounds Volume Slider"
              />
            </div>
            <label className="toggle-switch" htmlFor="cat-sounds-toggle">
              <input 
                id="cat-sounds-toggle"
                type="checkbox"
                checked={catSoundsEnabled}
                onChange={(e) => setCatSoundsEnabled(e.target.checked)}
                disabled={!soundEffectsEnabled}
                title="Enable/Disable Lucky Cat Sounds"
                aria-label="Lucky Cat Sounds Toggle"
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="setting-item sub-setting">
          <div className="setting-row">
            <span className="setting-label">
              <i className="fas fa-feather"></i>
              Pirate Parrot Sounds
            </span>
            <div className="volume-slider-container">
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={parrotSoundsVolume}
                onChange={(e) => setParrotSoundsVolume(parseFloat(e.target.value))}
                className="volume-slider"
                disabled={!soundEffectsEnabled || !parrotSoundsEnabled}
                title="Pirate Parrot Sounds Volume"
                aria-label="Pirate Parrot Sounds Volume Slider"
              />
            </div>
            <label className="toggle-switch" htmlFor="parrot-sounds-toggle">
              <input 
                id="parrot-sounds-toggle"
                type="checkbox"
                checked={parrotSoundsEnabled}
                onChange={(e) => setParrotSoundsEnabled(e.target.checked)}
                disabled={!soundEffectsEnabled}
                title="Enable/Disable Pirate Parrot Sounds"
                aria-label="Pirate Parrot Sounds Toggle"
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <div className="section-header">
          <i className="fas fa-gift"></i>
          <h3>Promo Codes</h3>
        </div>
        <div className="promo-code-container">
          <input 
            type="text" 
            className="promo-input"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePromoCodeApply()}
          />
          <motion.button 
            className="promo-button"
            onClick={handlePromoCodeApply}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Apply
          </motion.button>
        </div>
        {promoMessage && (
          <motion.div 
            className={`promo-message ${promoMessage.success ? 'success' : 'error'}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {promoMessage.text}
          </motion.div>
        )}
      </div>
      
      <div className="settings-section version-section">
        <div className="section-header">
          <i className="fas fa-info-circle"></i>
          <h3>Information</h3>
        </div>
        <div className="version-info">Version 0.1.0 Alpha</div>
      </div>
    </motion.div>
  );
};