import { useCallback } from 'react';

// Preload audio files
const sounds = {
  click: typeof Audio !== 'undefined' ? new Audio('/sounds/click.mp3') : null,
  hover: typeof Audio !== 'undefined' ? new Audio('/sounds/hover.mp3') : null
};

if (sounds.click) { sounds.click.volume = 0.4; sounds.click.load(); }
if (sounds.hover) { sounds.hover.volume = 0.15; sounds.hover.load(); }

export const useSound = () => {
  const playSound = useCallback((type) => {
    if (!sounds[type]) return;

    // Clone node for overlapping playback (polyphony)
    const clone = sounds[type].cloneNode();
    clone.volume = sounds[type].volume;

    // Pitch variation for more natural feel (optional, subtle)
    // clone.playbackRate = 0.95 + Math.random() * 0.1;

    clone.play().catch(() => {
      // Auto-play policy might block this
    });
  }, []);

  const playClick = useCallback(() => playSound('click'), [playSound]);
  const playHover = useCallback(() => playSound('hover'), [playSound]);

  return { playClick, playHover };
};