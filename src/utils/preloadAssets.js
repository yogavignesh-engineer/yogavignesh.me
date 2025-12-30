/**
 * Asset Preloading Utilities
 * Preloads critical 3D models and images for better performance
 */

import { useGLTF } from '@react-three/drei';

// Preload 3D models
export const preload3DModels = () => {
  // Preload Dodge Challenger model if it exists
  const modelPath = '/models/dodge-challenger/scene.gltf';
  try {
    useGLTF.preload(modelPath);
    console.log('✅ Preloaded 3D model:', modelPath);
  } catch (error) {
    console.warn('⚠️ Could not preload model:', modelPath);
  }
};

// Progressive image loading with blur-up effect
export const createProgressiveImage = (src, placeholder) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    // Load low-quality placeholder first
    if (placeholder) {
      const placeholderImg = new Image();
      placeholderImg.src = placeholder;
      placeholderImg.onload = () => {
        resolve({ src: placeholder, isPlaceholder: true });
      };
    }
    
    // Then load full quality
    img.src = src;
    img.onload = () => resolve({ src, isPlaceholder: false });
    img.onerror = reject;
  });
};

// Preload critical project images
export const preloadProjectImages = (projects) => {
  const criticalImages = projects.slice(0, 4).map(p => p.img);
  
  criticalImages.forEach(src => {
    if (src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.type = 'image/webp';
      document.head.appendChild(link);
    }
  });
  
  console.log(`✅ Preloaded ${criticalImages.length} project images`);
};

// Lazy load images with IntersectionObserver
export const useLazyImage = (ref, src) => {
  if (typeof window === 'undefined') return;
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && ref.current) {
          ref.current.src = src;
          observer.disconnect();
        }
      });
    },
    { rootMargin: '50px' }
  );
  
  if (ref.current) {
    observer.observe(ref.current);
  }
  
  return () => observer.disconnect();
};

export default {
  preload3DModels,
  createProgressiveImage,
  preloadProjectImages,
  useLazyImage
};
