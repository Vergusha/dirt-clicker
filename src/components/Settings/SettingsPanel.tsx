import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { formatNumber } from '../../utils/formatNumber';
import styles from './SettingsPanel.module.css';

/**
 * Component for displaying game settings and statistics
 */
export const SettingsPanel = () => {
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const {
    musicEnabled,
    setMusicEnabled,
    musicVolume,
    setMusicVolume,
    soundEffectsEnabled,
    setSoundEffectsEnabled,
    soundEffectsVolume,
    setSoundEffectsVolume,
    endermanSoundsEnabled,
    setEndermanSoundsEnabled,
    allaySoundsEnabled,
    setAllaySoundsEnabled,
    catSoundsEnabled,
    setCatSoundsEnabled,
    parrotSoundsEnabled,
    setParrotSoundsEnabled,
    foxSoundsEnabled,
    setFoxSoundsEnabled,
    dirtCount,
    totalDirtCollected,
    applyPromoCode
  } = useGameStore();

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = applyPromoCode(promoCode);
    setPromoMessage(result.message);
    setPromoCode('');
  };

  return (
    <motion.div
      className={styles.settingsPanelContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className={styles.settingsPanel}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <h2 className={styles.title}>Settings</h2>

        {/* Statistics */}
        <div className={styles.statsGroup}>
          <h3 className={styles.subtitle}>Statistics</h3>
          <div className={styles.statItem}>
            <span>Total Dirt Collected:</span>
            <span className={styles.statValue}>{formatNumber(totalDirtCollected)}</span>
          </div>
          <div className={styles.statItem}>
            <span>Current Dirt Amount:</span>
            <span className={styles.statValue}>{formatNumber(dirtCount)}</span>
          </div>
        </div>

        {/* Music Settings */}
        <div className={styles.settingGroup}>
          <label className={styles.settingLabel}>
            <input
              type="checkbox"
              checked={musicEnabled}
              onChange={(e) => setMusicEnabled(e.target.checked)}
            />
            Music
          </label>
          <AnimatePresence>
            {musicEnabled && (
              <motion.div
                className={styles.volumeControl}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={musicVolume}
                  onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sound Effects Settings */}
        <div className={styles.settingGroup}>
          <label className={styles.settingLabel}>
            <input
              type="checkbox"
              checked={soundEffectsEnabled}
              onChange={(e) => setSoundEffectsEnabled(e.target.checked)}
            />
            Sound Effects
          </label>
          <AnimatePresence>
            {soundEffectsEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className={styles.volumeControl}>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={soundEffectsVolume}
                    onChange={(e) => setSoundEffectsVolume(parseFloat(e.target.value))}
                  />
                </div>
                <div className={styles.subSettings}>
                  <label className={styles.settingLabel}>
                    <input
                      type="checkbox"
                      checked={endermanSoundsEnabled}
                      onChange={(e) => setEndermanSoundsEnabled(e.target.checked)}
                    />
                    Enderman Sounds
                  </label>
                  <label className={styles.settingLabel}>
                    <input
                      type="checkbox"
                      checked={allaySoundsEnabled}
                      onChange={(e) => setAllaySoundsEnabled(e.target.checked)}
                    />
                    Allay Sounds
                  </label>
                  <label className={styles.settingLabel}>
                    <input
                      type="checkbox"
                      checked={catSoundsEnabled}
                      onChange={(e) => setCatSoundsEnabled(e.target.checked)}
                    />
                    Cat Sounds
                  </label>
                  <label className={styles.settingLabel}>
                    <input
                      type="checkbox"
                      checked={parrotSoundsEnabled}
                      onChange={(e) => setParrotSoundsEnabled(e.target.checked)}
                    />
                    Parrot Sounds
                  </label>
                  <label className={styles.settingLabel}>
                    <input
                      type="checkbox"
                      checked={foxSoundsEnabled}
                      onChange={(e) => setFoxSoundsEnabled(e.target.checked)}
                    />
                    Fox Sounds
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Promo Code */}
        <div className={styles.promoGroup}>
          <h3 className={styles.subtitle}>Promo Code</h3>
          <form onSubmit={handlePromoSubmit} className={styles.promoForm}>
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter promo code"
              className={styles.promoInput}
            />
            <button type="submit" className={styles.promoButton}>
              Apply
            </button>
          </form>
          {promoMessage && (
            <div className={styles.promoMessage}>
              {promoMessage}
            </div>
          )}
        </div>

        {/* Game Version */}
        <div className={styles.versionInfo}>
          Game Version: 1.0.0
        </div>
      </motion.div>
    </motion.div>
  );
};