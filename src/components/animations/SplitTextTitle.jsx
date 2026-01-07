import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useInView, useAnimation } from 'framer-motion';

const SplitContainer = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  line-height: 1;
  overflow: hidden;
`;

const CharWrapper = styled(motion.span)`
  display: inline-block;
  position: relative;
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  will-change: transform, opacity;
  
  /* Each character is independently animated */
  .char-top, .char-bottom {
    display: block;
    position: relative;
  }
  
  .char-top {
    clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
  }
  
  .char-bottom {
    position: absolute;
    top: 0;
    left: 0;
    clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);
  }
`;

const ImageMask = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 200px;
  overflow: hidden;
  border-radius: 4px;
  z-index: 10;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%);
    transition: filter 0.3s ease;
  }
  
  &:hover img {
    filter: grayscale(0%);
  }
`;

const SpaceChar = styled.span`
  display: inline-block;
  width: 0.3em;
`;

const SplitTextTitle = ({
    text = 'MECHANICAL ENGINEER',
    fontSize = 'clamp(3rem, 10vw, 8rem)',
    imageSrc = null,
    color = '#000',
    className = '',
    delay = 0
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

    // Find center position for image
    const centerIndex = Math.floor(chars.length / 2);

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.03,
                delayChildren: delay
            }
        }
    };

    const charVariants = {
        hidden: {
            opacity: 0,
            y: 100,
            rotateX: -90,
            scale: 0.5
        },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: [0.215, 0.61, 0.355, 1],
                // Add random offset for more organic feel
                delay: Math.random() * 0.1
            }
        })
    };

    const topHalfVariants = {
        hidden: { y: -50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: [0.215, 0.61, 0.355, 1]
            }
        }
    };

    const bottomHalfVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: [0.215, 0.61, 0.355, 1],
                delay: 0.1
            }
        }
    };

    const imageVariants = {
        hidden: {
            scale: 0,
            opacity: 0,
            clipPath: 'inset(50% 50% 50% 50%)'
        },
        visible: {
            scale: 1,
            opacity: 1,
            clipPath: 'inset(0% 0% 0% 0%)',
            transition: {
                duration: 0.8,
                ease: [0.215, 0.61, 0.355, 1],
                delay: delay + 0.3
            }
        }
    };

    return (
        <SplitContainer
            ref={containerRef}
            as={motion.div}
            className={`split-text-title ${className}`}
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
                        custom={i}
                        style={{
                            perspective: '1000px',
                            transformStyle: 'preserve-3d'
                        }}
                    >
                        <motion.span
                            className="char-top"
                            variants={topHalfVariants}
                        >
                            {char}
                        </motion.span>
                        <motion.span
                            className="char-bottom"
                            variants={bottomHalfVariants}
                        >
                            {char}
                        </motion.span>
                    </CharWrapper>
                );
            })}
        </SplitContainer>
    );
};

export default SplitTextTitle;
