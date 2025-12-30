import React, { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const Magnetic = React.memo(({ children }) => {
  const ref = useRef(null);
  
  // PERFORMANCE: Use motion values to track mouse position without re-renders.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // PERFORMANCE: Create spring-animated values from the base motion values.
  const springConfig = { stiffness: 350, damping: 15, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const handleMouse = useCallback((e) => {
    if (ref.current) {
      const { clientX, clientY } = e;
      const { height, width, left, top } = ref.current.getBoundingClientRect();
      const middleX = clientX - (left + width / 2);
      const middleY = clientY - (top + height / 2);
      
      // Set the motion value directly, which does not trigger a re-render.
      mouseX.set(middleX * 0.15); // Slightly increased intensity for better feel
      mouseY.set(middleY * 0.15);
    }
  }, [mouseX, mouseY]);

  const reset = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      // PERFORMANCE: Pass motion values directly to the style prop.
      // This allows framer-motion to handle animation outside of React's render loop.
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
});

Magnetic.displayName = 'Magnetic';

export default Magnetic;