import { useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { BlockPosition } from '../types';

/**
 * Hook for managing automatic clicking functionality
 */
export const useAutoClick = (
  addAnimation: (x: number, y: number, value: number) => void,
  blockPosition: BlockPosition | null
) => {
  const { 
    increaseDirtCount, 
    autoClickerCount, 
    multiAutoClickPower 
  } = useGameStore();
  
  // Calculate the actual value added per tick based on auto clickers and multiplier
  const getAutoClickValue = useCallback(() => {
    if (autoClickerCount <= 0) return 0;
    return Math.floor(autoClickerCount * multiAutoClickPower);
  }, [autoClickerCount, multiAutoClickPower]);
  
  // Handle auto clicking at regular intervals
  useEffect(() => {
    // If there are no auto clickers or block position isn't available, don't do anything
    if (autoClickerCount <= 0 || !blockPosition) return;
    
    const clickValue = getAutoClickValue();
    
    // Set up interval for auto clicking
    const interval = setInterval(() => {
      // Add dirt based on auto clicker power
      increaseDirtCount(clickValue);
      
      // Create animation if block is visible
      if (blockPosition) {
        // Calculate a random position around the block for the animation
        const randomOffsetX = (Math.random() - 0.5) * 80;
        const randomOffsetY = (Math.random() - 0.5) * 80;
        
        const x = blockPosition.x + randomOffsetX;
        const y = blockPosition.y + randomOffsetY;
        
        addAnimation(x, y, clickValue);
      }
    }, 1000); // Auto click once per second
    
    // Clean up interval
    return () => clearInterval(interval);
  }, [autoClickerCount, blockPosition, getAutoClickValue, increaseDirtCount, addAnimation]);
};