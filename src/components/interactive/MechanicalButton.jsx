import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useSound } from '../../hooks/useSound';

// Container for button with glow effect
const ButtonContainer = styled(motion.button)`
  position: relative;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font-family: 'Oswald', sans-serif;
  overflow: hidden;
  
  /* Remove default button styles */
  outline: none;
  -webkit-tap-highlight-color: transparent;
  
  &:focus-visible {
    outline: 2px solid #FF6B35;
    outline-offset: 4px;
  }
`;

// Main button body (mechanical switch)
const SwitchBody = styled(motion.div)`
  position: relative;
  padding: ${props => props.$size === 'large' ? '1.2rem 2.5rem' : '0.9rem 2rem'};
  background: linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 100%);
  border: 2px solid #333;
  clip-path: polygon(
    12px 0, 100% 0, 100% calc(100% - 12px), 
    calc(100% - 12px) 100%, 0 100%, 0 12px
  );
  
  font-size: ${props => props.$size === 'large' ? '1.1rem' : '0.95rem'};
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #EAEAEA;
  
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  will-change: transform;
  
  /* Metallic sheen */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.5s ease;
  }
  
  /* Active pressed state */
  ${ButtonContainer}:active & {
    transform: translateY(2px);
    box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.5);
  }
`;

// Orange accent stripe (industrial safety marking)
const AccentStripe = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #FF6B35 0%, #E85A28 100%);
  box-shadow: 0 0 10px rgba(255, 107, 53, 0.5);
  
  ${ButtonContainer}:hover & {
    width: 100%;
    transition: width 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
`;

// Glowing border on hover
const GlowBorder = styled(motion.div)`
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #FF6B35, #4A90E2, #FF6B35);
  background-size: 300% 300%;
  opacity: 0;
  z-index: -1;
  border-radius: 2px;
  filter: blur(8px);
  
  ${ButtonContainer}:hover & {
    opacity: 0.6;
    animation: gradientShift 2s ease infinite;
  }
  
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`;

// Corner bracket indicators
const CornerBrackets = styled.div`
  position: absolute;
  inset: -6px;
  pointer-events: none;
  
  &::before,
  &::after,
  span::before,
  span::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    border: 2px solid #FF6B35;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  ${ButtonContainer}:hover & {
    &::before,
    &::after,
    span::before,
    span::after {
      opacity: 1;
    }
  }
  
  &::before { top: 0; left: 0; border-right: none; border-bottom: none; }
  &::after { top: 0; right: 0; border-left: none; border-bottom: none; }
  span::before { bottom: 0; left: 0; border-right: none; border-top: none; }
  span::after { bottom: 0; right: 0; border-left: none; border-top: none; }
`;

// LED indicator light
const LEDIndicator = styled(motion.div)`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 6px;
  height: 6px;
  background: ${props => props.$active ? '#4CAF50' : '#333'};
  border-radius: 50%;
  box-shadow: ${props => props.$active ? '0 0 8px #4CAF50' : 'none'};
  transition: all 0.3s ease;
  
  ${ButtonContainer}:hover & {
    background: #4CAF50;
    box-shadow: 0 0 12px #4CAF50;
  }
`;

// Text content with slide effect
const ButtonText = styled(motion.span)`
  position: relative;
  z-index: 1;
  display: inline-block;
`;

/**
 * MechanicalButton Component
 * Award-winning mechanical switch button with industrial aesthetics
 * 
 * Props:
 * - children: Button text
 * - onClick: Click handler
 * - size: 'normal' | 'large' (default: 'normal')
 * - variant: 'primary' | 'secondary' (default: 'primary')
 * - showLED: boolean (default: true)
 * - disabled: boolean
 */
const MechanicalButton = ({
  children,
  onClick,
  size = 'normal',
  variant = 'primary',
  showLED = true,
  disabled = false,
  className,
  ...props
}) => {
  const { playClick, playHover } = useSound();

  const handleClick = (e) => {
    playClick();
    if (onClick) onClick(e);
  };

  const handleMouseEnter = () => {
    playHover();
  };

  return (
    <ButtonContainer
      className={className}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      <GlowBorder />
      <AccentStripe />

      <SwitchBody $size={size}>
        {showLED && <LEDIndicator $active={!disabled} />}

        <ButtonText
          initial={{ x: 0 }}
          whileHover={{ x: 2 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          {children}
        </ButtonText>

        <CornerBrackets>
          <span />
        </CornerBrackets>
      </SwitchBody>
    </ButtonContainer>
  );
};

export default MechanicalButton;
