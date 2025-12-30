import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// --- KEYFRAMES ---
const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// --- SKELETON LOADERS ---
const SkeletonBase = styled.div`
  background: ${props => props.$variant === 'light' 
    ? 'linear-gradient(90deg, #E0E0E0 0%, #F0F0F0 50%, #E0E0E0 100%)'
    : 'linear-gradient(90deg, #1A1A1A 0%, #2A2A2A 50%, #1A1A1A 100%)'
  };
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  border-radius: ${props => props.$radius || '4px'};
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${props => props.$variant === 'light' 
        ? 'rgba(255, 255, 255, 0.4)' 
        : 'rgba(255, 255, 255, 0.1)'
      } 50%,
      transparent 100%
    );
    animation: ${shimmer} 2s ease-in-out infinite;
  }
`;

export const SkeletonText = styled(SkeletonBase)`
  height: ${props => props.$height || '20px'};
  width: ${props => props.$width || '100%'};
  margin: ${props => props.$margin || '0 0 12px 0'};
`;

export const SkeletonCircle = styled(SkeletonBase)`
  width: ${props => props.$size || '60px'};
  height: ${props => props.$size || '60px'};
  border-radius: 50%;
`;

export const SkeletonCard = styled(SkeletonBase)`
  width: 100%;
  height: ${props => props.$height || '300px'};
  border-radius: ${props => props.$radius || '16px'};
`;

export const SkeletonImage = styled(SkeletonBase)`
  width: 100%;
  aspect-ratio: ${props => props.$ratio || '16/9'};
  border-radius: ${props => props.$radius || '8px'};
`;

// --- PROJECT CARD SKELETON ---
const CardSkeletonWrapper = styled.div`
  width: 100%;
  padding: 24px;
  background: ${props => props.$variant === 'light' ? '#F9F9F9' : '#0A0A0A'};
  border-radius: 16px;
  border: 1px solid ${props => props.$variant === 'light' 
    ? 'rgba(0, 0, 0, 0.1)' 
    : 'rgba(255, 255, 255, 0.1)'
  };
`;

export const ProjectCardSkeleton = ({ variant = 'dark' }) => (
  <CardSkeletonWrapper $variant={variant}>
    <SkeletonImage $variant={variant} $ratio="16/9" $radius="12px" />
    <div style={{ marginTop: '16px' }}>
      <SkeletonText $variant={variant} $height="14px" $width="30%" />
      <SkeletonText $variant={variant} $height="24px" $width="80%" />
      <SkeletonText $variant={variant} $height="16px" $width="100%" />
      <SkeletonText $variant={variant} $height="16px" $width="90%" />
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <SkeletonText $variant={variant} $height="28px" $width="80px" />
        <SkeletonText $variant={variant} $height="28px" $width="100px" />
        <SkeletonText $variant={variant} $height="28px" $width="90px" />
      </div>
    </div>
  </CardSkeletonWrapper>
);

// --- LOADING SPINNERS ---
const SpinnerContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.$size || '60px'};
  height: ${props => props.$size || '60px'};
`;

const MechanicalSpinner = styled.div`
  width: 100%;
  height: 100%;
  border: 3px solid ${props => props.$variant === 'light' 
    ? 'rgba(17, 17, 17, 0.1)' 
    : 'rgba(102, 252, 241, 0.2)'
  };
  border-top-color: ${props => props.$variant === 'light' ? '#FF6B35' : '#66FCF1'};
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
  position: relative;
  
  &::before {
    content: '';
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
    border-top-color: ${props => props.$variant === 'light' ? '#FF6B35' : '#66FCF1'};
    border-radius: 50%;
    animation: ${rotate} 0.6s linear infinite reverse;
  }
`;

export const LoadingSpinner = ({ size = '60px', variant = 'dark' }) => (
  <SpinnerContainer $size={size}>
    <MechanicalSpinner $variant={variant} />
  </SpinnerContainer>
);

// --- GEAR LOADER ---
const GearLoader = styled.div`
  width: ${props => props.$size || '60px'};
  height: ${props => props.$size || '60px'};
  border: 4px solid ${props => props.$variant === 'light' 
    ? 'rgba(17, 17, 17, 0.2)' 
    : 'rgba(102, 252, 241, 0.3)'
  };
  border-radius: 50%;
  position: relative;
  animation: ${rotate} 2s linear infinite;
  
  /* Gear teeth */
  &::before,
  &::after {
    content: '';
    position: absolute;
    background: ${props => props.$variant === 'light' ? '#111' : '#66FCF1'};
  }
  
  &::before {
    width: 100%;
    height: 4px;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
  
  &::after {
    width: 4px;
    height: 100%;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
  }
`;

export const LoadingGear = ({ size = '60px', variant = 'dark' }) => (
  <GearLoader $size={size} $variant={variant} />
);

// --- DOTS LOADER ---
const DotsContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Dot = styled.div`
  width: ${props => props.$size || '12px'};
  height: ${props => props.$size || '12px'};
  background: ${props => props.$variant === 'light' ? '#FF6B35' : '#66FCF1'};
  border-radius: 50%;
  animation: ${bounce} 1.4s ease-in-out infinite;
  animation-delay: ${props => props.$delay || '0s'};
`;

export const LoadingDots = ({ size = '12px', variant = 'dark' }) => (
  <DotsContainer>
    <Dot $size={size} $variant={variant} $delay="0s" />
    <Dot $size={size} $variant={variant} $delay="0.2s" />
    <Dot $size={size} $variant={variant} $delay="0.4s" />
  </DotsContainer>
);

// --- PROGRESS BAR ---
const ProgressContainer = styled.div`
  width: 100%;
  height: ${props => props.$height || '8px'};
  background: ${props => props.$variant === 'light' 
    ? 'rgba(0, 0, 0, 0.1)' 
    : 'rgba(255, 255, 255, 0.1)'
  };
  border-radius: 100px;
  overflow: hidden;
  position: relative;
`;

const ProgressBar = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #FF6B35 0%, #66FCF1 100%);
  border-radius: 100px;
  box-shadow: 0 0 10px ${props => props.$variant === 'light' 
    ? 'rgba(255, 107, 53, 0.5)' 
    : 'rgba(102, 252, 241, 0.5)'
  };
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 100%
    );
    animation: ${shimmer} 2s ease-in-out infinite;
  }
`;

export const LoadingProgress = ({ 
  progress = 0, 
  height = '8px', 
  variant = 'dark',
  animated = true 
}) => (
  <ProgressContainer $height={height} $variant={variant}>
    <ProgressBar
      $variant={variant}
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ 
        duration: animated ? 0.5 : 0, 
        ease: 'easeOut' 
      }}
    />
  </ProgressContainer>
);

// --- FULL PAGE LOADER ---
const FullPageContainer = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: ${props => props.$variant === 'light' 
    ? 'linear-gradient(135deg, #F9F9F9 0%, #E8E8E8 100%)' 
    : 'linear-gradient(135deg, #050505 0%, #1A1A1A 100%)'
  };
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
  z-index: 10000;
  
  /* Grid background */
  background-image: 
    linear-gradient(${props => props.$variant === 'light' 
      ? 'rgba(17, 17, 17, 0.03)' 
      : 'rgba(102, 252, 241, 0.02)'
    } 1px, transparent 1px),
    linear-gradient(90deg, ${props => props.$variant === 'light' 
      ? 'rgba(17, 17, 17, 0.03)' 
      : 'rgba(102, 252, 241, 0.02)'
    } 1px, transparent 1px);
  background-size: 40px 40px;
`;

const LoadingText = styled(motion.div)`
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
`;

const PercentageText = styled(motion.div)`
  font-family: 'Oswald', sans-serif;
  font-size: 4rem;
  font-weight: 700;
  color: ${props => props.$variant === 'light' ? '#FF6B35' : '#66FCF1'};
  text-shadow: 0 0 30px currentColor;
`;

export const FullPageLoader = ({ 
  variant = 'dark',
  message = 'LOADING',
  progress = null, // null for indeterminate
  onComplete
}) => {
  return (
    <FullPageContainer
      $variant={variant}
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.6 }
      }}
    >
      {progress !== null ? (
        <>
          <PercentageText
            $variant={variant}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {Math.round(progress)}%
          </PercentageText>
          
          <div style={{ width: '400px', maxWidth: '80vw' }}>
            <LoadingProgress 
              progress={progress} 
              height="12px" 
              variant={variant}
            />
          </div>
        </>
      ) : (
        <LoadingGear size="80px" variant={variant} />
      )}
      
      <LoadingText
        $variant={variant}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {message}
      </LoadingText>
      
      <LoadingDots size="14px" variant={variant} />
    </FullPageContainer>
  );
};

export default {
  SkeletonText,
  SkeletonCircle,
  SkeletonCard,
  SkeletonImage,
  ProjectCardSkeleton,
  LoadingSpinner,
  LoadingGear,
  LoadingDots,
  LoadingProgress,
  FullPageLoader
};
