import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useAudioContext } from '../../hooks/useAudioContext';
import parrotSound1 from '../../audio/Parrot_idle1.ogg';
import parrotSound2 from '../../audio/Parrot_idle2.ogg';

const SOUND_THROTTLE = 2000; // 2 секунды между звуками
const SOUNDS = [parrotSound1, parrotSound2];

export const ParrotSoundPlayer: React.FC = () => {
  const { soundEnabled, soundVolume } = useGameStore();
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const [lastPlayTime, setLastPlayTime] = useState(0);
  const audioContext = useAudioContext();

  useEffect(() => {
    const handleInteraction = async () => {
      setIsUserInteracted(true);
      await audioContext.initialize();
      await Promise.all(SOUNDS.map(sound => audioContext.loadSound(sound)));
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  const playRandomParrotSound = () => {
    if (!soundEnabled || !isUserInteracted) return;

    const now = Date.now();
    if (now - lastPlayTime < SOUND_THROTTLE) return;

    const randomSound = SOUNDS[Math.floor(Math.random() * SOUNDS.length)];
    audioContext.playSound(randomSound, soundVolume);
    setLastPlayTime(now);
  };

  useEffect(() => {
    audioContext.setMasterVolume(soundVolume);
  }, [soundVolume]);

  return { playRandomParrotSound };
}; 