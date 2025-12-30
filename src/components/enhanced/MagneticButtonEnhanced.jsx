import React, { useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';
import { useSound } from '../../hooks/useSound';

// --- KEYFRAMES ---
const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 0.8;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(102, 252, 241, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(102, 252, 241, 0); }
`;

// --- STYLED COMPONENTS ---
const ButtonWrapper = styled(motion.button)`
  position: relative;
  padding: ${props => props.$size === 'large' ? '18px 48px' : props.$size === 'small' ? '10px 24px' : '14px 36px'};
  font-family: 'JetBrains Mono', monospace;
  font-size: ${props => props.$size === 'large' ? '1.1rem' : props.$size === 'small' ? '0.85rem' : '1rem'};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${props => props.$variant === 'secondary' ? '#111' : '#EAEAEA'};
  background: ${props => {
    if (props.$variant === 'secondary') return 'linear-gradient(135deg, #F9F9F9, #E0E0E0)';
    if (props.$variant === 'accent') return 'linear-gradient(135deg, #66FCF1, #4DCFC5)';
    return 'linear-gradient(135deg, #FF6B35, #E85A28)';
  }};
  border: 2px solid ${props => {
    if (props.$variant === 'secondary') return 'rgba(17, 17, 17, 0.2)';
    if (props.$variant === 'accent') return '#66FCF1';
    return '#FF6B35';
  }};
  border-radius: ${props => props.$rounded ? '50px' : '8px'};
  cursor: pointer;
  overflow: hidden;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, box-shadow;
  transform-style: preserve-3d;
  
  /* 3D depth effect */
  box-shadow: 
    0 4px 15px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  
  /* Shimmer overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  &:hover::before {
    left: 100%;
  }
  
  /* Glow effect on hover */
  &:hover {
    box-shadow: 
      0 8px 25px ${props => {
        if (props.$variant === 'accent') return 'rgba(102, 252, 241, 0.4)';
        if (props.$variant === 'secondary') return 'rgba(17, 17, 17, 0.2)';
        return 'rgba(255, 107, 53, 0.4)';
      }},
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      inset 0 -1px 0 rgba(0, 0, 0, 0.2);
  }
  
  /* Active state */
  &:active {
    transform: translateY(2px) scale(0.98);
    box-shadow: 
      0 2px 10px rgba(0, 0, 0, 0.2),
      inset 0 1px 3px rgba(0, 0, 0, 0.3);
  }
  
  /* Focus visible for accessibility */
  &:focus-visible {
    outline: 3px solid ${props => props.$variant === 'accent' ? '#66FCF1' : '#FF6B35'};
    outline-offset: 4px;
  }
  
  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    filter: grayscale(60%);
  }
  
  @media (max-width: 768px) {
    padding: ${props => props.$size === 'large' ? '14px 32px' : props.$size === 'small' ? '8px 18px' : '12px 28px'};
    font-size: ${props => props.$size === 'large' ? '1rem' : props.$size === 'small' ? '0.8rem' : '0.9rem'};
  }
`;

const ButtonContent = styled.span`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
`;

const IconWrapper = styled.span`
  display: inline-flex;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${ButtonWrapper}:hover & {
    transform: ${props => props.$iconPosition === 'right' ? 'translateX(5px)' : 'translateX(-5px)'};
  }
`;

const RippleEffect = styled.span`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  pointer-events: none;
  animation: ${ripple} 0.6s ease-out;
`;

const ParticleEffect = styled(motion.span)`
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
  pointer-events: none;
`;

// --- MAGNETIC BUTTON COMPONENT ---
const MagneticButtonEnhanced = ({
  children,
  onClick,
  variant = 'primary', // 'primary' | 'secondary' | 'accent'
  size = 'medium', // 'small' | 'medium' | 'large'
  icon,
  iconPosition = 'right', // 'left' | 'right'
  rounded = true,
  disabled = false,
  magneticStrength = 0.3, // 0 to 1
  ...props
}) => {
  const buttonRef = useRef(null);
  const [ripples, setRipples] = useState([]);
  const [particles, setParticles] = useState([]);
  const { setCursor } = useCursor();
  const { playClick, playHover } = useSound();

  // Magnetic effect using motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // 3D rotation based on mouse position
  const rotateX = useTransform(springY, [-50, 50], [10, -10]);
  const rotateY = useTransform(springX, [-50, 50], [-10, 10]);

  const handleMouseMove = (e) => {
    if (!buttonRef.current || disabled) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * magneticStrength;
    const deltaY = (e.clientY - centerY) * magneticStrength;

    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setCursor('default');
  };

  const handleMouseEnter = () => {
    if (!disabled) {
      setCursor('button');
      playHover();
    }
  };

  const handleClick = (e) => {
    if (disabled) return;

    playClick();

    // Create ripple effect
    const rect = buttonRef.current.getBoundingClientRect();
    const rippleX = e.clientX - rect.left;
    const rippleY = e.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x: rippleX,
      y: rippleY,
      size: Math.max(rect.width, rect.height)
    };

    setRipples(prev => [...prev, newRipple]);

    // Create particle burst
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      angle: (i / 8) * Math.PI * 2,
      distance: 50
    }));

    setParticles(newParticles);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);

    // Remove particles after animation
    setTimeout(() => {
      setParticles([]);
    }, 800);

    onClick?.(e);
  };

  return (
    <ButtonWrapper
      ref={buttonRef}
      $variant={variant}
      $size={size}
      $rounded={rounded}
      disabled={disabled}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        x: springX,
        y: springY,
        rotateX,
        rotateY
      }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      <ButtonContent>
        {icon && iconPosition === 'left' && (
          <IconWrapper $iconPosition="left">{icon}</IconWrapper>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <IconWrapper $iconPosition="right">{icon}</IconWrapper>
        )}
      </ButtonContent>

      {/* Ripple effects */}
      {ripples.map(ripple => (
        <RippleEffect
          key={ripple.id}
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            marginLeft: -ripple.size / 2,
            marginTop: -ripple.size / 2
          }}
        />
      ))}

      {/* Particle effects */}
      {particles.map(particle => (
        <ParticleEffect
          key={particle.id}
          initial={{ 
            x: 0, 
            y: 0, 
            opacity: 1,
            scale: 1
          }}
          animate={{ 
            x: Math.cos(particle.angle) * particle.distance,
            y: Math.sin(particle.angle) * particle.distance,
            opacity: 0,
            scale: 0
          }}
          transition={{ 
            duration: 0.6,
            ease: "easeOut"
          }}
          style={{
            left: '50%',
            top: '50%'
          }}
        />
      ))}
    </ButtonWrapper>
  );
};

export default MagneticButtonEnhanced;
