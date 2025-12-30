import React, { useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// --- STYLES ---
const HUDContainer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Reticle = styled(motion.div)`
  position: absolute;
  width: 400px;
  height: 400px;
  border: 1px solid rgba(102, 252, 241, 0.3); /* Cyan low opacity */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform; /* Added will-change */

  /* The "Sniper" crosshair lines */
  &::before, &::after {
    content: '';
    position: absolute;
    background: #66FCF1;
  }
  &::before { width: 100%; height: 1px; opacity: 0.5; } /* Horizontal */
  &::after { height: 100%; width: 1px; opacity: 0.5; } /* Vertical */
`;

const Ring = styled(motion.div)`
  position: absolute;
  border: 1px dashed #66FCF1;
  border-radius: 50%;
  opacity: 0.6;
  will-change: transform; /* Added will-change */
`;

const DataLabel = styled(motion.div)`
  position: absolute;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: #66FCF1;
  background: rgba(0,0,0,0.8);
  padding: 2px 6px;
  border: 1px solid #66FCF1;
  will-change: opacity, transform; /* Added will-change */
`;

// --- COMPONENT ---
const MechanicalHUD = React.memo(({ activeId }) => {
  
  // Determine position based on active project (1-6 for 3x2 grid)
  // If null, stay center.
  const targetPos = useMemo(() => {
    switch (activeId) {
      case 1: return { x: '-33vw', y: '-25vh' }; // Top Left
      case 2: return { x: '0vw', y: '-25vh' };   // Top Center
      case 3: return { x: '33vw', y: '-25vh' };  // Top Right
      case 4: return { x: '-33vw', y: '25vh' };  // Bottom Left
      case 5: return { x: '0vw', y: '25vh' };    // Bottom Center
      case 6: return { x: '33vw', y: '25vh' };   // Bottom Right
      default: return { x: 0, y: 0 };            // Center
    }
  }, [activeId]);

  // PERFORMANCE: Memoize animation configs with SLOWER rotations for Chrome
  const spring = useMemo(() => ({ type: "spring", stiffness: 60, damping: 15, mass: 0.5 }), []);
  const ring1Transition = useMemo(() => ({ repeat: Infinity, duration: 50, ease: "linear" }), []); // Slower
  const ring2Transition = useMemo(() => ({ repeat: Infinity, duration: 40, ease: "linear" }), []); // Slower
  const labelAnimate = useMemo(() => ({ 
    opacity: activeId ? 1 : 0,
    x: 120, 
    y: -120 
  }), [activeId]);
  const labelText = useMemo(() => `TARGET_LOCK: ${activeId ? String(activeId).padStart(2, '0') : 'IDLE'}`, [activeId]);

  return (
    <HUDContainer>
      {/* MAIN RETICLE MOVES TO TARGET */}
      <Reticle
        animate={targetPos}
        transition={spring}
      >
        {/* INNER ROTATING RING 1 (Clockwise) */}
        <Ring 
          style={{ width: '300px', height: '300px', borderStyle: 'dotted' }}
          animate={{ rotate: 360 }}
          transition={ring1Transition}
        />

        {/* INNER ROTATING RING 2 (Counter-Clockwise) */}
        <Ring 
          style={{ width: '350px', height: '350px', borderWidth: '2px', borderColor: 'rgba(102, 252, 241, 0.2)' }}
          animate={{ rotate: -360 }}
          transition={ring2Transition}
        />

        {/* DATA LABEL */}
        <DataLabel
          animate={labelAnimate}
        >
          {labelText}
        </DataLabel>

      </Reticle>

      {/* STATIC GRID LINES (Background context) */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.1 }}>
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#000" strokeDasharray="5,5" />
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#000" strokeDasharray="5,5" />
      </svg>

    </HUDContainer>
  );
});

MechanicalHUD.displayName = 'MechanicalHUD';
export default MechanicalHUD;