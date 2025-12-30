import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { SKILLS } from '../../data/skills';
import { useCursor } from '../../context/CursorContext';
import { useSound } from '../../hooks/useSound';
import PistonProgressBar from '../ui/PistonProgressBar';

// --- ANIMATIONS ---
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const rotate3D = keyframes`
  0% { transform: rotateY(0deg) rotateX(10deg); }
  100% { transform: rotateY(360deg) rotateX(10deg); }
`;

// --- STYLES ---
const Section = styled.section`
  background: #050505;
  color: #EAEAEA;
  min-height: 100vh;
  padding: 10vh 5vw 15vh 5vw;
  position: relative;
  z-index: 12;
  overflow-x: hidden;
  width: 100%;
  margin: 0;
  
  /* GPU Acceleration */
  transform: translate3d(0, 0, 0);
  will-change: transform;
  backface-visibility: hidden;
  contain: layout style paint;
  
  /* Cinematic Grid */
  background-image: 
    linear-gradient(rgba(102, 252, 241, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(102, 252, 241, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 200px;
    background: linear-gradient(to bottom, #050505, transparent);
    z-index: 1;
  }
`;

const ScanLine = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(102, 252, 241, 0.8) 50%, 
    transparent
  );
  animation: ${scanline} 6s linear infinite;
  z-index: 10;
  pointer-events: none;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 8vh;
  z-index: 2;
  position: relative;
`;

const Title = styled(motion.h2)`
  font-family: 'Oswald', sans-serif;
  font-size: clamp(3rem, 8vw, 7rem);
  text-transform: uppercase;
  color: transparent;
  -webkit-text-stroke: 2px #66FCF1;
  letter-spacing: 4px;
  margin: 0;
  position: relative;
  display: inline-block;
  
  &::after {
    content: attr(data-text);
    position: absolute;
    left: 0; top: 0;
    color: #66FCF1;
    -webkit-text-stroke: 0;
    clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
    animation: ${pulse} 3s ease-in-out infinite;
  }
`;

const Subtitle = styled.p`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: #666;
  letter-spacing: 2px;
  margin-top: 1rem;
`;

// --- HEXAGONAL GRID LAYOUT ---
const SkillsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  perspective: 1000px;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const HexagonCard = styled(motion.div)`
  width: 280px;
  height: 320px;
  position: relative;
  cursor: pointer;
  transform-style: preserve-3d;
  will-change: transform;
  
  @media (max-width: 768px) {
    width: 160px;
    height: 200px;
  }
`;

const HexagonInner = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: relative;
  background: rgba(10, 10, 10, 0.8);
  border: 2px solid ${props => props.$isActive ? '#66FCF1' : '#222'};
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, #66FCF1, #FF6B35);
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    opacity: ${props => props.$isActive ? 0.3 : 0};
    transition: opacity 0.4s ease;
    z-index: -1;
    filter: blur(10px);
  }
  
  ${HexagonCard}:focus-visible & {
    border-color: #66FCF1;
    box-shadow: 0 0 30px rgba(102, 252, 241, 0.6);
  }
  
  &:hover {
    border-color: #66FCF1;
    transform: translateY(-10px) scale(1.05);
    box-shadow: 0 20px 60px rgba(102, 252, 241, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
  }
`;

const SkillIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 252, 241, 0.2), rgba(255, 107, 53, 0.2));
  border: 2px solid #66FCF1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Oswald', sans-serif;
  font-size: 2rem;
  color: #66FCF1;
  margin-bottom: 1rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    inset: -5px;
    border-radius: 50%;
    border: 1px solid #66FCF1;
    opacity: 0.3;
  }
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
`;

const SkillName = styled.h3`
  font-family: 'Oswald', sans-serif;
  font-size: 1.2rem;
  text-transform: uppercase;
  color: #EAEAEA;
  text-align: center;
  margin: 0.5rem 0;
  letter-spacing: 1px;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const SkillCategory = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  @media (max-width: 768px) {
    font-size: 0.55rem;
  }
`;

const LevelBar = styled.div`
  width: 100%;
  height: 4px;
  background: #222;
  border-radius: 2px;
  margin-top: 1rem;
  overflow: hidden;
  position: relative;
`;

const LevelFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #FF6B35, #66FCF1);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(102, 252, 241, 0.5);
`;

const LevelText = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #66FCF1;
  margin-top: 0.5rem;
  display: block;
  
  @media (max-width: 768px) {
    font-size: 0.65rem;
  }
`;

// --- DETAIL PANEL (INLINE EXPANSION) ---
const DetailPanel = styled(motion.div)`
  grid-column: 1 / -1;
  background: linear-gradient(135deg, rgba(10, 10, 10, 0.95), rgba(5, 5, 5, 0.98));
  border: 2px solid #66FCF1;
  border-radius: 8px;
  padding: 3rem;
  margin: 2rem 0;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(20px);
  box-shadow: 
    0 20px 60px rgba(102, 252, 241, 0.3),
    inset 0 0 100px rgba(102, 252, 241, 0.05);
  
  /* Animated Corner Accents */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    border: 2px solid transparent;
    border-image: linear-gradient(135deg, #66FCF1, #FF6B35, #66FCF1) 1;
    opacity: 0.3;
    pointer-events: none;
  }
  
  /* Glowing corner markers */
  &::after {
    content: '';
    position: absolute;
    top: -2px; left: -2px;
    width: 40px; height: 40px;
    border-top: 3px solid #66FCF1;
    border-left: 3px solid #66FCF1;
    animation: ${pulse} 2s ease-in-out infinite;
  }
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const PanelGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  align-items: start;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const PanelLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #222;
  border-radius: 8px;
  position: relative;
`;

const PanelRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const LargeIcon = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 252, 241, 0.2), rgba(255, 107, 53, 0.2));
  border: 3px solid #66FCF1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Oswald', sans-serif;
  font-size: 3rem;
  color: #66FCF1;
  margin-bottom: 1.5rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: -10px;
    border-radius: 50%;
    border: 1px solid #66FCF1;
    opacity: 0.3;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: -20px;
    border-radius: 50%;
    border: 1px solid #66FCF1;
    opacity: 0.15;
  }
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: transparent;
  border: 2px solid #FF6B35;
  color: #FF6B35;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
  
  &:hover {
    background: #FF6B35;
    color: #050505;
    transform: rotate(90deg) scale(1.1);
    box-shadow: 0 0 20px rgba(255, 107, 53, 0.8);
  }
`;

const PanelTitle = styled.h2`
  font-family: 'Oswald', sans-serif;
  font-size: 2.8rem;
  color: #66FCF1;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 20px rgba(102, 252, 241, 0.5);
`;

const PanelVersion = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  color: #FF6B35;
  background: rgba(255, 107, 53, 0.2);
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid #FF6B35;
  display: inline-block;
  margin-bottom: 1rem;
`;

const PanelCategory = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 0.5rem;
`;

const PanelDesc = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  color: #EAEAEA;
  line-height: 1.8;
  margin: 0 0 2rem 0;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-left: 3px solid #66FCF1;
  border-radius: 4px;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 0;
  border-bottom: 1px solid rgba(102, 252, 241, 0.2);
  
  &:last-child {
    border-bottom: none;
  }
`;

const StatLabel = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const StatValue = styled.span`
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  color: #66FCF1;
  font-weight: 600;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(102, 252, 241, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  margin-top: 0.5rem;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.$level}%;
    background: linear-gradient(90deg, #66FCF1, #FF6B35);
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(102, 252, 241, 0.8);
    animation: ${pulse} 2s ease-in-out infinite;
  }
`;

const UseCaseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const UseCaseCard = styled.div`
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(102, 252, 241, 0.3);
  border-radius: 6px;
  padding: 1.5rem;
  position: relative;
  
  &::before {
    content: '◆';
    position: absolute;
    top: 1rem;
    left: 1rem;
    color: #FF6B35;
    font-size: 1.2rem;
  }
`;

const UseCaseTitle = styled.h4`
  font-family: 'Oswald', sans-serif;
  font-size: 1.1rem;
  color: #66FCF1;
  margin: 0 0 0.5rem 1.5rem;
  text-transform: uppercase;
`;

const UseCaseDesc = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #CCC;
  line-height: 1.6;
  margin: 0;
  margin-left: 1.5rem;
`;

const WireframeOverlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  
  /* Grid pattern */
  background-image: 
    linear-gradient(rgba(102, 252, 241, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(102, 252, 241, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
  
  /* Scanning line */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #66FCF1, transparent);
    animation: scanlineAnim 4s linear infinite;
  }
  
  @keyframes scanlineAnim {
    0% { transform: translateY(0); }
    100% { transform: translateY(100vh); }
  }
`;

const ProgressCircle = styled.div`
  width: 120px;
  height: 120px;
  position: relative;
  margin: 2rem auto;
`;

const SVG = styled.svg`
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
`;

const CircleBg = styled.circle`
  fill: none;
  stroke: #222;
  stroke-width: 8;
`;

const CircleProgress = styled(motion.circle)`
  fill: none;
  stroke: url(#gradient);
  stroke-width: 8;
  stroke-linecap: round;
  filter: drop-shadow(0 0 8px rgba(102, 252, 241, 0.6));
`;

const PercentText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Oswald', sans-serif;
  font-size: 2rem;
  color: #66FCF1;
  font-weight: bold;
`;

// --- FLOATING PARTICLES ---
const Particle = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  background: #66FCF1;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(1px);
  box-shadow: 0 0 10px #66FCF1;
`;

// --- COMPONENT ---
const Skills = React.forwardRef(function Skills(props, ref) {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const { setCursor } = useCursor();
  const { playHover, playClick } = useSound();
  const sectionRef = useRef(null);
  
  // Particles
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 10
    }));
    setParticles(newParticles);
  }, []);

  const handleSkillClick = (skill, category) => {
    playClick();
    // Toggle selection - if same skill clicked, close it
    if (selectedSkill?.name === skill.name) {
      setSelectedSkill(null);
      setActiveCategory(null);
    } else {
      setSelectedSkill({ ...skill, category });
      setActiveCategory(category);
    }
  };

  const closeModal = () => {
    setSelectedSkill(null);
    setActiveCategory(null);
  };

  // Get skill icon (first 2 letters)
  const getIcon = (name) => {
    return name.split(' ')[0].substring(0, 2).toUpperCase();
  };

  // Flatten all skills
  const allSkills = SKILLS.flatMap(cat => 
    cat.items.map(skill => ({ ...skill, category: cat.category }))
  );

  // Animated progress for PistonProgressBar
  const [pistonProgress, setPistonProgress] = useState(90);
  const [pistonLabel, setPistonLabel] = useState('SYSTEM UPTIME');

  useEffect(() => {
    const progressStates = [
      { value: 90, label: 'SYSTEM UPTIME', status: 'HYDRAULIC PRESSURE NOMINAL' },
      { value: 75, label: 'CAD PROFICIENCY', status: 'SOLIDWORKS ACTIVE' },
      { value: 85, label: 'CODE EFFICIENCY', status: 'OPTIMIZATION COMPLETE' },
      { value: 95, label: 'DESIGN QUALITY', status: 'PRECISION VERIFIED' },
      { value: 80, label: 'PROJECT STATUS', status: 'ON SCHEDULE' }
    ];
    
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % progressStates.length;
      setPistonProgress(progressStates[currentIndex].value);
      setPistonLabel(progressStates[currentIndex].label);
    }, 3000); // Change every 3 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Section ref={ref || sectionRef} data-section="skills">
      <ScanLine />
      
      {/* Floating Particles */}
      {particles.map(p => (
        <Particle
          key={p.id}
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut"
          }}
        />
      ))}
      
      <Header>
        <Title
          data-text="TECHNICAL ARSENAL"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          TECHNICAL ARSENAL
        </Title>
        <Subtitle>
          [[ ENGINEERING CAPABILITIES • OPERATIONAL SYSTEMS • MISSION READY ]]
        </Subtitle>
        
        {/* Piston Progress Bar */}
        <div style={{ 
          maxWidth: '700px', 
          margin: '3rem auto 0',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          padding: '0 1rem'
        }}>
          <div style={{ flex: '1 1 400px', minWidth: 'min(300px, 100%)' }}>
            <PistonProgressBar 
              progress={pistonProgress} 
              height="clamp(50px, 8vw, 60px)"
              maxWidth="100%"
              margin="0"
              showPercentage={false}
              showMarks={true}
              showLED={true}
              animated={true}
            />
          </div>
          <div style={{ 
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
            color: '#66FCF1',
            textAlign: 'left',
            minWidth: '150px'
          }}>
            <motion.div 
              key={pistonProgress}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ fontSize: 'clamp(2rem, 6vw, 2.5rem)', fontWeight: 'bold', marginBottom: '0.25rem', color: '#FF6B35' }}
            >
              {pistonProgress}%
            </motion.div>
            <motion.div 
              key={pistonLabel}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 0.7, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ letterSpacing: '0.1em', fontSize: 'clamp(0.7rem, 1.8vw, 0.875rem)' }}
            >
              {pistonLabel}
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)', marginTop: '0.25rem' }}
            >
              PRESSURE NOMINAL
            </motion.div>
          </div>
        </div>
      </Header>

      <SkillsGrid>
        {allSkills.map((skill, index) => {
          // Check if we should insert the panel after this skill
          const shouldShowPanelAfter = selectedSkill?.name === skill.name;
          
          return (
            <React.Fragment key={skill.name}>
              <HexagonCard
                initial={{ opacity: 0, scale: 0.8, rotateY: -180 }}
                whileInView={{ 
                  opacity: 1, 
                  scale: 1, 
                  rotateY: 0
                }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ scale: 1.1, z: 50 }}
                onClick={() => handleSkillClick(skill, skill.category)}
                onMouseEnter={() => {
                  setCursor('button');
                  playHover();
                }}
                onMouseLeave={() => setCursor('default')}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${skill.name}, ${skill.level}% proficiency`}
                aria-pressed={selectedSkill?.name === skill.name}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSkillClick(skill, skill.category);
                  }
                }}
                style={{ outline: 'none' }}
              >
                <HexagonInner $isActive={selectedSkill?.name === skill.name}>
                  <SkillIcon>
                    {getIcon(skill.name)}
                  </SkillIcon>
                  <SkillName>{skill.name}</SkillName>
                  <SkillCategory>{skill.category.replace(/_/g, ' ')}</SkillCategory>
                  <LevelBar>
                    <LevelFill
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: index * 0.05 + 0.3 }}
                      viewport={{ once: true }}
                    />
                  </LevelBar>
                  <LevelText>{skill.level}% PROFICIENCY</LevelText>
                </HexagonInner>
              </HexagonCard>
              
              {/* Inline Expandable Detail Panel */}
              <AnimatePresence>
                {shouldShowPanelAfter && (
                  <DetailPanel
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 150, damping: 20 }}
                  >
                  <WireframeOverlay />
                  <CloseButton 
                    onClick={closeModal}
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ×
                  </CloseButton>
                  
                  <PanelGrid>
                    <PanelLeft>
                      <LargeIcon>{getIcon(selectedSkill.name)}</LargeIcon>
                      <PanelTitle>{selectedSkill.name}</PanelTitle>
                      <PanelVersion>v{selectedSkill.version}</PanelVersion>
                      <PanelCategory>{selectedSkill.category.replace(/_/g, ' ')}</PanelCategory>
                      
                      {/* Circular Progress */}
                      <ProgressCircle style={{ marginTop: '2rem' }}>
                        <SVG>
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#FF6B35" />
                              <stop offset="100%" stopColor="#66FCF1" />
                            </linearGradient>
                          </defs>
                          <CircleBg cx="60" cy="60" r="50" />
                          <CircleProgress
                            cx="60"
                            cy="60"
                            r="50"
                            strokeDasharray={314}
                            initial={{ strokeDashoffset: 314 }}
                            animate={{ strokeDashoffset: 314 - (314 * selectedSkill.level / 100) }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                        </SVG>
                        <PercentText>{selectedSkill.level}%</PercentText>
                      </ProgressCircle>
                    </PanelLeft>
                    
                    <PanelRight>
                      <PanelDesc>
                        {selectedSkill.desc}
                      </PanelDesc>
                      
                      {/* Stats */}
                      <div>
                        <StatRow>
                          <StatLabel>Proficiency Level</StatLabel>
                          <StatValue>{selectedSkill.level}%</StatValue>
                        </StatRow>
                        <ProgressBar $level={selectedSkill.level} />
                        
                        <StatRow>
                          <StatLabel>Years Experience</StatLabel>
                          <StatValue>{selectedSkill.experience || '2+'}</StatValue>
                        </StatRow>
                        
                        <StatRow>
                          <StatLabel>Category</StatLabel>
                          <StatValue style={{ fontSize: '1rem', textTransform: 'uppercase' }}>
                            {selectedSkill.category.replace(/_/g, ' ')}
                          </StatValue>
                        </StatRow>
                      </div>
                      
                      {/* Use Cases */}
                      {selectedSkill.details && selectedSkill.details.length > 0 && (
                        <div>
                          <h3 style={{ 
                            fontFamily: 'Oswald', 
                            color: '#66FCF1', 
                            fontSize: '1.5rem',
                            marginBottom: '1rem',
                            textTransform: 'uppercase'
                          }}>
                            Application Areas
                          </h3>
                          <UseCaseGrid>
                            {selectedSkill.details.slice(0, 4).map((detail, i) => (
                              <UseCaseCard key={i}>
                                <UseCaseTitle>System {i + 1}</UseCaseTitle>
                                <UseCaseDesc>{detail}</UseCaseDesc>
                              </UseCaseCard>
                            ))}
                          </UseCaseGrid>
                        </div>
                      )}
                    </PanelRight>
                  </PanelGrid>
                </DetailPanel>
              )}
            </AnimatePresence>
            </React.Fragment>
          );
        })}
      </SkillsGrid>
    </Section>
  );
});

Skills.displayName = 'Skills';

export default React.memo(Skills);