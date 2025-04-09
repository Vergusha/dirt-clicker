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
  const audioInitializedRef = useRef(false);

  // Инициализация аудио при монтировании компонента
  useEffect(() => {
    if (audioInitializedRef.current) return;

    // Создаем аудио элемент при монтировании компонента
    const audio = new Audio(backgroundMusic);
    audio.loop = true;  // Зацикливаем воспроизведение
    audio.volume = musicVolume;  // Устанавливаем начальную громкость
    
    // Если музыка была включена до обновления страницы, начинаем воспроизведение
    if (musicEnabled) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Initial play prevented:', error);
        });
      }
    }
    
    // Добавляем обработчик события окончания воспроизведения
    const handleEnded = () => {
      if (musicEnabled) {
        audio.currentTime = 0;
        audio.play().catch(error => {
          console.log('Replay after end prevented:', error);
        });
      }
    };
    
    audio.addEventListener('ended', handleEnded);
    
    // Сохраняем ссылку на аудио элемент
    audioRef.current = audio;
    audioInitializedRef.current = true;
    
    // Очистка при размонтировании компонента
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.pause();
        audioRef.current = null;
        audioInitializedRef.current = false;
      }
    };
  }, []); // Выполняется только при монтировании

  // Обработка изменения состояния воспроизведения
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (musicEnabled) {
      const playPromise = audioRef.current.play();
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