import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// --- THEME ---
const THEME = {
  bg: '#1E1E1E', grid: '#2D2D2D', text: '#D4D4D4', blue: '#569CD6',
  orange: '#CE9178', green: '#6A9955', cyan: '#4EC9B0', mechColor: '#FFCC00',
};

// --- STYLED COMPONENTS ---
const LoaderWrapper = styled(motion.div)`
  position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
  background: ${THEME.bg}; color: ${THEME.text}; display: flex;
  flex-direction: column; justify-content: center; align-items: center;
  z-index: 10000; font-family: 'JetBrains Mono', 'Consolas', monospace;
  overflow: hidden;
  will-change: opacity, transform;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  contain: layout style paint;
  &::before {
    content: ''; position: absolute; inset: 0;
    background-image: 
      linear-gradient(${THEME.grid} 1px, transparent 1px),
      linear-gradient(90deg, ${THEME.grid} 1px, transparent 1px);
    background-size: 40px 40px; pointer-events: none; z-index: 0;
  }
`;

const Scanline = styled.div`
  position: absolute; top: 0; left: 0; width: 100%; height: 5px;
  background: linear-gradient(90deg, transparent 0%, ${THEME.mechColor} 50%, transparent 100%);
  opacity: 0.5; box-shadow: 0 0 15px ${THEME.mechColor};
  animation: scan 3s linear infinite; pointer-events: none; z-index: 20;
  @keyframes scan {
    0% { top: -10%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; }
    100% { top: 110%; opacity: 0; }
  }
`;

const DatumWrapper = styled(motion.div)`
  position: absolute; opacity: 0.25; width: 60vh; height: 60vh;
  border: 1px dashed ${THEME.blue}; border-radius: 50%;
  display: flex; justify-content: center; align-items: center;
  filter: drop-shadow(0 0 8px rgba(86, 156, 214, 0.3));
  &::before, &::after {
    content: ''; position: absolute; background: ${THEME.mechColor};
    box-shadow: 0 0 10px ${THEME.mechColor};
  }
  &::before { width: 100%; height: 1px; } 
  &::after { height: 100%; width: 1px; } 
`;

const AxisLabel = styled.div`
  position: absolute; color: ${THEME.mechColor}; font-size: 0.8rem;
  font-weight: bold; text-shadow: 0 0 5px ${THEME.mechColor};
`;

const StreamWrapper = styled.div`
  position: absolute; top: 50%; transform: translateY(-50%);
  font-size: 0.75rem; line-height: 1.8; opacity: 0.6;
  display: flex; flex-direction: column; pointer-events: none;
  &.left { 
    left: 4vw; text-align: left; color: ${THEME.mechColor};
    border-left: 1px solid rgba(255, 204, 0, 0.3); padding-left: 1rem;
  }
  &.right { 
    right: 4vw; text-align: right; color: ${THEME.blue};
    border-right: 1px solid rgba(86, 156, 214, 0.3); padding-right: 1rem;
  }
  @media (max-width: 1024px) { display: none; }
`;

const StreamLine = styled.div`
  opacity: ${props => props.$isActive ? 1 : 0.2};
`;

const CenterConsole = styled.div`
  z-index: 30; text-align: center; display: flex; flex-direction: column;
  align-items: center; gap: 1.5rem;
`;

const TitleBlock = styled.div`
  font-size: 2.5rem; font-weight: 700; letter-spacing: -1.5px;
  text-shadow: 0 0 25px rgba(86, 156, 214, 0.4); 
  .keyword { color: ${THEME.cyan}; } .var { color: ${THEME.blue}; }
  .string { color: ${THEME.orange}; } .semicolon { color: ${THEME.text}; opacity: 0.5; }
  @media (max-width: 768px) { font-size: 1.4rem; }
`;

const TerminalLine = styled(motion.div)`
  font-size: 1rem; opacity: 0.9; letter-spacing: 1px;
  .mech { color: ${THEME.mechColor}; font-weight: bold; }
  .dim { color: #666; }
`;

const ProgressBar = styled.div`
  width: 320px; height: 2px; background: #333; position: relative;
  overflow: hidden; border-radius: 2px;
  will-change: transform; /* GPU acceleration */
  &::after {
    content: ''; position: absolute; top: 0; left: 0; height: 100%; width: 100%;
    background: ${THEME.mechColor}; box-shadow: 0 0 15px ${THEME.mechColor};
    transform: translateX(-100%);
    animation: progress 1.5s cubic-bezier(0.65, 0, 0.35, 1) forwards;
    will-change: transform;
  }
  @keyframes progress { to { transform: translateX(0%); } }
`;

// --- DATA & MOTION PROPS ---
const MECH_CODES = ["G21 G90 G40", "G00 X0.0 Y0.0", "M03 S1200", "G01 Z-5.0 F200", "CHECK_TOLERANCE", "DATUM_A_LOCKED", "COOLANT_ON (M08)"];
const DEV_CODES = ["npm run build", "git push origin", "import { Hero }", "const engine = true", "await initSystem()", "console.log('READY')"];

const datumAnim = {
  animate: { rotate: 360 },
  transition: { repeat: Infinity, duration: 30, ease: "linear" } // Slower for better performance
};
const terminalLineAnim = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay: 0.3, duration: 0.3 } // Faster animation
};

// --- SUB-COMPONENTS for PERFORMANCE ---

const DataStream = React.memo(({ codes, interval, isLeftAligned }) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % codes.length);
    }, interval);
    return () => clearInterval(timer);
  }, [codes, interval]);

  return (
    <StreamWrapper className={isLeftAligned ? 'left' : 'right'}>
      {codes.map((code, i) => (
        <StreamLine key={i} $isActive={i === index}>
          {isLeftAligned ? (i === index ? '> ' : '  ') + code : code + (i === index ? ' <' : '')}
        </StreamLine>
      ))}
    </StreamWrapper>
  );
});

// --- MAIN COMPONENT ---
const HeroLoader = ({ onComplete }) => {
  useEffect(() => {
    console.log('[LOADER] HeroLoader mounted');
    console.log('[LOADER] onComplete callback:', typeof onComplete);

    // PERFORMANCE: Faster load time for better UX (1.5s)
    const finishTimer = setTimeout(() => {
      console.log('[LOADER] Timer complete, calling onComplete');
      if (typeof onComplete === 'function') {
        onComplete();
      } else {
        console.error('[LOADER] onComplete is not a function!');
      }
    }, 800);

    return () => {
      console.log('[LOADER] HeroLoader unmounting');
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  // Memoize the dynamic terminal line to optimize re-renders from DataStream
  const DynamicTerminalLine = useMemo(() => {
    const mechIndex = Math.floor((Date.now() / 120) % MECH_CODES.length);
    return (
      <TerminalLine key={mechIndex} initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <span className="mech">&gt;&gt; {MECH_CODES[mechIndex]}</span>
      </TerminalLine>
    )
  }, []);


  return (
    <LoaderWrapper
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] } }}
    >
      <Scanline />
      <DatumWrapper {...datumAnim}>
        <AxisLabel style={{ top: -25 }}>+Y</AxisLabel>
        <AxisLabel style={{ right: -30 }}>+X</AxisLabel>
      </DatumWrapper>

      <DataStream codes={MECH_CODES} interval={120} isLeftAligned />
      <DataStream codes={DEV_CODES} interval={180} />

      <CenterConsole>
        <TitleBlock>
          <span className="keyword">const</span> <span className="var">IDENTITY</span> = <span className="string">"MECH_X_DEV"</span><span className="semicolon">;</span>
        </TitleBlock>
        <TerminalLine {...terminalLineAnim}>
          <span className="dim">// INITIALIZING WORKSPACE...</span>
        </TerminalLine>
        <TerminalLine initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <span className="mech">&gt;&gt; SYSTEM READY</span>
        </TerminalLine>
        <ProgressBar />
      </CenterConsole>
    </LoaderWrapper>
  );
};

export default React.memo(HeroLoader);