import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useSound } from '../../hooks/useSound';

// --- STYLED COMPONENTS ---

const TransitionContainer = styled(motion.div)`
  width: 100%;
  position: relative;
`;

const ShutterOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10000;
  pointer-events: none;
  display: flex;
`;

const ShutterColumn = styled(motion.div)`
  flex: 1;
  height: 100%;
  background: #050505;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;

  /* Subtle highlight line */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: #FF6B35;
    box-shadow: 0 0 10px #FF6B35;
  }
`;

const PageNameOverlay = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10001;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const PageTitle = styled(motion.h2)`
  font-family: 'Oswald', sans-serif;
  font-size: 5rem;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 5px;
  margin: 0;
`;

const LoadingText = styled(motion.div)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: #FF6B35;
  margin-top: 1rem;
  letter-spacing: 3px;
`;

// --- ANIMATION VARIANTS ---

const columnVariants = {
  initial: ({ isFirstMount }) => ({
    scaleY: isFirstMount ? 0 : 1,
    transformOrigin: 'bottom'
  }),
  animate: ({ i }) => ({
    scaleY: 0,
    transition: {
      duration: 0.8,
      ease: [0.76, 0, 0.24, 1],
      delay: i * 0.05
    }
  }),
  exit: ({ i }) => ({
    scaleY: 1,
    transformOrigin: 'top',
    transition: {
      duration: 0.8,
      ease: [0.76, 0, 0.24, 1],
      delay: i * 0.05
    }
  })
};

// ... (textVariants stays same or updated if needed, keeping simple)

export function PageTransition({ children }) {
  const location = useLocation();
  const { playHover } = useSound();
  const isFirstMount = React.useRef(true);

  useEffect(() => {
    isFirstMount.current = false;
  }, []);

  useEffect(() => {
    // Only play sound on navigation, not initial load
    if (!isFirstMount.current) {
      playHover();
    }
  }, [location.pathname, playHover]);

  const pageName = location.pathname === '/' ? 'HOME'
    : location.pathname.includes('/work') ? 'PROJECT'
      : location.pathname.replace('/', '');

  return (
    <AnimatePresence mode="wait">
      <TransitionContainer key={location.pathname}>
        {/* SHUTTER OVERLAY */}
        <ShutterOverlay>
          {[0, 1, 2, 3, 4].map((i) => (
            <ShutterColumn
              key={i}
              custom={{ i, isFirstMount: isFirstMount.current }}
              variants={columnVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            />
          ))}
        </ShutterOverlay>

        {/* LOADING TEXT - Hide on first mount */}
        {!isFirstMount.current && (
          <PageNameOverlay
            variants={textVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <PageTitle>{pageName}</PageTitle>
            <LoadingText>INITIALIZING /// </LoadingText>
          </PageNameOverlay>
        )}

        {/* PAGE CONTENT */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </TransitionContainer>
    </AnimatePresence>
  );
}

// Keeping SlideTransition export to avoid breaking existing imports if any
export function SlideTransition({ children }) {
  return <PageTransition>{children}</PageTransition>;
}
