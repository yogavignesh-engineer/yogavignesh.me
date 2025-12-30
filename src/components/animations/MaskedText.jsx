import React, { useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Wrapper = styled.div`
  overflow: hidden;
  display: inline-block;
  vertical-align: bottom; /* Fixes layout gaps */
`;

// PERFORMANCE: Motion props are defined as stable constants.
const motionVariants = {
  initial: { y: "100%" },
  whileInView: { y: "0%" },
  viewport: { once: true },
};

const MaskedText = React.memo(({ children, delay = 0 }) => {
  // PERFORMANCE: useMemo to prevent recreating the transition object on each render.
  const transition = useMemo(() => ({
    duration: 1.2,
    ease: [0.19, 1, 0.22, 1],
    delay: delay
  }), [delay]);

  return (
    <Wrapper>
      <motion.div
        initial={motionVariants.initial}
        whileInView={motionVariants.whileInView}
        viewport={motionVariants.viewport}
        transition={transition}
      >
        {children}
      </motion.div>
    </Wrapper>
  );
});

MaskedText.displayName = 'MaskedText';

export default MaskedText;