import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import backgroundMusic from '../../audio/C418-Ghostly.mp3';

/**
 * Компонент AudioPlayer управляет фоновой музыкой игры
 * Реагирует на настройки из gameStore и воспроизводит фоновую музыку
 */
export const AudioPlayer: React.FC = () => {
  const { musicEnabled, musicVolume } = useGameStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Инициализация аудио при монтировании и обработка настроек
  useEffect(() => {
    // Создаем аудио элемент при монтировании компонента
    const audio = new Audio(backgroundMusic);
    audio.loop = true;  // Зацикливаем воспроизведение
    audio.volume = musicVolume;  // Устанавливаем начальную громкость
    
    // Сохраняем ссылку на аудио элемент
    audioRef.current = audio;
    
    // Начинаем воспроизведение, если оно включено
    if (musicEnabled) {
      const playPromise = audio.play();
      
      // Обрабатываем возможные проблемы с автовоспроизведением
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Autoplay prevented:', error);
          // Здесь можно добавить обработку ошибки автовоспроизведения,
          // например, показать пользователю кнопку для ручного запуска музыки
        });
      }
    }
    
    // Очистка при размонтировании компонента
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []); // Выполняется только при монтировании компонента

  // Обновляем состояние воспроизведения при изменении настроек
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (musicEnabled) {
      const playPromise = audioRef.current.play();
      
      // Обрабатываем возможные проблемы с воспроизведением
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Play prevented:', error);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [musicEnabled]);

  // Обновляем громкость при изменении настроек
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = musicVolume;
  }, [musicVolume]);

  // Компонент не рендерит никаких элементов в DOM
  return null;
};