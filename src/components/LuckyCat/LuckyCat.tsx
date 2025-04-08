import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import catImage from '../../assets/cat.webp';
import { useEffect, useState, useCallback } from 'react';

/**
 * Component for displaying a Lucky Cat on screen when the player has the upgrade
 * Lucky Cat doubles random dirt drops and increases luck
 * Now supports manual position editing
 */
export const LuckyCat: React.FC = () => {
  const { luckyCatCount } = useGameStore();
  
  // Animation parameters
  const [animationDuration, setAnimationDuration] = useState(4.0);
  const [catSize, setCatSize] = useState(55);
  
  // Position state variables
  const [position, setPosition] = useState({ left: 20, bottom: 20 });
  const [isEditing, setIsEditing] = useState(false);
  
  // Temporary position while dragging
  const [dragPosition, setDragPosition] = useState({ left: 0, bottom: 0 });

  // Update responsive values based on screen size
  const updateResponsiveValues = useCallback(() => {
    if (window.innerWidth <= 480) {
      // Mobile devices
      setAnimationDuration(4.2);
      setCatSize(45);
    } else if (window.innerWidth <= 768) {
      // Tablets
      setAnimationDuration(4.0);
      setCatSize(50);
    } else {
      // Desktop
      setAnimationDuration(3.8);
      setCatSize(55);
    }
  }, []);

  // Listen for window resize events
  useEffect(() => {
    updateResponsiveValues();
    
    const handleResize = () => {
      updateResponsiveValues();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateResponsiveValues]);

  // Handle drag end (when using drag mode)
  const handleDragEnd = (event, info) => {
    // Convert the delta position to actual screen position
    const newLeft = position.left + info.offset.x;
    const newBottom = position.bottom - info.offset.y; // Y is inverted in screen coordinates
    
    setPosition({ 
      left: Math.max(0, newLeft), // Prevent cat from going off-screen
      bottom: Math.max(0, newBottom)
    });
  };

  // Don't render if no Lucky Cats
  if (luckyCatCount <= 0) return null;

  return (
    <>
      {/* Position controls - only show when editing */}
      {isEditing && (
        <div className="position-controls" style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: '5px',
          padding: '10px',
          color: 'white'
        }}>
          <h4>Edit Cat Position</h4>
          
          <div style={{ marginBottom: '10px' }}>
            <label>Left: </label>
            <input
              type="number"
              value={position.left}
              onChange={(e) => setPosition({...position, left: Number(e.target.value)})}
              style={{ width: '60px', marginRight: '5px' }}
            /> px
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label>Bottom: </label>
            <input
              type="number"
              value={position.bottom}
              onChange={(e) => setPosition({...position, bottom: Number(e.target.value)})}
              style={{ width: '60px', marginRight: '5px' }}
            /> px
          </div>
          
          <button onClick={() => setIsEditing(false)} style={{
            backgroundColor: '#4CAF50',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '3px',
            color: 'white',
            cursor: 'pointer'
          }}>
            Done
          </button>
        </div>
      )}
      
      <div 
        className="lucky-cat-container" 
        style={{ 
          position: 'absolute', 
          left: `${position.left}px`, 
          bottom: `${position.bottom}px`,
          zIndex: 7, // Higher than other elements
          cursor: isEditing ? 'move' : 'default'
        }}
        onDoubleClick={() => setIsEditing(true)} // Double click to enter edit mode
      >
        <motion.div
          className="lucky-cat"
          style={{
            pointerEvents: isEditing ? 'auto' : 'none',
          }}
          drag={isEditing} // Only enable drag when editing
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={1}
          onDragEnd={handleDragEnd}
        >
          <motion.img
            src={catImage}
            alt="Lucky Cat"
            className="lucky-cat-image"
            style={{
              width: `${catSize}px`,
              height: 'auto',
              filter: 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.6))' // Golden glow
            }}
            animate={{
              // Slow head nod animation with a paw-waving effect
              rotate: isEditing ? 0 : [0, 3, 0, -3, 0], // Disable animation when editing
              // Subtle scaling for "breathing" effect
              scale: isEditing ? 1 : [1, 1.03, 1], // Disable animation when editing
              // Golden luck glow pulsing
              filter: isEditing ? 
                'drop-shadow(0 0 5px rgba(255, 215, 0, 0.6))' : 
                [
                  'drop-shadow(0 0 5px rgba(255, 215, 0, 0.6))', 
                  'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))', 
                  'drop-shadow(0 0 5px rgba(255, 215, 0, 0.6))'
                ]
            }}
            transition={{
              duration: animationDuration,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
          
          {isEditing && (
            <div style={{
              position: 'absolute',
              bottom: '-20px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'white',
              fontSize: '12px',
              backgroundColor: 'rgba(0,0,0,0.7)',
              padding: '2px 5px',
              borderRadius: '3px'
            }}>
              Drag to position
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Toggle edit mode button */}
      {!isEditing && (
        <button 
          onClick={() => setIsEditing(true)} 
          style={{
            position: 'absolute',
            right: '10px',
            bottom: '10px',
            zIndex: 8,
            backgroundColor: '#2196F3',
            border: 'none',
            borderRadius: '3px',
            padding: '5px 10px',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Edit Cat Position
        </button>
      )}
    </>
  );
}