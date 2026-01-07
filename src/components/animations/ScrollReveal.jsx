import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

/**
 * SCROLL REVEAL ANIMATIONS
 * 
 * Reusable components for scroll-linked animations
 */

// Basic fade-in on scroll
export const FadeInOnScroll = ({
    children,
    delay = 0,
    duration = 0.6,
    direction = 'up', // 'up', 'down', 'left', 'right'
    distance = 50,
    once = true
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, amount: 0.2 });

    const directionMap = {
        up: { y: distance, x: 0 },
        down: { y: -distance, x: 0 },
        left: { x: distance, y: 0 },
        right: { x: -distance, y: 0 }
    };

    const initialPos = directionMap[direction] || directionMap.up;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, ...initialPos }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...initialPos }}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
        >
            {children}
        </motion.div>
    );
};

// Staggered children reveal
export const StaggerContainer = ({
    children,
    staggerDelay = 0.1,
    once = true
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, amount: 0.2 });

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: staggerDelay
                    }
                }
            }}
        >
            {children}
        </motion.div>
    );
};

export const StaggerItem = ({ children, direction = 'up', distance = 30 }) => {
    const directionMap = {
        up: { y: distance, x: 0 },
        down: { y: -distance, x: 0 },
        left: { x: distance, y: 0 },
        right: { x: -distance, y: 0 }
    };

    const initialPos = directionMap[direction] || directionMap.up;

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, ...initialPos },
                visible: {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    transition: {
                        duration: 0.5,
                        ease: [0.25, 0.46, 0.45, 0.94]
                    }
                }
            }}
        >
            {children}
        </motion.div>
    );
};

// Parallax scroll effect
export const ParallaxScroll = ({
    children,
    speed = 0.5, // -1 to 1, negative = opposite direction
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

// Scale on scroll (zoom effect)
export const ScaleOnScroll = ({
    children,
    startScale = 0.8,
    endScale = 1,
    once = true
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, amount: 0.3 });

    return (
        <motion.div
            ref={ref}
            initial={{ scale: startScale, opacity: 0 }}
            animate={isInView ? { scale: endScale, opacity: 1 } : { scale: startScale, opacity: 0 }}
            transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
        >
            {children}
        </motion.div>
    );
};

// Text reveal (letter by letter on scroll)
export const TextRevealOnScroll = ({
    text,
    className = '',
    once = true,
    staggerDelay = 0.03
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, amount: 0.5 });

    return (
        <motion.span
            ref={ref}
            className={className}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: staggerDelay
                    }
                }
            }}
        >
            {text.split("").map((char, i) => (
                <motion.span
                    key={i}
                    style={{ display: 'inline-block' }}
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: {
                                duration: 0.4,
                                ease: [0.25, 0.46, 0.45, 0.94]
                            }
                        }
                    }}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.span>
    );
};

// Clip reveal (wipe effect)
export const ClipReveal = ({
    children,
    direction = 'up', // 'up', 'down', 'left', 'right'
    once = true
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, amount: 0.3 });

    const clipPaths = {
        up: {
            hidden: 'inset(100% 0 0 0)',
            visible: 'inset(0 0 0 0)'
        },
        down: {
            hidden: 'inset(0 0 100% 0)',
            visible: 'inset(0 0 0 0)'
        },
        left: {
            hidden: 'inset(0 100% 0 0)',
            visible: 'inset(0 0 0 0)'
        },
        right: {
            hidden: 'inset(0 0 0 100%)',
            visible: 'inset(0 0 0 0)'
        }
    };

    const clip = clipPaths[direction] || clipPaths.up;

    return (
        <motion.div
            ref={ref}
            initial={{ clipPath: clip.hidden }}
            animate={isInView ? { clipPath: clip.visible } : { clipPath: clip.hidden }}
            transition={{
                duration: 0.8,
                ease: [0.76, 0, 0.24, 1]
            }}
        >
            {children}
        </motion.div>
    );
};

export default {
    FadeInOnScroll,
    StaggerContainer,
    StaggerItem,
    ParallaxScroll,
    ScaleOnScroll,
    TextRevealOnScroll,
    ClipReveal
};
