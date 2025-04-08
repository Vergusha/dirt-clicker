import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../store/gameStore';

// Импортируем звуковые файлы
import shovelSound1 from '../../audio/Shovel_flatten1.ogg';
import shovelSound2 from '../../audio/Shovel_flatten2.ogg';
import shovelSound3 from '../../audio/Shovel_flatten3.ogg';
import shovelSound4 from '../../audio/Shovel_flatten4.ogg';

/**
 * Компонент для проигрывания звуков лопат при наличии автоматических копателей
 */
export const ShovelSoundPlayer: React.FC = () => {
  const { autoClickerCount, shovelSoundsEnabled } = useGameStore();
  const soundsArray = [shovelSound1, shovelSound2, shovelSound3, shovelSound4];
  const audioRefs = useRef<HTMLAudioElement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);
  
  // Подготавливаем аудио элементы при монтировании
  useEffect(() => {
    // Создаем элементы Audio для каждого звука
    audioRefs.current = soundsArray.map(sound => {
      const audio = new Audio(sound);
      audio.volume = 0.3; // Устанавливаем громкость звука (30%)
      return audio;
    });
    
    // Очистка при размонтировании
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      audioRefs.current.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);
  
  // Функция воспроизведения случайного звука лопаты
  const playRandomShovelSound = () => {
    if (!shovelSoundsEnabled || autoClickerCount <= 0) return;
    
    // Выбираем случайный индекс для следующего звука, не повторяя предыдущий
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * soundsArray.length);
    } while (nextIndex === currentIndex && soundsArray.length > 1);
    
    setCurrentIndex(nextIndex);
    
    const audio = audioRefs.current[nextIndex];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(error => {
        console.log('Error playing shovel sound:', error);
      });
    }
  };
  
  // Запускаем и останавливаем воспроизведение звуков в зависимости от настроек и наличия лопат
  useEffect(() => {
    // Если звуки включены и есть лопаты - начинаем воспроизведение
    if (shovelSoundsEnabled && autoClickerCount > 0) {
      // Немедленное воспроизведение звука при активации
      playRandomShovelSound();
      
      // Устанавливаем интервал для регулярного воспроизведения звуков
      // Интервал должен быть достаточно коротким для частых лопат, но не слишком
      const interval = setInterval(() => {
        playRandomShovelSound();
      }, 1000); // Каждую секунду, совпадает с частотой автоклика
      
      intervalRef.current = interval as unknown as number;
      
      return () => {
        clearInterval(interval);
        intervalRef.current = null;
      };
    } else {
      // Если звуки отключены или нет лопат - останавливаем все звуки
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // Остановить все звуки
      audioRefs.current.forEach(audio => {
        if (!audio.paused) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    }
  }, [shovelSoundsEnabled, autoClickerCount]);
  
  // Компонент не отображает никаких элементов интерфейса
  return null;
};