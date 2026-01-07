import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ELITE Loading Screen
 * 
 * - Stunning animated logo
 * - Progress indicator
 * - Smooth fade-out transition
 */

const slideUp = keyframes`
  from { transform: translateY(0); }
  to { transform: translateY(-100%); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const LoadingContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #0a0a0a;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overflow: hidden;
`;

const LogoWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const LogoText = styled(motion.div)`
  font-family: 'Oswald', sans-serif;
  font-size: clamp(2rem, 8vw, 5rem);
  font-weight: 900;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  color: transparent;
  background: linear-gradient(
    90deg,
    #333 0%,
    #fff 25%,
    #fff 50%,
    #333 75%,
    #333 100%
  );
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  animation: ${shimmer} 2s linear infinite;
`;

const ProgressContainer = styled.div`
  width: 200px;
  height: 2px;
  background: #222;
  border-radius: 2px;
  overflow: hidden;
  position: relative;
`;

const ProgressBar = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #FF6B35, #F7931E);
  border-radius: 2px;
`;

const LoadingText = styled(motion.div)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-top: 1.5rem;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const LetterSpan = styled(motion.span)`
  display: inline-block;
`;

const LoadingScreen = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setIsComplete(true);
                        if (onComplete) onComplete();
                    }, 300);
                    return 100;
                }
                return prev + Math.random() * 15 + 5;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [onComplete]);

    const name = "S. YOGA VIGNESH";

    const letterVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: (i) => ({
            y: 0,
            opacity: 1,
            transition: {
                delay: i * 0.05,
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        })
    };

    return (
        <AnimatePresence>
            {!isComplete && (
                <LoadingContainer
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
                    }}
                >
                    <LogoWrapper>
                        <LogoText>
                            {name.split("").map((letter, i) => (
                                <LetterSpan
                                    key={i}
                                    custom={i}
                                    variants={letterVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {letter === " " ? "\u00A0" : letter}
                                </LetterSpan>
                            ))}
                        </LogoText>

                        <ProgressContainer>
                            <ProgressBar
                                initial={{ width: "0%" }}
                                animate={{ width: `${Math.min(progress, 100)}%` }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            />
                        </ProgressContainer>

                        <LoadingText>
                            {progress < 100 ? "Loading Experience..." : "Ready"}
                        </LoadingText>
                    </LogoWrapper>
                </LoadingContainer>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;
