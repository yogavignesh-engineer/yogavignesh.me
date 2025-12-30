import { useEffect, useState, useCallback, useMemo } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

export const useMouseParallax = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    
    const handleChange = (e) => setIsActive(e.matches);
    handleChange(mediaQuery);
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // ✅ OPTIMIZED: Throttled mouse handler with RAF
  useEffect(() => {
    if (!isActive) return;

    let rafId = null;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Cancel previous frame
      if (rafId !== null) return;

      // Throttle to next animation frame
      rafId = requestAnimationFrame(() => {
        const { innerWidth, innerHeight } = window;
        x.set((mouseX / innerWidth) - 0.5);
        y.set((mouseY / innerHeight) - 0.5);
        rafId = null;
      });
    };

    // ✅ CRITICAL: Passive listener for scroll performance
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isActive, x, y]);

  // PERFORMANCE: Memoize spring config to prevent recreation
  const springConfig = useMemo(() => ({ 
    damping: 25, 
    stiffness: 80,
    mass: 0.3,
    restSpeed: 0.001,
    restDelta: 0.001
  }), []);
  
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);
  
  // PERFORMANCE: Memoize return object to prevent consumer re-renders
  return useMemo(() => ({ xSpring, ySpring }), [xSpring, ySpring]);
};