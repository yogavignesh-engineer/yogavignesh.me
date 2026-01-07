import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import Lenis from 'lenis';
import GlobalStyles from './styles/GlobalStyles';
import { CursorProvider } from './context/CursorContext';
import { usePageTracking, useScrollDepthTracking } from './hooks/useAnalytics';
import { useTouchOptimization } from './hooks/useTouchGestures';

import HeroNavbar from './components/hero/HeroNavbar';
import CustomCursor from './components/ui/CustomCursor';
import Grain from './components/ui/Grain';
import HeroLoader from './components/hero/HeroLoader';
import KonamiCode from './KonamiCode';
import AvailabilityBadge from './components/ui/AvailabilityBadge';
import PerformanceMonitor from './components/ui/PerformanceMonitor';
import MechanicalHUD from './components/ui/MechanicalHUD';
import { AnimationProvider, useAnimationReady } from './context/AnimationContext';
import { ScrollProgress } from './components/animations/MicroInteractions';
import { PageTransition } from './components/animations/PageTransition';

// Route Pages
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';

// Lazy load heavy components
const ProjectDetailPage = React.lazy(() => import('./pages/ProjectDetailPage'));
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage'));
const ResumePage = React.lazy(() => import('./pages/ResumePage'));

// Simple loading fallback for lazy-loaded routes
const RouteLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: #000;
  color: #FF6B35;
  font-family: 'Inter', sans-serif;
`;

const SkipToContent = styled.a`
  position: fixed;
  top: -100px;
  left: 20px;
  z-index: 9999;
  padding: 1rem 2rem;
  background: #FF6B35;
  color: white;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  border-radius: 4px;
  transition: top 0.3s ease;
  
  &:focus {
    top: 20px;
    outline: 3px solid #66FCF1;
    outline-offset: 4px;
  }
  
  @media print {
    display: none !important;
    visibility: hidden !important;
  }
`;

const MainContainer = styled.main`
  flex: 1;
  position: relative;
  z-index: 1;
`;


function AppContent() {
  const location = useLocation();
  // Only show loader on homepage
  const isHomePage = location.pathname === '/';
  const [loading, setLoading] = useState(isHomePage);
  const lenisRef = useRef(null);
  const { setAnimationReady } = useAnimationReady();

  // Analytics tracking
  usePageTracking(location);
  useScrollDepthTracking();

  // Touch optimization for mobile devices
  useTouchOptimization();

  useEffect(() => {
    // Handle hash navigation (e.g., /#works)
    if (location.hash) {
      setTimeout(() => {
        const elementId = location.hash.replace('#', '');
        const element = document.getElementById(elementId);
        if (element) {
          if (lenisRef.current) {
            lenisRef.current.scrollTo(element, {
              duration: 0.8,
              offset: -100
            });
          } else {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 300);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      touchMultiplier: 2,
      smoothWheel: true,
      lerp: 0.08,
      infinite: false,
      syncTouch: true,
      syncTouchLerp: 0.1,
      touchInertiaMultiplier: 25,
      prevent: (node) => node.classList.contains('lenis-prevent') || node.hasAttribute('data-lenis-prevent'),
      autoResize: true,
      normalizeWheel: true
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const handleNavClick = (section) => {
    if (section.toLowerCase() === 'resume') {
      window.location.href = '/resume';
      return;
    }
    // For router-based navigation, navigate to home with hash
    window.location.href = `/#${section.toLowerCase().replace(' ', '-')}`;
  };

  const handleLoaderComplete = () => {
    setLoading(false);
    // Signal all hero animations to start now
    setAnimationReady(true);
  };

  const isResumePage = location.pathname === '/resume';

  return (
    <CursorProvider>
      <GlobalStyles />
      <CustomCursor />
      {!loading && <MechanicalHUD />}
      <Grain />
      <ScrollProgress />
      <KonamiCode />

      {/* Skip to content link for accessibility */}
      <SkipToContent href="#main-content">Skip to main content</SkipToContent>

      <AnimatePresence mode="wait">
        {loading && isHomePage && <HeroLoader key="loader" onComplete={handleLoaderComplete} />}
      </AnimatePresence>

      {/* Hide navbar during loading, on resume page, and on project detail pages */}
      {!loading && !isResumePage && !location.pathname.startsWith('/project') && (
        <HeroNavbar onNavClick={handleNavClick} />
      )}

      <LazyMotion features={domAnimation}>
        <MainContainer id="main-content" role="main">
          {/* <Hero ref={heroRef} /> */}
          {/* Hero is usually outside LazyMotion if it needs instant hydration, but domAnimation is small enough */}

          <Suspense fallback={<RouteLoader />}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/project/:id" element={<ProjectDetailPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/resume" element={<ResumePage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </MainContainer>
      </LazyMotion>

      {/* AvailabilityBadge removed to avoid navbar overlap */}

      {/* Performance Monitor - Toggle with Ctrl+Shift+P */}
      <PerformanceMonitor enabled={true} />
    </CursorProvider>
  );
}

function App() {
  return (
    <AnimationProvider>
      <AppContent />
    </AnimationProvider>
  );
}

export default App;