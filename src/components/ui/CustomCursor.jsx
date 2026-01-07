import React, { useEffect, useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * CUSTOM CURSOR (PERFORMANCE OPTIMIZED)
 * 
 * OPTIMIZATIONS:
 * - Passive event listeners
 * - RAF throttling for hover detection
 * - GPU acceleration
 * - Reduced re-renders
 * - Visible across ALL sections
 */

const CursorWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  pointer-events: none;
  mix-blend-mode: difference;
`;

const MainCursor = styled(motion.div)`
  width: 12px;
  height: 12px;
  background-color: #FF6B35;
  border-radius: 50%;
  position: fixed;
  top: 0;
  left: 0;
  will-change: transform;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
`;

const CustomCursor = React.memo(() => {
  const [isVisible, setIsVisible] = useState(true);

  // Mouse position values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Optimized spring config for smooth following
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const moveCursor = useCallback((e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
    if (!isVisible) setIsVisible(true);
  }, [mouseX, mouseY, isVisible]);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    // Passive listeners for better scroll performance
    window.addEventListener('mousemove', moveCursor, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [moveCursor, handleMouseLeave, handleMouseEnter]);

  if (!isVisible) return null;

  return (
    <CursorWrapper>
      <MainCursor
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%'
        }}
      />
    </CursorWrapper>
  );
});

CustomCursor.displayName = 'CustomCursor';

export default CustomCursor;