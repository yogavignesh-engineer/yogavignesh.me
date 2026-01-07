import React, { createContext, useContext, useRef, useEffect, useState, useCallback } from 'react';
import { Howl, Howler } from 'howler';

// Sound Context
const SoundContext = createContext({
    playHover: () => { },
    playClick: () => { },
    playSuccess: () => { },
    toggleAmbient: () => { },
    setVolume: () => { },
    isAmbientPlaying: false,
    isSoundEnabled: true,
    toggleSound: () => { }
});

export const useSound = () => useContext(SoundContext);

// Generate sounds programmatically using Web Audio API
const createOscillatorSound = (frequency, duration, type = 'sine') => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
};

export const SoundProvider = ({ children }) => {
    const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);
    const [volume, setVolume] = useState(0.3);
    const audioContextRef = useRef(null);

    useEffect(() => {
        // Set global volume
        Howler.volume(volume);

        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [volume]);

    const getAudioContext = useCallback(() => {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
        return audioContextRef.current;
    }, []);

    const playHover = useCallback(() => {
        if (!isSoundEnabled) return;

        try {
            const ctx = getAudioContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(1200, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);

            gainNode.gain.setValueAtTime(0.05 * volume, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.08);
        } catch (e) {
            // Silently fail if audio isn't available
        }
    }, [isSoundEnabled, volume, getAudioContext]);

    const playClick = useCallback(() => {
        if (!isSoundEnabled) return;

        try {
            const ctx = getAudioContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(150, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.08 * volume, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.12);
        } catch (e) {
            // Silently fail
        }
    }, [isSoundEnabled, volume, getAudioContext]);

    const playSuccess = useCallback(() => {
        if (!isSoundEnabled) return;

        try {
            const ctx = getAudioContext();
            const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5

            frequencies.forEach((freq, i) => {
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                oscillator.type = 'sine';
                oscillator.frequency.value = freq;

                const startTime = ctx.currentTime + i * 0.1;
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(0.1 * volume, startTime + 0.02);
                gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

                oscillator.start(startTime);
                oscillator.stop(startTime + 0.3);
            });
        } catch (e) {
            // Silently fail
        }
    }, [isSoundEnabled, volume, getAudioContext]);

    const toggleAmbient = useCallback(() => {
        setIsAmbientPlaying(prev => !prev);
        // Ambient audio would be implemented with actual audio files
    }, []);

    const toggleSound = useCallback(() => {
        setIsSoundEnabled(prev => !prev);
    }, []);

    return (
        <SoundContext.Provider value={{
            playHover,
            playClick,
            playSuccess,
            toggleAmbient,
            setVolume,
            isAmbientPlaying,
            isSoundEnabled,
            toggleSound
        }}>
            {children}
        </SoundContext.Provider>
    );
};

// Sound Toggle Button Component
const SoundToggle = () => {
    const { isSoundEnabled, toggleSound } = useSound();

    return (
        <button
            onClick={toggleSound}
            style={{
                position: 'fixed',
                bottom: '20px',
                left: '20px',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(10, 10, 10, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: isSoundEnabled ? '#66FCF1' : 'rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                zIndex: 9999,
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
            }}
            aria-label={isSoundEnabled ? 'Disable sound' : 'Enable sound'}
        >
            {isSoundEnabled ? '🔊' : '🔇'}
        </button>
    );
};

export { SoundToggle };
export default SoundProvider;
