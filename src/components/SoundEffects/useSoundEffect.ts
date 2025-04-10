import { useRef, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';

export const useSoundEffect = (sounds: string[], volume: number = 1) => {
  const { soundEffectsEnabled } = useGameStore();
  const audioRefs = useRef<HTMLAudioElement[]>([]);

  useEffect(() => {
    // Создаем аудио элементы для каждого звука
    audioRefs.current = sounds.map(sound => {
      const audio = new Audio(sound);
      audio.volume = volume;
      return audio;
    });

    // Очистка при размонтировании
    return () => {
      audioRefs.current.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, [sounds, volume]);

  const playRandomSound = () => {
    if (!soundEffectsEnabled) return;

    // Выбираем случайный звук
    const randomIndex = Math.floor(Math.random() * sounds.length);
    
    // Используем существующий аудио элемент
    const audio = audioRefs.current[randomIndex];
    audio.currentTime = 0; // Сбрасываем время воспроизведения
    audio.volume = volume;
    
    // Воспроизводим звук
    audio.play().catch(error => {
      console.log('Error playing sound:', error);
    });
  };

  return playRandomSound;
}; 