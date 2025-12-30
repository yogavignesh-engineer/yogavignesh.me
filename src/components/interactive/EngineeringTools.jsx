import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';
import { useSound } from '../../hooks/useSound';
import GearCalculator from './GearCalculator';
import BeamVisualizer from './BeamVisualizer';

const ToolsContainer = styled.section`
  position: relative;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%);
  padding: 8rem 2rem;
  margin: 0;
  
  /* Performance optimizations for smooth scrolling */
  will-change: transform;
  transform: translate3d(0, 0, 0);
  contain: layout style paint;
  backface-visibility: hidden;
  
  @media (max-width: 768px) {
    padding: 4rem 1rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled(motion.h2)`
  font-family: 'Oswald', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 4px;
  color: #EAEAEA;
  margin-bottom: 1rem;
  
  span {
    color: #FFCC00;
    text-shadow: 0 0 20px rgba(255, 204, 0, 0.5);
  }
`;

const Subtitle = styled(motion.p)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: #66FCF1;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
    flex-wrap: wrap;
  }
`;

const Tab = styled(motion.button)`
  position: relative;
  background: ${props => props.$active ? 'linear-gradient(135deg, #FFCC00 0%, #FF9900 100%)' : 'rgba(255, 204, 0, 0.1)'};
  border: 2px solid ${props => props.$active ? '#FFCC00' : 'rgba(255, 204, 0, 0.3)'};
  color: ${props => props.$active ? '#000' : '#FFCC00'};
  font-family: 'Oswald', sans-serif;
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding: 1rem 2.5rem;
  cursor: none;
  transition: all 0.3s ease;
  clip-path: polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%);
  box-shadow: ${props => props.$active ? '0 0 30px rgba(255, 204, 0, 0.4)' : 'none'};
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 1rem;
    width: 6px;
    height: 6px;
    background: ${props => props.$active ? '#000' : '#FFCC00'};
    transform: translateY(-50%) rotate(45deg);
    transition: all 0.3s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 8px;
    right: 8px;
    width: 4px;
    height: 4px;
    background: ${props => props.$active ? 'rgba(0,0,0,0.3)' : 'rgba(255, 204, 0, 0.5)'};
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem 1.5rem;
    font-size: 0.85rem;
    
    &::before {
      left: 0.7rem;
      width: 5px;
      height: 5px;
    }
  }
`;

const ToolWrapper = styled(motion.div)`
  position: relative;
  width: 100%;
  min-height: 600px;
  
  /* GPU acceleration for smooth scroll */
  will-change: transform, opacity;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  
  @media (max-width: 768px) {
    min-height: 500px;
  }
`;

const DecorativeLine = styled(motion.div)`
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, #FFCC00 50%, transparent 100%);
  margin: 3rem auto;
  max-width: 600px;
  box-shadow: 0 0 10px rgba(255, 204, 0, 0.3);
`;

const EngineeringTools = React.memo(() => {
  const [activeTab, setActiveTab] = useState('gear');
  const { setCursor } = useCursor();
  const { playClick, playHover } = useSound();

  const handleTabClick = useCallback((tab) => {
    playClick();
    setActiveTab(tab);
  }, [playClick]);

  const tabs = useMemo(() => [
    { id: 'gear', label: 'Gear Calculator', icon: '⚙️' },
    { id: 'beam', label: 'Beam Analyzer', icon: '📐' }
  ], []);

  return (
    <ToolsContainer>
      <ContentWrapper>
        <Header>
          <Title
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <span>⚡</span> ENGINEERING <span>TOOLS</span>
          </Title>
          <Subtitle
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            // Precision Calculators for Real-World Problems
          </Subtitle>
        </Header>

        <DecorativeLine
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
        />

        <TabsContainer>
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => handleTabClick(tab.id)}
              onMouseEnter={() => {
                setCursor('button');
                playHover();
              }}
              onMouseLeave={() => setCursor('default')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.icon} {tab.label}
            </Tab>
          ))}
        </TabsContainer>

        <AnimatePresence mode="wait">
          <ToolWrapper
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === 'gear' ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === 'gear' ? 50 : -50 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            {activeTab === 'gear' ? <GearCalculator /> : <BeamVisualizer />}
          </ToolWrapper>
        </AnimatePresence>
      </ContentWrapper>
    </ToolsContainer>
  );
});

EngineeringTools.displayName = 'EngineeringTools';

export default EngineeringTools;
