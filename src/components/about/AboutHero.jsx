import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import CipherReveal from '../animations/CipherReveal';

// --- ANIMATIONS ---
const glitchAnim = keyframes`
  0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 1px); }
  20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
  40% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); }
  60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
  80% { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 1px); }
  100% { clip-path: inset(30% 0 50% 0); transform: translate(1px, -1px); }
`;

// --- STYLED COMPONENTS ---
const Section = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 15vh;
  position: relative;
  z-index: 2;
`;

const SmallTag = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 4vh;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    background-color: #333; /* Dark dot indicator */
    border-radius: 50%;
  }
`;

const TitleContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const BlurredDuplicate = styled(motion.div)`
  position: absolute;
  inset: 0;
  filter: blur(10px);
  opacity: 1;
  pointer-events: none;
  transform: translateZ(0);
`;

const MainTitle = styled(motion.h1)`
  font-family: 'Inter', sans-serif;
  font-size: 4.5vw;
  font-weight: 400; /* Regular weight for that "Swiss" look */
  text-transform: uppercase;
  margin-bottom: 8vh;
  text-align: center;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: #EAEAEA;
  max-width: 90vw;
  transform: translateZ(0);
  
  @media (max-width: 768px) { font-size: 9vw; }
`;

const ImageWrapper = styled(motion.div)`
  position: relative;
  width: 280px;
  height: 380px;
  margin-bottom: 2rem;
  cursor: pointer;
  
  &:hover {
    .glitch-layer {
      opacity: 0.5;
      animation: ${glitchAnim} 0.3s steps(2) infinite;
    }
    img {
      filter: grayscale(0%) contrast(1.1);
      transform: scale(1.02);
    }
  }

  @media (max-width: 768px) {
    width: 70vw;
    height: 90vw;
  }
`;

// PERFORMANCE: Replaced inline style with a styled component
const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Portrait = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%);
  transition: all 0.4s ease;
  border-radius: 2px;
`;

// PERFORMANCE: Use .webp
const GLITCH_IMAGE_URL = '/about-image-3.webp';

const GlitchLayer = styled.div`
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: url(${GLITCH_IMAGE_URL});
  background-size: cover;
  background-position: center;
  opacity: 0;
  mix-blend-mode: hard-light;
  pointer-events: none;
  z-index: 2;
`;

const Caption = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: #555;
  margin-top: 1.5rem;
  text-transform: uppercase;
  letter-spacing: -0.02em;
`;

// --- MOTION PROPS ---
const blurredDuplicateAnim = {
  initial: { opacity: 1 },
  animate: { opacity: 0 },
  transition: { duration: 0.5 },
};

const mainTitleAnim = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.3 },
};

const imageWrapperAnim = {
  initial: { clipPath: "inset(50% 0 50% 0)", scale: 0.9 },
  whileInView: { clipPath: "inset(0% 0 0% 0)", scale: 1 },
  transition: { duration: 1.2, ease: "circOut", delay: 0.2 },
};

// --- COMPONENT ---
const AboutHero = React.memo(() => {
  return (
    <Section>
      <SmallTag>
        <CipherReveal text="( ABOUT ME. )" delay={0.2} />
      </SmallTag>
      
      <TitleContainer>
        <BlurredDuplicate {...blurredDuplicateAnim}>
          MECHANICAL ENGINEER & FULL STACK DEVELOPER
        </BlurredDuplicate>
        
        <MainTitle {...mainTitleAnim}>
          MECHANICAL ENGINEER & FULL STACK DEVELOPER
        </MainTitle>
      </TitleContainer>

      <ImageContainer>
        <ImageWrapper {...imageWrapperAnim}>
          <Portrait src={GLITCH_IMAGE_URL} alt="Profile" />
          <GlitchLayer className="glitch-layer" />
        </ImageWrapper>

        <Caption>
           <CipherReveal text="S. YOGA VIGNESH, MECHANICAL ENGINEER" delay={0.8} />
        </Caption>
      </ImageContainer>
    </Section>
  );
});

AboutHero.displayName = 'AboutHero';

export default AboutHero;