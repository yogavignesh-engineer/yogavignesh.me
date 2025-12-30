/**
 * Analytics Integration Examples
 * 
 * Add these tracking calls to your existing components
 */

// ==========================================
// Example 1: Track Hero CTA Button Click
// ==========================================
// File: src/components/hero/HeroContent.jsx

import useAnalytics from '../../hooks/useAnalytics';

function HeroContent() {
  const { trackEvent } = useAnalytics();

  const handleExploreClick = () => {
    trackEvent('click', 'cta_button', 'hero_explore');
    // Your existing scroll logic...
  };

  return (
    <button onClick={handleExploreClick}>
      Explore My Work
    </button>
  );
}

// ==========================================
// Example 2: Track Project Card Interactions
// ==========================================
// File: src/components/works/WorksMenu.jsx

import useAnalytics from '../../hooks/useAnalytics';

function WorksMenu() {
  const { trackProjectInteraction } = useAnalytics();

  const handleProjectClick = (project) => {
    trackProjectInteraction(project.title, 'view_card');
    // Your existing modal open logic...
  };

  const handleProjectHover = (project) => {
    trackProjectInteraction(project.title, 'hover_card');
  };

  return (
    <ProjectCard 
      onClick={() => handleProjectClick(project)}
      onMouseEnter={() => handleProjectHover(project)}
    >
      {project.title}
    </ProjectCard>
  );
}

// ==========================================
// Example 3: Track Resume Downloads
// ==========================================
// File: src/components/footer/Footer.jsx or wherever resume button is

import useAnalytics from '../../hooks/useAnalytics';

function ResumeButton() {
  const { trackDownload } = useAnalytics();

  const handleDownload = () => {
    trackDownload('Yoga_Vignesh_Resume.pdf');
  };

  return (
    <a 
      href="/resume/Yoga_Vignesh_Resume.pdf" 
      onClick={handleDownload}
      download
    >
      Download Resume
    </a>
  );
}

// ==========================================
// Example 4: Track Contact Form Submission
// ==========================================
// File: src/components/ContactForm.jsx

import useAnalytics from '../hooks/useAnalytics';

function ContactForm() {
  const { trackFormSubmission, trackError } = useAnalytics();

  const handleSubmit = async (formData) => {
    try {
      // Your form submission logic
      await sendEmail(formData);
      
      // Track success
      trackFormSubmission('contact_form', true);
      
      // Show success message
      setSuccess(true);
    } catch (error) {
      // Track error
      trackFormSubmission('contact_form', false);
      trackError(error.message, 'contact_form_submit');
      
      // Show error message
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields... */}
    </form>
  );
}

// ==========================================
// Example 5: Track External Link Clicks
// ==========================================
// File: src/components/footer/Footer.jsx or any social links

import useAnalytics from '../../hooks/useAnalytics';

function SocialLinks() {
  const { trackOutboundLink } = useAnalytics();

  return (
    <>
      <button onClick={() => trackOutboundLink('GitHub', 'https://github.com/username')}>
        GitHub
      </button>
      
      <button onClick={() => trackOutboundLink('LinkedIn', 'https://linkedin.com/in/username')}>
        LinkedIn
      </button>
    </>
  );
}

// ==========================================
// Example 6: Track Section Visibility
// ==========================================
// File: src/components/about/About.jsx (or any section)

import { useEffect } from 'react';
import { useInView } from 'framer-motion';
import useAnalytics from '../../hooks/useAnalytics';

function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { trackSectionView } = useAnalytics();

  useEffect(() => {
    if (isInView) {
      trackSectionView('about');
    }
  }, [isInView, trackSectionView]);

  return (
    <section ref={ref}>
      {/* About content... */}
    </section>
  );
}

// ==========================================
// Example 7: Track Blog Post Engagement
// ==========================================
// File: src/pages/BlogPostPage.jsx

import { useEffect } from 'react';
import useAnalytics from '../hooks/useAnalytics';

function BlogPostPage() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    // Track when post is opened
    trackEvent('view', 'blog_post', post.title);

    // Track if user reads 70% of expected time
    const readTimeMs = post.readTime * 60 * 1000; // Convert min to ms
    const readTimer = setTimeout(() => {
      trackEvent('complete', 'blog_post', post.title);
    }, readTimeMs * 0.7); // 70% of read time

    return () => clearTimeout(readTimer);
  }, [post, trackEvent]);

  return (
    <article>
      {/* Blog post content... */}
    </article>
  );
}

// ==========================================
// Example 8: Track Modal Opens
// ==========================================
// File: src/components/works/ProjectDetail.jsx

import useAnalytics from '../../hooks/useAnalytics';

function ProjectDetail({ project }) {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    // Track modal open
    trackEvent('open', 'modal', `project_detail_${project.title}`);
  }, [project, trackEvent]);

  const handleDemoClick = () => {
    trackEvent('click', 'button', `demo_${project.title}`);
    window.open(project.demoUrl, '_blank');
  };

  return (
    <div>
      <button onClick={handleDemoClick}>View Demo</button>
    </div>
  );
}

// ==========================================
// Example 9: Track Scroll Progress
// ==========================================
// File: Add to any long-form page

import { useEffect } from 'react';
import useAnalytics from '../hooks/useAnalytics';

function LongFormPage() {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    let scrollMilestones = { 25: false, 50: false, 75: false, 100: false };

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = Math.round(((scrollTop + windowHeight) / documentHeight) * 100);

      Object.keys(scrollMilestones).forEach((milestone) => {
        if (scrollPercent >= parseInt(milestone) && !scrollMilestones[milestone]) {
          scrollMilestones[milestone] = true;
          trackEvent('scroll_depth', 'engagement', `${milestone}%`, parseInt(milestone));
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackEvent]);

  return <div>{/* Page content... */}</div>;
}

// ==========================================
// Example 10: Track Performance Metrics
// ==========================================
// File: src/App.jsx or main entry

import { useEffect } from 'react';
import useAnalytics from './hooks/useAnalytics';

function App() {
  const { trackPerformance } = useAnalytics();

  useEffect(() => {
    // Track Core Web Vitals after page loads
    if ('performance' in window && 'getEntriesByType' in performance) {
      window.addEventListener('load', () => {
        // First Contentful Paint
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        if (fcp) {
          trackPerformance('first_contentful_paint', fcp.startTime);
        }

        // Time to Interactive (approximate with DOMContentLoaded)
        const navTiming = performance.getEntriesByType('navigation')[0];
        if (navTiming) {
          trackPerformance('dom_content_loaded', navTiming.domContentLoadedEventEnd);
        }
      });
    }
  }, [trackPerformance]);

  return <div>{/* App content... */}</div>;
}
