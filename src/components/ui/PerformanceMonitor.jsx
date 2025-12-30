import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const MonitorContainer = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  font-family: 'JetBrains Mono', monospace;
  user-select: none;
  
  @media (max-width: 768px) {
    bottom: 10px;
    right: 10px;
    scale: 0.85;
  }
`;

const ToggleButton = styled(motion.button)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #111 0%, #222 100%);
  border: 2px solid #66FCF1;
  color: #66FCF1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 4px 20px rgba(102, 252, 241, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #66FCF1 0%, #45A29E 100%);
    color: #111;
    transform: scale(1.1);
    box-shadow: 0 6px 30px rgba(102, 252, 241, 0.5);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const Panel = styled(motion.div)`
  position: absolute;
  bottom: 60px;
  right: 0;
  min-width: 280px;
  background: linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(34, 34, 34, 0.95) 100%);
  border: 2px solid #66FCF1;
  border-radius: 12px;
  padding: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #66FCF1 0%, #45A29E 100%);
    border-radius: 12px 12px 0 0;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(102, 252, 241, 0.2);
`;

const Title = styled.h3`
  color: #66FCF1;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '⚡';
    font-size: 1rem;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #66FCF1;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  
  &:hover {
    transform: rotate(90deg);
  }
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(102, 252, 241, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const MetricLabel = styled.span`
  color: #AAAAAA;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const MetricValue = styled(motion.span)`
  color: ${props => props.$warning ? '#FF6B35' : '#66FCF1'};
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$status === 'good' ? '#66FCF1' : props.$status === 'warning' ? '#FFCC00' : '#FF6B35'};
  box-shadow: 0 0 8px ${props => props.$status === 'good' ? '#66FCF1' : props.$status === 'warning' ? '#FFCC00' : '#FF6B35'};
  animation: pulse 2s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(102, 252, 241, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 4px;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #66FCF1 0%, #45A29E 100%);
  border-radius: 2px;
`;

const PerformanceMonitor = ({ enabled = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [metrics, setMetrics] = useState({
    fps: 60,
    loadTime: 0,
    bundleSize: '327 KB',
    memory: 0,
    paintTime: 0
  });
  
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const rafId = useRef(null);

  // Calculate FPS
  useEffect(() => {
    if (!enabled) return;
    
    const measureFPS = () => {
      frameCount.current++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime.current + 1000) {
        const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
        setMetrics(prev => ({ ...prev, fps }));
        frameCount.current = 0;
        lastTime.current = currentTime;
      }
      
      rafId.current = requestAnimationFrame(measureFPS);
    };
    
    rafId.current = requestAnimationFrame(measureFPS);
    
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [enabled]);

  // Get load time and memory on mount
  useEffect(() => {
    if (!enabled) return;
    
    // Load time from Navigation Timing API
    if (window.performance && window.performance.timing) {
      const loadTime = (performance.timing.loadEventEnd - performance.timing.navigationStart) / 1000;
      setMetrics(prev => ({ ...prev, loadTime: loadTime.toFixed(2) }));
    }
    
    // Paint time from Paint Timing API
    if (window.performance && window.performance.getEntriesByType) {
      const paintEntries = performance.getEntriesByType('paint');
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcp) {
        setMetrics(prev => ({ ...prev, paintTime: (fcp.startTime / 1000).toFixed(2) }));
      }
    }
    
    // Memory usage (Chrome only)
    const updateMemory = () => {
      if (performance.memory) {
        const usedMemory = (performance.memory.usedJSHeapSize / 1048576).toFixed(1);
        setMetrics(prev => ({ ...prev, memory: usedMemory }));
      }
    };
    
    updateMemory();
    const memoryInterval = setInterval(updateMemory, 5000);
    
    return () => clearInterval(memoryInterval);
  }, [enabled]);

  if (!enabled) return null;

  const getFPSStatus = (fps) => {
    if (fps >= 55) return 'good';
    if (fps >= 40) return 'warning';
    return 'bad';
  };

  return (
    <MonitorContainer>
      <AnimatePresence>
        {isOpen && (
          <Panel
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <Header>
              <Title>Performance</Title>
              <CloseButton onClick={() => setIsOpen(false)}>×</CloseButton>
            </Header>
            
            <MetricRow>
              <MetricLabel>FPS</MetricLabel>
              <MetricValue $warning={metrics.fps < 55}>
                <StatusDot $status={getFPSStatus(metrics.fps)} />
                {metrics.fps}
              </MetricValue>
            </MetricRow>
            
            <MetricRow>
              <MetricLabel>Load Time</MetricLabel>
              <MetricValue>{metrics.loadTime}s</MetricValue>
            </MetricRow>
            
            {metrics.paintTime > 0 && (
              <MetricRow>
                <MetricLabel>First Paint</MetricLabel>
                <MetricValue>{metrics.paintTime}s</MetricValue>
              </MetricRow>
            )}
            
            <MetricRow>
              <MetricLabel>Bundle Size</MetricLabel>
              <MetricValue>{metrics.bundleSize}</MetricValue>
            </MetricRow>
            
            {performance.memory && (
              <>
                <MetricRow>
                  <MetricLabel>Memory Usage</MetricLabel>
                  <MetricValue>{metrics.memory} MB</MetricValue>
                </MetricRow>
                <ProgressBar>
                  <ProgressFill
                    initial={{ width: 0 }}
                    animate={{ width: `${(metrics.memory / 100) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </ProgressBar>
              </>
            )}
          </Panel>
        )}
      </AnimatePresence>
      
      <ToggleButton
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Performance Metrics"
      >
        ⚡
      </ToggleButton>
    </MonitorContainer>
  );
};

export default PerformanceMonitor;
