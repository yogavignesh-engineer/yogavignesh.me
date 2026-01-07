import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PROJECTS } from '../../data/projects';

// ===== KEYFRAME ANIMATIONS =====

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 30px rgba(255, 107, 53, 0.2); }
  50% { box-shadow: 0 0 50px rgba(255, 107, 53, 0.4); }
`;

// ===== FULL PAGE SCROLL LAYOUT =====

const PageWrapper = styled(motion.div)`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(180deg, 
    #1a0a00 0%, 
    #0a0505 20%, 
    #050505 100%
  );
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: radial-gradient(ellipse at center top, 
      rgba(255, 107, 53, 0.15) 0%, 
      transparent 60%
    );
    pointer-events: none;
    z-index: 0;
  }
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

// ===== STICKY NAVBAR =====

const TopNavbar = styled(motion.nav)`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: rgba(10, 10, 10, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  margin-bottom: 2rem;
  animation: ${glowPulse} 4s ease-in-out infinite;
`;

const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoIcon = styled.span`
  color: #FF6B35;
  font-size: 1.5rem;
`;

const LogoText = styled.span`
  font-family: 'Oswald', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 2px;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(motion.button)`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  background: none;
  border: none;
  transition: color 0.3s ease;
  padding: 0.5rem 0;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0%;
    height: 2px;
    background: #FF6B35;
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: #fff;
    &::after {
      width: 100%;
    }
  }
`;

const NavIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconButton = styled(motion.a)`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  text-decoration: none;
  
  &:hover {
    border-color: #FF6B35;
    color: #FF6B35;
    background: rgba(255, 107, 53, 0.1);
  }
`;

const CloseButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #FF6B35;
    background: rgba(255, 107, 53, 0.15);
    color: #FF6B35;
  }
`;

// ===== HERO SECTION =====

const HeroSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 3rem;
  padding: 2rem 0;
  min-height: 50vh;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const LeftContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
  
  @media (max-width: 1024px) {
    order: 2;
    text-align: center;
    align-items: center;
  }
`;

const CategoryBadge = styled(motion.span)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #66FCF1;
  letter-spacing: 3px;
  text-transform: uppercase;
  padding: 0.5rem 1rem;
  border: 1px solid rgba(102, 252, 241, 0.3);
  border-radius: 50px;
  width: fit-content;
  background: rgba(102, 252, 241, 0.05);
`;

const HeroTitle = styled(motion.h1)`
  font-family: 'Oswald', sans-serif;
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  line-height: 0.95;
  letter-spacing: -1px;
`;

const HeroDescription = styled(motion.p)`
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.7;
  max-width: 450px;
`;

const CTAButtons = styled(motion.div)`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: 1024px) {
    justify-content: center;
  }
`;

const PrimaryButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
    background-size: 200% 100%;
    animation: ${shimmer} 3s infinite;
  }
`;

const SecondaryButton = styled(motion.a)`
  padding: 1rem 2rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  cursor: pointer;
  
  &:hover {
    border-color: #66FCF1;
    color: #66FCF1;
  }
`;

const RightContent = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  
  @media (max-width: 1024px) {
    order: 1;
  }
`;

const ImageWrapper = styled(motion.div)`
  position: relative;
  width: 100%;
  min-height: 350px;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 0 60px rgba(255, 107, 53, 0.1);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 
      0 30px 80px rgba(0, 0, 0, 0.6),
      0 0 0 1px rgba(255, 107, 53, 0.3),
      inset 0 0 80px rgba(255, 107, 53, 0.15);
  }
  
  @media (max-width: 1024px) {
    min-height: 280px;
    border-radius: 24px;
  }
`;

const HeroImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const StatsOverlay = styled(motion.div)`
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatAvatars = styled.div`
  display: flex;
  span {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: linear-gradient(135deg, #66FCF1, #45B7D1);
    border: 2px solid #050505;
    margin-left: -10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    color: #050505;
    font-weight: 700;
    &:first-child { margin-left: 0; }
  }
`;

const StatText = styled.div`
  .value {
    font-family: 'Oswald', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
    line-height: 1;
  }
  .label {
    font-family: 'Inter', sans-serif;
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.5);
  }
`;

// ===== CONTENT SECTIONS =====

const Section = styled(motion.section)`
  padding: 4rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  
  @media (max-width: 768px) {
    padding: 3rem 0;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionLabel = styled(motion.span)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #66FCF1;
  letter-spacing: 4px;
  text-transform: uppercase;
  display: block;
  margin-bottom: 0.75rem;
`;

const SectionTitle = styled(motion.h2)`
  font-family: 'Oswald', sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
`;

// Tech Stack
const TechGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const TechItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #66FCF1;
    background: rgba(102, 252, 241, 0.05);
    transform: translateY(-5px);
  }
`;

const TechDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.$color || '#66FCF1'};
`;

const TechName = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
`;

// Story Cards
const StoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const StoryCard = styled(motion.div)`
  padding: 2rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${props => props.$accent || '#66FCF1'};
    background: rgba(102, 252, 241, 0.03);
    transform: translateY(-8px);
  }
`;

const StoryNumber = styled.span`
  font-family: 'Oswald', sans-serif;
  font-size: 3rem;
  font-weight: 700;
  color: ${props => props.$color || '#66FCF1'};
  opacity: 0.3;
  line-height: 1;
  display: block;
  margin-bottom: 1rem;
`;

const StoryTitle = styled.h3`
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
  margin-bottom: 1rem;
`;

const StoryText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.7;
`;

// Gallery
const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const GalleryCard = styled(motion.div)`
  aspect-ratio: 16/10;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.1);
  }
`;

// Other Projects
const PreviewSection = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 2rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PreviewCard = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(255, 107, 53, 0.4);
    background: rgba(255, 107, 53, 0.05);
    transform: translateY(-5px);
  }
`;

const PreviewImage = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const PreviewInfo = styled.div`
  flex: 1;
`;

const PreviewTitle = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  display: block;
`;

const PreviewMeta = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #FF6B35;
`;

const PreviewArrow = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  ${PreviewCard}:hover & {
    border-color: #FF6B35;
    color: #FF6B35;
    transform: rotate(-45deg);
  }
`;

// Back to Portfolio Footer
const BackToPortfolioSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 4rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
`;

const BackTitle = styled.h3`
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const BackButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 3rem;
  font-family: 'Oswald', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #050505;
  background: linear-gradient(135deg, #66FCF1 0%, #45B7D1 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%);
    background-size: 200% 100%;
    animation: ${shimmer} 2s infinite;
  }
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 40px rgba(102, 252, 241, 0.4);
  }
`;

// ===== ANIMATION VARIANTS =====

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.4 }
};

// ===== MAIN COMPONENT =====

const SplitHeroProjectDetail = ({ project, onClose }) => {
  const navigate = useNavigate();
  const overviewRef = useRef(null);
  const techRef = useRef(null);
  const storyRef = useRef(null);
  const galleryRef = useRef(null);

  const otherProjects = PROJECTS.filter(p => p.id !== project.id).slice(0, 3);
  const primaryMetric = project.metrics ? Object.entries(project.metrics)[0] : null;
  const techColors = ['#66FCF1', '#FF6B35', '#F7931E', '#45B7D1', '#96CEB4', '#FFEAA7'];

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleClose = () => {
    if (onClose) onClose();
    else navigate('/#works');  // Navigate to works section
  };

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <PageWrapper initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      <ContentContainer>
        {/* Sticky Navbar */}
        <TopNavbar>
          <LogoArea>
            <LogoIcon>✦</LogoIcon>
            <LogoText>{project.title}</LogoText>
          </LogoArea>

          <NavLinks>
            <NavLink onClick={() => scrollToSection(overviewRef)} whileHover={{ y: -2 }}>Overview</NavLink>
            <NavLink onClick={() => scrollToSection(techRef)} whileHover={{ y: -2 }}>Tech Stack</NavLink>
            <NavLink onClick={() => scrollToSection(storyRef)} whileHover={{ y: -2 }}>Story</NavLink>
            <NavLink onClick={() => scrollToSection(galleryRef)} whileHover={{ y: -2 }}>Gallery</NavLink>
          </NavLinks>

          <NavIcons>
            {project.github && (
              <IconButton href={project.github} target="_blank" whileHover={{ scale: 1.1 }}>
                🔗
              </IconButton>
            )}
            <CloseButton onClick={handleClose} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              ← Back to Works
            </CloseButton>
          </NavIcons>
        </TopNavbar>

        {/* Hero Section */}
        <HeroSection ref={overviewRef} id="overview">
          <LeftContent>
            <CategoryBadge>{project.cat}</CategoryBadge>
            <HeroTitle
              layoutId={`project-title-${project.id}`}
              transition={{ duration: 0.6, ease: [0.6, 0.01, -0.05, 0.9] }}
            >
              {project.title}
            </HeroTitle>
            <HeroDescription>{project.story?.hook || project.subtitle}</HeroDescription>
            <CTAButtons>
              {project.demo && (
                <PrimaryButton href={project.demo} target="_blank" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  View Live Demo <span>→</span>
                </PrimaryButton>
              )}
              {project.github && (
                <SecondaryButton href={project.github} target="_blank" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  GitHub Repo
                </SecondaryButton>
              )}
            </CTAButtons>
          </LeftContent>

          <RightContent>
            <ImageWrapper>
              <HeroImage
                src={project.img2 || project.img}
                alt={project.title}
                layoutId={`project-image-${project.id}`}
                transition={{ duration: 0.6, ease: [0.6, 0.01, -0.05, 0.9] }}
              />
              {primaryMetric && (
                <StatsOverlay>
                  <StatAvatars>
                    <span>Y</span><span>V</span><span>+</span>
                  </StatAvatars>
                  <StatText>
                    <span className="value">{primaryMetric[1]}</span>
                    <span className="label">{primaryMetric[0].replace(/([A-Z])/g, ' $1').trim()}</span>
                  </StatText>
                </StatsOverlay>
              )}
            </ImageWrapper>
          </RightContent>
        </HeroSection>

        {/* Tech Stack Section */}
        <Section ref={techRef} id="tech">
          <SectionHeader>
            <SectionLabel>Technologies Used</SectionLabel>
            <SectionTitle>Tech Stack</SectionTitle>
          </SectionHeader>
          <TechGrid>
            {project.tech?.map((tech, i) => (
              <TechItem key={tech} whileHover={{ scale: 1.05, y: -5 }}>
                <TechDot $color={techColors[i % techColors.length]} />
                <TechName>{tech}</TechName>
              </TechItem>
            ))}
          </TechGrid>
        </Section>

        {/* Story Section */}
        {project.story && (
          <Section ref={storyRef} id="story">
            <SectionHeader>
              <SectionLabel>The Journey</SectionLabel>
              <SectionTitle>From Problem to Solution</SectionTitle>
            </SectionHeader>
            <StoryGrid>
              <StoryCard $accent="#FF6B35" whileHover={{ y: -8 }}>
                <StoryNumber $color="#FF6B35">01</StoryNumber>
                <StoryTitle>The Problem</StoryTitle>
                <StoryText>{project.story.problem}</StoryText>
              </StoryCard>
              <StoryCard $accent="#F7931E" whileHover={{ y: -8 }}>
                <StoryNumber $color="#F7931E">02</StoryNumber>
                <StoryTitle>The Insight</StoryTitle>
                <StoryText>{project.story.insight}</StoryText>
              </StoryCard>
              <StoryCard $accent="#66FCF1" whileHover={{ y: -8 }}>
                <StoryNumber $color="#66FCF1">03</StoryNumber>
                <StoryTitle>The Solution</StoryTitle>
                <StoryText>{project.solution}</StoryText>
              </StoryCard>
            </StoryGrid>
          </Section>
        )}

        {/* Gallery Section */}
        {project.media?.gallery && project.media.gallery.length > 0 && (
          <Section ref={galleryRef} id="gallery">
            <SectionHeader>
              <SectionLabel>Visual Gallery</SectionLabel>
              <SectionTitle>Project Screenshots</SectionTitle>
            </SectionHeader>
            <GalleryGrid>
              {project.media.gallery.slice(0, 6).map((img, i) => (
                <GalleryCard key={i} whileHover={{ y: -10 }}>
                  <img src={img} alt={`${project.title} ${i + 1}`} />
                </GalleryCard>
              ))}
            </GalleryGrid>
          </Section>
        )}

        {/* Other Projects */}
        <PreviewSection>
          {otherProjects.map((proj) => (
            <PreviewCard
              key={proj.id}
              onClick={() => navigate(`/project/${proj.id}`)}
              whileHover={{ scale: 1.02 }}
            >
              <PreviewImage>
                <img src={proj.img} alt={proj.title} />
              </PreviewImage>
              <PreviewInfo>
                <PreviewTitle>{proj.title}</PreviewTitle>
                <PreviewMeta>{proj.cat}</PreviewMeta>
              </PreviewInfo>
              <PreviewArrow>↗</PreviewArrow>
            </PreviewCard>
          ))}
        </PreviewSection>

        {/* Back to Portfolio Footer */}
        <BackToPortfolioSection>
          <BackTitle>Ready to see more?</BackTitle>
          <BackButton
            onClick={handleClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back to Works
          </BackButton>
        </BackToPortfolioSection>
      </ContentContainer>
    </PageWrapper>
  );
};

export default SplitHeroProjectDetail;
