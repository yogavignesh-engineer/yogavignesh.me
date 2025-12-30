import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
  useInView
} from "framer-motion";
import styled from "styled-components";

const Wrapper = styled.div`
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
`;

const Scroller = styled(motion.div)`
  display: flex;
  white-space: nowrap;
  font-family: 'Oswald', sans-serif;
  font-size: 8vw;
  font-weight: 700;
  text-transform: uppercase;
  color: #333;
  line-height: 0.8;
  
  /* GPU ACCELERATION */
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
  
  span {
    display: block;
    margin-right: 3rem;
  }

  @media (max-width: 768px) {
    font-size: 15vw;
  }
`;

const VelocityText = React.memo(({ baseVelocity = 5 }) => {
  const wrapperRef = useRef(null);
  const baseX = useMotionValue(0);
  
  const { scrollY } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end start"]
  });
  
  const scrollVelocity = useVelocity(scrollY);
  
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 60,
    stiffness: 300,
    mass: 0.1
  });
  
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const skewX = useTransform(smoothVelocity, [-1000, 0, 1000], [-5, 0, 5]);
  const x = useTransform(baseX, (v) => `${parseFloat(v) % -50}%`);

  const directionFactor = useRef(1);
  const isInView = useInView(wrapperRef, { amount: 0.1, once: false });
  
  useAnimationFrame((t, delta) => {
    if (!isInView) return;
    
    const safeDelta = Math.min(delta, 33);

    let moveBy = directionFactor.current * baseVelocity * (safeDelta / 1000);

    const velocity = velocityFactor.get();
    if (velocity < 0) {
      directionFactor.current = -1;
    } else if (velocity > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocity;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <Wrapper ref={wrapperRef}>
      <Scroller style={{ x, skewX }}>
        <span>CREATIVE FRONTEND DEVELOPER</span>
        <span>MECHANICAL ENGINEER</span>
        <span>CREATIVE FRONTEND DEVELOPER</span>
        <span>MECHANICAL ENGINEER</span>
        <span>CREATIVE FRONTEND DEVELOPER</span>
        <span>MECHANICAL ENGINEER</span>
      </Scroller>
    </Wrapper>
  );
});

VelocityText.displayName = 'VelocityText';

export default VelocityText;