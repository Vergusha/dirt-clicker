import { RefObject } from 'react';
import { motion } from 'framer-motion';
import dirtImage from '../../assets/dirt.webp';
import { useGameStore } from '../../store/gameStore';

interface DirtBlockProps {
  blockRef: RefObject<HTMLDivElement>;
  onBlockClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * Component representing the clickable dirt block
 */
export const DirtBlock: React.FC<DirtBlockProps> = ({ blockRef, onBlockClick }) => {
  return (
    <motion.div 
      ref={blockRef}
      className="dirt-block-container"
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