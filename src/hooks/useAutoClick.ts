import { useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { BlockPosition } from '../types';

const ANIMATION_BATCH_SIZE = 20; // Увеличиваем размер пакета анимаций
const ANIMATION_THROTTLE = 500; // Увеличиваем интервал между анимациями
const UPDATE_INTERVAL = 500; // Увеличиваем интервал обновления
const MAX_ANIMATIONS_PER_SECOND = 2; // Максимум 2 анимации в секунду

/**
 * Hook for managing automatic clicking functionality
 */
export const useAutoClick = (
  addAnimation: (x: number, y: number, value: number) => void,
  blockPosition: BlockPosition | null
) => {
  const { 
    increaseDirtCount, 
    autoClickerCount
  } = useGameStore();
  
  const lastAnimationTimeRef = useRef(0);
  const accumulatedValueRef = useRef(0);
  const animationCountRef = useRef(0);
  const lastResetTimeRef = useRef(Date.now());
  
  // Calculate the actual value added per tick based on auto clickers
  const getAutoClickValue = useCallback(() => {
    if (autoClickerCount <= 0) return 0;
    return autoClickerCount;
  }, [autoClickerCount]);
  
  // Оптимизированная функция для расчета позиции анимации
  const getAnimationPosition = useCallback((blockPos: BlockPosition) => {
    const angle = (Math.random() * 4) | 0; // Используем только 4 фиксированных угла
    const distance = 30; // Фиксированная дистанция
    const x = blockPos.x + Math.cos(angle * Math.PI / 2) * distance;
    const y = blockPos.y + Math.sin(angle * Math.PI / 2) * distance;
    return { x, y };
  }, []);
  
  useEffect(() => {
    if (autoClickerCount <= 0 || !blockPosition) return;
    
    const baseClickValue = getAutoClickValue();
    const clicksPerSecond = baseClickValue;
    const valuePerTick = (clicksPerSecond * UPDATE_INTERVAL) / 1000;
    
    const interval = setInterval(() => {
      // Сброс счетчика анимаций каждую секунду
      const now = Date.now();
      if (now - lastResetTimeRef.current >= 1000) {
        animationCountRef.current = 0;
        lastResetTimeRef.current = now;
      }
      
      // Накапливаем значение
      accumulatedValueRef.current += valuePerTick;
      
      // Увеличиваем счетчик земли одним большим пакетом
      increaseDirtCount(valuePerTick);
      
      // Проверяем условия для анимации
      if (now - lastAnimationTimeRef.current >= ANIMATION_THROTTLE && 
          accumulatedValueRef.current >= ANIMATION_BATCH_SIZE && 
          animationCountRef.current < MAX_ANIMATIONS_PER_SECOND &&
          blockPosition) {
        
        lastAnimationTimeRef.current = now;
        animationCountRef.current++;
        
        const animationValue = Math.floor(accumulatedValueRef.current);
        accumulatedValueRef.current = 0;
        
        const pos = getAnimationPosition(blockPosition);
        addAnimation(pos.x, pos.y, animationValue);
      }
    }, UPDATE_INTERVAL);
    
    return () => clearInterval(interval);
  }, [autoClickerCount, blockPosition, getAutoClickValue, increaseDirtCount, addAnimation, getAnimationPosition]);
};