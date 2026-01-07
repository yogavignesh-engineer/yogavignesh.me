import React from 'react';
import styled, { css } from 'styled-components';

const GlassCard = styled.div`
  position: relative;
  background: ${props => props.$dark
        ? 'rgba(10, 10, 10, 0.7)'
        : 'rgba(255, 255, 255, 0.05)'};
  backdrop-filter: blur(${props => props.$blur || 20}px);
  -webkit-backdrop-filter: blur(${props => props.$blur || 20}px);
  border-radius: ${props => props.$radius || 24}px;
  border: 1px solid rgba(255, 255, 255, ${props => props.$borderOpacity || 0.1});
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  ${props => props.$glow && css`
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.3),
      inset 0 0 60px rgba(255, 107, 53, 0.05);
  `}
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 100%;
    background: linear-gradient(
      180deg,
      transparent,
      rgba(255, 255, 255, 0.15),
      transparent
    );
  }
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 107, 53, 0.3);
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.4),
      0 0 40px rgba(255, 107, 53, 0.1);
  }
  
  ${props => props.$interactive && css`
    cursor: pointer;
    
    &:active {
      transform: translateY(-2px) scale(0.98);
    }
  `}
`;

const GlassContent = styled.div`
  position: relative;
  z-index: 1;
  padding: ${props => props.$padding || '2rem'};
`;

const Glassmorphism = ({
    children,
    dark = true,
    blur = 20,
    radius = 24,
    borderOpacity = 0.1,
    glow = true,
    interactive = false,
    padding = '2rem',
    className = '',
    style = {},
    onClick,
    ...props
}) => {
    return (
        <GlassCard
            className={`glassmorphism ${className}`}
            $dark={dark}
            $blur={blur}
            $radius={radius}
            $borderOpacity={borderOpacity}
            $glow={glow}
            $interactive={interactive}
            onClick={onClick}
            style={style}
            {...props}
        >
            <GlassContent $padding={padding}>
                {children}
            </GlassContent>
        </GlassCard>
    );
};

export default Glassmorphism;
