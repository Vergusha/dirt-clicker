import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { formatNumber } from '../../utils/formatNumber';
import styles from './SettingsPanel.module.css';

/**
 * Компонент для отображения настроек и статистики игры
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
    shovelSoundsEnabled,
    setShovelSoundsEnabled,
    endermanSoundsEnabled,
    setEndermanSoundsEnabled,
    allaySoundsEnabled,
    setAllaySoundsEnabled,
    catSoundsEnabled,
    setCatSoundsEnabled,
    parrotSoundsEnabled,
    setParrotSoundsEnabled,
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
      className={styles.settingsPanel}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className={styles.title}>Настройки</h2>

      {/* Статистика */}
      <div className={styles.statsGroup}>
        <h3 className={styles.subtitle}>Статистика</h3>
        <div className={styles.statItem}>
          <span>Всего земли добыто:</span>
          <span className={styles.statValue}>{formatNumber(totalDirtCollected)}</span>
        </div>
        <div className={styles.statItem}>
          <span>Текущее количество земли:</span>
          <span className={styles.statValue}>{formatNumber(dirtCount)}</span>
        </div>
      </div>

      {/* Настройки музыки */}
      <div className={styles.settingGroup}>
        <label className={styles.settingLabel}>
          <input
            type="checkbox"
            checked={musicEnabled}
            onChange={(e) => setMusicEnabled(e.target.checked)}
          />
          Музыка
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

      {/* Настройки звуковых эффектов */}
      <div className={styles.settingGroup}>
        <label className={styles.settingLabel}>
          <input
            type="checkbox"
            checked={soundEffectsEnabled}
            onChange={(e) => setSoundEffectsEnabled(e.target.checked)}
          />
          Звуковые эффекты
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
                    checked={shovelSoundsEnabled}
                    onChange={(e) => setShovelSoundsEnabled(e.target.checked)}
                  />
                  Звуки лопаты
                </label>
                <label className={styles.settingLabel}>
                  <input
                    type="checkbox"
                    checked={endermanSoundsEnabled}
                    onChange={(e) => setEndermanSoundsEnabled(e.target.checked)}
                  />
                  Звуки эндермена
                </label>
                <label className={styles.settingLabel}>
                  <input
                    type="checkbox"
                    checked={allaySoundsEnabled}
                    onChange={(e) => setAllaySoundsEnabled(e.target.checked)}
                  />
                  Звуки эллея
                </label>
                <label className={styles.settingLabel}>
                  <input
                    type="checkbox"
                    checked={catSoundsEnabled}
                    onChange={(e) => setCatSoundsEnabled(e.target.checked)}
                  />
                  Звуки кота
                </label>
                <label className={styles.settingLabel}>
                  <input
                    type="checkbox"
                    checked={parrotSoundsEnabled}
                    onChange={(e) => setParrotSoundsEnabled(e.target.checked)}
                  />
                  Звуки попугая
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ввод промокода */}
      <div className={styles.promoGroup}>
        <h3 className={styles.subtitle}>Промокод</h3>
        <form onSubmit={handlePromoSubmit} className={styles.promoForm}>
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Введите промокод"
            className={styles.promoInput}
          />
          <button type="submit" className={styles.promoButton}>
            Применить
          </button>
        </form>
        {promoMessage && (
          <div className={styles.promoMessage}>
            {promoMessage}
          </div>
        )}
      </div>

      {/* Версия игры */}
      <div className={styles.versionInfo}>
        Версия игры: 1.0.0
      </div>
    </motion.div>
  );
};