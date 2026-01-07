import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

const liquidMorph = keyframes`
  0%, 100% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }
  25% {
    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
  }
  50% {
    border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%;
  }
  75% {
    border-radius: 60% 40% 60% 30% / 70% 30% 50% 60%;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

const pulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(255, 107, 53, 0.4);
  }
  50% {
    box-shadow: 0 0 0 15px rgba(255, 107, 53, 0);
  }
`;

const LiquidButtonWrapper = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: ${props => props.$size === 'large' ? '1.25rem 2.5rem' : props.$size === 'small' ? '0.75rem 1.5rem' : '1rem 2rem'};
  font-family: 'Inter', sans-serif;
  font-size: ${props => props.$size === 'large' ? '1.1rem' : props.$size === 'small' ? '0.85rem' : '0.95rem'};
  font-weight: 600;
  color: ${props => props.$variant === 'secondary' ? '#fff' : '#050505'};
  background: ${props => props.$variant === 'secondary'
        ? 'transparent'
        : 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'};
  border: ${props => props.$variant === 'secondary'
        ? '2px solid rgba(255, 255, 255, 0.3)'
        : 'none'};
  border-radius: 50px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-decoration: none;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      120deg,
      transparent 30%,
      rgba(255, 255, 255, 0.4) 50%,
      transparent 70%
    );
    background-size: 200% 100%;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, #FF6B35, #66FCF1, #FF6B35);
    border-radius: 52px;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
    filter: blur(8px);
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 15px 40px rgba(255, 107, 53, 0.4);
    
    &::before {
      opacity: 1;
      animation: ${shimmer} 1.5s infinite;
    }
    
    &::after {
      opacity: 0.6;
    }
  }
  
  &:active {
    transform: translateY(-1px) scale(0.98);
  }
  
  ${props => props.$liquid && css`
    &:hover {
      animation: ${liquidMorph} 4s ease-in-out infinite;
    }
  `}
  
  ${props => props.$pulse && css`
    animation: ${pulse} 2s ease-in-out infinite;
  `}
  
  .btn-text {
    position: relative;
    z-index: 1;
  }
  
  .btn-icon {
    position: relative;
    z-index: 1;
    transition: transform 0.3s ease;
  }
  
  &:hover .btn-icon {
    transform: translateX(4px);
  }
`;

const MagneticWrapper = styled.span`
  display: inline-block;
  transition: transform 0.3s ease;
`;

const LiquidButton = ({
    children,
    variant = 'primary',
    size = 'medium',
    liquid = false,
    pulse = false,
    magnetic = true,
    icon,
    as = 'button',
    href,
    onClick,
    className = '',
    ...props
}) => {
    const [transform, setTransform] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        if (!magnetic) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        setTransform({ x: x * 0.2, y: y * 0.2 });
    };

    const handleMouseLeave = () => {
        setTransform({ x: 0, y: 0 });
    };

    const Component = href ? 'a' : as;

    return (
        <MagneticWrapper
            style={{ transform: `translate(${transform.x}px, ${transform.y}px)` }}
            data-magnetic={magnetic ? 'true' : undefined}
        >
            <LiquidButtonWrapper
                as={Component}
                href={href}
                onClick={onClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                $variant={variant}
                $size={size}
                $liquid={liquid}
                $pulse={pulse}
                className={`liquid-button ${className}`}
                {...props}
            >
                <span className="btn-text">{children}</span>
                {icon && <span className="btn-icon">{icon}</span>}
            </LiquidButtonWrapper>
        </MagneticWrapper>
    );
};

export default LiquidButton;
