import React, { useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';
import { useSound } from '../../hooks/useSound';

// --- KEYFRAMES ---
const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const borderGlow = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

// --- STYLED COMPONENTS ---
const CardContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 500px;
  cursor: pointer;
  perspective: 1500px;
  transform-style: preserve-3d;
  
  @media (max-width: 768px) {
    height: 400px;
  }
`;

const CardInner = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 100%);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 107, 53, 0.2),
    inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  transform-style: preserve-3d;
  will-change: transform;
  
  /* Animated border */
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(
      135deg,
      #FF6B35 0%,
      #66FCF1 50%,
      #FF6B35 100%
    );
    background-size: 200% 200%;
    border-radius: 18px;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.4s ease;
    animation: ${borderGlow} 3s ease-in-out infinite;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      transparent 0%,
      transparent 50%,
      rgba(0, 0, 0, 0.8) 100%
    );
    pointer-events: none;
    z-index: 1;
  }
`;

const ProjectImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(50%) contrast(1.1);
  transition: filter 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, filter;
  
  ${CardContainer}:hover & {
    filter: grayscale(0%) contrast(1.2);
    transform: scale(1.1);
  }
`;

const ShimmerOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(102, 252, 241, 0.3) 50%,
    transparent 100%
  );
  transform: translateX(-100%);
  pointer-events: none;
  z-index: 2;
  
  ${CardContainer}:hover & {
    animation: ${shimmer} 1.5s ease-in-out;
  }
`;

const ContentOverlay = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32px;
  z-index: 3;
  
  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const CategoryTag = styled(motion.div)`
  display: inline-block;
  padding: 6px 16px;
  background: rgba(102, 252, 241, 0.2);
  border: 1px solid #66FCF1;
  border-radius: 20px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  color: #66FCF1;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 20px rgba(102, 252, 241, 0.3);
`;

const Title = styled(motion.h3)`
  font-family: 'Oswald', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #EAEAEA;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  line-height: 1.1;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Description = styled(motion.p)`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #CCC;
  line-height: 1.6;
  margin: 0 0 16px 0;
  max-width: 600px;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const TechStack = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const TechTag = styled(motion.span)`
  padding: 6px 12px;
  background: rgba(255, 107, 53, 0.15);
  border: 1px solid rgba(255, 107, 53, 0.3);
  border-radius: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  font-weight: 600;
  color: #FF6B35;
  letter-spacing: 0.05em;
  backdrop-filter: blur(5px);
  
  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 5px 10px;
  }
`;

const HoverIndicator = styled(motion.div)`
  position: absolute;
  bottom: 32px;
  right: 32px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B35, #E85A28);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #FFF;
  box-shadow: 
    0 4px 20px rgba(255, 107, 53, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  z-index: 4;
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    bottom: 24px;
    right: 24px;
  }
`;

const CornerAccent = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  border: 2px solid #66FCF1;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 5;
  
  &.top-left {
    top: 16px;
    left: 16px;
    border-right: none;
    border-bottom: none;
  }
  
  &.top-right {
    top: 16px;
    right: 16px;
    border-left: none;
    border-bottom: none;
  }
  
  &.bottom-left {
    bottom: 16px;
    left: 16px;
    border-right: none;
    border-top: none;
  }
  
  &.bottom-right {
    bottom: 16px;
    right: 16px;
    border-left: none;
    border-top: none;
  }
  
  ${CardContainer}:hover & {
    opacity: 0.8;
  }
`;

// --- COMPONENT ---
const ProjectCardEnhanced = ({ project, onClick }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const { setCursor } = useCursor();
  const { playHover, playClick } = useSound();

  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = (e.clientX - centerX) / (rect.width / 2);
    const mouseY = (e.clientY - centerY) / (rect.height / 2);

    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setCursor('text', 'VIEW');
    playHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
    setCursor('default');
  };

  const handleClick = () => {
    playClick();
    onClick?.(project);
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <CardContainer
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <CardInner
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
      >
        <ImageWrapper>
          <ProjectImage
            src={project.img || '/projects/placeholder.webp'}
            alt={project.title}
            loading="lazy"
            style={{
              scale: isHovered ? 1.1 : 1
            }}
          />
          <ShimmerOverlay />
        </ImageWrapper>

        <ContentOverlay
          variants={contentVariants}
          initial="hidden"
          animate={isHovered ? "visible" : "hidden"}
        >
          <CategoryTag variants={itemVariants}>
            {project.cat || project.category}
          </CategoryTag>
          
          <Title variants={itemVariants}>
            {project.title}
          </Title>
          
          {project.subtitle && (
            <Description variants={itemVariants}>
              {project.subtitle}
            </Description>
          )}
          
          {project.tech && project.tech.length > 0 && (
            <TechStack variants={itemVariants}>
              {project.tech.slice(0, 4).map((tech, index) => (
                <TechTag
                  key={index}
                  variants={itemVariants}
                >
                  {tech}
                </TechTag>
              ))}
            </TechStack>
          )}
        </ContentOverlay>

        <HoverIndicator
          initial={{ scale: 0, rotate: -180 }}
          animate={isHovered ? { 
            scale: 1, 
            rotate: 0,
            transition: { 
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          } : { 
            scale: 0, 
            rotate: -180,
            transition: { duration: 0.2 }
          }}
        >
          →
        </HoverIndicator>

        <CornerAccent className="top-left" />
        <CornerAccent className="top-right" />
        <CornerAccent className="bottom-left" />
        <CornerAccent className="bottom-right" />
      </CardInner>
    </CardContainer>
  );
};

export default ProjectCardEnhanced;
