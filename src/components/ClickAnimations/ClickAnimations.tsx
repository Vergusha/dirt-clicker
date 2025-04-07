import { motion, AnimatePresence } from 'framer-motion';
import dirtImage from '../../assets/dirt.webp';
import { ClickAnimation } from '../../types';
import { formatNumber } from '../../utils/formatNumber';

interface ClickAnimationsProps {
  animations: ClickAnimation[];
}

/**
 * Component displaying click and autoclick animations
 */
export const ClickAnimations: React.FC<ClickAnimationsProps> = ({ animations }) => {
  return (
    <div className="animations-container">
      <AnimatePresence>
        {animations.map(anim => (
          <motion.div
            key={anim.id}
            className="click-animation"
            style={{
              position: 'fixed',
              left: `${anim.x}px`,
              top: `${anim.y}px`,
              pointerEvents: 'none',
              zIndex: 60,
            }}
            initial={{ 
              opacity: 1,
              scale: 1,
              translateX: '-50%',
              translateY: '-50%'
            }}
            animate={{ 
              top: `${anim.y - 40}px`,
              opacity: 0,
              scale: 1.2
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src={dirtImage} 
              alt="" 
              className="mini-dirt"
            />
            <span className="click-power-text">+{formatNumber(anim.value)}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};