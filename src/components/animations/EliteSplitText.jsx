import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useInView, useAnimation } from 'framer-motion';

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
`;

const CharWrapper = styled(motion.span)`
  display: inline-block;
  position: relative;
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  will-change: transform, opacity;
  transform-origin: center bottom;
`;

const TopHalf = styled(motion.span)`
  display: block;
  clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
  position: relative;
`;

const BottomHalf = styled(motion.span)`
  display: block;
  clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);
  position: absolute;
  top: 0;
  left: 0;
`;

const SpaceChar = styled.span`
  display: inline-block;
  width: 0.25em;
`;

/**
 * Elite "ABOUT ME" style animation - letters split horizontally 
 * and animate in with stagger like olhalazarieva.com
 */
const EliteSplitText = ({
    text = 'ABOUT ME',
    fontSize = 'clamp(4rem, 15vw, 12rem)',
    color = '#000',
    delay = 0,
    className = ''
}) => {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.3 });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) {
            controls.start('visible');
        }
    }, [isInView, controls]);

    const chars = text.split('');

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.05,
                delayChildren: delay
            }
        }
    };

    // Each character animates from split position
    const charVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.215, 0.61, 0.355, 1]
            }
        }
    };

    // Top half slides down from above
    const topVariants = {
        hidden: {
            y: '-100%',
            opacity: 0
        },
        visible: {
            y: '0%',
            opacity: 1,
            transition: {
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    // Bottom half slides up from below
    const bottomVariants = {
        hidden: {
            y: '100%',
            opacity: 0
        },
        visible: {
            y: '0%',
            opacity: 1,
            transition: {
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1
            }
        }
    };

    return (
        <Container
            ref={containerRef}
            as={motion.div}
            className={`elite-split-text ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            style={{ fontSize, color }}
        >
            {chars.map((char, i) => {
                if (char === ' ') {
                    return <SpaceChar key={i} />;
                }

                return (
                    <CharWrapper
                        key={i}
                        variants={charVariants}
                    >
                        <TopHalf variants={topVariants}>
                            {char}
                        </TopHalf>
                        <BottomHalf variants={bottomVariants}>
                            {char}
                        </BottomHalf>
                    </CharWrapper>
                );
            })}
        </Container>
    );
};

export default EliteSplitText;
