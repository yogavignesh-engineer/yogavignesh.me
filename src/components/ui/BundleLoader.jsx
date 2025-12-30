import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const pistonMove = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const LoaderContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #050505 0%, #0A0A0A 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(102, 252, 241, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(102, 252, 241, 0.02) 1px, transparent 1px);
    background-size: 50px 50px;
  }
`;

const LoaderContent = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`;

const Title = styled.div`
  font-family: 'Oswald', sans-serif;
  font-size: 2.5rem;
  color: #66FCF1;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const ProgressContainer = styled.div`
  width: 500px;
  max-width: 90vw;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(102, 252, 241, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(102, 252, 241, 0.3);
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #66FCF1, #00D9FF);
  border-radius: 4px;
  position: relative;
  box-shadow: 0 0 20px rgba(102, 252, 241, 0.5);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3));
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const PercentageText = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 3rem;
  color: #66FCF1;
  text-align: center;
  margin-top: 20px;
  font-weight: 700;
  text-shadow: 0 0 30px rgba(102, 252, 241, 0.5);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const LoadingText = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: #666;
  text-align: center;
  margin-top: 10px;
  letter-spacing: 0.1em;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const PistonContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
`;

const Piston = styled.div`
  width: 6px;
  height: 60px;
  background: linear-gradient(180deg, #66FCF1, #00D9FF);
  border-radius: 3px;
  animation: ${pistonMove} ${props => props.$delay}s ease-in-out infinite;
  box-shadow: 0 0 15px rgba(102, 252, 241, 0.5);
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  background: #66FCF1;
  border-radius: 50%;
  display: inline-block;
  margin: 0 5px;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.3; transform: scale(0.8); }
  }
`;

const BundleLoader = ({ children, fallback }) => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Initializing...');

  useEffect(() => {
    const messages = [
      'Initializing...',
      'Loading React core...',
      'Importing Three.js...',
      'Loading animations...',
      'Optimizing assets...',
      'Almost ready...',
      'Welcome!'
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15 + 5; // Random increment between 5-20
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        setLoadingMessage(messages[messages.length - 1]);
        
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
        
        clearInterval(interval);
      } else {
        setProgress(Math.min(currentProgress, 95)); // Cap at 95 until actually loaded
        const messageIndex = Math.floor((currentProgress / 100) * (messages.length - 1));
        setLoadingMessage(messages[messageIndex]);
      }
    }, 300);

    // Detect when all resources are loaded
    const handleLoad = () => {
      setProgress(100);
      setLoadingMessage(messages[messages.length - 1]);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
      clearInterval(interval);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <LoaderContainer
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <LoaderContent>
              <PistonContainer>
                <Piston $delay={0.8} />
                <Piston $delay={1.0} />
                <Piston $delay={0.6} />
                <Piston $delay={1.2} />
                <Piston $delay={0.9} />
              </PistonContainer>

              <Title>LOADING EXPERIENCE</Title>

              <ProgressContainer>
                <ProgressBar>
                  <ProgressFill
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </ProgressBar>
                <PercentageText>{Math.round(progress)}%</PercentageText>
                <LoadingText>
                  <StatusDot />
                  {loadingMessage}
                  <StatusDot />
                </LoadingText>
              </ProgressContainer>
            </LoaderContent>
          </LoaderContainer>
        )}
      </AnimatePresence>

      {!isLoading && children}
    </>
  );
};

export default BundleLoader;
