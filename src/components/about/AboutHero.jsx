import React, { useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import CipherReveal from '../animations/CipherReveal';
import ArcFallingText from '../animations/ArcFallingText';

// --- ANIMATIONS ---
const glitchAnim = keyframes`
  0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 1px); }
  20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
  40% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); }
  60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
  80% { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 1px); }
  100% { clip-path: inset(30% 0 50% 0); transform: translate(1px, -1px); }
`;

// ===== SCROLL RISE SECTION CONTAINER =====
// This is the section that "rises" over the Hero
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

// Small tag: "( ABOUT ME. )"
const SmallTag = styled(motion.div)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 2vh;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    background-color: #333;
    border-radius: 50%;
  }
`;

// Large ARC TEXT container
const ArcTextWrapper = styled(motion.div)`
  margin-bottom: 4vh;
  overflow: hidden;
`;

// Subtitle container (blur-to-focus)
const TitleContainer = styled(motion.div)`
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
  font-family: 'Inter', sans-serif;
  font-size: 1.5vw;
  font-weight: 400;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 0.1em;
  line-height: 1.1;
  color: #888;
  
  @media (max-width: 768px) { font-size: 3.5vw; }
`;

const SubTitle = styled(motion.div)`
  font-family: 'Inter', sans-serif;
  font-size: 1.5vw;
  font-weight: 400;
  text-transform: uppercase;
  margin-bottom: 6vh;
  text-align: center;
  letter-spacing: 0.1em;
  line-height: 1.1;
  color: #888;
  max-width: 90vw;
  transform: translateZ(0);

  @media (max-width: 768px) { font-size: 3.5vw; }
`;

const ImageWrapper = styled(motion.div)`
  position: relative;
  width: 280px;
  height: 380px;
  margin-bottom: 2rem;
  cursor: pointer;
  overflow: hidden;

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

const ImageContainer = styled(motion.div)`
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

const Caption = styled(motion.div)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: #555;
  margin-top: 1.5rem;
  text-transform: uppercase;
  letter-spacing: -0.02em;
`;

// --- COMPONENT ---
const AboutHero = React.memo(() => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);

  // ===== IMAGE REVEAL ANIMATION =====
  // Track scroll for image reveal (vertical clip-path)
  const { scrollYProgress: imageProgress } = useScroll({
    target: imageRef,
    offset: ["start 0.9", "start 0.4"]
  });

  // Image reveals from bottom to top with clip-path
  const imageClipPath = useTransform(
    imageProgress,
    [0, 1],
    ["inset(100% 0 0 0)", "inset(0% 0 0 0)"]
  );

  return (
    <Section ref={sectionRef}>
      {/* Small tag with CipherReveal */}
      <SmallTag
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
      >
        <CipherReveal text="( ABOUT ME. )" delay={0.2} />
      </SmallTag>

      {/* LARGE ARC FALLING TEXT - "ABOUT ME" */}
      <ArcTextWrapper
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
      >
        <ArcFallingText
          text="ABOUT ME"
          fontSize="clamp(5rem, 18vw, 14rem)"
          color="#EAEAEA"
        />
      </ArcTextWrapper>

      {/* Subtitle with blur-to-focus effect */}
      <TitleContainer
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <BlurredDuplicate
          initial={{ opacity: 1, filter: "blur(10px)" }}
          whileInView={{ opacity: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          MECHANICAL ENGINEER & FULL STACK DEVELOPER
        </BlurredDuplicate>

        <SubTitle>
          MECHANICAL ENGINEER & FULL STACK DEVELOPER
        </SubTitle>
      </TitleContainer>

      {/* Image with vertical clip-path reveal */}
      <ImageContainer ref={imageRef}>
        <ImageWrapper
          style={{ clipPath: imageClipPath }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
        >
          <Portrait src={GLITCH_IMAGE_URL} alt="Profile" />
          <GlitchLayer className="glitch-layer" />
        </ImageWrapper>

        <Caption
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <CipherReveal text="S. YOGA VIGNESH, MECHANICAL ENGINEER" delay={0.8} />
        </Caption>
      </ImageContainer>
    </Section>
  );
});

AboutHero.displayName = 'AboutHero';

export default AboutHero;