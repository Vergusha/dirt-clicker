import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import endermanDefaultImage from '../../assets/enderman_default.webp';
import endermanImage from '../../assets/enderman.webp';
import teleportSound from '../../audio/tp-enderman.mp3';

/**
 * Component for displaying Enderman animations when the player has Friendly Endermen
 */
export const EndermanAnimation: React.FC = () => {
  // Get the game state including the enderman sound settings
  const { 
    friendlyEndermanCount, 
    soundEffectsEnabled, 
    endermanSoundsEnabled,
    endermanSoundsVolume
  } = useGameStore();
  
  // Define the states for the animation cycle
  type EndermanState = 'hidden' | 'default' | 'enderman';
  
  // Current state of the Enderman
  const [currentState, setCurrentState] = useState<EndermanState>('hidden');
  
  // Track which image was shown last to determine which one to show next
  const [lastShownImage, setLastShownImage] = useState<'default' | 'enderman'>('default');
  
  // Reference to the audio element for teleport sound
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Time for each state (in milliseconds)
  const stateDuration = 5000; // 5 seconds

  // Animation parameters for subtle movement
  const [animationDuration, setAnimationDuration] = useState(4.0);
  
  // Update animation duration based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) {
        // Mobile devices
        setAnimationDuration(4.2);
      } else if (window.innerWidth <= 768) {
        // Tablets
        setAnimationDuration(4.0);
      } else {
        // Desktop
        setAnimationDuration(3.8);
      }
    };
    
    // Initial setup
    handleResize();
    
    // Listen for window resize events
    window.addEventListener('resize', handleResize);
    
    // Cleanup listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(teleportSound);
    
    // Set initial volume based on settings
    if (audioRef.current) {
      audioRef.current.volume = endermanSoundsVolume;
    }
    
    // Cleanup when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Update audio volume when settings change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = endermanSoundsVolume;
    }
  }, [endermanSoundsVolume]);

  // Play teleport sound
  const playTeleportSound = () => {
    // Only play sound if sound effects and enderman sounds are enabled
    if (audioRef.current && soundEffectsEnabled && endermanSoundsEnabled) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.error('Error playing teleport sound:', err));
    }
  };

  // Set up the animation cycle when the player has Friendly Endermen
  useEffect(() => {
    // Only run the animation if the player has at least one Friendly Enderman
    if (friendlyEndermanCount <= 0) {
      setCurrentState('hidden');
      return;
    }
    
    // Start with the default enderman state
    setCurrentState('default');
    setLastShownImage('default');
    playTeleportSound();
    
    // Set up the interval for cycling through states
    const interval = setInterval(() => {
      setCurrentState(prevState => {
        // Play the teleport sound on every transition
        playTeleportSound();
        
        // Handle state transitions
        if (prevState === 'hidden') {
          // If coming from hidden state, show the opposite of last shown image
          const nextState = lastShownImage === 'default' ? 'enderman' : 'default';
          setLastShownImage(nextState);
          return nextState;
        } else {
          // If currently showing an image, go back to hidden
          return 'hidden';
        }
      });
    }, stateDuration);
    
    // Clear the interval when component unmounts or when friendlyEndermanCount changes
    return () => clearInterval(interval);
  }, [friendlyEndermanCount, soundEffectsEnabled, endermanSoundsEnabled]);

  // Don't render anything if player doesn't have any Friendly Endermen
  if (friendlyEndermanCount <= 0) {
    return null;
  }

  return (
    <div className="enderman-container">
      <AnimatePresence>
        {currentState !== 'hidden' && (
          <motion.div
            className="enderman-animation"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.3 }}
          >
            <motion.img 
              src={currentState === 'default' ? endermanDefaultImage : endermanImage} 
              alt="Enderman"
              className="enderman-image"
              animate={{
                y: [0, -7, 0, -4, 0], // Небольшое движение вверх-вниз
                rotate: [0, 2, 0, -2, 0], // Легкое покачивание
                scale: [1, 1.03, 1, 1.02, 1], // Легкое изменение размера
              }}
              transition={{
                duration: animationDuration,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};