import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PROJECTS } from '../../data/projects';
import { useCursor } from '../../context/CursorContext';

// Animations
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

const Section = styled.section`
  position: relative;
  z-index: 11;
  background: linear-gradient(180deg, #0A0A0A 0%, #111 50%, #0A0A0A 100%);
  padding: 10vh 5vw;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  
  /* Grid Background */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(rgba(102, 252, 241, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(102, 252, 241, 0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 8vh;
  position: relative;
  z-index: 2;
`;

const SectionLabel = styled(motion.span)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #66FCF1;
  letter-spacing: 4px;
  text-transform: uppercase;
  display: block;
  margin-bottom: 1rem;
`;

const Title = styled(motion.h2)`
  font-family: 'Oswald', sans-serif;
  font-size: clamp(3rem, 10vw, 8rem);
  font-weight: 700;
  color: transparent;
  -webkit-text-stroke: 2px #fff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
  line-height: 1;
  
  span {
    color: #fff;
    -webkit-text-stroke: 0;
  }
`;

const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  max-width: 600px;
  margin: 1.5rem auto 0;
  line-height: 1.6;
`;

// Bento Grid Container
const BentoContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, minmax(200px, auto));
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

// Project Card with glassmorphism
const ProjectCard = styled(motion.article)`
  position: relative;
  background: linear-gradient(
    135deg,
    rgba(20, 20, 20, 0.9) 0%,
    rgba(30, 30, 30, 0.8) 100%
  );
  border: 1px solid rgba(102, 252, 241, 0.1);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  
  /* Grid positioning */
  &.featured {
    grid-column: span 2;
    grid-row: span 2;
    min-height: 500px;
  }
  
  &.tall {
    grid-row: span 2;
    min-height: 400px;
  }
  
  &.wide {
    grid-column: span 2;
  }
  
  /* Glassmorphism effect */
  backdrop-filter: blur(10px);
  
  /* Gradient border on hover */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    padding: 2px;
    background: linear-gradient(135deg, #66FCF1, #FF6B35, #66FCF1);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: xor;
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  /* Shimmer effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.05) 50%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: ${shimmer} 3s infinite;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::after {
    opacity: 1;
  }
  
  @media (max-width: 1024px) {
    &.featured, &.tall, &.wide {
      grid-column: span 1;
      grid-row: span 1;
      min-height: 350px;
    }
  }
`;

const CardImage = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${props => props.$src});
  background-size: cover;
  background-position: center;
  opacity: 0.3;
  transition: opacity 0.5s ease, transform 0.5s ease;
  
  ${ProjectCard}:hover & {
    opacity: 0.5;
    transform: scale(1.05);
  }
`;

const CardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.9) 100%
  );
  z-index: 1;
`;

const CardContent = styled.div`
  position: relative;
  z-index: 2;
  height: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const CategoryBadge = styled(motion.span)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: #66FCF1;
  letter-spacing: 2px;
  text-transform: uppercase;
  background: rgba(102, 252, 241, 0.1);
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid rgba(102, 252, 241, 0.3);
  width: fit-content;
  margin-bottom: 1rem;
`;

const CardTitle = styled(motion.h3)`
  font-family: 'Oswald', sans-serif;
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 0.5rem 0;
  line-height: 1.1;
`;

const CardSubtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  margin: 0 0 1rem 0;
  max-width: 400px;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
`;

const TechTag = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 10px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const MetricHighlight = styled(motion.div)`
  position: absolute;
  top: 2rem;
  right: 2rem;
  text-align: right;
  z-index: 2;
`;

const MetricValue = styled.div`
  font-family: 'Oswald', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #FF6B35;
  line-height: 1;
`;

const MetricLabel = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const ViewButton = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #66FCF1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #050505;
  font-size: 1.2rem;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
  z-index: 3;
  
  ${ProjectCard}:hover & {
    opacity: 1;
    transform: scale(1);
  }
`;

// MEMOIZED CARD COMPONENT FOR PERFORMANCE
const CardItem = React.memo(({ project, index, className }) => {
  const navigate = useNavigate();
  const { setCursor } = useCursor();
  const ref = useRef(null);
  const rafId = useRef(null);

  // Motion Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth Springs
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    stiffness: 150, damping: 20, mass: 0.5
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
    stiffness: 150, damping: 20, mass: 0.5
  });

  const handleClick = () => {
    navigate(`/work/${project.id}`);
  };

  const handleMouseMove = (e) => {
    if (!ref.current) return;

    // THROTTLE WITH RAF
    if (rafId.current) return;

    rafId.current = requestAnimationFrame(() => {
      const rect = ref.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;

      x.set(xPct);
      y.set(yPct);

      rafId.current = null;
    });
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    setCursor('default');
  };

  const primaryMetric = project.metrics ? Object.entries(project.metrics)[0] : null;

  return (
    <ProjectCard
      ref={ref}
      className={`${className} gpu-accelerated`} // Force GPU
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setCursor('view')}
      onMouseOut={() => setCursor('default')}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ z: 20 }}
    >
      <CardImage $src={project.img} className="no-paint-layout" />
      <CardOverlay />

      {primaryMetric && className === 'featured' && (
        <MetricHighlight
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.1 }}
        >
          <MetricValue>{primaryMetric[1]}</MetricValue>
          <MetricLabel>{primaryMetric[0].replace(/([A-Z])/g, ' $1').trim()}</MetricLabel>
        </MetricHighlight>
      )}

      <CardContent className="no-paint-layout">
        <CategoryBadge
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 + index * 0.1 }}
        >
          {project.cat}
        </CategoryBadge>

        <CardTitle
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 + index * 0.1 }}
        >
          {project.title}
        </CardTitle>

        {project.subtitle && (
          <CardSubtitle>{project.subtitle}</CardSubtitle>
        )}

        {project.tech && (
          <TechStack>
            {project.tech.slice(0, 3).map((tech, i) => (
              <TechTag key={i}>{tech}</TechTag>
            ))}
          </TechStack>
        )}
      </CardContent>

      <ViewButton>→</ViewButton>
    </ProjectCard>
  );
});

// Main Bento Grid Component
const BentoGrid = React.forwardRef(function BentoGrid(props, ref) {
  // Get first 6 projects for the grid
  const projects = PROJECTS.slice(0, 6);

  // Define grid layout classes
  const getClass = (index) => {
    switch (index) {
      case 0: return 'featured'; // PromptToCAD - Large Featured
      case 1: return 'tall';     // Smart Boundary - Tall
      case 2: return '';         // Wi-Rover - Normal
      case 3: return '';         // Ferrofluids - Normal
      case 4: return 'wide';     // Sand Filtration - Wide
      case 5: return '';         // Plummer Block - Normal
      default: return '';
    }
  };

  return (
    <Section ref={ref} id="works" data-section="works">
      <Header>
        <SectionLabel
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          [ Selected Works ]
        </SectionLabel>

        <Title
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Featured <span>Projects</span>
        </Title>

        <Subtitle>
          Engineering solutions that blend mechanical precision with digital innovation
        </Subtitle>
      </Header>

      <BentoContainer>
        {projects.map((project, index) => (
          <CardItem
            key={project.id}
            project={project}
            className={getClass(index)}
            index={index}
          />
        ))}
      </BentoContainer>
    </Section>
  );
});

export default React.memo(BentoGrid);
