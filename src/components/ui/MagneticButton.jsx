import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * ELITE Magnetic Button
 * 
 * - Magnetic cursor attraction
 * - Ripple effect on click
 * - Glow on hover
 * - Scale animation
 */

const ButtonWrapper = styled(motion.div)`
  position: relative;
  display: inline-block;
`;

const StyledButton = styled(motion.button)`
  position: relative;
  padding: ${props => props.$size === 'large' ? '1.25rem 3rem' : '0.875rem 2rem'};
  font-family: 'Oswald', sans-serif;
  font-size: ${props => props.$size === 'large' ? '1.1rem' : '0.9rem'};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${props => props.$variant === 'outline' ? '#111' : '#fff'};
  background: ${props => props.$variant === 'outline'
        ? 'transparent'
        : 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'};
  border: 2px solid ${props => props.$variant === 'outline' ? '#111' : 'transparent'};
  border-radius: 50px;
  cursor: none;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease;
  }
  
  &:hover {
    box-shadow: ${props => props.$variant === 'outline'
        ? '0 10px 40px rgba(0, 0, 0, 0.15)'
        : '0 15px 50px rgba(255, 107, 53, 0.4)'};
    transform: translateY(-2px);
  }
  
  &:active::before {
    width: 300px;
    height: 300px;
  }
`;

const Glow = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50px;
  opacity: 0;
  background: radial-gradient(circle at center, rgba(255, 107, 53, 0.4), transparent 70%);
  pointer-events: none;
  z-index: -1;
`;

const MagneticButton = ({
    children,
    onClick,
    variant = 'filled',
    size = 'normal',
    magneticStrength = 0.3,
    className = '',
    ...props
}) => {
    const buttonRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { stiffness: 150, damping: 15 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    const handleMouseMove = (e) => {
        if (!buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        x.set(distanceX * magneticStrength);
        y.set(distanceY * magneticStrength);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    return (
        <ButtonWrapper
            ref={buttonRef}
            style={{ x: xSpring, y: ySpring }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            className={className}
        >
            <StyledButton
                $variant={variant}
                $size={size}
                onClick={onClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                {...props}
            >
                {children}
            </StyledButton>
            <Glow
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            />
        </ButtonWrapper>
    );
};

export default MagneticButton;
