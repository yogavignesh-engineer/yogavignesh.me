import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useReducedMotion, useTransform } from 'framer-motion';

// PERFORMANCE: Use webp for smaller file size.
const MY_IMAGE_URL = "/image.webp";

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
  100% { transform: translateY(0px); }
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
  z-index: 1;
  overflow: hidden; 
  margin: 0; padding: 0;
  
  @media (max-width: 768px) {
    height: 100vh;
  }
`;

const TextContainer = styled(motion.div)`
  font-family: 'Oswald', sans-serif;
  font-size: 11.5vw;
  font-weight: 700;
  line-height: 0.8;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  white-space: nowrap;
  color: #111;
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

  @media (max-width: 1024px) {
    font-size: 13vw;
  }

  @media (max-width: 768px) {
    font-size: 16vw;
    white-space: normal;
    text-align: center;
    line-height: 1;
    width: 90%;
    /* Disable expensive animations on mobile */
    animation: none !important;
  }
`;

const LetterSpan = styled(motion.span)`
  display: inline-block;
  transform-origin: bottom center;
  will-change: transform;
  position: relative;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  
  /* Optimized shadow - only on hover and desktop */
  @media (min-width: 769px) {
    &::after {
      content: attr(data-letter);
      position: absolute;
      inset: 0;
      filter: blur(20px);
      opacity: 0;
      color: rgba(0,0,0,0.2);
      z-index: -1;
      transform: translate3d(0, 0, 0);
      transition: opacity 0.15s ease;
      pointer-events: none;
    }
    
    &:hover::after {
      opacity: 1;
    }
  }
`;

const CenterStage = styled.div`
  position: relative;
  z-index: 10;
  width: 22vw;
  height: 32vw;
  overflow: visible;
  margin: 0; 
  
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
  will-change: clip-path;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
`;

const PortraitFrame = styled(motion.div)`
  width: 100%;
  height: 100%;
  background: #ccc;
  will-change: transform; /* Separate from clip */
  transform: translateZ(0);
  animation: ${float} 6s ease-in-out infinite;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%);
    transition: filter 0.5s ease, transform 0.5s ease;
  }
  
  &:hover img {
    filter: grayscale(0%);
    transform: scale(1.05);
  }
  
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
      rgba(255,255,255,0.1) 50%,
      transparent 70%
    );
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
    transition: transform 0.6s ease;
    pointer-events: none;
    z-index: 1;
  }
  
  &:hover::before {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
`;

const ListItem = styled(motion.div)`
  background: #F9F9F9;
  display: block;
  margin-bottom: 6px;
  padding: 2px 0;
  cursor: default;
  position: relative;
  width: fit-content;
  margin-left: auto;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 0%;
    height: 1px;
    background: #000;
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const ServiceList = styled(motion.div)`
  position: absolute;
  left: 0;
  bottom: 20px;
  transform: translateX(calc(-100% - 20px));
  text-align: right;
  font-size: 0.85rem;
  font-weight: 700;
  line-height: 1.5;
  color: #000;
  white-space: nowrap;
  z-index: 20;
  
  @media (max-width: 1024px) {
    font-size: 0.75rem;
    transform: translateX(calc(-100% - 10px));
  }
  
  @media (max-width: 768px) {
    transform: none;
    left: 0;
    bottom: -120px;
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
  bottom: -40px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #111;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 5px;
  
  span {
    color: #666;
    font-weight: 500;
  }
  
  @media (max-width: 768px) {
    bottom: -60px;
    left: 0;
    right: auto;
    width: 100%;
    justify-content: center;
    font-size: 0.8rem;
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

const magneticPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(255, 107, 53, 0.7),
                0 0 0 0 rgba(255, 107, 53, 0.4),
                0 4px 15px rgba(255, 107, 53, 0.3);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(255, 107, 53, 0),
                0 0 0 20px rgba(255, 107, 53, 0),
                0 8px 25px rgba(255, 107, 53, 0.5);
  }
`;

const iconBounce = keyframes`
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-3px) scale(1.1);
  }
`;

const ResumeButton = styled(motion.a)`
  position: absolute;
  left: 50%;
  bottom: -120px;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 20px 40px;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FF6B35 100%);
  background-size: 200% 100%;
  color: #FFF;
  font-family: 'Oswald', sans-serif;
  font-size: 1rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-decoration: none;
  border-radius: 50px;
  cursor: pointer;
  z-index: 20;
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  will-change: transform, box-shadow;
  animation: ${magneticPulse} 3s ease-in-out infinite;
  
  /* Glossy overlay */
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
      rgba(255, 255, 255, 0.4),
      transparent
    );
    transition: left 0.5s ease;
  }
  
  /* Icon container */
  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    animation: ${iconBounce} 2s ease-in-out infinite;
  }
  
  /* Text container */
  .text-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.2;
  }
  
  .main-text {
    font-size: 0.9rem;
    font-weight: 700;
  }
  
  .sub-text {
    font-size: 0.65rem;
    opacity: 0.9;
    font-weight: 400;
    letter-spacing: 1px;
  }
  
  /* Hover state */
  &:hover {
    transform: translateX(-50%) translateY(-6px) scale(1.08);
    box-shadow: 0 15px 50px rgba(255, 107, 53, 0.7),
                0 0 0 4px rgba(255, 255, 255, 0.4),
                inset 0 0 25px rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
    background-position: 100% center;
    animation: none;
    
    &::before {
      left: 100%;
    }
    
    .icon-wrapper {
      animation: ${iconBounce} 0.5s ease-in-out infinite;
      transform: rotate(360deg);
    }
  }
  
  /* Active/Press state */
  &:active {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
  }
  
  @media (max-width: 768px) {
    bottom: -110px;
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    font-size: 0.9rem;
    padding: 14px 28px;
    gap: 10px;
    
    .main-text {
      font-size: 0.9rem;
    }
    
    .sub-text {
      font-size: 0.7rem;
    }
    
    &:hover {
      transform: translateX(-50%) translateY(-4px) scale(1.05);
    }
  }
`;

// PERFORMANCE: Memoize the ArcText component to prevent re-renders.
const ArcText = React.memo(({ text }) => {
  const letters = useMemo(() => Array.from(text), [text]);
  const centerIndex = useMemo(() => letters.length / 2, [letters.length]);
  const prefersReducedMotion = useReducedMotion();

  // PERFORMANCE: Pre-calculate all variants to avoid function calls in render.
  const letterVariantsArray = useMemo(() => {
    return letters.map((_, index) => {
      const dist = Math.abs(index - centerIndex);
      const delay = dist * 0.035;

      if (prefersReducedMotion) {
        return {
          initial: { y: "0%", rotateX: 0, opacity: 1 },
          animate: { y: "0%", rotateX: 0, opacity: 1 }
        };
      }

      return {
        initial: { y: "-100%", rotateX: -90, opacity: 0 },
        animate: {
          y: "0%",
          rotateX: 0,
          opacity: 1,
          transition: {
            type: "spring",
            stiffness: 50,
            damping: 18,
            delay: delay + 0.1 // Fast entrance
          }
        }
      };
    });
  }, [letters.length, centerIndex, prefersReducedMotion]);

  // PERFORMANCE: Memoize hover variant.
  const letterHoverVariant = useMemo(() => ({ y: -8 }), []);

  return (
    <TextContainer>
      {letters.map((letter, index) => (
        <LetterSpan
          key={`${letter}-${index}`}
          data-letter={letter} /* For pseudo-element */
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

const HeroContent = React.memo(({ xSpring, ySpring }) => {
  const prefersReducedMotion = useReducedMotion();

  const parallaxX = useTransform(xSpring, [-0.5, 0.5], [-5, 5]);
  const parallaxY = useTransform(ySpring, [-0.5, 0.5], [-5, 5]);

  // PERFORMANCE: Memoize motion props to prevent recreating on each render.
  const clipWrapperAnim = useMemo(() => ({
    initial: { clipPath: 'inset(100% 0% 0% 0%)' },
    animate: { clipPath: 'inset(0% 0% 0% 0%)' },
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.3 } // Fast entrance
  }), []);

  const portraitFrameAnim = useMemo(() => ({
    initial: { y: "20%" },
    animate: { y: "0%" },
    transition: { type: "spring", stiffness: 40, damping: 20, delay: 0.4 } // Fast entrance
  }), []);

  const listItemVariants = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 1, x: 0 },
        visible: { opacity: 1, x: 0 }
      };
    }
    return {
      hidden: { opacity: 0, x: 50 },
      visible: (i) => ({
        opacity: 1,
        x: 0,
        transition: {
          delay: 1.1 + i * 0.1, // Reduced from 2.1
          type: 'spring',
          stiffness: 70,
          damping: 20
        }
      })
    };
  }, [prefersReducedMotion]);

  const listItemHover = useMemo(() => ({ x: -5 }), []);

  const locationVariants = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 }
      };
    }
    return {
      initial: { opacity: 0, y: -10 },
      animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: 1.4 } // Reduced from 2.4
      }
    };
  }, [prefersReducedMotion]);

  const locationHover = useMemo(() => ({ scale: 1.05 }), []);

  const serviceItems = useMemo(() => [
    '/ CAD DESIGN & DRAFTING',
    '/ FULL STACK DEV',
    '/ IOT SYSTEMS'
  ], []);

  const parallaxStyle = useMemo(() => ({ x: parallaxX, y: parallaxY }), [parallaxX, parallaxY]);

  return (
    <Wrapper>
      <ArcText text="MECHANICAL ENGINEER" />

      <CenterStage>
        <PortraitClipWrapper {...clipWrapperAnim}>
          <PortraitFrame
            {...portraitFrameAnim}
            style={parallaxStyle}
          >
            <img src={MY_IMAGE_URL} alt="Portrait" loading="eager" fetchpriority="high" />
          </PortraitFrame>
        </PortraitClipWrapper>

        <ServiceList
          initial="hidden"
          animate="visible"
        >
          {serviceItems.map((item, i) => (
            <ListItem
              key={item}
              custom={i}
              variants={listItemVariants}
              initial="hidden"
              animate="visible"
              whileHover={listItemHover}
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
        >
          <span>BASED IN</span> <strong>MADURAI</strong>
        </LocationTag>
      </CenterStage>
    </Wrapper>
  );
});
HeroContent.displayName = 'HeroContent';

export default HeroContent;