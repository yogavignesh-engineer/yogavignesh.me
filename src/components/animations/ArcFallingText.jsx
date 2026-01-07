import React, { useRef } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * EXACT olhalazarieva.com Scroll-Linked Animation
 * 
 * - NO SPRING (causes delay issues)
 * - Direct scroll-linked movement
 * - Symmetric letter pairs
 */

const TextContainer = styled.div`
  font-family: 'Oswald', sans-serif;
  font-size: ${props => props.$fontSize || 'clamp(4rem, 15vw, 12rem)'};
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  color: ${props => props.$color || '#EAEAEA'};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  overflow: hidden;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: clamp(3rem, 12vw, 8rem);
    letter-spacing: -0.03em;
  }
`;

// Overflow wrapper - masks the letter movement
const LetterWrapper = styled.span`
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
  line-height: 1;
`;

// Single letter - DIRECT scroll-linked (no spring delay)
const ScrollLinkedLetter = ({ char, scrollYProgress, revealStart, revealEnd }) => {
    // Direct scroll-linked Y position - NO SPRING (fixes the delay issue)
    const y = useTransform(
        scrollYProgress,
        [revealStart, revealEnd],
        ["-100%", "0%"]
    );

    return (
        <LetterWrapper>
            <motion.span
                style={{
                    display: 'inline-block',
                    willChange: 'transform',
                    transformOrigin: 'top center',
                    y
                }}
            >
                {char === " " ? "\u00A0" : char}
            </motion.span>
        </LetterWrapper>
    );
};

const ArcFallingText = ({
    text = 'ABOUT ME',
    fontSize = 'clamp(4rem, 15vw, 12rem)',
    color = '#EAEAEA',
    className = ''
}) => {
    const containerRef = useRef(null);

    // Track scroll progress - FIXED offset for proper animation range
    const { scrollYProgress } = useScroll({
        target: containerRef,
        // Animation starts when text is 80% down viewport, ends at 40%
        offset: ["start 0.8", "start 0.4"]
    });

    /**
     * SYMMETRIC LETTER PAIRS for "ABOUT ME":
     * U → (O,T) → (B,M) → (A,E)
     */
    const getRevealTiming = (index) => {
        const timings = {
            // Wave 1: U first
            3: { start: 0.0, end: 0.25 },

            // Wave 2: O & T together
            2: { start: 0.1, end: 0.35 },
            4: { start: 0.1, end: 0.35 },

            // Wave 3: B & M together (SYMMETRIC!)
            1: { start: 0.25, end: 0.50 },
            6: { start: 0.25, end: 0.50 },

            // Wave 4: A & E together (SYMMETRIC!)
            0: { start: 0.40, end: 0.65 },
            7: { start: 0.40, end: 0.65 },

            // Space
            5: { start: 0.25, end: 0.50 }
        };
        return timings[index] || { start: 0.5, end: 0.75 };
    };

    return (
        <TextContainer
            ref={containerRef}
            className={`scroll-linked-text ${className}`}
            $fontSize={fontSize}
            $color={color}
        >
            {text.split("").map((char, i) => {
                const timing = getRevealTiming(i);
                return (
                    <ScrollLinkedLetter
                        key={i}
                        char={char}
                        scrollYProgress={scrollYProgress}
                        revealStart={timing.start}
                        revealEnd={timing.end}
                    />
                );
            })}
        </TextContainer>
    );
};

export default ArcFallingText;
