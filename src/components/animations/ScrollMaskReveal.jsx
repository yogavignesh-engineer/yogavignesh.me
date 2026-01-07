import React, { useRef, useMemo } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * SCROLL MASK REVEAL - Elite Animation Component (PERFORMANCE OPTIMIZED)
 * 
 * Creates a scroll-driven mask reveal effect with two modes:
 * - "circle" (default): Camera aperture/mechanical iris effect (Engineering)
 * - "inset": Blast door opening effect (Industrial)
 * 
 * PERFORMANCE OPTIMIZATIONS:
 * - GPU acceleration with transform3d
 * - will-change for compositor hints
 * - Memoized styled components
 * - Optimized scroll tracking
 */

// Container with GPU acceleration
const RevealContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  will-change: clip-path;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
`;

// Inner wrapper with GPU acceleration for scale
const ParallaxWrapper = styled(motion.div)`
  width: 100%;
  height: 100%;
  will-change: transform;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  
  /* Ensure children fill the container */
  & > img,
  & > video,
  & > div {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ScrollMaskReveal = React.memo(({
    children,
    type = 'circle',  // Default to circle (aperture) for Mechanical Engineer theme
    className,
    style,
    startOffset = 'start end',
    endOffset = 'end center',
    scaleStart = 1.2,
    scaleEnd = 1,
}) => {
    const containerRef = useRef(null);

    // Optimized scroll tracking with passive listener
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: [startOffset, endOffset]
    });

    // ===== CIRCLE MODE (Mechanical Iris) =====
    const circleRadius = useTransform(scrollYProgress, [0, 1], [0, 150]);

    // ===== INSET MODE (Blast Door) =====
    const insetValue = useTransform(scrollYProgress, [0, 1], [10, 0]);
    const borderRadius = useTransform(scrollYProgress, [0, 1], [20, 0]);

    // ===== PARALLAX SCALE (Lens Effect) =====
    const scale = useTransform(scrollYProgress, [0, 1], [scaleStart, scaleEnd]);

    // Memoized clip-path transforms
    const clipPathCircle = useTransform(
        circleRadius,
        (r) => `circle(${r}% at 50% 50%)`
    );

    const clipPathInset = useTransform(
        [insetValue, borderRadius],
        ([i, br]) => `inset(${i}% ${i}% ${i}% ${i}% round ${br}px)`
    );

    const clipPath = type === 'circle' ? clipPathCircle : clipPathInset;

    // Memoized style object
    const containerStyle = useMemo(() => ({
        ...style,
        clipPath
    }), [style, clipPath]);

    return (
        <RevealContainer
            ref={containerRef}
            className={className}
            style={containerStyle}
        >
            <ParallaxWrapper style={{ scale }}>
                {children}
            </ParallaxWrapper>
        </RevealContainer>
    );
});

ScrollMaskReveal.displayName = 'ScrollMaskReveal';

export default ScrollMaskReveal;
