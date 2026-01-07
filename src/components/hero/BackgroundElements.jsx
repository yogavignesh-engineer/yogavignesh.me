import React from 'react';
import styled from 'styled-components';
import { motion, useTransform } from 'framer-motion';
import { useIsMobile } from '../../hooks/useIsMobile';

// --- ASSETS ---
// PERFORMANCE: Memoized SVG component to prevent re-creation.
const GearIcon = React.memo((props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
  </svg>
));
GearIcon.displayName = 'GearIcon';

// --- STYLES ---
const GlowLayer = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(17,17,17,0.08) 0%, rgba(17,17,17,0) 60%);
  pointer-events: none;
  z-index: 5;
  will-change: transform;
  transform: translate3d(-50%, -50%, 0);
  backface-visibility: hidden;
  @media (max-width: 768px) { width: 500px; height: 500px; }
`;

const BackgroundLayer = styled.div`
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100vh;
  overflow: hidden; z-index: 0; pointer-events: none;
`;

const GearWrapper = styled(motion.div)`
  position: absolute;
  width: 45vw; height: 45vw;
  opacity: 0.15; color: #222;
  will-change: transform;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: -20px;
    background: radial-gradient(circle, rgba(17,17,17,0.3) 0%, transparent 70%);
    z-index: -1;
    pointer-events: none;
    filter: blur(40px);
    transform: translateZ(0);
  }
  
  @media (max-width: 768px) { width: 60vw; height: 60vw; }
`;

const SpinningInner = styled(motion.div)`
  width: 100%; height: 100%; 
  will-change: transform;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
`;

// --- MOBILE: Simple static gear (no animation) ---
const MobileStaticGear = styled.div`
  position: absolute;
  width: 50vw; height: 50vw;
  opacity: 0.08;
  color: #222;
  
  &.gear1 { top: -10vw; left: -10vw; }
  &.gear2 { bottom: -12vw; right: -8vw; width: 55vw; height: 55vw; }
`;

const BackgroundElements = React.memo(({ xSpring, ySpring, animationReady = true }) => {
  const isMobile = useIsMobile();

  // CRITICAL: All hooks must be called before any conditional return
  // to satisfy React's Rules of Hooks
  const gear1X = useTransform(xSpring, [-0.5, 0.5], [-30, 30]);
  const gear1Y = useTransform(ySpring, [-0.5, 0.5], [-30, 30]);
  const gear2X = useTransform(xSpring, [-0.5, 0.5], [30, -30]);
  const gear2Y = useTransform(ySpring, [-0.5, 0.5], [30, -30]);
  const glowX = useTransform(xSpring, [-0.5, 0.5], [-100, 100]);
  const glowY = useTransform(ySpring, [-0.5, 0.5], [-100, 100]);

  // MOBILE: Render simplified static version (no animations, no parallax)
  if (isMobile) {
    return (
      <BackgroundLayer>
        <MobileStaticGear className="gear1">
          <GearIcon />
        </MobileStaticGear>
        <MobileStaticGear className="gear2">
          <GearIcon />
        </MobileStaticGear>
      </BackgroundLayer>
    );
  }

  // DESKTOP: Full animated version with parallax
  // Animations only start when animationReady is true (after loader completes)

  return (
    <>
      <GlowLayer
        style={{ x: glowX, y: glowY, transform: 'translate(-50%, -50%)' }}
        initial={{ opacity: 0, scale: 0 }}
        animate={animationReady ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.1 } }}
      />
      <BackgroundLayer>
        {/* GEAR 1 - Dramatic entrance from top-left with rotation */}
        <GearWrapper
          style={{ x: gear1X, y: gear1Y, top: '-12vw', left: '-12vw' }}
          initial={{
            opacity: 0,
            scale: 0.3,
            rotate: -180,
            x: -400,
            y: -400,
            filter: 'blur(20px)'
          }}
          animate={animationReady ? {
            opacity: 0.15,
            scale: 1,
            rotate: 0,
            x: 0,
            y: 0,
            filter: 'blur(0px)'
          } : {
            opacity: 0,
            scale: 0.3,
            rotate: -180,
            x: -400,
            y: -400,
            filter: 'blur(20px)'
          }}
          transition={{
            duration: 1.4,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
            opacity: { duration: 1.0, delay: 0.2 },
            scale: { duration: 1.4, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] },
            rotate: { duration: 1.4, delay: 0.2, ease: [0.87, 0, 0.13, 1] },
            x: { duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
            y: { duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
            filter: { duration: 1.0, delay: 0.2 }
          }}
          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.5 } }}
        >
          <SpinningInner
            initial={{ rotate: -180 }}
            animate={animationReady ? { rotate: 360 } : { rotate: -180 }}
            transition={{
              rotate: { repeat: Infinity, duration: 40, ease: "linear" }
            }}
          >
            <GearIcon />
          </SpinningInner>
        </GearWrapper>

        {/* GEAR 2 - Explosive entrance from bottom-right with bounce */}
        <GearWrapper
          style={{ x: gear2X, y: gear2Y, bottom: '-15vw', right: '-10vw', width: '55vw', height: '55vw' }}
          initial={{
            opacity: 0,
            scale: 0.2,
            rotate: 270,
            x: 500,
            y: 500,
            filter: 'blur(30px)'
          }}
          animate={animationReady ? {
            opacity: 0.15,
            scale: 1,
            rotate: 0,
            x: 0,
            y: 0,
            filter: 'blur(0px)'
          } : {
            opacity: 0,
            scale: 0.2,
            rotate: 270,
            x: 500,
            y: 500,
            filter: 'blur(30px)'
          }}
          transition={{
            duration: 1.6,
            delay: 0.4,
            ease: [0.16, 1, 0.3, 1],
            opacity: { duration: 1.2, delay: 0.4 },
            scale: {
              duration: 1.6,
              delay: 0.4,
              ease: [0.34, 1.56, 0.64, 1]
            },
            rotate: {
              duration: 1.6,
              delay: 0.4,
              ease: [0.87, 0, 0.13, 1]
            },
            x: { duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] },
            y: { duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] },
            filter: { duration: 1.2, delay: 0.4 }
          }}
          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.5, delay: 0.1 } }}
        >
          <SpinningInner
            initial={{ rotate: 270 }}
            animate={animationReady ? { rotate: -360 } : { rotate: 270 }}
            transition={{
              rotate: { repeat: Infinity, duration: 45, ease: "linear" }
            }}
          >
            <GearIcon />
          </SpinningInner>
        </GearWrapper>
      </BackgroundLayer>
    </>
  );
});

BackgroundElements.displayName = 'BackgroundElements';

export default BackgroundElements;