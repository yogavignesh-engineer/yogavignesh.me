# PERFORMANCE OPTIMIZATION GUIDE

## 🚀 ACHIEVING LIGHTHOUSE 90+ SCORE

### 1. IMAGE OPTIMIZATION

#### Convert all images to WebP
```bash
# Install Sharp (image processing)
npm install sharp

# Create conversion script
node scripts/convert-to-webp.js
```

**scripts/convert-to-webp.js**:
```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const convertImages = async (dir) => {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const ext = path.extname(file).toLowerCase();
    
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      const webpPath = filePath.replace(ext, '.webp');
      await sharp(filePath)
        .webp({ quality: 85 })
        .toFile(webpPath);
      console.log(`Converted: ${file} -> ${path.basename(webpPath)}`);
    }
  }
};

convertImages('./public/projects');
convertImages('./public/bts');
convertImages('./public/testimonials');
```

#### Responsive Images
```jsx
<picture>
  <source 
    srcSet="/projects/project-mobile.webp" 
    media="(max-width: 768px)" 
  />
  <source 
    srcSet="/projects/project-tablet.webp" 
    media="(max-width: 1024px)" 
  />
  <img 
    src="/projects/project-desktop.webp" 
    alt="Project"
    loading="lazy"
    decoding="async"
  />
</picture>
```

#### Image Component with Blur Placeholder
```jsx
// src/components/OptimizedImage.jsx
import { useState } from 'react';
import styled from 'styled-components';

const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
`;

const BlurPlaceholder = styled.div`
  position: absolute;
  inset: 0;
  background: ${props => props.$color || '#E0E0E0'};
  filter: blur(20px);
  transform: scale(1.1);
  opacity: ${props => props.$loaded ? 0 : 1};
  transition: opacity 0.4s ease;
`;

const Image = styled.img`
  opacity: ${props => props.$loaded ? 1 : 0};
  transition: opacity 0.4s ease;
`;

export const OptimizedImage = ({ src, alt, placeholderColor, ...props }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <ImageWrapper>
      <BlurPlaceholder $color={placeholderColor} $loaded={loaded} />
      <Image 
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        decoding="async"
        $loaded={loaded}
        {...props}
      />
    </ImageWrapper>
  );
};
```

---

### 2. CODE SPLITTING

#### Update vite.config.js
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true }) // Bundle analyzer
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'framer-vendor': ['framer-motion'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'animation-vendor': ['lenis'],
          
          // Component chunks
          'hero-chunk': ['./src/components/hero/Hero.jsx', './src/components/hero/HeroEnhanced.jsx'],
          'works-chunk': ['./src/components/works/Works.jsx', './src/components/works/WorksMenu.jsx'],
          'enhanced-ui': [
            './src/components/MagneticButtonEnhanced.jsx',
            './src/components/ScrollReveal.jsx',
            './src/components/ProjectCardEnhanced.jsx'
          ]
        }
      }
    },
    
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 500
  },
  
  // Optimize deps
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'three']
  }
});
```

---

### 3. FONT OPTIMIZATION

#### Preload Critical Fonts
```html
<!-- In index.html <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Preload critical fonts -->
<link 
  rel="preload" 
  href="https://fonts.gstatic.com/s/oswald/v49/TK3_WkUHHAIjg75cFRf3bXL8LICs1_FvsUtiZTaR.woff2" 
  as="font" 
  type="font/woff2" 
  crossorigin
>

<!-- Load fonts with display=swap -->
<link 
  href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Oswald:wght@400;500;600;700&display=swap" 
  rel="stylesheet"
>
```

#### Font Subsetting (Only load needed characters)
Use [Google Webfonts Helper](https://gwfh.mranftl.com/fonts) to download subsetted fonts.

---

### 4. LAZY LOADING STRATEGY

#### Intersection Observer for Images
```jsx
// src/hooks/useLazyLoad.js
import { useEffect, useRef, useState } from 'react';

export const useLazyLoad = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Load slightly before entering viewport
        ...options
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
};
```

Usage:
```jsx
const [ref, isVisible] = useLazyLoad();

<div ref={ref}>
  {isVisible && <HeavyComponent />}
</div>
```

---

### 5. REDUCE JAVASCRIPT BUNDLE

#### Tree Shaking - Import Only What You Need
```jsx
// ❌ BAD: Imports entire library
import _ from 'lodash';

// ✅ GOOD: Import specific functions
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
```

#### Dynamic Imports for Routes
```jsx
// src/App.jsx
import { lazy, Suspense } from 'react';
import { FullPageLoader } from './components/LoadingStates';

const About = lazy(() => import('./components/about/About'));
const Works = lazy(() => import('./components/works/Works'));
const Skills = lazy(() => import('./components/skills/Skills'));

function App() {
  return (
    <Suspense fallback={<FullPageLoader message="LOADING SECTION" />}>
      <About />
      <Works />
      <Skills />
    </Suspense>
  );
}
```

---

### 6. CRITICAL CSS EXTRACTION

#### Inline Critical CSS
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { criticalCss } from 'vite-plugin-critical-css';

export default defineConfig({
  plugins: [
    criticalCss({
      inline: true,
      minify: true
    })
  ]
});
```

---

### 7. CACHING STRATEGY

#### Service Worker (Optional)
```javascript
// public/service-worker.js
const CACHE_NAME = 'portfolio-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/sounds/click.mp3',
  '/sounds/hover.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

#### Browser Caching Headers (for production server)
```
# .htaccess (Apache)
<IfModule mod_expires.c>
  ExpiresActive On
  
  # Images
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  
  # CSS & JS
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  
  # Fonts
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>
```

---

### 8. REDUCE RENDER BLOCKING

#### Defer Non-Critical Scripts
```html
<!-- index.html -->
<script src="/analytics.js" defer></script>
<script src="/chat-widget.js" async></script>
```

#### Preload Key Resources
```html
<link rel="preload" href="/hero-bg.webp" as="image">
<link rel="preload" href="/main.js" as="script">
```

---

### 9. PERFORMANCE MONITORING

#### Add Performance Marks
```javascript
// src/utils/performance.js
export const markPerformance = (name) => {
  if ('performance' in window) {
    performance.mark(name);
  }
};

export const measurePerformance = (name, startMark, endMark) => {
  if ('performance' in window) {
    performance.measure(name, startMark, endMark);
    const measure = performance.getEntriesByName(name)[0];
    console.log(`${name}: ${measure.duration.toFixed(2)}ms`);
  }
};

// Usage in components
markPerformance('hero-start');
// ... render hero
markPerformance('hero-end');
measurePerformance('hero-render', 'hero-start', 'hero-end');
```

#### Web Vitals Tracking
```javascript
// src/utils/webVitals.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const sendToAnalytics = (metric) => {
  console.log(metric);
  // Send to your analytics (Google Analytics, etc.)
};

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

---

### 10. CHECKLIST

- [ ] Convert all images to WebP (85% quality)
- [ ] Add lazy loading to all images
- [ ] Implement code splitting in vite.config.js
- [ ] Preload critical fonts
- [ ] Remove unused CSS/JS
- [ ] Minify HTML/CSS/JS
- [ ] Enable Gzip/Brotli compression
- [ ] Add browser caching headers
- [ ] Optimize animations (use transform/opacity only)
- [ ] Reduce third-party scripts
- [ ] Test on real devices (mobile 3G/4G)
- [ ] Run Lighthouse audit
- [ ] Check bundle size (< 200KB initial)

---

### 11. EXPECTED RESULTS

**Before Optimization**:
- Performance: 60-70
- First Contentful Paint: 3-4s
- Largest Contentful Paint: 4-5s
- Total Blocking Time: 500-800ms
- Bundle Size: 500KB+

**After Optimization**:
- Performance: 90-95 ⭐
- First Contentful Paint: 1-1.5s ✅
- Largest Contentful Paint: 2-2.5s ✅
- Total Blocking Time: 100-200ms ✅
- Bundle Size: 150-200KB ✅

---

### 12. QUICK WINS (Implement First)

1. **Convert images to WebP** (30% smaller)
2. **Add `loading="lazy"` to all images** (defer offscreen images)
3. **Code split vendor chunks** (parallel loading)
4. **Preload critical fonts** (eliminate font flash)
5. **Remove console.logs in production** (smaller bundle)

---

**Run Lighthouse**: `npm run build && npm run preview`, then open Chrome DevTools > Lighthouse

Target: **90+ on all metrics** (Performance, Accessibility, Best Practices, SEO)
