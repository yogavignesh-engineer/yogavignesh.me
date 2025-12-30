/**
 * Pinch-to-Zoom Component
 * 
 * Touch-enabled image zoom with pinch gestures
 * Also supports mouse wheel zoom on desktop
 */

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import styled from 'styled-components';

// --- STYLED COMPONENTS ---
const ZoomContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.isZoomed ? 'zoom-out' : 'zoom-in'};
  overflow: hidden;
  touch-action: none;
`;

const ZoomImage = styled(motion.img)`
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
  will-change: transform;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10001;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 768px) {
    top: 1rem;
    right: 1rem;
    width: 44px;
    height: 44px;
  }
`;

const ZoomIndicator = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.75rem 1.5rem;
  background: rgba(102, 252, 241, 0.2);
  border: 1px solid rgba(102, 252, 241, 0.5);
  border-radius: 20px;
  color: #66FCF1;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
  pointer-events: none;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 0.5rem 1rem;
  }
`;

const GestureHint = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  pointer-events: none;
  
  svg {
    width: 60px;
    height: 60px;
    margin-bottom: 1rem;
    opacity: 0.6;
  }
`;

// --- MAIN COMPONENT ---
export default function PinchZoom({ 
  src, 
  alt, 
  isOpen, 
  onClose,
  minZoom = 1,
  maxZoom = 4,
  showHint = true
}) {
  const [scale, setScale] = useState(1);
  const [initialDistance, setInitialDistance] = useState(0);
  const [initialScale, setInitialScale] = useState(1);
  const [showGesture, setShowGesture] = useState(true);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 });
  
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  
  // Hide gesture hint after 3 seconds
  useEffect(() => {
    if (isOpen && showHint) {
      const timer = setTimeout(() => setShowGesture(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, showHint]);
  
  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setScale(1);
      x.set(0);
      y.set(0);
    }
  }, [isOpen, x, y]);
  
  // Touch handlers
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const distance = getDistance(e.touches[0], e.touches[1]);
      setInitialDistance(distance);
      setInitialScale(scale);
      setShowGesture(false);
    }
  };
  
  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      
      const distance = getDistance(e.touches[0], e.touches[1]);
      const ratio = distance / initialDistance;
      const newScale = Math.min(Math.max(initialScale * ratio, minZoom), maxZoom);
      setScale(newScale);
    } else if (e.touches.length === 1 && scale > 1) {
      // Pan when zoomed
      e.preventDefault();
      const touch = e.touches[0];
      const rect = containerRef.current?.getBoundingClientRect();
      
      if (rect) {
        x.set(touch.clientX - rect.width / 2);
        y.set(touch.clientY - rect.height / 2);
      }
    }
  };
  
  const handleTouchEnd = () => {
    setInitialDistance(0);
  };
  
  // Mouse wheel zoom (desktop)
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.min(Math.max(scale + delta, minZoom), maxZoom);
    setScale(newScale);
    setShowGesture(false);
  };
  
  // Double tap to zoom
  const lastTap = useRef(0);
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      setScale(scale === 1 ? 2 : 1);
      x.set(0);
      y.set(0);
    }
    lastTap.current = now;
  };
  
  if (!isOpen) return null;
  
  return (
    <ZoomContainer
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === containerRef.current && scale === 1) {
          onClose();
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      isZoomed={scale > 1}
    >
      <CloseButton
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        ✕
      </CloseButton>
      
      <ZoomImage
        ref={imageRef}
        src={src}
        alt={alt}
        style={{
          scale,
          x: xSpring,
          y: ySpring
        }}
        onClick={handleDoubleTap}
        drag={scale > 1}
        dragConstraints={containerRef}
        dragElastic={0.1}
      />
      
      {scale > 1 && (
        <ZoomIndicator
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {(scale * 100).toFixed(0)}%
        </ZoomIndicator>
      )}
      
      {showGesture && showHint && (
        <GestureHint
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          <div>Pinch to zoom • Drag to pan</div>
        </GestureHint>
      )}
    </ZoomContainer>
  );
}

// --- THUMBNAIL WRAPPER ---
export function ZoomableImage({ src, alt, thumbnail, className }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <motion.img
        src={thumbnail || src}
        alt={alt}
        className={className}
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{ cursor: 'zoom-in' }}
      />
      
      <PinchZoom
        src={src}
        alt={alt}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

// --- GALLERY VARIANT ---
export function ZoomableGallery({ images, columns = 3 }) {
  const [selectedImage, setSelectedImage] = useState(null);
  
  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '1rem'
      }}>
        {images.map((img, index) => (
          <motion.img
            key={index}
            src={img.thumbnail || img.src}
            alt={img.alt || `Image ${index + 1}`}
            onClick={() => setSelectedImage(img)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '8px',
              cursor: 'zoom-in'
            }}
          />
        ))}
      </div>
      
      {selectedImage && (
        <PinchZoom
          src={selectedImage.src}
          alt={selectedImage.alt}
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
}

// --- HELPER FUNCTIONS ---
function getDistance(touch1, touch2) {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// --- USAGE EXAMPLE ---
/*
import { ZoomableImage, ZoomableGallery } from './components/PinchZoom';

// Single image
<ZoomableImage 
  src="/projects/project-large.webp"
  thumbnail="/projects/project-thumb.webp"
  alt="Project screenshot"
/>

// Gallery
<ZoomableGallery 
  images={[
    { src: '/img1.jpg', alt: 'Image 1' },
    { src: '/img2.jpg', alt: 'Image 2' },
    { src: '/img3.jpg', alt: 'Image 3' }
  ]}
  columns={3}
/>
*/
