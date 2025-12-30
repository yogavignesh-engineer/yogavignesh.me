import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import WorksMenu from './WorksMenu';
import BlueprintOverlay from '../project/BlueprintOverlay';
import SectionTransition from '../animations/SectionTransition';

const Section = styled.section`
  position: relative;
  z-index: 11;
  background: linear-gradient(180deg, #EAEAEA 0%, #D0D0D0 100%);
  width: 100%;
  overflow-x: hidden;
  overflow-y: visible;
  margin: 0;
  padding: 0;
  
  /* PERFORMANCE: Hardware acceleration */
  transform: translate3d(0, 0, 0);
  will-change: transform;
  contain: layout style paint;
  backface-visibility: hidden;
  
  /* Add subtle texture */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(circle, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
  }
`;

const Works = React.forwardRef(function Works(props, ref) {
  const navigate = useNavigate();

  const handleProjectSelect = useCallback((menuItem) => {
    console.log('[Works] Navigating to project:', menuItem.id);
    // Navigate to project detail page with router
    navigate(`/work/${menuItem.id}`);
  }, [navigate]);

  return (
    <Section ref={ref} data-section="works" id="works">
      {/* Blueprint overlay */}
      <BlueprintOverlay 
        variant="light" 
        intensity={0.15}
        showCorners={true}
        showAnnotations={false}
        showScanLine={false}
      />
      
      {/* Section transition */}
      <SectionTransition 
        variant="light"
        height="150px"
        label="WORKS_MODULE"
      />
      
      <WorksMenu onProjectSelect={handleProjectSelect} />
    </Section>
  );
});

export default React.memo(Works);