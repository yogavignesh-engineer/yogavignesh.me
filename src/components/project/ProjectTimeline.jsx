import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Container
const TimelineContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 3rem 0;
  margin: 2rem 0;
`;

// Timeline title
const TimelineTitle = styled.h3`
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  color: #FF6B35;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 3rem;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &::before {
    content: '◆';
    font-size: 0.8rem;
  }
`;

// Vertical line
const TimelineLine = styled.div`
  position: absolute;
  left: 50px;
  top: 80px;
  width: 3px;
  height: calc(100% - 120px);
  background: linear-gradient(180deg, #FF6B35 0%, rgba(255, 107, 53, 0.2) 100%);
  
  @media (max-width: 768px) {
    left: 20px;
  }
`;

// Timeline item wrapper
const TimelineItem = styled(motion.div)`
  position: relative;
  padding-left: 120px;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    padding-left: 60px;
  }
`;

// Phase indicator (dot on line)
const PhaseIndicator = styled(motion.div)`
  position: absolute;
  left: 38px;
  top: 0;
  width: 28px;
  height: 28px;
  background: ${props => props.$active ? 'linear-gradient(135deg, #FF6B35 0%, #E85A28 100%)' : '#1A1A1A'};
  border: 3px solid ${props => props.$active ? '#FF8C61' : '#333'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: ${props => props.$active ? '#FFF' : '#666'};
  font-weight: bold;
  box-shadow: ${props => props.$active ? '0 0 20px rgba(255, 107, 53, 0.5)' : 'none'};
  z-index: 2;
  
  @media (max-width: 768px) {
    left: 8px;
    width: 24px;
    height: 24px;
    font-size: 0.6rem;
  }
`;

// Content card
const ContentCard = styled(motion.div)`
  background: linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%);
  border: 1px solid #333;
  border-left: 3px solid #FF6B35;
  padding: 1.5rem;
  border-radius: 4px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: -10px;
    top: 12px;
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 8px solid #FF6B35;
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

// Phase header
const PhaseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 10px;
`;

// Phase name
const PhaseName = styled.h4`
  font-family: 'Oswald', sans-serif;
  font-size: 1.1rem;
  color: #FF6B35;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
`;

// Duration badge
const Duration = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: #999;
  background: rgba(255, 107, 53, 0.1);
  padding: 4px 8px;
  border-radius: 3px;
  border: 1px solid rgba(255, 107, 53, 0.2);
`;

// Action description
const Action = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #CCC;
  line-height: 1.6;
  margin: 0.5rem 0;
`;

// Outcome box
const Outcome = styled.div`
  background: rgba(255, 107, 53, 0.05);
  border-left: 2px solid #FF6B35;
  padding: 0.75rem;
  margin-top: 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #EAEAEA;
  
  &::before {
    content: '✓ OUTCOME: ';
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    color: #FF6B35;
    font-weight: bold;
    display: block;
    margin-bottom: 0.5rem;
  }
`;

/**
 * ProjectTimeline Component
 * Displays project development journey with visual timeline
 * 
 * Props:
 * - phases: Array of phase objects with { phase, action, duration, outcome }
 * - title: Timeline section title (default: "Development Journey")
 */
const ProjectTimeline = ({ phases = [], title = "Development Journey" }) => {
  if (!phases || phases.length === 0) return null;

  return (
    <TimelineContainer>
      <TimelineTitle>{title}</TimelineTitle>
      <TimelineLine />

      {phases.map((item, index) => (
        <TimelineItem
          key={index}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.15, duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <PhaseIndicator
            $active={index === phases.length - 1}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: index * 0.15 + 0.2, type: 'spring', stiffness: 200 }}
            viewport={{ once: true }}
          >
            {index + 1}
          </PhaseIndicator>

          <ContentCard
            whileHover={{ scale: 1.02, borderLeftWidth: '4px' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <PhaseHeader>
              <PhaseName>{item.phase}</PhaseName>
              {item.duration && <Duration>{item.duration}</Duration>}
            </PhaseHeader>

            <Action>{item.action}</Action>

            {item.outcome && (
              <Outcome>{item.outcome}</Outcome>
            )}
          </ContentCard>
        </TimelineItem>
      ))}
    </TimelineContainer>
  );
};

export default ProjectTimeline;
