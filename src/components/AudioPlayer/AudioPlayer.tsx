import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useAudioContext } from '../../hooks/useAudioContext';
import backgroundMusic from '../../audio/C418-Ghostly.mp3';

/**
 * Компонент AudioPlayer управляет фоновой музыкой игры
 * Реагирует на настройки из gameStore и воспроизводит фоновую музыку
 */
export const AudioPlayer: React.FC = () => {
  const { musicEnabled, musicVolume } = useGameStore();
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const audioContext = useAudioContext();

  // Слушаем первое взаимодействие пользователя
  useEffect(() => {
    const handleInteraction = async () => {
      setIsUserInteracted(true);
      await audioContext.initialize();
      await audioContext.loadSound(backgroundMusic);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  // Управление воспроизведением
  useEffect(() => {
    if (!isUserInteracted) return;

    if (musicEnabled) {
      audioContext.resume();
      audioContext.playSound(backgroundMusic, musicVolume);
    } else {
      audioContext.stopAll();
      audioContext.suspend();
    }
  }, [musicEnabled, isUserInteracted]);

  // Обновляем громкость
  useEffect(() => {
    audioContext.setMasterVolume(musicVolume);
  }, [musicVolume]);

  return null;
};