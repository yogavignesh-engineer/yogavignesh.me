import React, { useRef, useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';
import { useSound } from '../../hooks/useSound';

// CHILD COMPONENTS
import ProjectMetrics from '../project/ProjectMetrics';
import ProjectTimeline from '../project/ProjectTimeline';
import ImageGallery from '../project/ImageGallery';
import BehindTheScenes from '../project/BehindTheScenes';
import Testimonials from '../project/Testimonials';
import SmartBoundarySimulator from '../project/SmartBoundarySimulator';
import MaskedText from '../animations/MaskedText';

// --- STYLES ---

const Container = styled(motion.div)`
  background-color: #050505;
  color: #EAEAEA;
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
`;

// HERO SECTION
const HeroSection = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const HeroTitle = styled(motion.h1)`
  font-family: 'Oswald', sans-serif;
  font-size: clamp(5rem, 15vw, 20rem);
  text-transform: uppercase;
  color: transparent;
  -webkit-text-stroke: 2px rgba(255, 255, 255, 0.8);
  margin: 0;
  line-height: 0.8;
  position: relative;
  z-index: 2;
  mix-blend-mode: difference;
  text-align: center;
`;

const HeroSubtitle = styled(motion.p)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.2rem;
  color: #FF6B35;
  margin-top: 2rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  background: rgba(0, 0, 0, 0.6);
  padding: 0.5rem 1rem;
  backdrop-filter: blur(4px);
  z-index: 2;
`;

const HeroBackground = styled(motion.div)`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 1;
  opacity: 0.4;
  
  img, video {
    width: 100%; height: 100%;
    object-fit: cover;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, transparent 0%, #050505 90%);
  }
`;

// SCROLLYTELLING CONTAINER
const StickyContainer = styled.div`
  display: flex;
  min-height: 300vh; /* Long scroll area */
  position: relative;
  
  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

const StickyVisual = styled.div`
  width: 50%;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #080808;
  overflow: hidden;
  border-right: 1px solid #111;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 50vh;
    position: relative;
  }
`;

const ScrollContent = styled.div`
  width: 50%;
  padding: 10vh 5vw;
  display: flex;
  flex-direction: column;
  gap: 80vh; /* Space out text blocks for scrollytelling */
  
  @media (max-width: 768px) {
    width: 100%;
    gap: 10vh;
  }
`;

const TextBlock = styled(motion.div)`
  max-width: 500px;
  
  h2 {
    font-family: 'Oswald', sans-serif;
    font-size: 3rem;
    color: #FF6B35;
    margin-bottom: 2rem;
  }
  
  p {
    font-family: 'Inter', sans-serif;
    font-size: 1.25rem;
    line-height: 1.6;
    color: #CCC;
  }
`;

const VisualImage = styled(motion.img)`
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
`;

// ADDITIONAL CONTENT SECTIONS
const ContentWrapper = styled.div`
  padding: 5vh 10vw;
  position: relative;
  z-index: 2;
`;

const SectionDivider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, #FF6B35, transparent);
  margin: 5vh 0;
  opacity: 0.3;
`;

const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const SpecItem = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #333;
  border-radius: 4px;
  padding: 1rem;
  
  strong {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    color: #999;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }
  
  span {
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    color: #EAEAEA;
  }
`;

// Challenges section
const ChallengesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 3rem;
`;

const ChallengeCard = styled(motion.div)`
  background: rgba(244, 67, 54, 0.05);
  border-left: 4px solid #F44336;
  border-radius: 4px;
  padding: 2rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 2rem;
  align-items: start;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChallengeIcon = styled.div`
  font-size: 2rem;
  color: #F44336;
`;

const ChallengeContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ChallengeTitle = styled.h4`
  font-family: 'Oswald', sans-serif;
  font-size: 1.2rem;
  color: #F44336;
  text-transform: uppercase;
  margin: 0;
`;

const ChallengeDescription = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #EAEAEA;
  margin: 0;
  line-height: 1.6;
`;

const ChallengeSolution = styled.div`
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 4px;
  padding: 1rem;
  
  strong {
    display: block;
    color: #4CAF50;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
    color: #EAEAEA;
  }
`;

const ChallengeResult = styled.div`
  background: #050505;
  border: 1px solid #4CAF50;
  border-radius: 4px;
  padding: 1rem;
  min-width: 150px;
  
  strong {
    display: block;
    color: #4CAF50;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
    color: #EAEAEA;
    line-height: 1.4;
  }
`;

// Impact Section
const ImpactSectionWrapper = styled.div`
  padding: 10vh 10vw;
  text-align: center;
`;

const ImpactTitle = styled.h2`
  font-family: 'Oswald';
  font-size: clamp(2rem, 3vw, 4rem);
  color: #FF6B35;
  margin: 0;
`;

const ImpactText = styled.p`
  font-family: 'Inter';
  font-size: clamp(1rem, 1.5rem, 2rem);
  color: #ccc;
  max-width: 800px;
  margin: 2rem auto;
  line-height: 1.6;
`;

// CLOSE BUTTON
const CloseFab = styled(motion.button)`
  position: fixed;
  top: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: white;
  color: black;
  border: none;
  z-index: 5000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const ProgressBar = styled(motion.div)`
  position: fixed;
  right: 0;
  top: 0;
  width: 4px;
  background: #FF6B35;
  z-index: 9999;
  transform-origin: top;
`;

// --- COMPONENT ---

const ImmersiveProjectDetail = ({ project, onClose, onNext }) => {
  const containerRef = useRef(null);
  const { setCursor } = useCursor() || { setCursor: () => { } };
  const { playClick, playHover } = useSound();

  const { scrollYProgress } = useScroll({
    container: containerRef
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]); // Progress bar
  const heroY = useTransform(scrollYProgress, [0, 0.2], ['0%', '50%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <Container
      ref={containerRef}
      data-lenis-prevent
      initial={{ y: "100%" }}
      animate={{ y: "0%" }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      <ProgressBar style={{ scaleY }} />

      <CloseFab
        onClick={() => { playClick(); onClose(); }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onMouseEnter={() => playHover()}
      >
        ✕
      </CloseFab>

      {/* HERO */}
      <HeroSection>
        <HeroBackground style={{ y: heroY, opacity: heroOpacity }}>
          <img src={project.img} alt="Hero Background" />
        </HeroBackground>
        <HeroTitle
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {project.title}
        </HeroTitle>
        <HeroSubtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {project.subtitle}
        </HeroSubtitle>
      </HeroSection>

      {/* METRICS (If Available) */}
      {project.metrics && (
        <ContentWrapper style={{ background: '#050505', position: 'relative', zIndex: 10 }}>
          <ProjectMetrics metrics={project.metrics} />
        </ContentWrapper>
      )}

      {/* SCROLLYTELLING CONTAINER (Problem/Insight/Solution) */}
      <StickyContainer>
        <StickyVisual>
          <VisualImage
            src={project.img2 || project.img}
            alt="Project Visual"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        </StickyVisual>

        <ScrollContent>
          {/* Block 1: The Problem */}
          <TextBlock
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ margin: "-20%" }}
          >
            <h2>01 // THE PROBLEM</h2>
            <p>{project.story?.problem || project.challenge}</p>
          </TextBlock>

          {/* Block 2: The Insight */}
          <TextBlock
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ margin: "-20%" }}
          >
            <h2>02 // THE INSIGHT</h2>
            <p>{project.story?.insight || "Finding a better way..."}</p>
          </TextBlock>

          {/* Block 3: The Solution */}
          <TextBlock
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ margin: "-20%" }}
          >
            <h2>03 // THE SOLUTION</h2>
            <p>{project.solution}</p>
          </TextBlock>
        </ScrollContent>
      </StickyContainer>

      {/* SIMULATOR */}
      {(project.id === 1 || project.id === 'smart-boundary') && (
        <ContentWrapper>
          <SmartBoundarySimulator />
        </ContentWrapper>
      )}

      {/* DEVELOPMENT JOURNEY */}
      {project.process && (
        <>
          <SectionDivider />
          <ContentWrapper>
            <MaskedText>
              <h2 style={{ fontFamily: 'Oswald', fontSize: '2.5rem', color: '#FF6B35', marginBottom: '3rem' }}>
                04 // DEVELOPMENT JOURNEY
              </h2>
            </MaskedText>
            <ProjectTimeline process={project.process} />
          </ContentWrapper>
        </>
      )}

      {/* TECHNICAL SPECS */}
      {project.technicalSpecs && (
        <>
          <SectionDivider />
          <ContentWrapper>
            <MaskedText>
              <h2 style={{ fontFamily: 'Oswald', fontSize: '2.5rem', color: '#FF6B35', marginBottom: '2rem' }}>
                05 // UNDER THE HOOD
              </h2>
            </MaskedText>
            <SpecsGrid>
              {Object.entries(project.technicalSpecs).map(([key, value]) => (
                <SpecItem key={key}>
                  <strong>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</strong>
                  <span>{value}</span>
                </SpecItem>
              ))}
            </SpecsGrid>
          </ContentWrapper>
        </>
      )}

      {/* CHALLENGES OVERCOME (Sticky list) */}
      {project.challenges && project.challenges.length > 0 && (
        <>
          <SectionDivider />
          <ContentWrapper>
            <MaskedText>
              <h2 style={{ fontFamily: 'Oswald', fontSize: '2.5rem', color: '#FF6B35', marginBottom: '2rem' }}>
                06 // CHALLENGES OVERCOME
              </h2>
            </MaskedText>
            <ChallengesList>
              {project.challenges.map((challenge, index) => (
                <ChallengeCard
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ChallengeIcon>⚠️</ChallengeIcon>
                  <ChallengeContent>
                    <ChallengeTitle>Challenge #{index + 1}</ChallengeTitle>
                    <ChallengeDescription>{challenge.issue}</ChallengeDescription>
                    <ChallengeSolution>
                      <strong>SOLUTION:</strong>
                      <p>{challenge.solution}</p>
                    </ChallengeSolution>
                  </ChallengeContent>
                  <ChallengeResult>
                    <strong>✓ RESULT</strong>
                    <p>{challenge.result}</p>
                  </ChallengeResult>
                </ChallengeCard>
              ))}
            </ChallengesList>
          </ContentWrapper>
        </>
      )}

      {/* BEHIND THE SCENES */}
      {project.behindTheScenes && (
        <>
          <SectionDivider />
          <ContentWrapper>
            <BehindTheScenes bts={project.behindTheScenes} />
          </ContentWrapper>
        </>
      )}

      {/* GALLERY */}
      {project.media?.gallery && (
        <>
          <SectionDivider />
          <ContentWrapper>
            <h2 style={{ fontFamily: 'Oswald', fontSize: '2.5rem', color: '#FF6B35', marginBottom: '2rem' }}>
              07 // VISUAL GALLERY
            </h2>
            <ImageGallery gallery={project.media.gallery} />
          </ContentWrapper>
        </>
      )}

      {/* TESTIMONIALS */}
      {project.testimonials && project.testimonials.length > 0 && (
        <>
          <SectionDivider />
          <ContentWrapper>
            <Testimonials testimonials={project.testimonials} />
          </ContentWrapper>
        </>
      )}

      {/* IMPACT SECTION */}
      {project.impact && (
        <>
          <SectionDivider />
          <ContentWrapper style={{ textAlign: 'center' }}>
            <ImpactTitle>08 // THE IMPACT</ImpactTitle>
            <ImpactText>{project.impact}</ImpactText>
          </ContentWrapper>
        </>
      )}

      {/* FOOTER AREA */}
      <section style={{ height: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid #222', marginTop: '5vh' }}>
        <h2 style={{ fontFamily: 'Oswald', fontSize: '3rem', color: '#333' }}>
          CASE STUDY END //
        </h2>

        <CloseFab
          style={{ position: 'relative', top: 'auto', right: 'auto', marginTop: '2rem', width: '60px', height: '60px' }}
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
        >
          ✕
        </CloseFab>
      </section>
    </Container>
  );
};

export default ImmersiveProjectDetail;
