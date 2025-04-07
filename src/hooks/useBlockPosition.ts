import { useState, useEffect, RefObject } from 'react';
import { BlockPosition } from '../types';

/**
 * Hook for tracking the position of the dirt block
 */
export const useBlockPosition = (blockRef: RefObject<HTMLDivElement>) => {
  const [blockPosition, setBlockPosition] = useState<BlockPosition | null>(null);
  
  // Update block position when the component mounts or window resizes
  useEffect(() => {
    const updateBlockPosition = () => {
      if (blockRef.current) {
        const rect = blockRef.current.getBoundingClientRect();
        
        // Calculate the center of the block
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        setBlockPosition({ x, y });
      }
    };
    
    // Initial position
    updateBlockPosition();
    
    // Update position when window is resized
    window.addEventListener('resize', updateBlockPosition);
    
    // Cleanup listener
    return () => {
      window.removeEventListener('resize', updateBlockPosition);
    };
  }, [blockRef]);
  
  return blockPosition;
};