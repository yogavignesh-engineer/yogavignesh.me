import React, { useState, useMemo, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import MechanicalHUD from './MechanicalHUD'; // Import the new component
import { PROJECTS } from '../../data/projects';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #EAEAEA; /* Engineering Grey */
  position: relative;
  overflow: hidden;
  pointer-events: auto;
  cursor: none; /* Ensure we use your custom cursor */
  
  @media (max-width: 768px) {
    cursor: auto; /* Show native cursor on mobile */
  }
`;

const MobileInstructions = styled(motion.div)`
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  background: rgba(17, 17, 17, 0.9);
  color: #66FCF1;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(102, 252, 241, 0.3);
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const QuadrantUI = styled.div`
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 10;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(6, 1fr);
  }
`;

const ProjectZoneContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  padding: 0 4vw; 
  will-change: opacity, transform;
  pointer-events: auto; /* Ensure clicks are captured */
  transition: background-color 0.3s ease;

  /* Dynamic Alignment based on prop */
  align-items: ${props => 
    props.alignX === 'right' ? 'flex-end' : 
    props.alignX === 'center' ? 'center' : 
    'flex-start'};
  text-align: ${props => 
    props.alignX === 'right' ? 'right' : 
    props.alignX === 'center' ? 'center' : 
    'left'};
  
  justify-content: ${props => props.alignY === 'top' ? '10vh' : 'flex-start'};
  padding-bottom: ${props => props.alignY === 'top' ? '10vh' : '0'};
  padding-top: ${props => props.alignY === 'bottom' ? '10vh' : '0'};
  
  /* Mobile touch feedback */
  @media (max-width: 768px) {
    &:active {
      background: rgba(102, 252, 241, 0.1);
      
      h3 {
        color: #66FCF1;
        transform: scale(1.05);
      }
    }
  }
  
  &:focus-visible {
    outline: 3px solid #FF6B35;
    outline-offset: -5px;
    background: rgba(255, 107, 53, 0.05);
    
    h3 {
      color: #FF6B35;
      text-shadow: 0 0 20px rgba(255, 107, 53, 0.5);
    }
  }

  h3 {
    font-family: 'Oswald', sans-serif;
    font-size: 3vw;
    color: #111;
    text-transform: uppercase;
    margin: 0;
    z-index: 20;
    transition: color 0.3s ease;
    pointer-events: none; /* Let clicks pass through to container */
  }

  /* Highlight text when active */
  &:hover h3 {
    color: #66FCF1; /* Cyan Highlight */
    -webkit-text-stroke: 1px #111;
  }

  span {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem; color: #666; margin-top: 0.5rem;
    z-index: 20;
    pointer-events: none; /* Let clicks pass through to container */
  }

  @media (max-width: 768px) { 
    h3 { font-size: 6vw; }
    padding: 2vh 4vw;
  }
`;

// PERFORMANCE: Precompute alignments for 3x2 grid (6 projects)
const ALIGNMENTS = [
  { x: 'left', y: 'top' },     // Index 0: Top Left
  { x: 'center', y: 'top' },   // Index 1: Top Center
  { x: 'right', y: 'top' },    // Index 2: Top Right
  { x: 'left', y: 'bottom' },  // Index 3: Bottom Left
  { x: 'center', y: 'bottom' },// Index 4: Bottom Center
  { x: 'right', y: 'bottom' }  // Index 5: Bottom Right
];

const getAlignment = (index) => ALIGNMENTS[index] || ALIGNMENTS[5];

// PERFORMANCE: Define outside component to prevent recreation
const zoneVariants = {
  initial: { opacity: 0, scale: 0.98 },
  visible: (i) => ({ 
    opacity: 1, 
    scale: 1,
    transition: { 
      delay: 0.05 + i * 0.05, 
      duration: 0.4,
      ease: "easeOut"
    }
  })
};

const ProjectZone = React.memo(({ project, index, onSelect, onHoverStart, onHoverEnd, isMobile, isActive }) => {
  const align = useMemo(() => getAlignment(index), [index]);

  const handleClick = useCallback(() => {
    console.log('[WorksMenu] Project clicked:', project.id, project.title);
    onSelect(project);
  }, [project, onSelect]);

  const handleInteraction = useCallback(() => {
    if (!isMobile) {
      onHoverStart(project.id);
    }
  }, [isMobile, onHoverStart, project.id]);

  return (
    <ProjectZoneContainer
      alignX={align.x}
      alignY={align.y}
      custom={index}
      variants={zoneVariants}
      initial="initial"
      whileInView="visible"
      onClick={handleClick}
      onMouseEnter={handleInteraction}
      onMouseLeave={onHoverEnd}
      onTouchStart={isMobile ? handleInteraction : undefined}
      role="button"
      tabIndex={0}
      aria-label={`View ${project.title} project - ${project.cat}${isActive ? ' (selected)' : ''}`}
      aria-pressed={isActive}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      style={{
        backgroundColor: isActive && isMobile ? 'rgba(102, 252, 241, 0.05)' : 'transparent'
      }}
    >
      <h3 style={{ 
        color: isActive && isMobile ? '#66FCF1' : '#111',
        transition: 'all 0.3s ease'
      }}>{project.title}</h3>
      <span>// {project.cat}</span>
    </ProjectZoneContainer>
  );
});
ProjectZone.displayName = 'ProjectZone';

// --- MAIN EXPORT ---
export default function WorksMenu({ onProjectSelect }) {
  const [activeId, setActiveId] = useState(null); // 1, 2, 3, 4 or null
  const [isMobile, setIsMobile] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hide instructions after first interaction
  useEffect(() => {
    if (isMobile && activeId !== null) {
      const timer = setTimeout(() => setShowInstructions(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isMobile, activeId]);

  const handleHoverStart = useCallback((id) => {
    setActiveId(id);
  }, []);
  
  const handleHoverEnd = useCallback(() => {
    // On mobile, keep active state until selection
    if (!isMobile) {
      setActiveId(null);
    }
  }, [isMobile]);

  const handleTouchProject = useCallback((project) => {
    // On mobile, tap to highlight, tap again to select
    if (isMobile) {
      if (activeId === project.id) {
        // Second tap - select project
        onProjectSelect(project);
      } else {
        // First tap - highlight
        setActiveId(project.id);
      }
    }
  }, [isMobile, activeId, onProjectSelect]);

  return (
    <Container>
      {/* THE NEW HUD LAYER (Replaces Canvas) */}
      <MechanicalHUD activeId={activeId} />

      {/* Mobile Instructions */}
      {isMobile && showInstructions && (
        <MobileInstructions
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          👆 TAP PROJECT TO HIGHLIGHT • TAP AGAIN TO VIEW
        </MobileInstructions>
      )}

      <QuadrantUI>
        {PROJECTS.map((p, index) => (
          <ProjectZone
            key={p.id}
            project={p}
            index={index}
            onSelect={isMobile ? handleTouchProject : onProjectSelect}
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
            isMobile={isMobile}
            isActive={activeId === p.id}
          />
        ))}
      </QuadrantUI>
    </Container>
  );
}