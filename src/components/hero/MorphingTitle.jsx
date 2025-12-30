import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const glowPulse = keyframes`
  0%, 100% { text-shadow: 0 0 20px rgba(102, 252, 241, 0.3); }
  50% { text-shadow: 0 0 40px rgba(102, 252, 241, 0.6), 0 0 60px rgba(102, 252, 241, 0.4); }
`;

const TitleContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  min-height: 1.2em;
`;

const TitleWrapper = styled(motion.div)`
  font-family: 'Oswald', sans-serif;
  font-size: ${props => props.$fontSize || '11.5vw'};
  font-weight: 700;
  line-height: 0.9;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  white-space: nowrap;
  color: #111;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 1024px) {
    font-size: 13vw;
  }
  
  @media (max-width: 768px) {
    font-size: 12vw;
    white-space: normal;
    text-align: center;
    line-height: 1.1;
  }
`;

const CharacterSpan = styled(motion.span)`
  display: inline-block;
  position: relative;
  transform-origin: center bottom;
  
  /* Glow effect on hover */
  &:hover {
    color: #66FCF1;
    animation: ${glowPulse} 1s ease-in-out infinite;
  }
`;

const UnderlineIndicator = styled(motion.div)`
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
`;

const Dot = styled(motion.div)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$active ? '#66FCF1' : 'rgba(102, 252, 241, 0.3)'};
  transition: background 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: #FF6B35;
  }
`;

// Character animation variants
const characterVariants = {
    initial: {
        y: 50,
        opacity: 0,
        rotateX: -90,
        scale: 0.5,
    },
    animate: (i) => ({
        y: 0,
        opacity: 1,
        rotateX: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 12,
            delay: i * 0.03,
        },
    }),
    exit: (i) => ({
        y: -50,
        opacity: 0,
        rotateX: 90,
        scale: 0.5,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 12,
            delay: i * 0.02,
        },
    }),
};

// Wrapper animation variants
const wrapperVariants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            staggerChildren: 0.03,
            delayChildren: 0.1,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.02,
            staggerDirection: -1,
        },
    },
};

const MorphingTitle = React.memo(function MorphingTitle({
    words = ['MECHANICAL ENGINEER', 'FULL STACK DEV', 'CAD DESIGNER', 'INNOVATOR'],
    interval = 4000,
    fontSize = '11.5vw',
    showIndicator = true,
    autoPlay = true,
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Split current word into characters
    const characters = useMemo(() => {
        return words[currentIndex].split('');
    }, [words, currentIndex]);

    // Auto-cycle through words
    useEffect(() => {
        if (!autoPlay || isPaused) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % words.length);
        }, interval);

        return () => clearInterval(timer);
    }, [words.length, interval, autoPlay, isPaused]);

    // Handle dot click to jump to specific word
    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };

    // Pause/resume on hover
    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);

    return (
        <TitleContainer
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <AnimatePresence mode="wait">
                <TitleWrapper
                    key={currentIndex}
                    $fontSize={fontSize}
                    variants={wrapperVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    {characters.map((char, i) => (
                        <CharacterSpan
                            key={`${currentIndex}-${i}-${char}`}
                            variants={characterVariants}
                            custom={i}
                            style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
                        >
                            {char === ' ' ? '\u00A0' : char}
                        </CharacterSpan>
                    ))}
                </TitleWrapper>
            </AnimatePresence>

            {showIndicator && words.length > 1 && (
                <UnderlineIndicator
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                >
                    {words.map((_, index) => (
                        <Dot
                            key={index}
                            $active={index === currentIndex}
                            onClick={() => handleDotClick(index)}
                            whileHover={{ scale: 1.3 }}
                            whileTap={{ scale: 0.9 }}
                        />
                    ))}
                </UnderlineIndicator>
            )}
        </TitleContainer>
    );
});

export default MorphingTitle;
