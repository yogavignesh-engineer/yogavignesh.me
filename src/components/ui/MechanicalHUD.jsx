import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

/**
 * MECHANICAL HUD OVERLAY (PERFORMANCE OPTIMIZED)
 * 
 * OPTIMIZATIONS:
 * - Passive event listeners for scroll performance
 * - Throttled coordinate updates (60fps max)
 * - GPU acceleration with transform3d
 * - Reduced re-renders with useCallback/useMemo
 * - Lazy window size updates
 */

const HUDContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  pointer-events: none;
  overflow: hidden;
  contain: layout style;
`;

// SVG Grid overlay with GPU hints
const GridOverlay = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  will-change: opacity;
`;

const GridLine = styled(motion.line)`
  stroke: rgba(255, 107, 53, 0.3);
  stroke-width: 1;
  stroke-dasharray: 8, 8;
`;

// Crosshair with GPU acceleration
const CrosshairContainer = styled(motion.div)`
  position: fixed;
  pointer-events: none;
  z-index: 10000;
  will-change: transform;
  transform: translate3d(0, 0, 0);
`;

const CrosshairSVG = styled.svg`
  width: 60px;
  height: 60px;
  transform: translate(-50%, -50%);
`;

const CrosshairCircle = styled.circle`
  fill: none;
  stroke: #FF6B35;
  stroke-width: 1.5;
`;

const CrosshairLine = styled.line`
  stroke: #FF6B35;
  stroke-width: 1;
`;

const CrosshairDot = styled.circle`
  fill: #FF6B35;
`;

// Coordinate display
const CoordinateDisplay = styled(motion.div)`
  position: absolute;
  top: 35px;
  left: 35px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: #FF6B35;
  white-space: nowrap;
  text-shadow: 0 0 5px rgba(255, 107, 53, 0.5);
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 8px;
  border: 1px solid rgba(255, 107, 53, 0.3);
  border-radius: 2px;
`;

// Corner brackets (static - no re-renders)
const CornerBracket = styled.div`
  position: fixed;
  width: 30px;
  height: 30px;
  border: 1px solid rgba(255, 107, 53, 0.3);
  pointer-events: none;
  
  &.top-left { top: 20px; left: 20px; border-right: none; border-bottom: none; }
  &.top-right { top: 20px; right: 20px; border-left: none; border-bottom: none; }
  &.bottom-left { bottom: 20px; left: 20px; border-right: none; border-top: none; }
  &.bottom-right { bottom: 20px; right: 20px; border-left: none; border-top: none; }
`;

// Status indicator
const StatusIndicator = styled(motion.div)`
  position: fixed;
  bottom: 25px;
  left: 60px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: rgba(255, 107, 53, 0.6);
  letter-spacing: 2px;
  text-transform: uppercase;
`;

// Memoized static corner brackets
const CornerBrackets = React.memo(() => (
  <>
    <CornerBracket className="top-left" />
    <CornerBracket className="top-right" />
    <CornerBracket className="bottom-left" />
    <CornerBracket className="bottom-right" />
  </>
));
CornerBrackets.displayName = 'CornerBrackets';

const MechanicalHUD = () => {
  const [isActive, setIsActive] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef(null);
  const rafRef = useRef(null);
  const lastUpdateRef = useRef(0);

  // Raw mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Optimized spring configs (lighter for better performance)
  const springConfig = useMemo(() => ({ stiffness: 150, damping: 20, mass: 0.5 }), []);
  const crosshairX = useSpring(mouseX, springConfig);
  const crosshairY = useSpring(mouseY, springConfig);

  // Grid uses same spring (removed duplicate)
  const gridX = crosshairX;
  const gridY = crosshairY;

  // Throttled window resize
  const updateWindowSize = useCallback(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  // Optimized mouse move with RAF throttling
  const handleMouseMove = useCallback((e) => {
    // Cancel any pending RAF
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Throttle isActive state updates
      const now = Date.now();
      if (now - lastUpdateRef.current > 100) {
        setIsActive(true);
        lastUpdateRef.current = now;
      }

      // Reset inactivity timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setIsActive(false);
      }, 2000);
    });
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    setIsActive(false);
  }, []);

  useEffect(() => {
    updateWindowSize();

    // Passive listeners for better scroll performance
    window.addEventListener('resize', updateWindowSize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', updateWindowSize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateWindowSize, handleMouseMove, handleMouseLeave]);

  // Throttled coordinate display updates (every 50ms)
  useEffect(() => {
    let lastX = 0, lastY = 0;

    const updateCoords = () => {
      const x = Math.round(crosshairX.get());
      const y = Math.round(crosshairY.get());

      // Only update if changed significantly
      if (Math.abs(x - lastX) > 2 || Math.abs(y - lastY) > 2) {
        lastX = x;
        lastY = y;
        setCoords({ x, y });
      }
    };

    const interval = setInterval(updateCoords, 50);
    return () => clearInterval(interval);
  }, [crosshairX, crosshairY]);

  // Memoized opacity animations
  const statusOpacity = useMemo(() => ({ opacity: isActive ? 0.6 : 0.2 }), [isActive]);
  const crosshairOpacity = useMemo(() => ({ opacity: isActive ? 1 : 0.3 }), [isActive]);
  const coordOpacity = useMemo(() => ({ opacity: isActive ? 1 : 0 }), [isActive]);

  return (
    <HUDContainer>
      <CornerBrackets />

      <StatusIndicator
        animate={statusOpacity}
        transition={{ duration: 0.3 }}
      >
        {isActive ? '● TRACKING' : '○ STANDBY'}
      </StatusIndicator>

      <AnimatePresence>
        {isActive && (
          <GridOverlay>
            <GridLine
              x1="0" y1={gridY} x2={windowSize.width} y2={gridY}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <GridLine
              x1={gridX} y1="0" x2={gridX} y2={windowSize.height}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </GridOverlay>
        )}
      </AnimatePresence>

      <CrosshairContainer
        style={{ x: crosshairX, y: crosshairY }}
        animate={crosshairOpacity}
        transition={{ duration: 0.3 }}
      >
        <CrosshairSVG viewBox="0 0 60 60">
          <CrosshairCircle cx="30" cy="30" r="20" />
          <CrosshairDot cx="30" cy="30" r="3" />
          <CrosshairLine x1="30" y1="0" x2="30" y2="10" />
          <CrosshairLine x1="30" y1="50" x2="30" y2="60" />
          <CrosshairLine x1="0" y1="30" x2="10" y2="30" />
          <CrosshairLine x1="50" y1="30" x2="60" y2="30" />
        </CrosshairSVG>

        <CoordinateDisplay animate={coordOpacity} transition={{ duration: 0.2 }}>
          X: {coords.x.toString().padStart(4, '0')} | Y: {coords.y.toString().padStart(4, '0')}
        </CoordinateDisplay>
      </CrosshairContainer>
    </HUDContainer>
  );
};

export default React.memo(MechanicalHUD);
