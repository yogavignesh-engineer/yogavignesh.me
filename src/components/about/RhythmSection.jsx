import React, { useRef, useMemo } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const Container = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 10vh 0;
`;

const HugeBgText = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  font-family: 'Oswald', sans-serif;
  font-size: 28vw;
  font-weight: 700;
  text-align: center;
  line-height: 0.8;
  color: #161616;
  z-index: 0;
  white-space: nowrap;
  
  /* GPU OPTIMIZATIONS */
  transform: translate(-50%, -50%);
  will-change: transform;
  backface-visibility: hidden;
  contain: layout style paint; // Isolate from DOM
`;

const SpinnerWrapper = styled(motion.div)`
  width: 300px;
  height: 300px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  
  /* GPU LAYER */
  will-change: transform;
  transform: translateZ(0);
  
  img {
    width: 180px;
    height: 240px;
    object-fit: cover;
    filter: grayscale(100%);
    border-radius: 4px;
  }
`;

const CircleText = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  
  /* GPU LAYER */
  will-change: transform;
  transform: translateZ(0);
  
  svg { 
    width: 100%; 
    height: 100%; 
    overflow: visible; 
  }
  path { fill: none; }
  text {
    fill: #EAEAEA;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
  }
`;

const RhythmSection = React.memo(() => {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const smoothRotate = useSpring(rotate, { 
    damping: 30,
    stiffness: 100,
    mass: 0.5
  });

  const yBg = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const smoothYBg = useSpring(yBg, { damping: 30, stiffness: 100 });

  const bgStyle = useMemo(() => ({
    y: smoothYBg,
    x: '-50%',
    translateY: '-50%'
  }), [smoothYBg]);

  // PERFORMANCE: use .webp
  const imageUrl = "/about-image-2.webp";

  return (
    <Container ref={ref}>
      <HugeBgText style={bgStyle}>
        RHYTHM<br/>& FLOW
      </HugeBgText>
      
      <SpinnerWrapper>
        <img src={imageUrl} alt="Detail" loading="lazy" />
        
        <CircleText style={{ rotate: smoothRotate }}>
           <svg viewBox="0 0 100 100">
             <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
             <text>
               <textPath href="#circlePath">
                 DEVELOPER • CREATIVE • ENGINEER • REACT • 
               </textPath>
             </text>
           </svg>
        </CircleText>
      </SpinnerWrapper>
    </Container>
  );
});

RhythmSection.displayName = 'RhythmSection';

export default RhythmSection;