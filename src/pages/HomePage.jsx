import React, { useRef, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import Hero from '../components/hero/Hero';
import { AboutSkeleton, WorksSkeleton, SkillsSkeleton, FooterSkeleton } from '../components/ui/SkeletonLoader';

// Lazy load heavy sections
const About = lazy(() => import('../components/about/About'));
const BentoGrid = lazy(() => import('../components/works/BentoGrid'));
const Skills = lazy(() => import('../components/skills/SkillsEnhanced'));
const BlogSection = lazy(() => import('../components/blog/BlogSection'));
const EngineeringTools = lazy(() => import('../components/interactive/EngineeringTools'));
const Footer = lazy(() => import('../components/footer/Footer'));

const MainContainer = styled.main`
  position: relative;
  width: 100% !important;
  max-width: 100% !important;
  overflow-x: hidden !important;
  overflow-y: visible;
  background-color: transparent;
  margin: 0 !important;
  padding: 0 !important;
  min-height: 100vh;
`;

export default function HomePage() {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const worksRef = useRef(null);
  const skillsRef = useRef(null);
  const blogRef = useRef(null);
  const footerRef = useRef(null);

  return (
    <>
      <Helmet>
        <title>S. Yoga Vignesh | Mechanical Engineer & Full Stack Developer Portfolio</title>
        <meta name="description" content="Interactive portfolio with 3D Three.js animations, React performance optimization, and custom cursor mechanics. Built by a mechanical engineer who codes. 3 hackathon wins | ₹43L+ cost savings demonstrated." />
        <meta name="keywords" content="Mechanical Engineer, Full Stack Developer, IoT, Computer Vision, React Developer, CAD Design, SolidWorks, CATIA, Raspberry Pi, Python, JavaScript, Portfolio" />
        <link rel="canonical" href="https://yogavignesh.me" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yogavignesh.me" />
        <meta property="og:title" content="S. Yoga Vignesh | Mechanical Engineer & Full Stack Developer" />
        <meta property="og:description" content="Interactive portfolio with 3D Three.js animations, React performance optimization, and custom cursor mechanics. Built by a mechanical engineer who codes. 3 hackathon wins | ₹43L+ cost savings." />
        <meta property="og:image" content="https://yogavignesh.me/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://yogavignesh.me" />
        <meta property="twitter:title" content="S. Yoga Vignesh | Mechanical Engineer & Full Stack Developer" />
        <meta property="twitter:description" content="Interactive portfolio with 3D Three.js animations, React performance optimization, and custom cursor mechanics. Built by a mechanical engineer who codes. 3 hackathon wins | ₹43L+ cost savings." />
        <meta property="twitter:image" content="https://yogavignesh.me/og-image.jpg" />
      </Helmet>

      <MainContainer id="main-content" role="main">
        <Hero ref={heroRef} />

        <div style={{ position: 'relative', zIndex: 10, backgroundColor: '#050505', width: '100%', maxWidth: '100%', overflowX: 'hidden', margin: 0, padding: 0 }}>
          <Suspense fallback={<AboutSkeleton />}>
            <div id="about">
              <About ref={aboutRef} />
            </div>
          </Suspense>

          <Suspense fallback={<WorksSkeleton />}>
            <BentoGrid ref={worksRef} />
          </Suspense>

          <Suspense fallback={<SkillsSkeleton />}>
            <div id="skills">
              <Skills ref={skillsRef} />
            </div>
          </Suspense>

          <Suspense fallback={<div style={{ minHeight: '50vh', background: '#050505' }} />}>
            <div id="blog">
              <BlogSection ref={blogRef} />
            </div>
          </Suspense>

          <Suspense fallback={<div style={{ minHeight: '600px', background: '#0a0a0a' }} />}>
            <EngineeringTools />
          </Suspense>

          <Suspense fallback={<FooterSkeleton />}>
            <div id="contact">
              <Footer ref={footerRef} />
            </div>
          </Suspense>
        </div>
      </MainContainer>
    </>
  );
}
