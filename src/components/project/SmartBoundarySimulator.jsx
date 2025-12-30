import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import PistonProgressBar from '../ui/PistonProgressBar';
import MechanicalButton from '../interactive/MechanicalButton';

// Container
const SimulatorContainer = styled.div`
  background: linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%);
  border: 2px solid #FF6B35;
  border-radius: 8px;
  padding: 2rem;
  margin: 3rem 0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #FF6B35, transparent);
    animation: scan 2s linear infinite;
  }
  
  @keyframes scan {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

// Title
const SimTitle = styled.h3`
  font-family: 'Oswald', sans-serif;
  font-size: 1.8rem;
  color: #FF6B35;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &::before {
    content: '⚡';
    font-size: 1.5rem;
  }
`;

// Subtitle
const SimSubtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #999;
  margin-bottom: 2rem;
`;

// Control panel
const ControlPanel = styled.div`
  background: rgba(255, 107, 53, 0.05);
  border: 1px solid rgba(255, 107, 53, 0.2);
  border-radius: 4px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

// Slider container
const SliderControl = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

// Slider label
const SliderLabel = styled.label`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: #EAEAEA;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  
  span {
    color: #FF6B35;
    font-weight: bold;
  }
`;

// Slider input
const Slider = styled.input`
  width: 100%;
  height: 8px;
  border-radius: 5px;
  background: linear-gradient(
    to right,
    #333 0%,
    #333 ${props => props.value}%,
    #1A1A1A ${props => props.value}%,
    #1A1A1A 100%
  );
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FF6B35 0%, #E85A28 100%);
    cursor: pointer;
    border: 2px solid #FF8C61;
    box-shadow: 0 0 10px rgba(255, 107, 53, 0.5);
    transition: all 0.2s ease;
  }
  
  &::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 0 15px rgba(255, 107, 53, 0.8);
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FF6B35 0%, #E85A28 100%);
    cursor: pointer;
    border: 2px solid #FF8C61;
    box-shadow: 0 0 10px rgba(255, 107, 53, 0.5);
  }
`;

// Results display
const ResultsPanel = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

// Result card
const ResultCard = styled.div`
  background: rgba(255, 107, 53, 0.05);
  border: 1px solid rgba(255, 107, 53, 0.2);
  border-radius: 4px;
  padding: 1rem;
  text-align: center;
`;

// Result label
const ResultLabel = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: #999;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

// Result value
const ResultValue = styled.div`
  font-family: 'Oswald', sans-serif;
  font-size: 2rem;
  color: ${props => {
    if (props.status === 'excellent') return '#4CAF50';
    if (props.status === 'good') return '#FF6B35';
    if (props.status === 'warning') return '#FFC107';
    return '#F44336';
  }};
  font-weight: bold;
`;

// Visual demo area
const DemoArea = styled.div`
  background: #050505;
  border: 2px solid #333;
  border-radius: 4px;
  padding: 2rem;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

// Simulated ball
const Ball = styled(motion.div)`
  width: 40px;
  height: 40px;
  background: radial-gradient(circle at 30% 30%, #FFF, #F44336);
  border-radius: 50%;
  position: absolute;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
`;

// Boundary rope
const BoundaryRope = styled.div`
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4CAF50, #4CAF50);
  box-shadow: 0 0 10px #4CAF50;
  
  &::after {
    content: 'BOUNDARY';
    position: absolute;
    top: -20px;
    left: 10px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    color: #4CAF50;
  }
`;

// Detection indicator
const DetectionIndicator = styled(motion.div)`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 0.5rem 1rem;
  background: ${props => props.detected ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'};
  border: 2px solid ${props => props.detected ? '#4CAF50' : '#F44336'};
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: ${props => props.detected ? '#4CAF50' : '#F44336'};
  font-weight: bold;
`;

/**
 * SmartBoundarySimulator Component
 * Interactive demo of pressure threshold detection
 */
const SmartBoundarySimulator = () => {
  const [pressureThreshold, setPressureThreshold] = useState(50);
  const [sensitivity, setSensitivity] = useState(75);
  const [isSimulating, setIsSimulating] = useState(false);
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 });
  const [detectionMade, setDetectionMade] = useState(false);
  
  // Calculate accuracy based on settings
  const calculateAccuracy = () => {
    // Realistic formula: optimal at threshold=50, sensitivity=75
    const thresholdFactor = 100 - Math.abs(50 - pressureThreshold);
    const sensitivityFactor = 100 - Math.abs(75 - sensitivity) * 0.5;
    const accuracy = Math.min(99.5, (thresholdFactor + sensitivityFactor) / 2);
    return accuracy.toFixed(1);
  };
  
  // Calculate false positives
  const calculateFalsePositives = () => {
    const base = Math.abs(50 - pressureThreshold) * 0.1;
    const sens = (100 - sensitivity) * 0.05;
    return Math.min(15, base + sens).toFixed(1);
  };
  
  // Calculate response time
  const calculateResponseTime = () => {
    const base = 120;
    const thresholdDelay = Math.abs(50 - pressureThreshold) * 0.5;
    return Math.round(base + thresholdDelay);
  };
  
  // Status based on accuracy
  const getStatus = (accuracy) => {
    if (accuracy >= 98) return 'excellent';
    if (accuracy >= 95) return 'good';
    if (accuracy >= 90) return 'warning';
    return 'poor';
  };
  
  // Run simulation
  const runSimulation = () => {
    setIsSimulating(true);
    setDetectionMade(false);
    
    // Animate ball
    const startX = -60;
    const endX = window.innerWidth > 768 ? 600 : 300;
    const duration = 2000;
    const steps = 60;
    const increment = (endX - startX) / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const x = startX + (increment * currentStep);
      const y = 100 + Math.sin(currentStep * 0.2) * 20;
      
      setBallPosition({ x, y });
      
      // Check if ball crosses boundary
      if (y >= 180 && !detectionMade) {
        const accuracy = parseFloat(calculateAccuracy());
        const detected = Math.random() * 100 < accuracy;
        setDetectionMade(detected);
      }
      
      if (currentStep >= steps) {
        clearInterval(interval);
        setIsSimulating(false);
        setTimeout(() => setDetectionMade(false), 1000);
      }
    }, duration / steps);
  };
  
  const accuracy = calculateAccuracy();
  const falsePositives = calculateFalsePositives();
  const responseTime = calculateResponseTime();
  
  return (
    <SimulatorContainer>
      <SimTitle>Interactive Demo</SimTitle>
      <SimSubtitle>
        Adjust pressure threshold and sensitivity to see how detection accuracy changes
      </SimSubtitle>
      
      <ControlPanel>
        <SliderControl>
          <SliderLabel>
            Pressure Threshold (Newtons)
            <span>{pressureThreshold}N</span>
          </SliderLabel>
          <Slider
            type="range"
            min="0"
            max="100"
            value={pressureThreshold}
            onChange={(e) => setPressureThreshold(parseInt(e.target.value))}
          />
        </SliderControl>
        
        <SliderControl>
          <SliderLabel>
            Sensor Sensitivity
            <span>{sensitivity}%</span>
          </SliderLabel>
          <Slider
            type="range"
            min="0"
            max="100"
            value={sensitivity}
            onChange={(e) => setSensitivity(parseInt(e.target.value))}
          />
        </SliderControl>
      </ControlPanel>
      
      <ResultsPanel
        key={`${pressureThreshold}-${sensitivity}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ResultCard>
          <ResultLabel>Detection Accuracy</ResultLabel>
          <ResultValue status={getStatus(accuracy)}>{accuracy}%</ResultValue>
        </ResultCard>
        
        <ResultCard>
          <ResultLabel>False Positives</ResultLabel>
          <ResultValue status={falsePositives < 5 ? 'excellent' : 'warning'}>{falsePositives}%</ResultValue>
        </ResultCard>
        
        <ResultCard>
          <ResultLabel>Response Time</ResultLabel>
          <ResultValue status={responseTime < 150 ? 'excellent' : 'good'}>{responseTime}ms</ResultValue>
        </ResultCard>
      </ResultsPanel>
      
      <PistonProgressBar
        progress={parseFloat(accuracy)}
        label="SYSTEM_ACCURACY"
        height="60px"
        animated={true}
      />
      
      <div style={{ marginTop: '2rem', marginBottom: '1rem', textAlign: 'center' }}>
        <MechanicalButton
          onClick={runSimulation}
          size="large"
          disabled={isSimulating}
        >
          {isSimulating ? 'Simulating...' : 'Run Simulation'}
        </MechanicalButton>
      </div>
      
      <DemoArea>
        <BoundaryRope />
        
        {isSimulating && (
          <Ball
            animate={{
              x: ballPosition.x,
              y: ballPosition.y,
            }}
            transition={{ duration: 0.05, ease: 'linear' }}
          />
        )}
        
        {detectionMade && (
          <DetectionIndicator
            detected={true}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            ✓ BOUNDARY DETECTED
          </DetectionIndicator>
        )}
        
        {isSimulating && !detectionMade && ballPosition.y >= 180 && (
          <DetectionIndicator
            detected={false}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            ✗ MISSED DETECTION
          </DetectionIndicator>
        )}
      </DemoArea>
    </SimulatorContainer>
  );
};

export default SmartBoundarySimulator;
