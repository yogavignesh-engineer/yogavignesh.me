import React, { useRef, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import DistortedImage from './DistortedImage';
import MaskedText from '../animations/MaskedText';
import CipherReveal from '../animations/CipherReveal';
import ProjectTimeline from '../project/ProjectTimeline';
import ProjectMetrics from '../project/ProjectMetrics';
import Testimonials from '../project/Testimonials';
import ImageGallery from '../project/ImageGallery';
import BehindTheScenes from '../project/BehindTheScenes';
import SmartBoundarySimulator from '../project/SmartBoundarySimulator';
import { useCursor } from '../../context/CursorContext';
import { useSound } from '../../hooks/useSound';

// --- STYLED-COMPONENTS ---

// FIX 1: Reverted to 'fixed' so it overlays the whole screen and scrolls independently
const Wrapper = styled(motion.div)`
  position: fixed; 
  top: 0; left: 0;
  width: 100%; height: 100vh;
  background-color: #050505;
  color: #EAEAEA;
  z-index: 2000;
  
  /* SCROLLING LOGIC */
  overflow-y: auto; 
  overflow-x: hidden;
  overscroll-behavior: contain;
  
  /* PERFORMANCE OPTIMIZATION */
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;

  /* Scrollbar Styling */
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: #111; }
  &::-webkit-scrollbar-thumb { 
    background: #333; 
    border-radius: 3px;
    transition: background 0.2s ease;
    
    &:hover {
      background: #FF6B35;
    }
  }
`;

const CloseButton = styled.button`
  position: fixed;
  bottom: 3rem;
  right: 3rem;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 107, 53, 0.4);
  color: #FF6B35;
  padding: 12px 28px;
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #FF6B35;
    color: #050505;
    border-color: #FF6B35;
    box-shadow: 0 0 20px rgba(255, 107, 53, 0.5);
  }
`;

const Header = styled.div`
  height: 85vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 5vw;
  border-bottom: 1px solid #222;
  position: relative;
  overflow: hidden;
`;

const Title = styled(motion.h1)`
  font-family: 'Oswald', sans-serif;
  font-size: clamp(3rem, 11vw, 12rem);
  line-height: 0.8;
  margin: 0;
  text-transform: uppercase;
  color: transparent;
  -webkit-text-stroke: 2px #EAEAEA;
  z-index: 2;
  pointer-events: none;
`;

const FilledTitle = styled(Title)`
  position: absolute;
  top: 50%;
  left: 5vw;
  transform: translateY(-50%);
  color: #EAEAEA;
  -webkit-text-stroke: 0;
  clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
  opacity: 0.5;
`;

const HeaderMeta = styled.div`
  margin-top: 2rem;
  font-family: 'JetBrains Mono';
  color: #666;
`;

const Section = styled.section`
  display: grid;
  grid-template-columns: ${props => props.grid || '1fr 1fr'};
  min-height: 100vh;
  border-bottom: 1px solid #222;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StickyContent = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 5vw;
  border-right: 1px solid #222;
  
  h2 {
    font-family: 'Oswald';
    font-size: clamp(2rem, 3vw, 4rem);
    color: #FF6B35;
    margin-bottom: 2rem;
  }
  
  p {
    font-family: 'Inter';
    font-size: clamp(1rem, 1.2rem, 1.5rem);
    line-height: 1.6;
    color: #ccc;
    max-width: 90%;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 90%;
  }

  li {
    font-family: 'Inter', sans-serif;
    font-size: clamp(0.9rem, 1rem, 1.1rem);
    color: #aeaeae;
    padding: 1rem 0;
    border-bottom: 1px solid #222;
    line-height: 1.5;
  }
  
  @media (max-width: 768px) {
    position: relative;
    height: auto;
    padding: 6rem 5vw;
    border: none;
  }
`;

const ImageSide = styled.div`
  padding: 10vh 5vw;
  display: flex;
  flex-direction: column;
  gap: 5vh;
  justify-content: center;
`;

const WebGLContainer = styled.div`
  width: 100%;
  height: 60vh;
  background: #1a1a1a;
  overflow: hidden;
  position: relative;
  border-radius: 4px;
`;

const TechStack = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const TechPill = styled.span`
  border: 1px solid #333;
  padding: 5px 10px;
  color: #FF6B35;
  font-size: 0.8rem;
  font-family: 'JetBrains Mono';
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #FF6B35;
    background: rgba(255, 107, 53, 0.1);
  }
`;

// Story section
const StorySection = styled.div`
  padding: 10vh 10vw;
  background: linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%);
`;

const StoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  margin-top: 3rem;
`;

const StoryCard = styled(motion.div)`
  background: rgba(255, 107, 53, 0.05);
  border: 2px solid rgba(255, 107, 53, 0.2);
  border-radius: 8px;
  padding: 2rem;
`;

const StoryLabel = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #FF6B35;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 1rem;
`;

const StoryText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1.05rem;
  color: #EAEAEA;
  line-height: 1.7;
  margin: 0;
`;

// Technical specs section
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

// Content wrapper
const ContentWrapper = styled.div`
  padding: 5vh 10vw;
`;

// Section divider
const SectionDivider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, #FF6B35, transparent);
  margin: 5vh 0;
`;

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

const NextProjectSection = styled.div`
  padding: 5vh 5vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #080808;
  position: relative;
  border-top: 1px solid #222;
  gap: 2rem;
`;

const NextLabel = styled.span`
  font-family: 'JetBrains Mono';
  color: #FF6B35;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const NextButton = styled(motion.button)`
  background: transparent;
  border: 2px solid #FF6B35;
  color: #FF6B35;
  padding: 1.5rem 3rem;
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  &:hover {
    background: #FF6B35;
    color: #050505;
    box-shadow: 0 0 30px rgba(255, 107, 53, 0.5);
  }
  
  @media (max-width: 768px) {
    padding: 1.25rem 2.5rem;
    font-size: 1.2rem;
  }
`;

const CloseButtonBottom = styled(motion.button)`
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #EAEAEA;
  padding: 1rem 2.5rem;
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #EAEAEA;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 2rem;
    font-size: 0.8rem;
  }
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

// --- MOTION PROPS ---
const contentAnim = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { 
    duration: 0.6, 
    delay: 0.2,
    ease: [0.25, 0.1, 0.25, 1.0] // Optimized easing
  },
  viewport: { once: true, amount: 0.2, margin: "0px 0px -100px 0px" }
};

// --- MAIN COMPONENT ---
const ProjectDetail = React.memo(({ project, onClose, onNext }) => {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Safe Hook Calls
  const { setCursor } = useCursor() || { setCursor: () => {} };
  const { playClick, playHover } = useSound() || { playClick: () => {}, playHover: () => {} };

  const { scrollYProgress } = useScroll({ 
    container: containerRef,
  });
  
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const progressBarStyle = useMemo(() => ({ scaleY }), [scaleY]);

  const handleClose = useCallback(() => {
    playClick();
    onClose?.();
  }, [playClick, onClose]);

  const handleNext = useCallback(() => {
    playClick();
    onNext?.();
  }, [playClick, onNext]);

  const handleButtonHover = useCallback(() => {
    setCursor('button');
    playHover();
  }, [setCursor, playHover]);

  const handleTextHover = useCallback(() => {
    setCursor('text', 'EXPLORE');
  }, [setCursor]);

  const handleDefaultCursor = useCallback(() => {
    setCursor('default');
  }, [setCursor]);

  if (!project) return null;

  return (
    <Wrapper 
      ref={containerRef}
      initial={{ y: "100%" }} 
      animate={{ y: "0%" }} 
      exit={{ y: "100%" }} 
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      data-lenis-prevent
    >
      <ProgressBar style={progressBarStyle} />

      <CloseButton 
        onClick={handleClose}
        onMouseEnter={handleButtonHover}
        onMouseLeave={handleDefaultCursor}
      >
        [ CLOSE ]
      </CloseButton>

      {/* HERO HEADER */}
      <Header>
        <MaskedText delay={0.2}>
          <Title>{project.title}</Title>
        </MaskedText>
        <FilledTitle>{project.title}</FilledTitle>
        <HeaderMeta>
          <CipherReveal text={`// ${project.category} — ${project.year}`} delay={0.5} />
          {project.subtitle && (
            <div style={{ marginTop: '1rem', fontSize: '1.2rem', color: '#999' }}>
              {project.subtitle}
            </div>
          )}
        </HeaderMeta>
      </Header>

      {/* STORYTELLING SECTION (Hook/Problem/Insight) */}
      {project.story && (
        <StorySection>
          <MaskedText>
            <ImpactTitle>00 // THE STORY</ImpactTitle>
          </MaskedText>
          <StoryGrid>
            <StoryCard
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <StoryLabel>🎯 THE HOOK</StoryLabel>
              <StoryText>{project.story.hook}</StoryText>
            </StoryCard>
            
            <StoryCard
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <StoryLabel>⚠️ THE PROBLEM</StoryLabel>
              <StoryText>{project.story.problem}</StoryText>
            </StoryCard>
            
            <StoryCard
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <StoryLabel>💡 THE INSIGHT</StoryLabel>
              <StoryText>{project.story.insight}</StoryText>
            </StoryCard>
          </StoryGrid>
        </StorySection>
      )}

      {/* METRICS SECTION */}
      {project.metrics && (
        <>
          <SectionDivider />
          <ContentWrapper>
            <ProjectMetrics metrics={project.metrics} />
          </ContentWrapper>
        </>
      )}

      {/* CHALLENGE SECTION */}
      <Section>
        <StickyContent>
          <MaskedText><h2>01 // THE CHALLENGE</h2></MaskedText>
          <motion.div {...contentAnim}>
            <p>{project.challenge}</p>
          </motion.div>
        </StickyContent>
        <ImageSide onMouseEnter={handleTextHover} onMouseLeave={handleDefaultCursor}>
          <WebGLContainer>
            <DistortedImage src={project.img} />
          </WebGLContainer>
        </ImageSide>
      </Section>

      {/* SOLUTION SECTION */}
      <Section>
        <StickyContent>
          <MaskedText><h2>02 // THE SOLUTION</h2></MaskedText>
          <motion.div {...contentAnim}>
            <p>{project.solution}</p>
          </motion.div>
          <TechStack>
            {project.tech?.map((t) => <TechPill key={t}>{t}</TechPill>)}
          </TechStack>
        </StickyContent>
        <ImageSide onMouseEnter={handleTextHover} onMouseLeave={handleDefaultCursor}>
          <WebGLContainer>
            <DistortedImage src={project.img2} />
          </WebGLContainer>
        </ImageSide>
      </Section>

      {/* INTERACTIVE SIMULATOR (Smart Boundary only) */}
      {project.id === 'smart-boundary' && (
        <ContentWrapper>
          <SmartBoundarySimulator />
        </ContentWrapper>
      )}

      {/* VIDEO DEMO - Placeholder for future videos */}
      {/* Video player removed - focusing on image galleries */}

      {/* DEVELOPMENT TIMELINE */}
      {project.process && project.process.length > 0 && (
        <>
          <SectionDivider />
          <ContentWrapper>
            <MaskedText>
              <h2 style={{ fontFamily: 'Oswald', fontSize: '2rem', color: '#FF6B35', marginBottom: '2rem' }}>
                03 // DEVELOPMENT JOURNEY
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
              <h2 style={{ fontFamily: 'Oswald', fontSize: '2rem', color: '#FF6B35', marginBottom: '2rem' }}>
                04 // TECHNICAL SPECIFICATIONS
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

      {/* CHALLENGES OVERCOME */}
      {project.challenges && project.challenges.length > 0 && (
        <>
          <SectionDivider />
          <ContentWrapper>
            <MaskedText>
              <h2 style={{ fontFamily: 'Oswald', fontSize: '2rem', color: '#FF6B35', marginBottom: '2rem' }}>
                05 // CHALLENGES OVERCOME
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
      <Section grid="1fr">
        <ImpactSectionWrapper>
          <MaskedText><ImpactTitle>07 // THE IMPACT</ImpactTitle></MaskedText>
          <ImpactText>{project.impact}</ImpactText>
        </ImpactSectionWrapper>
      </Section>

      {/* NEXT PROJECT & CLOSE */}
      <NextProjectSection>
        <NextLabel>// CONTINUOUS_FLOW</NextLabel>
        
        <NextButton
          onClick={handleNext}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleDefaultCursor}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          NEXT PROJECT
          <span style={{ fontSize: '1.8rem' }}>→</span>
        </NextButton>
        
        <CloseButtonBottom
          onClick={handleClose}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleDefaultCursor}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          [ CLOSE ]
        </CloseButtonBottom>
      </NextProjectSection>
    </Wrapper>
  );
});

ProjectDetail.displayName = 'ProjectDetail';

export default ProjectDetail;