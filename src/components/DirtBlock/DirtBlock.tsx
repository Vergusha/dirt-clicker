import { RefObject, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import dirtImage from '../../assets/dirt.webp';
import { useGameStore } from '../../store/gameStore';

interface DirtBlockProps {
  blockRef: RefObject<HTMLDivElement | null>;
  onBlockClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  onPositionUpdate?: (position: { x: number, y: number, width: number, height: number }) => void;
}

/**
 * Component representing the clickable dirt block
 * Always positioned in the center of the screen
 */
export const DirtBlock: React.FC<DirtBlockProps> = ({ blockRef, onBlockClick, onPositionUpdate }) => {
  const { autoClickerCount } = useGameStore();
  const controls = useAnimation();
  
  // Keep track of the previous position to avoid unnecessary updates
  const prevPositionRef = useRef<{ x: number, y: number, width: number, height: number } | null>(null);
  
  // Анимация автоматической добычи
  useEffect(() => {
    if (autoClickerCount > 0) {
      const interval = setInterval(() => {
        controls.start({
          scale: [1, 0.9, 1],
          transition: { duration: 0.3 }
        });
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [autoClickerCount, controls]);
  
  // Helper function to check if positions are significantly different
  const hasPositionChanged = (
    prev: { x: number, y: number, width: number, height: number } | null, 
    current: { x: number, y: number, width: number, height: number }
  ) => {
    if (!prev) return true;
    
    // Only update if position changed by at least 1px
    return (
      Math.abs(prev.x - current.x) > 1 || 
      Math.abs(prev.y - current.y) > 1 ||
      Math.abs(prev.width - current.width) > 1 ||
      Math.abs(prev.height - current.height) > 1
    );
  };

  // Обновляем положение блока при монтировании и изменении размера
  useEffect(() => {
    const updateBlockPosition = () => {
      if (blockRef.current && onPositionUpdate) {
        const rect = blockRef.current.getBoundingClientRect();
        const newPosition = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height
        };
        
        // Only update if position has actually changed
        if (hasPositionChanged(prevPositionRef.current, newPosition)) {
          prevPositionRef.current = newPosition;
          onPositionUpdate(newPosition);
        }
      }
    };
    
    // Начальное обновление
    updateBlockPosition();
    
    // Обновление при изменении размера
    const resizeObserver = new ResizeObserver(() => {
      updateBlockPosition();
    });
    
    if (blockRef.current) {
      resizeObserver.observe(blockRef.current);
    }
    
    window.addEventListener('resize', updateBlockPosition);
    window.addEventListener('scroll', updateBlockPosition);
    
    // Снижаем частоту проверок - используем крупный интервал
    const interval = setInterval(updateBlockPosition, 500);
    
    return () => {
      window.removeEventListener('resize', updateBlockPosition);
      window.removeEventListener('scroll', updateBlockPosition);
      clearInterval(interval);
      resizeObserver.disconnect();
    };
  }, [blockRef, onPositionUpdate]); // Важные зависимости

  return (
    <motion.div 
      ref={blockRef}
      className="dirt-block-container"
      animate={controls}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onBlockClick}
      onContextMenu={(e) => e.preventDefault()} // Disable context menu
    >
      <img 
        src={dirtImage} 
        alt="Dirt Block" 
        draggable="false" 
        onContextMenu={(e) => e.preventDefault()} // Disable context menu on image
      />
    </motion.div>
  );
};