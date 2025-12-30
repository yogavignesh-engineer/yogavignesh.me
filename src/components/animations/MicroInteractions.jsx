import React, { useRef, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useInView, useSpring, useTransform, useScroll } from 'framer-motion';

// ==========================================
// 1. ANIMATED COUNTER - Numbers count up on scroll
// ==========================================
const CounterValue = styled(motion.span)`
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  display: inline-block;
`;

export function AnimatedCounter({
    value,
    suffix = '',
    prefix = '',
    duration = 2,
    className = ''
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (!isInView) return;

        const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
        const startTime = Date.now();
        const durationMs = duration * 1000;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            const eased = 1 - Math.pow(1 - progress, 4); // Ease out quart

            setDisplayValue(Math.floor(numericValue * eased));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, value, duration]);

    return (
        <CounterValue ref={ref} className={className}>
            {prefix}{displayValue}{suffix}
        </CounterValue>
    );
}

// ==========================================
// 2. TEXT REVEAL - Words reveal on scroll
// ==========================================
const RevealContainer = styled(motion.div)`
  overflow: hidden;
  display: inline-block;
`;

const RevealInner = styled(motion.span)`
  display: inline-block;
`;

export function TextReveal({ children, delay = 0 }) {
    return (
        <RevealContainer>
            <RevealInner
                initial={{ y: '100%', opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                    duration: 0.8,
                    delay,
                    ease: [0.25, 1, 0.5, 1]
                }}
            >
                {children}
            </RevealInner>
        </RevealContainer>
    );
}

// ==========================================
// 3. SPLIT TEXT - Each character animates
// ==========================================
const SplitContainer = styled(motion.span)`
  display: inline-flex;
  flex-wrap: wrap;
`;

const CharWrapper = styled(motion.span)`
  display: inline-block;
  white-space: pre;
`;

export function SplitText({ text, className = '', staggerDelay = 0.03 }) {
    const characters = text.split('');

    return (
        <SplitContainer className={className}>
            {characters.map((char, i) => (
                <CharWrapper
                    key={`${char}-${i}`}
                    initial={{ y: 50, opacity: 0, rotateX: -90 }}
                    whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.6,
                        delay: i * staggerDelay,
                        ease: [0.25, 1, 0.5, 1]
                    }}
                >
                    {char === ' ' ? '\u00A0' : char}
                </CharWrapper>
            ))}
        </SplitContainer>
    );
}

// ==========================================
// 4. MAGNETIC BUTTON - Follows cursor
// ==========================================
const MagneticWrapper = styled(motion.div)`
  display: inline-block;
  cursor: pointer;
`;

export function MagneticElement({ children, strength = 0.3 }) {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        setPosition({
            x: (e.clientX - centerX) * strength,
            y: (e.clientY - centerY) * strength
        });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    const springConfig = { stiffness: 150, damping: 15 };
    const x = useSpring(position.x, springConfig);
    const y = useSpring(position.y, springConfig);

    useEffect(() => {
        x.set(position.x);
        y.set(position.y);
    }, [position.x, position.y, x, y]);

    return (
        <MagneticWrapper
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={handleMouseLeave}
            style={{ x, y }}
        >
            {children}
        </MagneticWrapper>
    );
}

// ==========================================
// 5. PARALLAX SECTION - Scroll parallax
// ==========================================
const ParallaxWrapper = styled(motion.div)`
  will-change: transform;
`;

export function ParallaxElement({ children, speed = 0.5, className = '' }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start']
    });

    const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);

    return (
        <ParallaxWrapper ref={ref} style={{ y }} className={className}>
            {children}
        </ParallaxWrapper>
    );
}

// ==========================================
// 6. TYPEWRITER EFFECT
// ==========================================
const TypewriterText = styled.span`
  font-family: 'JetBrains Mono', monospace;
  
  &::after {
    content: '|';
    animation: blink 1s step-end infinite;
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`;

export function Typewriter({ text, speed = 50, delay = 0 }) {
    const [displayText, setDisplayText] = useState('');
    const [started, setStarted] = useState(false);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView || started) return;

        const startTimeout = setTimeout(() => {
            setStarted(true);
            let i = 0;
            const interval = setInterval(() => {
                if (i < text.length) {
                    setDisplayText(text.slice(0, i + 1));
                    i++;
                } else {
                    clearInterval(interval);
                }
            }, speed);

            return () => clearInterval(interval);
        }, delay);

        return () => clearTimeout(startTimeout);
    }, [isInView, text, speed, delay, started]);

    return <TypewriterText ref={ref}>{displayText}</TypewriterText>;
}

// ==========================================
// 7. FLOATING ELEMENTS
// ==========================================
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-15px) rotate(5deg); }
  75% { transform: translateY(10px) rotate(-5deg); }
`;

const FloatingWrapper = styled.div`
  animation: ${floatAnimation} ${props => props.$duration || 6}s ease-in-out infinite;
  animation-delay: ${props => props.$delay || 0}s;
`;

export function FloatingElement({ children, duration = 6, delay = 0 }) {
    return (
        <FloatingWrapper $duration={duration} $delay={delay}>
            {children}
        </FloatingWrapper>
    );
}

// ==========================================
// 8. GLOW PULSE EFFECT
// ==========================================
const glowPulse = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(102, 252, 241, 0.3);
    filter: brightness(1);
  }
  50% { 
    box-shadow: 0 0 40px rgba(102, 252, 241, 0.6), 0 0 60px rgba(102, 252, 241, 0.3);
    filter: brightness(1.1);
  }
`;

const GlowWrapper = styled.div`
  animation: ${glowPulse} ${props => props.$duration || 3}s ease-in-out infinite;
  border-radius: ${props => props.$radius || '8px'};
`;

export function GlowPulse({ children, duration = 3, radius = '8px' }) {
    return (
        <GlowWrapper $duration={duration} $radius={radius}>
            {children}
        </GlowWrapper>
    );
}

// ==========================================
// 9. SCROLL PROGRESS INDICATOR
// ==========================================
const ProgressBar = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #66FCF1, #FF6B35);
  transform-origin: left;
  z-index: 9999;
`;

export function ScrollProgress() {
    const { scrollYProgress } = useScroll();

    return <ProgressBar style={{ scaleX: scrollYProgress }} />;
}

// ==========================================
// 10. STAGGER CHILDREN ANIMATION
// ==========================================
export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

export const staggerItem = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 1, 0.5, 1]
        }
    }
};

// ==========================================
// 11. BLUR IN ANIMATION
// ==========================================
const BlurContainer = styled(motion.div)``;

export function BlurIn({ children, delay = 0, className = '' }) {
    return (
        <BlurContainer
            className={className}
            initial={{ opacity: 0, filter: 'blur(20px)' }}
            whileInView={{ opacity: 1, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay, ease: 'easeOut' }}
        >
            {children}
        </BlurContainer>
    );
}

// ==========================================
// 12. SCALE ON HOVER
// ==========================================
export function ScaleOnHover({ children, scale = 1.05 }) {
    return (
        <motion.div
            whileHover={{ scale }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
            {children}
        </motion.div>
    );
}

// ==========================================
// 13. MARQUEE / INFINITE SCROLL
// ==========================================
const marqueeAnimation = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const MarqueeWrapper = styled.div`
  overflow: hidden;
  white-space: nowrap;
`;

const MarqueeContent = styled.div`
  display: inline-flex;
  animation: ${marqueeAnimation} ${props => props.$duration || 20}s linear infinite;
  
  &:hover {
    animation-play-state: paused;
  }
`;

export function Marquee({ children, duration = 20 }) {
    return (
        <MarqueeWrapper>
            <MarqueeContent $duration={duration}>
                {children}
                {children}
            </MarqueeContent>
        </MarqueeWrapper>
    );
}

// ==========================================
// 14. GRADIENT BORDER ANIMATION
// ==========================================
const gradientBorder = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const GradientBorderWrapper = styled.div`
  position: relative;
  padding: 2px;
  background: linear-gradient(90deg, #66FCF1, #FF6B35, #66FCF1, #FF6B35);
  background-size: 300% 100%;
  animation: ${gradientBorder} 4s ease infinite;
  border-radius: ${props => props.$radius || '12px'};
  
  & > * {
    background: #0a0a0a;
    border-radius: calc(${props => props.$radius || '12px'} - 2px);
  }
`;

export function GradientBorder({ children, radius = '12px' }) {
    return (
        <GradientBorderWrapper $radius={radius}>
            {children}
        </GradientBorderWrapper>
    );
}

// ==========================================
// 15. STORY SECTION WITH REVEAL
// ==========================================
const StoryWrapper = styled(motion.div)`
  position: relative;
`;

const StoryLine = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  background: linear-gradient(180deg, #66FCF1, #FF6B35);
  transform-origin: top;
`;

export function StoryReveal({ children }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start 0.8', 'end 0.2']
    });

    return (
        <StoryWrapper ref={ref}>
            <StoryLine style={{ scaleY: scrollYProgress, height: '100%' }} />
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                style={{ paddingLeft: '2rem' }}
            >
                {children}
            </motion.div>
        </StoryWrapper>
    );
}
