import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// Pulse animation for values
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Container
const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
  padding: 2rem 0;
  border-top: 2px solid rgba(255, 107, 53, 0.2);
  border-bottom: 2px solid rgba(255, 107, 53, 0.2);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
`;

// Metric card
const MetricCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.05) 0%, rgba(255, 107, 53, 0.02) 100%);
  border: 1px solid rgba(255, 107, 53, 0.2);
  padding: 1.5rem;
  border-radius: 4px;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #FF6B35, transparent);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

// Metric label
const MetricLabel = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
`;

// Metric value (big number)
const MetricValue = styled(motion.div)`
  font-family: 'Oswald', sans-serif;
  font-size: 2.5rem;
  font-weight: bold;
  color: #FF6B35;
  line-height: 1;
  margin: 0.5rem 0;
  animation: ${pulse} 3s ease-in-out infinite;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

// Metric icon (optional)
const MetricIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  opacity: 0.6;
`;

// Title for metrics section
const MetricsTitle = styled.h3`
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  color: #FF6B35;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &::before {
    content: '◆';
    font-size: 0.8rem;
  }
`;

// Wrapper
const MetricsSection = styled.div`
  margin: 3rem 0;
`;

/**
 * ProjectMetrics Component
 * Displays key metrics in an eye-catching grid
 * 
 * Props:
 * - metrics: Object with metric keys and values
 * - title: Section title (default: "Key Metrics")
 * 
 * Example:
 * <ProjectMetrics 
 *   metrics={{
 *     accuracy: "99.2%",
 *     costReduction: "₹43L saved",
 *     responseTime: "120ms"
 *   }}
 * />
 */
const ProjectMetrics = ({ metrics = {}, title = "Key Metrics" }) => {
  if (!metrics || Object.keys(metrics).length === 0) return null;
  
  // Format metric keys into readable labels
  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1') // Add space before capitals
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .trim();
  };
  
  // Icon mapping (optional - can add custom icons per metric type)
  const getIcon = (key) => {
    const iconMap = {
      accuracy: '🎯',
      cost: '💰',
      time: '⏱️',
      users: '👥',
      speed: '⚡',
      efficiency: '📊',
      performance: '🚀'
    };
    
    // Find matching icon based on key words
    for (const [keyword, icon] of Object.entries(iconMap)) {
      if (key.toLowerCase().includes(keyword)) {
        return icon;
      }
    }
    return '📈'; // Default icon
  };
  
  return (
    <MetricsSection>
      <MetricsTitle>{title}</MetricsTitle>
      
      <MetricsGrid>
        {Object.entries(metrics).map(([key, value], index) => (
          <MetricCard
            key={key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ 
              scale: 1.05,
              borderColor: '#FF6B35',
              transition: { type: 'spring', stiffness: 300 }
            }}
          >
            <MetricIcon>{getIcon(key)}</MetricIcon>
            <MetricLabel>{formatLabel(key)}</MetricLabel>
            <MetricValue
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
              viewport={{ once: true }}
            >
              {value}
            </MetricValue>
          </MetricCard>
        ))}
      </MetricsGrid>
    </MetricsSection>
  );
};

export default ProjectMetrics;
