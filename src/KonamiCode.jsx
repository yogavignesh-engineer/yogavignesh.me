import { useEffect, useState } from 'react';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export default function KonamiCode() {
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeys(prev => {
        const newKeys = [...prev, e.key];
        if (newKeys.length > KONAMI.length) {
          return newKeys.slice(newKeys.length - KONAMI.length);
        }
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (keys.join(',') === KONAMI.join(',')) {
      // ACTIVATE WIREFRAME MODE
      document.body.classList.toggle('debug-mode');
      
      // Play sound effect
      const audio = new Audio('/sounds/click.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
      
      console.log("GOD MODE ACTIVATED");
      setKeys([]); // Reset keys
    }
  }, [keys]);

  return null;
}