import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

// Gallery container
const GalleryContainer = styled.div`
  margin: 3rem 0;
`;

// Title
const GalleryTitle = styled.h3`
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  color: #FF6B35;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &::before {
    content: '◆';
    font-size: 0.8rem;
  }
`;

// Grid layout
const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
`;

// Image wrapper
const ImageWrapper = styled(motion.div)`
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  border-radius: 4px;
  cursor: pointer;
  background: #1A1A1A;
  border: 2px solid transparent;
  transition: border-color 0.3s ease;
  
  &:hover {
    border-color: #FF6B35;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.1);
  }
`;

// Overlay on hover
const ImageOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.8) 100%);
  display: flex;
  align-items: flex-end;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${ImageWrapper}:hover & {
    opacity: 1;
  }
`;

// Image caption
const ImageCaption = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #FFF;
  line-height: 1.4;
`;

// Lightbox overlay (full screen)
const LightboxOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

// Lightbox content
const LightboxContent = styled(motion.div)`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  cursor: default;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 4px;
  }
`;

// Close button
const CloseButton = styled(motion.button)`
  position: absolute;
  top: -50px;
  right: 0;
  width: 40px;
  height: 40px;
  background: rgba(255, 107, 53, 0.2);
  border: 2px solid #FF6B35;
  border-radius: 50%;
  color: #FF6B35;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #FF6B35;
    color: #FFF;
    transform: rotate(90deg);
  }
  
  @media (max-width: 768px) {
    top: -60px;
  }
`;

// Navigation buttons
const NavButton = styled(motion.button)`
  position: absolute;
  top: 50%;
  ${props => props.direction === 'prev' ? 'left: -60px;' : 'right: -60px;'}
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: rgba(255, 107, 53, 0.2);
  border: 2px solid #FF6B35;
  border-radius: 50%;
  color: #FF6B35;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #FF6B35;
    color: #FFF;
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    ${props => props.direction === 'prev' ? 'left: 10px;' : 'right: 10px;'}
    top: auto;
    bottom: 20px;
  }
`;

// Counter
const ImageCounter = styled.div`
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: #FF6B35;
  
  @media (max-width: 768px) {
    bottom: -50px;
  }
`;

/**
 * ImageGallery Component
 * Grid gallery with lightbox modal
 * 
 * Props:
 * - images: Array of image objects { src, caption? }
 * - title: Gallery title (default: "Gallery")
 * 
 * Example:
 * <ImageGallery 
 *   images={[
 *     { src: "/image1.jpg", caption: "Prototype" },
 *     { src: "/image2.jpg", caption: "Testing" }
 *   ]}
 *   title="Project Photos"
 * />
 */
const ImageGallery = ({ images = [], title = "Gallery" }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  
  if (!images || images.length === 0) return null;
  
  const openLightbox = (index) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };
  
  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = '';
  };
  
  const nextImage = (e) => {
    e.stopPropagation();
    if (lightboxIndex < images.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };
  
  const prevImage = (e) => {
    e.stopPropagation();
    if (lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage(e);
    if (e.key === 'ArrowLeft') prevImage(e);
  };
  
  useEffect(() => {
    if (lightboxIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [lightboxIndex]);
  
  return (
    <GalleryContainer>
      <GalleryTitle>{title}</GalleryTitle>
      
      <GalleryGrid>
        {images.map((image, index) => {
          const imageSrc = typeof image === 'string' ? image : image.src;
          const caption = typeof image === 'object' ? image.caption : '';
          
          return (
            <ImageWrapper
              key={index}
              onClick={() => openLightbox(index)}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <img src={imageSrc} alt={caption || `Image ${index + 1}`} loading="lazy" />
              {caption && (
                <ImageOverlay>
                  <ImageCaption>{caption}</ImageCaption>
                </ImageOverlay>
              )}
            </ImageWrapper>
          );
        })}
      </GalleryGrid>
      
      {/* Lightbox Modal */}
      {createPortal(
        <AnimatePresence>
          {lightboxIndex !== null && (
            <LightboxOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
            >
              <LightboxContent
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <CloseButton
                  onClick={closeLightbox}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ×
                </CloseButton>
                
                {lightboxIndex > 0 && (
                  <NavButton
                    direction="prev"
                    onClick={prevImage}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ‹
                  </NavButton>
                )}
                
                {lightboxIndex < images.length - 1 && (
                  <NavButton
                    direction="next"
                    onClick={nextImage}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ›
                  </NavButton>
                )}
                
                <img
                  src={typeof images[lightboxIndex] === 'string' 
                    ? images[lightboxIndex] 
                    : images[lightboxIndex].src
                  }
                  alt={`Image ${lightboxIndex + 1}`}
                />
                
                <ImageCounter>
                  {lightboxIndex + 1} / {images.length}
                </ImageCounter>
              </LightboxContent>
            </LightboxOverlay>
          )}
        </AnimatePresence>,
        document.body
      )}
    </GalleryContainer>
  );
};

export default ImageGallery;
