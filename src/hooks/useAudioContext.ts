import { useEffect, useRef } from 'react';

class AudioContextManager {
  private static instance: AudioContextManager;
  private context: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private buffers: Map<string, AudioBuffer> = new Map();
  private sources: Map<string, AudioBufferSourceNode> = new Map();
  private activeSourcesCount: number = 0;
  private readonly MAX_CONCURRENT_SOURCES = 8;

  private constructor() {}

  static getInstance(): AudioContextManager {
    if (!AudioContextManager.instance) {
      AudioContextManager.instance = new AudioContextManager();
    }
    return AudioContextManager.instance;
  }

  async initialize() {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)({
        latencyHint: 'playback',
        sampleRate: 44100
      });
      this.gainNode = this.context.createGain();
      this.gainNode.connect(this.context.destination);
    }
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  async loadSound(url: string): Promise<void> {
    if (!this.context || this.buffers.has(url)) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      this.buffers.set(url, audioBuffer);
    } catch (error) {
      console.warn('Failed to load sound:', url);
    }
  }

  playSound(url: string, volume: number = 1) {
    if (!this.context || !this.gainNode || !this.buffers.has(url)) return;
    
    // Ограничиваем количество одновременных источников
    if (this.activeSourcesCount >= this.MAX_CONCURRENT_SOURCES) {
      const oldestSource = this.sources.values().next().value;
      if (oldestSource) {
        oldestSource.stop();
        oldestSource.disconnect();
        this.sources.delete(url);
        this.activeSourcesCount--;
      }
    }

    const source = this.context.createBufferSource();
    source.buffer = this.buffers.get(url)!;
    
    const sourceGain = this.context.createGain();
    sourceGain.gain.value = volume;
    
    source.connect(sourceGain);
    sourceGain.connect(this.gainNode);
    
    source.start(0);
    this.sources.set(url, source);
    this.activeSourcesCount++;
    
    source.onended = () => {
      sourceGain.disconnect();
      source.disconnect();
      this.sources.delete(url);
      this.activeSourcesCount--;
    };
  }

  setMasterVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(volume, this.context?.currentTime || 0);
    }
  }

  stopAll() {
    this.sources.forEach(source => {
      try {
        source.stop();
        source.disconnect();
      } catch (e) {
        // Ignore errors from already stopped sources
      }
    });
    this.sources.clear();
    this.activeSourcesCount = 0;
  }

  suspend() {
    if (this.context?.state === 'running') {
      this.stopAll();
      this.context?.suspend();
    }
  }

  resume() {
    if (this.context?.state === 'suspended') {
      this.context?.resume();
    }
  }
}

export const useAudioContext = () => {
  const managerRef = useRef<AudioContextManager>(AudioContextManager.getInstance());

  useEffect(() => {
    return () => {
      managerRef.current.stopAll();
    };
  }, []);

  return managerRef.current;
}; 