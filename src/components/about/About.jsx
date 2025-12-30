import React from 'react';
import styled from 'styled-components';
import AboutHero from './AboutHero';
import BioGrid from './BioGrid';
import RhythmSection from './RhythmSection';
import TimelineParallax from './TimelineParallax';
import BigFooter from './BigFooter';
import LabNotes from './LabNotes';

const PageContainer = styled.div`
  background-color: #050505;
  color: #EAEAEA;
  width: 100%;
  overflow-x: hidden;
  overflow-y: visible;
  
  /* CRITICAL: Slides OVER the sticky Hero */
  position: relative;
  z-index: 10; 
  
  /* Shadow for depth */
  box-shadow: 0 -10vh 15vh rgba(0,0,0,0.8); 
  margin: 0;
  padding: 0;
`;

const About = React.memo(React.forwardRef((props, ref) => {
  return (
    <PageContainer ref={ref} data-section="about">
      <AboutHero />
      <BioGrid />
      <RhythmSection />
      <LabNotes />
      <TimelineParallax />
      <BigFooter />
    </PageContainer>
  );
}));

About.displayName = 'About';

export default About;