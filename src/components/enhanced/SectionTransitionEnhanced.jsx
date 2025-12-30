import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// --- KEYFRAMES ---
const scanMove = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const rotateGear = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
`;

// --- STYLED COMPONENTS ---
const TransitionContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  height: ${props => props.$height || '200px'};
  background: ${props => props.$variant === 'light' 
    ? 'linear-gradient(180deg, #EAEAEA 0%, #F9F9F9 100%)' 
    : 'linear-gradient(180deg, #050505 0%, #0F0F0F 100%)'
  };
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Mechanical grid pattern */
  background-image: 
    linear-gradient(${props => props.$variant === 'light' 
      ? 'rgba(17, 17, 17, 0.03)' 
      : 'rgba(102, 252, 241, 0.02)'
    } 1px, transparent 1px),
    linear-gradient(90deg, ${props => props.$variant === 'light' 
      ? 'rgba(17, 17, 17, 0.03)' 
      : 'rgba(102, 252, 241, 0.02)'
    } 1px, transparent 1px);
  background-size: 30px 30px;
  
  @media (max-width: 768px) {
    height: ${props => props.$height ? `calc(${props.$height} * 0.7)` : '140px'};
  }
`;

const DiagonalWipe = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    transparent 0%,
    ${props => props.$variant === 'light' ? '#FF6B35' : '#66FCF1'} 50%,
    transparent 100%
  );
  opacity: 0.1;
  transform: translateX(-100%) skewX(-20deg);
  width: 200%;
`;

const ScanLine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    ${props => props.$variant === 'light' ? '#FF6B35' : '#66FCF1'} 50%,
    transparent 100%
  );
  animation: ${scanMove} 3s linear infinite;
  opacity: 0.6;
`;

const MechanicalGear = styled.div`
  position: absolute;
  width: ${props => props.$size || '60px'};
  height: ${props => props.$size || '60px'};
  border: 3px solid ${props => props.$variant === 'light' 
    ? 'rgba(17, 17, 17, 0.1)' 
    : 'rgba(102, 252, 241, 0.2)'
  };
  border-radius: 50%;
  ${props => props.$position};
  
  /* Gear teeth */
  &::before,
  &::after {
    content: '';
    position: absolute;
    background: ${props => props.$variant === 'light' 
      ? 'rgba(17, 17, 17, 0.1)' 
      : 'rgba(102, 252, 241, 0.2)'
    };
  }
  
  &::before {
    width: 100%;
    height: 3px;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
  
  &::after {
    width: 3px;
    height: 100%;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
  }
  
  animation: ${rotateGear} ${props => props.$speed || '10s'} linear infinite;
`;

const InnerGear = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  height: 60%;
  border: 2px solid ${props => props.$variant === 'light' 
    ? 'rgba(17, 17, 17, 0.15)' 
    : 'rgba(102, 252, 241, 0.3)'
  };
  border-radius: 50%;
  animation: ${rotateGear} ${props => props.$speed || '8s'} linear infinite reverse;
`;

const LabelContainer = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const SectionLabel = styled(motion.div)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${props => props.$variant === 'light' ? '#111' : '#66FCF1'};
  text-shadow: ${props => props.$variant === 'light' 
    ? '0 2px 10px rgba(0, 0, 0, 0.1)' 
    : '0 0 20px rgba(102, 252, 241, 0.3)'
  };
  
  /* Glitch effect */
  position: relative;
  
  &::before,
  &::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  &::before {
    left: 2px;
    text-shadow: -2px 0 ${props => props.$variant === 'light' ? '#FF6B35' : '#FF6B35'};
    animation: ${pulse} 2s ease-in-out infinite;
    opacity: 0.7;
  }
  
  &::after {
    left: -2px;
    text-shadow: 2px 0 ${props => props.$variant === 'light' ? '#66FCF1' : '#66FCF1'};
    animation: ${pulse} 3s ease-in-out infinite;
    opacity: 0.7;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const SubLabel = styled(motion.div)`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${props => props.$variant === 'light' ? '#666' : '#999'};
  
  @media (max-width: 768px) {
    font-size: 0.65rem;
  }
`;

const CornerBracket = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  border: 2px solid ${props => props.$variant === 'light' 
    ? 'rgba(255, 107, 53, 0.3)' 
    : 'rgba(102, 252, 241, 0.3)'
  };
  
  ${props => {
    switch(props.$corner) {
      case 'top-left':
        return `
          top: 20px;
          left: 20px;
          border-right: none;
          border-bottom: none;
        `;
      case 'top-right':
        return `
          top: 20px;
          right: 20px;
          border-left: none;
          border-bottom: none;
        `;
      case 'bottom-left':
        return `
          bottom: 20px;
          left: 20px;
          border-right: none;
          border-top: none;
        `;
      case 'bottom-right':
        return `
          bottom: 20px;
          right: 20px;
          border-left: none;
          border-top: none;
        `;
      default:
        return '';
    }
  }}
  
  &::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    background: ${props => props.$variant === 'light' ? '#FF6B35' : '#66FCF1'};
    border-radius: 50%;
    ${props => {
      switch(props.$corner) {
        case 'top-left': return 'top: -3px; left: -3px;';
        case 'top-right': return 'top: -3px; right: -3px;';
        case 'bottom-left': return 'bottom: -3px; left: -3px;';
        case 'bottom-right': return 'bottom: -3px; right: -3px;';
        default: return '';
      }
    }}
    animation: ${pulse} 2s ease-in-out infinite;
  }
  
  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
  }
`;

const CenterLine = styled(motion.div)`
  position: absolute;
  ${props => props.$horizontal ? 'width: 0%; height: 1px;' : 'width: 1px; height: 0%;'}
  background: linear-gradient(
    ${props => props.$horizontal ? '90deg' : '180deg'},
    transparent 0%,
    ${props => props.$variant === 'light' ? '#FF6B35' : '#66FCF1'} 50%,
    transparent 100%
  );
  ${props => props.$horizontal ? 'top: 50%; left: 0;' : 'left: 50%; top: 0;'}
  opacity: 0.5;
`;

// --- COMPONENT ---
const SectionTransitionEnhanced = ({
  variant = 'dark', // 'light' | 'dark'
  label = 'LOADING',
  subLabel = 'INITIALIZING SYSTEMS',
  height = '200px',
  showGears = true,
  showBrackets = true,
  showScanLine = true,
  animated = true,
  ...props
}) => {
  const wipeVariants = {
    initial: { x: '-100%' },
    animate: { 
      x: '100%',
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const labelVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const lineVariants = {
    initial: { scaleX: 0, scaleY: 0 },
    animate: { 
      scaleX: 1,
      scaleY: 1,
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  return (
    <TransitionContainer 
      $variant={variant} 
      $height={height}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      {...props}
    >
      {/* Diagonal wipe effect */}
      {animated && (
        <DiagonalWipe
          $variant={variant}
          variants={wipeVariants}
          initial="initial"
          animate="animate"
        />
      )}

      {/* Scan line */}
      {showScanLine && <ScanLine $variant={variant} />}

      {/* Corner brackets */}
      {showBrackets && (
        <>
          <CornerBracket $variant={variant} $corner="top-left" />
          <CornerBracket $variant={variant} $corner="top-right" />
          <CornerBracket $variant={variant} $corner="bottom-left" />
          <CornerBracket $variant={variant} $corner="bottom-right" />
        </>
      )}

      {/* Mechanical gears */}
      {showGears && (
        <>
          <MechanicalGear 
            $variant={variant} 
            $size="60px"
            $speed="10s"
            $position="top: 30%; left: 10%;"
          >
            <InnerGear $variant={variant} $speed="8s" />
          </MechanicalGear>
          
          <MechanicalGear 
            $variant={variant} 
            $size="80px"
            $speed="15s"
            $position="bottom: 20%; right: 15%;"
          >
            <InnerGear $variant={variant} $speed="12s" />
          </MechanicalGear>
          
          <MechanicalGear 
            $variant={variant} 
            $size="40px"
            $speed="8s"
            $position="top: 60%; left: 80%;"
          >
            <InnerGear $variant={variant} $speed="6s" />
          </MechanicalGear>
        </>
      )}

      {/* Center lines */}
      <CenterLine
        $variant={variant}
        $horizontal={true}
        variants={lineVariants}
        initial="initial"
        animate="animate"
      />
      <CenterLine
        $variant={variant}
        $horizontal={false}
        variants={lineVariants}
        initial="initial"
        animate="animate"
      />

      {/* Label */}
      <LabelContainer>
        <SectionLabel
          $variant={variant}
          data-text={label}
          variants={labelVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {label}
        </SectionLabel>
        
        {subLabel && (
          <SubLabel
            $variant={variant}
            variants={labelVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {subLabel}
          </SubLabel>
        )}
      </LabelContainer>
    </TransitionContainer>
  );
};

export default SectionTransitionEnhanced;
