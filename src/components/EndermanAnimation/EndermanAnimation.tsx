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
  // Get the game state
  const { friendlyEndermanCount, soundEffectsEnabled } = useGameStore();
  
  // Define the states for the animation cycle
  type EndermanState = 'hidden' | 'default' | 'enderman';
  
  // Current state of the Enderman
  const [currentState, setCurrentState] = useState<EndermanState>('hidden');
  
  // Track which image was shown last to determine which one to show next
  const [lastShownImage, setLastShownImage] = useState<'default' | 'enderman'>('default');
  
  // Reference to the audio element for teleport sound
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Time for each state (in milliseconds)
  const stateDuration = 10000; // 10 seconds

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(teleportSound);
    audioRef.current.volume = 0.5; // Set default volume
    
    // Cleanup when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Play teleport sound
  const playTeleportSound = () => {
    if (audioRef.current && soundEffectsEnabled) {
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
  }, [friendlyEndermanCount, soundEffectsEnabled]);

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
            <img 
              src={currentState === 'default' ? endermanDefaultImage : endermanImage} 
              alt="Enderman"
              className="enderman-image"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};