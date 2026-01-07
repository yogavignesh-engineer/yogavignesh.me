import React from 'react';
import styled, { keyframes } from 'styled-components';

const auroraMove1 = keyframes`
  0%, 100% { transform: translate(0%, 0%) rotate(0deg) scale(1); }
  25% { transform: translate(20%, -30%) rotate(90deg) scale(1.1); }
  50% { transform: translate(-20%, 20%) rotate(180deg) scale(0.9); }
  75% { transform: translate(30%, 10%) rotate(270deg) scale(1.05); }
`;

const auroraMove2 = keyframes`
  0%, 100% { transform: translate(0%, 0%) rotate(0deg) scale(1); }
  25% { transform: translate(-30%, 20%) rotate(-90deg) scale(1.15); }
  50% { transform: translate(20%, -20%) rotate(-180deg) scale(0.85); }
  75% { transform: translate(-10%, 30%) rotate(-270deg) scale(1.1); }
`;

const auroraMove3 = keyframes`
  0%, 100% { transform: translate(0%, 0%) rotate(0deg); }
  33% { transform: translate(25%, -25%) rotate(120deg); }
  66% { transform: translate(-25%, 25%) rotate(240deg); }
`;

const AuroraContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
`;

const Blob = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  will-change: transform;
  
  &.blob-1 {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(255, 107, 53, 0.6) 0%, rgba(255, 107, 53, 0) 70%);
    top: -20%;
    left: -10%;
    animation: ${auroraMove1} 20s ease-in-out infinite;
  }
  
  &.blob-2 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(102, 252, 241, 0.5) 0%, rgba(102, 252, 241, 0) 70%);
    top: 30%;
    right: -15%;
    animation: ${auroraMove2} 25s ease-in-out infinite;
  }
  
  &.blob-3 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(247, 147, 30, 0.4) 0%, rgba(247, 147, 30, 0) 70%);
    bottom: -10%;
    left: 30%;
    animation: ${auroraMove3} 30s ease-in-out infinite;
  }
  
  &.blob-4 {
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(139, 92, 246, 0) 70%);
    top: 50%;
    left: 10%;
    animation: ${auroraMove2} 22s ease-in-out infinite reverse;
  }
`;

const AuroraBackground = ({ intensity = 1, className = '' }) => {
    return (
        <AuroraContainer
            className={`aurora-background ${className}`}
            style={{ opacity: intensity }}
        >
            <Blob className="blob-1" />
            <Blob className="blob-2" />
            <Blob className="blob-3" />
            <Blob className="blob-4" />
        </AuroraContainer>
    );
};

export default AuroraBackground;
