import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const PlaceholderContainer = styled(motion.div)`
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '400px'};
  background: linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%);
  border: 2px dashed rgba(102, 252, 241, 0.3);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
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
      rgba(102, 252, 241, 0.1),
      transparent
    );
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
`;

const Icon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const Title = styled.h3`
  font-family: 'JetBrains Mono', monospace;
  color: #66FCF1;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  color: rgba(234, 234, 234, 0.6);
  font-size: 0.9rem;
  margin: 0;
  text-align: center;
  max-width: 80%;
`;

const Badge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 107, 53, 0.2);
  border: 1px solid #FF6B35;
  color: #FF6B35;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

/**
 * MediaPlaceholder Component
 * Displays while actual media assets are being generated
 * 
 * @param {string} type - Type of media: 'video', 'image', 'avatar'
 * @param {string} projectName - Name of the project
 * @param {string} width - CSS width value
 * @param {string} height - CSS height value
 */
const MediaPlaceholder = ({ 
  type = 'image', 
  projectName = 'Project', 
  width, 
  height,
  message = 'Media asset coming soon'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'video':
        return '🎬';
      case 'avatar':
        return '👤';
      case 'gallery':
        return '🖼️';
      default:
        return '📸';
    }
  };

  const getDefaultHeight = () => {
    switch (type) {
      case 'video':
        return '600px';
      case 'avatar':
        return '400px';
      case 'gallery':
        return '500px';
      default:
        return '400px';
    }
  };

  return (
    <PlaceholderContainer
      $width={width}
      $height={height || getDefaultHeight()}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Badge>In Production</Badge>
      <Icon>{getIcon()}</Icon>
      <Title>{projectName}</Title>
      <Subtitle>{message}</Subtitle>
    </PlaceholderContainer>
  );
};

export default MediaPlaceholder;
