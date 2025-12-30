import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CursorWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  pointer-events: none;
  mix-blend-mode: difference; /* Ensures visibility on light/dark backgrounds */
`;

const MainCursor = styled(motion.div)`
  width: 10px;
  height: 10px;
  background-color: #FF6B35;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
`;

const TrailingCursor = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 1px solid #FF6B35;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
  opacity: 0.6;
`;

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);

  // Mouse position values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for trailing effect
  const springConfig = { damping: 25, stiffness: 120 };
  const trailX = useSpring(mouseX, springConfig);
  const trailY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button') || e.target.getAttribute('role') === 'button') {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <CursorWrapper>
      <MainCursor
        style={{ x: mouseX, y: mouseY }}
        animate={{
          scale: isHovering ? 0 : 1, // Hide main dot on hover (optional style)
          opacity: isHovering ? 0 : 1
        }}
      />
      <TrailingCursor
        style={{ x: trailX, y: trailY }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? 'rgba(255, 107, 53, 0.1)' : 'transparent',
          borderColor: isHovering ? 'transparent' : '#FF6B35'
        }}
        transition={{ duration: 0.2 }}
      />
    </CursorWrapper>
  );
};

export default CustomCursor;