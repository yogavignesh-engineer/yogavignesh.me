import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const scanAnimation = keyframes`
  0% { transform: translateY(-100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(100%); opacity: 0; }
`;

const Wrapper = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 20;
  /* PERFORMANCE: Removed mix-blend-mode (causes full-page repaints) */
`;

const Track = styled.div`
  width: 1px;
  height: 60px;
  background: rgba(17, 17, 17, 0.3);
  position: relative;
  overflow: hidden;
`;

const ScanLine = styled.div`
  width: 100%;
  height: 50%;
  background: #111;
  animation: ${scanAnimation} 2s cubic-bezier(0.76, 0, 0.24, 1) infinite;
`;

const Label = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: #111;
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0.8;
`;

const ScrollGuide = () => {
  return (
    <Wrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.5, duration: 1 }}
    >
      <Track>
        <ScanLine />
      </Track>
      <Label>SCROLL</Label>
    </Wrapper>
  );
};

export default ScrollGuide;