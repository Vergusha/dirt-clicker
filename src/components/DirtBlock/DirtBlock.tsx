import { RefObject, useEffect, useRef, memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import dirtImage from '../../assets/dirt.webp';

interface DirtBlockProps {
  blockRef: RefObject<HTMLDivElement | null>;
  onBlockClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  onPositionUpdate?: (position: { x: number, y: number, width: number, height: number }) => void;
}

/**
 * Component representing the clickable dirt block
 * Always positioned in the center of the screen
 */
const DirtBlockComponent: React.FC<DirtBlockProps> = ({ blockRef, onBlockClick, onPositionUpdate }) => {
  const shouldReduceMotion = useReducedMotion();
  const prevPositionRef = useRef<{ x: number, y: number, width: number, height: number } | null>(null);
  const updateTimeoutRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  
  // Helper function to check if positions are significantly different
  const hasPositionChanged = (
    prev: { x: number, y: number, width: number, height: number } | null, 
    current: { x: number, y: number, width: number, height: number }
  ) => {
    if (!prev) return true;
    
    // Увеличиваем порог изменений до 10px
    return (
      Math.abs(prev.x - current.x) > 10 || 
      Math.abs(prev.y - current.y) > 10 ||
      Math.abs(prev.width - current.width) > 10 ||
      Math.abs(prev.height - current.height) > 10
    );
  };

  useEffect(() => {
    const updateBlockPosition = () => {
      const now = performance.now();
      // Ограничиваем обновления до 1 раза в 500мс
      if (now - lastUpdateTimeRef.current < 500) return;
      lastUpdateTimeRef.current = now;

      if (blockRef.current && onPositionUpdate) {
        const rect = blockRef.current.getBoundingClientRect();
        const newPosition = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height
        };
        
        if (hasPositionChanged(prevPositionRef.current, newPosition)) {
          prevPositionRef.current = newPosition;
          onPositionUpdate(newPosition);
        }
      }
    };
    
    // Начальное обновление
    updateBlockPosition();
    
    // Используем только ResizeObserver с сильным throttle
    const resizeObserver = new ResizeObserver(() => {
      if (updateTimeoutRef.current) {
        window.cancelAnimationFrame(updateTimeoutRef.current);
      }
      updateTimeoutRef.current = window.requestAnimationFrame(updateBlockPosition);
    });
    
    if (blockRef.current) {
      resizeObserver.observe(blockRef.current);
    }
    
    return () => {
      resizeObserver.disconnect();
      if (updateTimeoutRef.current) {
        window.cancelAnimationFrame(updateTimeoutRef.current);
      }
    };
  }, [blockRef, onPositionUpdate]);

  return (
    <motion.div 
      ref={blockRef}
      className="dirt-block-container"
      whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
      transition={{ 
        type: "tween", // Используем более легкую анимацию
        duration: 0.1,
        ease: "easeOut"
      }}
      onClick={onBlockClick}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        transform: 'translate3d(0,0,0)', // Включаем аппаратное ускорение
        backfaceVisibility: 'hidden',
        perspective: 1000,
        willChange: 'transform'
      }}
    >
      <img 
        src={dirtImage} 
        alt="Dirt Block" 
        draggable="false" 
        onContextMenu={(e) => e.preventDefault()}
        style={{
          transform: 'translate3d(0,0,0)',
          backfaceVisibility: 'hidden',
          perspective: 1000,
          willChange: 'transform'
        }}
      />
    </motion.div>
  );
};

// Мемоизируем компонент для предотвращения лишних ререндеров
export const DirtBlock = memo(DirtBlockComponent, (prev, next) => {
  // Дополнительная проверка для предотвращения ненужных ререндеров
  return prev.blockRef === next.blockRef;
});