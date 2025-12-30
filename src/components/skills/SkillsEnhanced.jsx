import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { SKILLS } from '../../data/skills';
import { useCursor } from '../../context/CursorContext';

// --- ANIMATIONS ---
const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(102, 252, 241, 0.3); }
  50% { box-shadow: 0 0 40px rgba(102, 252, 241, 0.6); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const gradientShift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

// --- STYLES ---
const Section = styled.section`
  background: linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #050505 100%);
  color: #EAEAEA;
  min-height: 100vh;
  padding: 10vh 5vw 15vh;
  position: relative;
  z-index: 12;
  overflow: hidden;
  width: 100%;
  
  /* Animated grid background */
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
    background-size: 80px 80px;
    pointer-events: none;
  }
`;

const ScanLine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, 
    transparent 0%,
    rgba(102, 252, 241, 0.8) 50%,
    transparent 100%
  );
  animation: ${scanline} 8s linear infinite;
  z-index: 5;
  pointer-events: none;
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
  margin-bottom: 1.5rem;
`;

const Title = styled(motion.h2)`
  font-family: 'Oswald', sans-serif;
  font-size: clamp(3rem, 10vw, 8rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
  line-height: 1;
  background: linear-gradient(135deg, #EAEAEA 0%, #66FCF1 50%, #FF6B35 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${gradientShift} 5s ease infinite;
`;

const Subtitle = styled.p`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 1rem;
  letter-spacing: 2px;
`;

// Category Tabs
const CategoryTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 5vh;
  flex-wrap: wrap;
`;

const CategoryTab = styled(motion.button)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 1rem 2rem;
  background: ${props => props.$active ?
    'linear-gradient(135deg, rgba(102, 252, 241, 0.2), rgba(255, 107, 53, 0.1))' :
    'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${props => props.$active ? '#66FCF1' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$active ? '#66FCF1' : 'rgba(255, 255, 255, 0.6)'};
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  
  &::before {
    content: '${props => props.$id}';
    position: absolute;
    top: 8px;
    left: 8px;
    font-size: 0.6rem;
    color: #FF6B35;
    opacity: 0.8;
  }
  
  &:hover {
    border-color: #66FCF1;
    background: rgba(102, 252, 241, 0.1);
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(102, 252, 241, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.7rem;
  }
`;

// Skills Container - Bento Style
const SkillsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

// Skill Card - Glassmorphism Style
const SkillCard = styled(motion.div)`
  position: relative;
  background: linear-gradient(135deg, 
    rgba(20, 20, 20, 0.9) 0%, 
    rgba(30, 30, 30, 0.8) 100%
  );
  border: 1px solid rgba(102, 252, 241, 0.15);
  border-radius: 20px;
  padding: 2.5rem;
  cursor: pointer;
  backdrop-filter: blur(20px);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Gradient border effect */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    padding: 2px;
    background: linear-gradient(135deg, #66FCF1, #FF6B35);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: xor;
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  /* Corner accent */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, transparent 50%, rgba(102, 252, 241, 0.1) 50%);
    border-radius: 0 20px 0 0;
  }
  
  &:hover {
    transform: translateY(-10px) scale(1.02);
    border-color: #66FCF1;
    box-shadow: 
      0 20px 60px rgba(102, 252, 241, 0.2),
      0 0 40px rgba(102, 252, 241, 0.1);
    
    &::before {
      opacity: 1;
    }
  }
  
  ${props => props.$featured && `
    grid-column: span 2;
    
    @media (max-width: 640px) {
      grid-column: span 1;
    }
  `}
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const SkillIcon = styled(motion.div)`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(102, 252, 241, 0.2), rgba(255, 107, 53, 0.1));
  border: 2px solid rgba(102, 252, 241, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Oswald', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #66FCF1;
  position: relative;
  
  /* Rotating ring */
  &::before {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 20px;
    border: 2px dashed rgba(102, 252, 241, 0.3);
    animation: ${rotate} 20s linear infinite;
  }
`;

const VersionBadge = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: #FF6B35;
  background: rgba(255, 107, 53, 0.15);
  padding: 4px 10px;
  border-radius: 12px;
  border: 1px solid rgba(255, 107, 53, 0.3);
`;

const SkillName = styled.h3`
  font-family: 'Oswald', sans-serif;
  font-size: 1.6rem;
  font-weight: 600;
  color: #EAEAEA;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const SkillDesc = styled.p`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 1px;
  margin: 0 0 1.5rem 0;
`;

// Circular Progress
const ProgressRing = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  margin: 1.5rem auto;
`;

const CircleSVG = styled.svg`
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
`;

const CircleBackground = styled.circle`
  fill: none;
  stroke: rgba(102, 252, 241, 0.1);
  stroke-width: 8;
`;

const CircleProgress = styled(motion.circle)`
  fill: none;
  stroke: url(#skillGradient);
  stroke-width: 8;
  stroke-linecap: round;
  filter: drop-shadow(0 0 8px rgba(102, 252, 241, 0.6));
`;

const ProgressValue = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const ProgressPercent = styled.span`
  font-family: 'Oswald', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #66FCF1;
  display: block;
`;

const ProgressLabel = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

// Experience Badge
const ExperienceBadge = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ExpValue = styled.span`
  font-family: 'Oswald', sans-serif;
  font-size: 1.2rem;
  color: #FF6B35;
  font-weight: 600;
`;

const ExpLabel = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
`;

// Skill Details Panel
const DetailsPanel = styled(motion.div)`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px dashed rgba(102, 252, 241, 0.2);
`;

const DetailItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  
  &::before {
    content: '◆';
    color: #66FCF1;
    font-size: 0.5rem;
    margin-top: 0.4rem;
    flex-shrink: 0;
  }
`;

// Stats Row
const StatsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin-top: 8vh;
  padding: 3rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  border: 1px solid rgba(102, 252, 241, 0.1);
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;
  }
`;

const StatItem = styled(motion.div)`
  text-align: center;
`;

const StatValue = styled.div`
  font-family: 'Oswald', sans-serif;
  font-size: 3.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #66FCF1, #FF6B35);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
`;

const StatLabel = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 0.5rem;
`;

// --- HELPER FUNCTIONS ---
const getIcon = (name) => {
  // Simple icon placeholder logic - in real app, use react-icons or SVGs
  const firstLetter = name.charAt(0);
  return <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{firstLetter}</div>;
};

// MEMOIZED SKILL CARD FOR PERFORMANCE
const SkillItem = React.memo(({ skill, index, isFeatured, expanded, onExpand }) => {
  const { setCursor } = useCursor();

  return (
    <SkillCard
      $featured={isFeatured}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => onExpand(expanded ? null : skill.name)}
      onMouseEnter={() => setCursor('view')}
      onMouseLeave={() => setCursor('default')}
      whileHover={{ y: -10 }}
      className="gpu-accelerated"
    >
      <CardHeader>
        <SkillIcon
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {getIcon(skill.name)}
        </SkillIcon>
        <VersionBadge>{skill.version}</VersionBadge>
      </CardHeader>

      <SkillName>{skill.name}</SkillName>
      <SkillDesc>{skill.desc}</SkillDesc>

      <ProgressRing>
        <CircleSVG viewBox="0 0 100 100">
          <CircleBackground cx="50" cy="50" r="42" />
          <CircleProgress
            cx="50"
            cy="50"
            r="42"
            strokeDasharray={2 * Math.PI * 42}
            initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 42 - (skill.level / 100) * (2 * Math.PI * 42) }}
            transition={{ duration: 1.5, delay: 0.5 + index * 0.2, ease: 'easeOut' }}
          />
        </CircleSVG>
        <ProgressValue>
          <ProgressPercent>{skill.level}%</ProgressPercent>
          <ProgressLabel>Level</ProgressLabel>
        </ProgressValue>
      </ProgressRing>

      <ExperienceBadge
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 + index * 0.1 }}
      >
        <ExpValue>{skill.experience}+</ExpValue>
        <ExpLabel>Years Experience</ExpLabel>
      </ExperienceBadge>

      {/* Expandable Details */}
      <AnimatePresence>
        {expanded && skill.details && (
          <DetailsPanel
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {skill.details.map((detail, i) => (
              <DetailItem
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.1 }}
              >
                <div style={{ color: '#66FCF1' }}>▹</div>
                <div>{detail}</div>
              </DetailItem>
            ))}
          </DetailsPanel>
        )}
      </AnimatePresence>
    </SkillCard>
  );
});

// --- MAIN COMPONENT ---
const SkillsEnhanced = React.forwardRef(function SkillsEnhanced(props, ref) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [expandedSkill, setExpandedSkill] = useState(null);
  const { setCursor } = useCursor();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const currentSkills = SKILLS[activeCategory]?.items || [];

  return (
    <Section ref={ref || sectionRef} id="skills" data-section="skills">
      <ScanLine />

      {/* SVG Gradient Definition */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="skillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#66FCF1" />
            <stop offset="100%" stopColor="#FF6B35" />
          </linearGradient>
        </defs>
      </svg>

      <Header>
        <SectionLabel
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          [ Technical Arsenal ]
        </SectionLabel>

        <Title
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Skills & Expertise
        </Title>

        <Subtitle>
          Engineering x Technology x Innovation
        </Subtitle>
      </Header>

      {/* Category Tabs */}
      <CategoryTabs>
        {SKILLS.map((cat, index) => (
          <CategoryTab
            key={cat.category}
            $active={activeCategory === index}
            $id={cat.id}
            onClick={() => {
              setActiveCategory(index);
              setExpandedSkill(null);
            }}
            onMouseEnter={() => setCursor('pointer')}
            onMouseLeave={() => setCursor('default')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {cat.category.replace(/_/g, ' ')}
          </CategoryTab>
        ))}
      </CategoryTabs>

      {/* Skills Grid */}
      <AnimatePresence mode="wait">
        <SkillsContainer
          key={activeCategory}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
        >
          {currentSkills.map((skill, index) => (
            <SkillItem
              key={skill.name}
              skill={skill}
              index={index}
              isFeatured={index === 0 && currentSkills.length > 2}
              expanded={expandedSkill === skill.name}
              onExpand={setExpandedSkill}
            />
          ))}
        </SkillsContainer>
      </AnimatePresence>

      {/* Bottom Stats */}
      <StatsRow>
        <StatItem
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <StatValue>8+</StatValue>
          <StatLabel>Core Skills</StatLabel>
        </StatItem>
        <StatItem
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <StatValue>15+</StatValue>
          <StatLabel>Projects Built</StatLabel>
        </StatItem>
        <StatItem
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <StatValue>5+</StatValue>
          <StatLabel>Hackathons</StatLabel>
        </StatItem>
        <StatItem
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <StatValue>4+</StatValue>
          <StatLabel>Years Learning</StatLabel>
        </StatItem>
      </StatsRow>
    </Section>
  );
});

export default React.memo(SkillsEnhanced);
