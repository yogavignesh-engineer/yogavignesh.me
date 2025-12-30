import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';

const Container = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
  touch-action: pan-y pinch-zoom;
`;

const SliderTrack = styled(motion.div)`
  display: flex;
  gap: 20px;
  padding: 20px 0;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
  
  @media (min-width: 769px) {
    cursor: default;
  }
`;

const SlideItem = styled(motion.div)`
  min-width: 300px;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    min-width: 85vw;
  }
`;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const Dot = styled(motion.button)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$active ? '#66FCF1' : '#CCC'};
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
  
  &:hover {
    background: #66FCF1;
    transform: scale(1.3);
  }
`;

const TouchFeedback = styled(motion.div)`
  position: fixed;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(102, 252, 241, 0.6) 0%, transparent 70%);
  pointer-events: none;
  z-index: 10000;
  transform: translate(-50%, -50%);
`;

export const MobileSwipeCarousel = ({ children, itemWidth = 300 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const constraintsRef = useRef(null);
  const x = useMotionValue(0);
  
  const items = React.Children.toArray(children);
  const totalItems = items.length;

  const handleDragEnd = (event, info) => {
    const threshold = itemWidth / 3;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (Math.abs(velocity) > 500) {
      // Fast swipe
      if (velocity > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (velocity < 0 && currentIndex < totalItems - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    } else if (Math.abs(offset) > threshold) {
      // Slow drag past threshold
      if (offset > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (offset < 0 && currentIndex < totalItems - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  return (
    <Container ref={constraintsRef}>
      <SliderTrack
        drag="x"
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={{ x: -currentIndex * (itemWidth + 20) }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        style={{ x }}
      >
        {items.map((child, index) => (
          <SlideItem key={index}>
            {child}
          </SlideItem>
        ))}
      </SliderTrack>
      
      <DotsContainer>
        {items.map((_, index) => (
          <Dot
            key={index}
            $active={index === currentIndex}
            onClick={() => setCurrentIndex(index)}
            whileTap={{ scale: 0.8 }}
          />
        ))}
      </DotsContainer>
    </Container>
  );
};

export const TouchFeedbackWrapper = ({ children }) => {
  const [touches, setTouches] = useState([]);

  const handleTouchStart = (e) => {
    const newTouches = Array.from(e.touches).map(touch => ({
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY
    }));
    setTouches(newTouches);
    
    // Remove touches after animation
    setTimeout(() => setTouches([]), 500);
  };

  return (
    <div onTouchStart={handleTouchStart} style={{ position: 'relative' }}>
      {children}
      {touches.map(touch => (
        <TouchFeedback
          key={touch.id}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ left: touch.x, top: touch.y }}
        />
      ))}
    </div>
  );
};

export const PullToRefresh = ({ onRefresh, children }) => {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const PULL_THRESHOLD = 100;

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (startY.current && window.scrollY === 0) {
      const currentY = e.touches[0].clientY;
      const distance = currentY - startY.current;
      
      if (distance > 0) {
        setPullDistance(Math.min(distance, PULL_THRESHOLD * 1.5));
        setPulling(distance > PULL_THRESHOLD);
      }
    }
  };

  const handleTouchEnd = () => {
    if (pulling && onRefresh) {
      onRefresh();
    }
    setPullDistance(0);
    setPulling(false);
    startY.current = 0;
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ position: 'relative' }}
    >
      {pullDistance > 0 && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px',
            background: 'rgba(102, 252, 241, 0.9)',
            borderRadius: '0 0 8px 8px',
            color: '#111',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.8rem',
            fontWeight: 600,
            zIndex: 9999,
            opacity: pullDistance / PULL_THRESHOLD
          }}
          animate={{ y: Math.min(pullDistance, PULL_THRESHOLD) }}
        >
          {pulling ? '🚀 Release to refresh' : '⬇️ Pull down'}
        </motion.div>
      )}
      {children}
    </div>
  );
};

// Hook for haptic feedback (mobile only)
export const useHapticFeedback = () => {
  const vibrate = (pattern = [10]) => {
    if ('vibrate' in navigator && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      navigator.vibrate(pattern);
    }
  };

  return {
    light: () => vibrate([10]),
    medium: () => vibrate([20]),
    heavy: () => vibrate([30]),
    success: () => vibrate([10, 50, 10]),
    error: () => vibrate([50, 100, 50])
  };
};

export default {
  MobileSwipeCarousel,
  TouchFeedbackWrapper,
  PullToRefresh,
  useHapticFeedback
};
