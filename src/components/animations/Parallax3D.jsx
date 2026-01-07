import React, { useRef } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * 3D PARALLAX EFFECTS
 * 
 * Creates depth and dimensionality in the scroll experience
 * - Multi-layer parallax
 * - 3D rotation on scroll
 * - Depth perception with scale
 */

// Wrapper with perspective for 3D effects
const ParallaxContainer = styled.div`
  position: relative;
  perspective: 1000px;
  perspective-origin: center;
  overflow: hidden;
`;

// ===== BASIC PARALLAX =====
export const Parallax = ({
    children,
    speed = 0.5, // -1 to 1
    className = ''
}) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);

    return (
        <motion.div ref={ref} style={{ y }} className={className}>
            {children}
        </motion.div>
    );
};

// ===== 3D TILT ON SCROLL =====
export const Parallax3D = ({
    children,
    rotateX = 15, // degrees
    rotateY = 0,
    scale = 1.1,
    className = ''
}) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"]
    });

    const rotateXValue = useTransform(scrollYProgress, [0, 1], [rotateX, 0]);
    const rotateYValue = useTransform(scrollYProgress, [0, 1], [rotateY, 0]);
    const scaleValue = useTransform(scrollYProgress, [0, 1], [scale, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [0.5, 1]);

    // Smooth springs
    const rotateXSpring = useSpring(rotateXValue, { stiffness: 100, damping: 30 });
    const rotateYSpring = useSpring(rotateYValue, { stiffness: 100, damping: 30 });
    const scaleSpring = useSpring(scaleValue, { stiffness: 100, damping: 30 });

    return (
        <ParallaxContainer>
            <motion.div
                ref={ref}
                style={{
                    rotateX: rotateXSpring,
                    rotateY: rotateYSpring,
                    scale: scaleSpring,
                    opacity,
                    transformStyle: 'preserve-3d'
                }}
                className={className}
            >
                {children}
            </motion.div>
        </ParallaxContainer>
    );
};

// ===== MULTI-LAYER PARALLAX =====
const LayerWrapper = styled(motion.div)`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

export const ParallaxLayers = ({
    children,
    layers = [], // Array of { content, speed, zIndex }
    className = ''
}) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    return (
        <div ref={ref} style={{ position: 'relative' }} className={className}>
            {children}

            {layers.map((layer, i) => {
                const y = useTransform(
                    scrollYProgress,
                    [0, 1],
                    [100 * layer.speed, -100 * layer.speed]
                );

                return (
                    <LayerWrapper
                        key={i}
                        style={{
                            y,
                            zIndex: layer.zIndex || i,
                            opacity: layer.opacity || 1
                        }}
                    >
                        {layer.content}
                    </LayerWrapper>
                );
            })}
        </div>
    );
};

// ===== DEPTH CARD =====
const CardWrapper = styled(motion.div)`
  transform-style: preserve-3d;
  cursor: pointer;
`;

const CardInner = styled(motion.div)`
  transition: transform 0.3s ease;
  transform-style: preserve-3d;
`;

export const DepthCard = ({
    children,
    depth = 20, // pixels
    className = ''
}) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const z = useTransform(scrollYProgress, [0, 0.5, 1], [-depth, 0, -depth]);
    const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -5]);

    return (
        <CardWrapper ref={ref} className={className}>
            <CardInner
                style={{
                    z,
                    rotateX,
                    transformStyle: 'preserve-3d'
                }}
            >
                {children}
            </CardInner>
        </CardWrapper>
    );
};

// ===== FLOATING ELEMENT =====
export const FloatingElement = ({
    children,
    amplitude = 20, // pixels
    duration = 3, // seconds
    delay = 0,
    className = ''
}) => {
    return (
        <motion.div
            animate={{
                y: [0, -amplitude, 0],
                rotate: [-1, 1, -1]
            }}
            transition={{
                duration,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                delay
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// ===== SCROLL ZOOM =====
export const ScrollZoom = ({
    children,
    startScale = 0.8,
    endScale = 1,
    className = ''
}) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [startScale, endScale, startScale]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

    return (
        <motion.div
            ref={ref}
            style={{ scale, opacity }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// ===== PERSPECTIVE TEXT =====
export const PerspectiveText = ({
    text,
    className = ''
}) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"]
    });

    const rotateX = useTransform(scrollYProgress, [0, 1], [45, 0]);
    const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);

    return (
        <ParallaxContainer>
            <motion.div
                ref={ref}
                style={{
                    rotateX,
                    y,
                    opacity,
                    transformOrigin: 'center bottom'
                }}
                className={className}
            >
                {text}
            </motion.div>
        </ParallaxContainer>
    );
};

export default {
    Parallax,
    Parallax3D,
    ParallaxLayers,
    DepthCard,
    FloatingElement,
    ScrollZoom,
    PerspectiveText
};
