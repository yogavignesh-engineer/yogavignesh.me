import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styled, { keyframes } from 'styled-components';

const glitch = keyframes`
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
  100% {
    transform: translate(0);
  }
`;

const scanline = keyframes`
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
`;

const PageContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #050505;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      rgba(255, 107, 53, 0.03),
      rgba(255, 107, 53, 0.03) 1px,
      transparent 1px,
      transparent 2px
    );
    pointer-events: none;
    z-index: 2;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, transparent, #FF6B35, transparent);
    box-shadow: 0 0 20px rgba(255, 107, 53, 0.8);
    animation: ${scanline} 3s linear infinite;
    z-index: 3;
  }
`;

const ErrorCode = styled.h1`
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(4rem, 15vw, 10rem);
  font-weight: 700;
  color: #FF6B35;
  margin: 0;
  text-shadow: 
    0 0 20px rgba(255, 107, 53, 0.8),
    0 0 40px rgba(255, 107, 53, 0.4),
    2px 2px 0 #66FCF1,
    -2px -2px 0 #E85A28;
  animation: ${glitch} 2s infinite;
  z-index: 1;
  
  @media (max-width: 768px) {
    font-size: 6rem;
  }
`;

const ErrorMessage = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: #66FCF1;
  text-align: center;
  margin: 2rem 0;
  text-transform: uppercase;
  letter-spacing: 3px;
  line-height: 1.8;
  max-width: 600px;
  padding: 0 2rem;
  z-index: 1;
  
  span {
    color: #FF6B35;
    font-weight: 600;
  }
`;

const SystemInfo = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: rgba(102, 252, 241, 0.5);
  margin: 1rem 0 2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  z-index: 1;
`;

const ReturnButton = styled(Link)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  font-weight: 600;
  color: #050505;
  background: linear-gradient(135deg, #FF6B35 0%, #E85A28 100%);
  padding: 1.2rem 3rem;
  border: none;
  border-radius: 50px;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 15px rgba(255, 107, 53, 0.4),
    inset 0 -2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1;
  
  &::before {
    content: '[ ';
  }
  
  &::after {
    content: ' ]';
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 
      0 6px 25px rgba(255, 107, 53, 0.6),
      inset 0 -2px 5px rgba(0, 0, 0, 0.2);
    background: linear-gradient(135deg, #E85A28 0%, #FF6B35 100%);
  }
  
  &:active {
    transform: translateY(-1px) scale(1.02);
    box-shadow: 
      0 3px 15px rgba(255, 107, 53, 0.4),
      inset 0 -2px 5px rgba(0, 0, 0, 0.2);
  }
`;

const GridBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(255, 107, 53, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 107, 53, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
  z-index: 0;
`;

export default function NotFound() {
  useEffect(() => {
    // Log 404 for analytics
    console.error('[404] Page not found:', window.location.href);
  }, []);

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | S. Yoga Vignesh</title>
        <meta name="description" content="The page you're looking for doesn't exist. Return to S. Yoga Vignesh's portfolio homepage." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <PageContainer>
        <GridBackground />
        
        <ErrorCode>404</ErrorCode>
        
        <ErrorMessage>
          <span>// SYSTEM_ERROR</span><br />
          THE COORDINATES YOU ENTERED DO NOT EXIST.<br />
          REDIRECT PROTOCOL INITIATED.
        </ErrorMessage>
        
        <SystemInfo>
          ERROR_CODE: 0x404 | STATUS: NOT_FOUND | TIME: {new Date().toISOString()}
        </SystemInfo>
        
        <ReturnButton to="/">
          RETURN TO BASE
        </ReturnButton>
      </PageContainer>
    </>
  );
}
