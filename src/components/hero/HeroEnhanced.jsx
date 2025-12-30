import React, { useMemo, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useReducedMotion, useTransform, useMotionValue, useSpring } from 'framer-motion';

// PERFORMANCE: Use webp for smaller file size.
const MY_IMAGE_URL = "/image.webp";

// --- ENHANCED KEYFRAMES ---
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
`;

const glitch = keyframes`
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
`;

const holographicShift = keyframes`
  0%, 100% { 
    background-position: 0% 50%;
    filter: hue-rotate(0deg);
  }
  50% { 
    background-position: 100% 50%;
    filter: hue-rotate(20deg);
  }
`;

const float3D = keyframes`
  0%, 100% { transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg); }
  25% { transform: translate3d(10px, -10px, 20px) rotateX(5deg) rotateY(5deg); }
  50% { transform: translate3d(0, -20px, 40px) rotateX(-5deg) rotateY(10deg); }
  75% { transform: translate3d(-10px, -10px, 20px) rotateX(5deg) rotateY(-5deg); }
`;

// --- ENHANCED WRAPPER ---
const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1500px;
  z-index: 1;
  overflow: hidden;
  background: linear-gradient(135deg, #F9F9F9 0%, #E8E8E8 100%);
  
  /* Animated grid background */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(17, 17, 17, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(17, 17, 17, 0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    background-position: 0 0, 0 0;
    animation: gridPulse 20s linear infinite;
    pointer-events: none;
  }
  
  @keyframes gridPulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 0.8; }
  }
  
  /* Scanline effect */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(102, 252, 241, 0.1) 50%,
      transparent 100%
    );
    height: 3px;
    animation: ${scanline} 8s linear infinite;
    pointer-events: none;
    z-index: 5;
  }
  
  @media (max-width: 768px) {
    height: 100vh;
  }
`;

// --- FLOATING GEOMETRIC ELEMENTS ---
const FloatingShape = styled(motion.div)`
  position: absolute;
  border: 2px solid rgba(255, 107, 53, 0.3);
  pointer-events: none;
  will-change: transform;
  transform-style: preserve-3d;
  
  &.circle {
    border-radius: 50%;
  }
  
  &.triangle {
    width: 0;
    height: 0;
    border-left: 40px solid transparent;
    border-right: 40px solid transparent;
    border-bottom: 70px solid rgba(102, 252, 241, 0.2);
    border-width: 35px 20px 60px 20px;
  }
  
  &.hexagon {
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    background: rgba(255, 107, 53, 0.1);
  }
`;

// --- ENHANCED TEXT CONTAINER ---
const TextContainer = styled(motion.div)`
  font-family: 'Oswald', sans-serif;
  font-size: 11.5vw;
  font-weight: 700;
  line-height: 0.8;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  white-space: nowrap;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  
  /* Holographic effect */
  background: linear-gradient(
    135deg,
    #111 0%,
    #FF6B35 25%,
    #66FCF1 50%,
    #111 75%,
    #FF6B35 100%
  );
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${holographicShift} 8s ease-in-out infinite;
  
  /* Text shadow for depth */
  filter: drop-shadow(0 4px 20px rgba(255, 107, 53, 0.3));

  @media (max-width: 1024px) {
    font-size: 13vw;
  }

  @media (max-width: 768px) {
    font-size: 15vw;
    white-space: normal;
    text-align: center;
    line-height: 0.9;
    width: 90%;
  }
`;

// --- ENHANCED LETTER ANIMATION ---
const LetterSpan = styled(motion.span)`
  display: inline-block;
  transform-origin: bottom center;
  will-change: transform;
  position: relative;
  
  /* Glitch effect on hover */
  &:hover {
    animation: ${glitch} 0.3s linear;
  }
  
  /* 3D shadow layers */
  &::before,
  &::after {
    content: attr(data-letter);
    position: absolute;
    inset: 0;
    z-index: -1;
  }
  
  &::before {
    color: rgba(102, 252, 241, 0.5);
    transform: translate(-2px, -2px);
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  &::after {
    color: rgba(255, 107, 53, 0.5);
    transform: translate(2px, 2px);
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  &:hover::before,
  &:hover::after {
    opacity: 1;
  }
`;

// --- ENHANCED CENTER STAGE ---
const CenterStage = styled.div`
  position: relative;
  z-index: 10;
  width: 22vw;
  height: 32vw;
  overflow: visible;
  margin: 0;
  transform-style: preserve-3d;
  
  @media (max-width: 1024px) {
    width: 30vw;
    height: 42vw;
  }
  
  @media (max-width: 768px) {
    width: 60vw;
    height: 80vw;
  }
`;

const PortraitClipWrapper = styled(motion.div)`
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 107, 53, 0.2),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  will-change: transform;
  transform: translateZ(0);
  position: relative;
  
  /* Animated border */
  &::before {
    content: '';
    position: absolute;
    inset: -3px;
    background: linear-gradient(
      135deg,
      #FF6B35,
      #66FCF1,
      #FF6B35,
      #66FCF1
    );
    background-size: 300% 300%;
    animation: ${holographicShift} 6s ease-in-out infinite;
    border-radius: 10px;
    z-index: -1;
    opacity: 0.6;
    filter: blur(8px);
  }
`;

const PortraitFrame = styled(motion.div)`
  width: 100%;
  height: 100%;
  background: #1a1a1a;
  will-change: transform;
  transform: translateZ(0);
  animation: ${float} 6s ease-in-out infinite;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%) contrast(1.1);
    transition: filter 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  &:hover img {
    filter: grayscale(0%) contrast(1.2);
    transform: scale(1.08);
  }
  
  /* Shimmer effect */
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 30%,
      rgba(102, 252, 241, 0.3) 50%,
      transparent 70%
    );
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
    z-index: 1;
  }
  
  &:hover::before {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
  
  /* Vignette overlay */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at center,
      transparent 40%,
      rgba(0, 0, 0, 0.4) 100%
    );
    pointer-events: none;
    z-index: 2;
  }
`;

// --- ENHANCED LIST STYLES ---
const ListItem = styled(motion.div)`
  background: linear-gradient(90deg, transparent, rgba(249, 249, 249, 0.8));
  backdrop-filter: blur(10px);
  display: block;
  margin-bottom: 8px;
  padding: 8px 16px;
  cursor: pointer;
  position: relative;
  width: fit-content;
  margin-left: auto;
  border-radius: 4px;
  border: 1px solid rgba(17, 17, 17, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Glowing underline */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 0%;
    height: 2px;
    background: linear-gradient(90deg, #FF6B35, #66FCF1);
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 10px currentColor;
  }
  
  &:hover {
    background: linear-gradient(90deg, rgba(255, 107, 53, 0.1), rgba(249, 249, 249, 0.95));
    border-color: rgba(255, 107, 53, 0.3);
    transform: translateX(-8px);
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const ServiceList = styled(motion.div)`
  position: absolute;
  left: 0;
  bottom: 20px;
  transform: translateX(calc(-100% - 30px));
  text-align: right;
  font-size: 0.85rem;
  font-weight: 700;
  line-height: 1.5;
  color: #111;
  white-space: nowrap;
  z-index: 20;
  
  @media (max-width: 1024px) {
    font-size: 0.75rem;
    transform: translateX(calc(-100% - 15px));
  }
  
  @media (max-width: 768px) {
    transform: none;
    left: 0;
    bottom: -140px;
    text-align: left;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    ${ListItem} {
      margin-left: 0;
      margin-right: 0;
    }
  }
`;

const LocationTag = styled(motion.div)`
  position: absolute;
  right: 0;
  bottom: -50px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #111;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(249, 249, 249, 0.8);
  backdrop-filter: blur(10px);
  padding: 10px 20px;
  border-radius: 30px;
  border: 1px solid rgba(17, 17, 17, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  span {
    color: #666;
    font-weight: 500;
  }
  
  strong {
    color: #FF6B35;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #FF6B35, #66FCF1);
    }
  }
  
  @media (max-width: 768px) {
    bottom: -70px;
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    font-size: 0.7rem;
  }
`;

// --- MAGNETIC CURSOR FOLLOWER ---
const MagneticDot = styled(motion.div)`
  position: absolute;
  width: 8px;
  height: 8px;
  background: #66FCF1;
  border-radius: 50%;
  pointer-events: none;
  z-index: 100;
  box-shadow: 0 0 20px #66FCF1, 0 0 40px rgba(102, 252, 241, 0.5);
  opacity: 0;
`;

// --- COMPONENT ---
const ArcText = React.memo(({ text }) => {
  const letters = useMemo(() => Array.from(text), [text]);
  const centerIndex = useMemo(() => letters.length / 2, [letters.length]);
  const prefersReducedMotion = useReducedMotion();

  const letterVariantsArray = useMemo(() => {
    return letters.map((_, index) => {
      const dist = Math.abs(index - centerIndex);
      const delay = dist * 0.04;
      
      if (prefersReducedMotion) {
        return {
          initial: { y: "0%", rotateX: 0, opacity: 1, scale: 1 },
          animate: { y: "0%", rotateX: 0, opacity: 1, scale: 1 }
        };
      }
      
      return {
        initial: { y: "-150%", rotateX: -90, opacity: 0, scale: 0.5 },
        animate: { 
          y: "0%", 
          rotateX: 0, 
          opacity: 1,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 60,
            damping: 20,
            delay: delay + 0.8,
            duration: 1.2
          }
        }
      };
    });
  }, [letters.length, centerIndex, prefersReducedMotion]);

  const letterHoverVariant = useMemo(() => ({ 
    y: -12,
    scale: 1.1,
    rotateZ: [0, -5, 5, 0],
    transition: { duration: 0.3 }
  }), []);
  
  return (
    <TextContainer>
      {letters.map((letter, index) => (
        <LetterSpan
          key={`${letter}-${index}`}
          data-letter={letter}
          variants={letterVariantsArray[index]}
          initial="initial"
          animate="animate"
          whileHover={letterHoverVariant}
        >
          {letter === " " ? "\u00A0" : letter}
        </LetterSpan>
      ))}
    </TextContainer>
  );
});
ArcText.displayName = 'ArcText';

const HeroEnhanced = React.memo(({ xSpring, ySpring }) => {
  const prefersReducedMotion = useReducedMotion();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Parallax with more dramatic effect
  const parallaxX = useTransform(xSpring, [-0.5, 0.5], [-15, 15]);
  const parallaxY = useTransform(ySpring, [-0.5, 0.5], [-15, 15]);
  
  // 3D tilt effect
  const rotateX = useTransform(ySpring, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-5, 5]);

  // Track mouse for magnetic dot
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const clipWrapperAnim = useMemo(() => ({
    initial: { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 },
    animate: { 
      clipPath: 'inset(0% 0% 0% 0%)',
      opacity: 1,
      transition: { 
        clipPath: { duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 1.4 },
        opacity: { duration: 0.6, delay: 1.6 }
      }
    }
  }), []);

  const portraitFrameAnim = useMemo(() => ({
    initial: { y: "30%", scale: 0.9 },
    animate: { 
      y: "0%",
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 50, 
        damping: 24, 
        delay: 1.6 
      }
    }
  }), []);

  const listItemVariants = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 1, x: 0 },
        visible: { opacity: 1, x: 0 }
      };
    }
    return {
      hidden: { opacity: 0, x: 60, rotateX: -45 },
      visible: (i) => ({
        opacity: 1,
        x: 0,
        rotateX: 0,
        transition: {
          delay: 2.0 + i * 0.15,
          type: 'spring',
          stiffness: 90,
          damping: 24
        }
      })
    };
  }, [prefersReducedMotion]);

  const listItemHover = useMemo(() => ({ 
    x: -10,
    scale: 1.05,
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  }), []);

  const locationVariants = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 }
      };
    }
    return {
      initial: { opacity: 0, y: 20, scale: 0.8 },
      animate: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: { 
          type: 'spring',
          stiffness: 80,
          damping: 22,
          delay: 2.5 
        }
      }
    };
  }, [prefersReducedMotion]);

  const locationHover = useMemo(() => ({ 
    scale: 1.08,
    boxShadow: '0 8px 30px rgba(255, 107, 53, 0.3)',
    transition: { duration: 0.3 }
  }), []);

  const serviceItems = useMemo(() => [
    '/ CAD DESIGN & DRAFTING', 
    '/ FULL STACK DEV', 
    '/ IOT SYSTEMS'
  ], []);
  
  const parallaxStyle = useMemo(() => ({ 
    x: parallaxX, 
    y: parallaxY,
    rotateX,
    rotateY
  }), [parallaxX, parallaxY, rotateX, rotateY]);

  // Floating shapes
  const shapes = useMemo(() => [
    { type: 'circle', size: 100, x: '10%', y: '20%', duration: 15 },
    { type: 'triangle', x: '85%', y: '15%', duration: 12 },
    { type: 'hexagon', size: 80, x: '90%', y: '70%', duration: 18 },
    { type: 'circle', size: 60, x: '15%', y: '80%', duration: 14 },
    { type: 'hexagon', size: 120, x: '5%', y: '50%', duration: 20 }
  ], []);

  return (
    <Wrapper>
      {/* Floating geometric shapes */}
      {shapes.map((shape, i) => (
        <FloatingShape
          key={i}
          className={shape.type}
          style={{
            width: shape.size || 'auto',
            height: shape.size || 'auto',
            left: shape.x,
            top: shape.y
          }}
          animate={{
            y: [0, -30, 0],
            rotateZ: [0, 180, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5
          }}
        />
      ))}

      <ArcText text="MECHANICAL ENGINEER" />

      <CenterStage>
        <PortraitClipWrapper {...clipWrapperAnim}>
          <PortraitFrame
            {...portraitFrameAnim}
            style={parallaxStyle}
          >
            <img 
              src={MY_IMAGE_URL} 
              alt="Yoga Vignesh - Mechanical Engineer" 
              loading="eager" 
              fetchpriority="high" 
            />
          </PortraitFrame>
        </PortraitClipWrapper>

        <ServiceList initial="hidden" animate="visible">
          {serviceItems.map((item, i) => (
            <ListItem
              key={item}
              custom={i}
              variants={listItemVariants}
              initial="hidden"
              animate="visible"
              whileHover={listItemHover}
              whileTap={{ scale: 0.95 }}
            >
              {item}
            </ListItem>
          ))}
        </ServiceList>

        <LocationTag
          variants={locationVariants}
          initial="initial"
          animate="animate"
          whileHover={locationHover}
          whileTap={{ scale: 0.95 }}
        >
          <span>📍 BASED IN</span> <strong>MADURAI</strong>
        </LocationTag>
      </CenterStage>

      {/* Magnetic cursor follower dot */}
      <MagneticDot
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          opacity: mousePosition.x > 0 ? 0.6 : 0
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 200,
          mass: 0.5
        }}
      />
    </Wrapper>
  );
});
HeroEnhanced.displayName = 'HeroEnhanced';

export default HeroEnhanced;
