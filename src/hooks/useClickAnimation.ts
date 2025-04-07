import { useState, useCallback } from 'react';
import { ClickAnimation } from '../types';

/**
 * Hook for managing click animations
 * Handles creating and removing animations
 */
export const useClickAnimation = () => {
  // State for tracking active animations
  const [animations, setAnimations] = useState<ClickAnimation[]>([]);
  
  // Generate a unique ID for each animation
  const generateId = () => `click-${Date.now()}-${Math.random()}`;
  
  // Create a new animation
  const addAnimation = useCallback((x: number, y: number, value: number) => {
    const newAnimation: ClickAnimation = {
      id: generateId(),
      x,
      y,
      value
    };
    
    setAnimations(prev => [...prev, newAnimation]);
    
    // Remove animation after 800ms (duration of animation)
    setTimeout(() => {
      setAnimations(prev => prev.filter(anim => anim.id !== newAnimation.id));
    }, 800);
  }, []);
  
  return {
    animations,
    addAnimation
  };
};