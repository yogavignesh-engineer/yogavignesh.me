import { useCallback, useRef, useEffect } from 'react';

/**
 * Enhanced Sound System for Award-Winning Portfolio
 * 
 * Features:
 * - Spatial audio (stereo panning based on position)
 * - Volume control and fading
 * - Sound preloading for performance
 * - Multiple sound variants
 * - Polyphony (multiple sounds at once)
 * - Web Audio API for advanced effects
 */

// Sound library configuration
const SOUNDS = {
  // UI Interactions
  hover: {
    src: '/sounds/hover.mp3',
    volume: 0.3,
    variants: [
      '/sounds/hover-soft.mp3',
      '/sounds/hover-click.mp3'
    ]
  },
  click: {
    src: '/sounds/click.mp3',
    volume: 0.4,
    variants: [
      '/sounds/click-mechanical.mp3',
      '/sounds/click-confirm.mp3'
    ]
  },
  
  // Mechanical Sounds
  gearRotate: {
    src: '/sounds/gear-rotate.mp3',
    volume: 0.2,
    loop: true
  },
  pistonMove: {
    src: '/sounds/piston-move.mp3',
    volume: 0.35
  },
  metalClick: {
    src: '/sounds/metal-click.mp3',
    volume: 0.4
  },
  
  // Transitions
  whoosh: {
    src: '/sounds/whoosh.mp3',
    volume: 0.3
  },
  wipe: {
    src: '/sounds/wipe.mp3',
    volume: 0.25
  },
  
  // Ambient
  ambient: {
    src: '/sounds/ambient-tech.mp3',
    volume: 0.15,
    loop: true
  },
  
  // Notifications
  success: {
    src: '/sounds/success.mp3',
    volume: 0.4
  },
  error: {
    src: '/sounds/error.mp3',
    volume: 0.35
  },
  notification: {
    src: '/sounds/notification.mp3',
    volume: 0.3
  }
};

// Fallback sounds (use beep/silent if files don't exist)
const createFallbackSound = (frequency = 440, duration = 0.1) => {
  if (typeof window === 'undefined' || !window.AudioContext) return null;
  
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  return { oscillator, gainNode, duration, audioContext };
};

class SoundManager {
  constructor() {
    this.sounds = new Map();
    this.audioContext = null;
    this.masterVolume = 1.0;
    this.muted = false;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    
    // Initialize Web Audio API
    if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Preload sounds
    await this.preloadSounds();
    this.initialized = true;
  }

  async preloadSounds() {
    const soundPromises = Object.entries(SOUNDS).map(async ([key, config]) => {
      try {
        const audio = new Audio();
        
        // Try main source
        audio.src = config.src;
        audio.volume = (config.volume || 0.5) * this.masterVolume;
        audio.loop = config.loop || false;
        audio.preload = 'auto';
        
        // Wait for can play
        await new Promise((resolve, reject) => {
          audio.addEventListener('canplaythrough', resolve, { once: true });
          audio.addEventListener('error', reject, { once: true });
          audio.load();
        });
        
        this.sounds.set(key, {
          audio,
          config,
          playing: false
        });
      } catch (error) {
        // Fallback: create silent placeholder
        console.warn(`Failed to load sound: ${key}, using fallback`);
        this.sounds.set(key, {
          audio: null,
          config,
          playing: false,
          fallback: true
        });
      }
    });
    
    await Promise.allSettled(soundPromises);
  }

  play(soundName, options = {}) {
    if (this.muted) return;
    
    const sound = this.sounds.get(soundName);
    if (!sound) {
      console.warn(`Sound not found: ${soundName}`);
      return;
    }

    // Use fallback beep if audio failed to load
    if (sound.fallback) {
      const beep = createFallbackSound(440, 0.1);
      if (beep) {
        beep.oscillator.start();
        beep.oscillator.stop(beep.audioContext.currentTime + beep.duration);
      }
      return;
    }

    const { audio } = sound;
    if (!audio) return;

    // Clone audio for polyphony (multiple sounds at once)
    const instance = audio.cloneNode();
    
    // Apply options
    instance.volume = (sound.config.volume || 0.5) * this.masterVolume * (options.volume || 1);
    instance.playbackRate = options.playbackRate || 1;
    
    // Spatial audio (pan based on screen position)
    if (options.pan && this.audioContext) {
      const source = this.audioContext.createMediaElementSource(instance);
      const panner = this.audioContext.createStereoPanner();
      panner.pan.value = options.pan; // -1 (left) to 1 (right)
      source.connect(panner);
      panner.connect(this.audioContext.destination);
    }
    
    // Play
    const playPromise = instance.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // Autoplay policy: user interaction required
        if (error.name === 'NotAllowedError') {
          console.log('Audio autoplay prevented. User interaction required.');
        }
      });
    }
    
    // Cleanup after play
    if (!sound.config.loop) {
      instance.addEventListener('ended', () => {
        instance.remove();
      });
    }
    
    return instance;
  }

  stop(soundName) {
    const sound = this.sounds.get(soundName);
    if (!sound || !sound.audio) return;
    
    sound.audio.pause();
    sound.audio.currentTime = 0;
  }

  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    
    // Update all sounds
    this.sounds.forEach(sound => {
      if (sound.audio) {
        sound.audio.volume = (sound.config.volume || 0.5) * this.masterVolume;
      }
    });
  }

  mute() {
    this.muted = true;
    this.sounds.forEach(sound => {
      if (sound.audio) {
        sound.audio.pause();
      }
    });
  }

  unmute() {
    this.muted = false;
  }

  toggleMute() {
    this.muted ? this.unmute() : this.mute();
    return this.muted;
  }
}

// Singleton instance
let soundManager = null;

const getSoundManager = () => {
  if (!soundManager) {
    soundManager = new SoundManager();
  }
  return soundManager;
};

// --- REACT HOOK ---
export const useSoundEnhanced = () => {
  const managerRef = useRef(null);

  useEffect(() => {
    managerRef.current = getSoundManager();
    
    // Initialize on first user interaction
    const initOnInteraction = () => {
      managerRef.current.init();
      document.removeEventListener('click', initOnInteraction);
      document.removeEventListener('touchstart', initOnInteraction);
    };
    
    document.addEventListener('click', initOnInteraction, { once: true });
    document.addEventListener('touchstart', initOnInteraction, { once: true });
    
    return () => {
      document.removeEventListener('click', initOnInteraction);
      document.removeEventListener('touchstart', initOnInteraction);
    };
  }, []);

  // Play sound with optional spatial audio
  const playSound = useCallback((soundName, options = {}) => {
    managerRef.current?.play(soundName, options);
  }, []);

  // Convenience methods
  const playHover = useCallback((element) => {
    const options = {};
    
    // Calculate pan based on element position
    if (element) {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const pan = (centerX / window.innerWidth) * 2 - 1; // -1 to 1
      options.pan = pan;
    }
    
    playSound('hover', options);
  }, [playSound]);

  const playClick = useCallback((element) => {
    const options = {};
    
    if (element) {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const pan = (centerX / window.innerWidth) * 2 - 1;
      options.pan = pan;
    }
    
    playSound('click', options);
  }, [playSound]);

  const playWhoosh = useCallback(() => {
    playSound('whoosh', { volume: 0.8 });
  }, [playSound]);

  const playMechanical = useCallback(() => {
    playSound('metalClick', { playbackRate: 0.9 + Math.random() * 0.2 });
  }, [playSound]);

  const playSuccess = useCallback(() => {
    playSound('success');
  }, [playSound]);

  const playError = useCallback(() => {
    playSound('error');
  }, [playSound]);

  const setVolume = useCallback((volume) => {
    managerRef.current?.setMasterVolume(volume);
  }, []);

  const toggleMute = useCallback(() => {
    return managerRef.current?.toggleMute();
  }, []);

  const stopSound = useCallback((soundName) => {
    managerRef.current?.stop(soundName);
  }, []);

  return {
    playSound,
    playHover,
    playClick,
    playWhoosh,
    playMechanical,
    playSuccess,
    playError,
    setVolume,
    toggleMute,
    stopSound
  };
};

export default useSoundEnhanced;
