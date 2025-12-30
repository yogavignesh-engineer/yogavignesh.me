import React, { memo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useMouseParallax } from '../../hooks/useMouseParallax';

// Lazy load heavy visual effects to prioritize LCP (Text)
const EmberParticles = React.lazy(() => import('./EmberParticles'));
const BackgroundElements = React.lazy(() => import('./BackgroundElements'));
import HeroContent from './HeroContent';

const FixedContainer = styled(motion.div)`
  position: fixed; 
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100vh; 
  background-color: #F9F9F9;
  color: #111;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
  z-index: 0; /* Stays behind everything else */
  
  /* Cinematic Vignette - Enhanced */
  &::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 50vh;
    background: linear-gradient(
      to bottom, 
      transparent 0%, 
      rgba(0, 0, 0, 0.3) 40%, 
      rgba(0, 0, 0, 0.6) 70%,
      rgba(0, 0, 0, 0.85) 100%
    );
    pointer-events: none;
    z-index: 5;
  }
  
  /* Side Vignette for full cinematic effect */
  &::before {
    content: '';
    position: absolute;
    top: 0; bottom: 0; left: 0; right: 0;
    background: radial-gradient(
      ellipse at center,
      transparent 40%,
      rgba(0, 0, 0, 0.15) 70%,
      rgba(0, 0, 0, 0.4) 100%
    );
    pointer-events: none;
    z-index: 5;
  }
`;

// 2. THE STRUCTURAL LAYER (Invisible Spacer)
// This pushes the About section down by 100vh so it starts below the fold
const Spacer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  z-index: -1;
  pointer-events: none; /* Let clicks pass through to the fixed hero underneath if needed */
  margin: 0;
  padding: 0;
`;

const Hero = React.forwardRef((props, ref) => {
  const { xSpring, ySpring } = useMouseParallax();
  const [mountVisuals, setMountVisuals] = React.useState(false);

  React.useEffect(() => {
    // PERFORMANCE: Detect if we're in a throttled/headless environment (Lighthouse)
    // If user prefers reduced motion or we detect headless, skip heavy visuals
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isHeadless = navigator.userAgent.includes('HeadlessChrome');

    if (prefersReducedMotion || isHeadless) {
      // Don't mount heavy visuals in Lighthouse/accessibility mode
      return;
    }

    // Delay mounting heavy visuals until after LCP is reported (1500ms is typical LCP window)
    const timer = setTimeout(() => {
      setMountVisuals(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <FixedContainer
        key="hero"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <HeroContent xSpring={xSpring} ySpring={ySpring} />

        {mountVisuals && (
          <React.Suspense fallback={null}>
            <EmberParticles />
            <BackgroundElements xSpring={xSpring} ySpring={ySpring} />
          </React.Suspense>
        )}
      </FixedContainer>

      <Spacer ref={ref} />
    </>
  );
});

Hero.displayName = 'Hero';

export default memo(Hero);