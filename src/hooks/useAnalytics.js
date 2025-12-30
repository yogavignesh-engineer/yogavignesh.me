/**
 * useAnalytics - Google Analytics event tracking hook
 * Provides methods for tracking user interactions, conversions, and engagement
 * 
 * Usage:
 * const { trackEvent, trackPageView, trackDownload, trackOutboundLink } = useAnalytics();
 * 
 * Examples:
 * trackEvent('button_click', 'contact_form', 'submit');
 * trackDownload('Resume.pdf');
 * trackOutboundLink('GitHub', 'https://github.com/username');
 */

import { useEffect } from 'react';

export const useAnalytics = () => {
  // Check if gtag is available (loaded from Google Analytics script)
  const isGtagAvailable = () => typeof window !== 'undefined' && typeof window.gtag === 'function';

  /**
   * Track custom events
   * @param {string} action - The action name (e.g., 'click', 'download', 'submit')
   * @param {string} category - Event category (e.g., 'button', 'form', 'navigation')
   * @param {string} label - Event label (optional)
   * @param {number} value - Event value (optional, numeric)
   */
  const trackEvent = (action, category, label = '', value = null) => {
    if (!isGtagAvailable()) {
      console.warn('Google Analytics not loaded');
      return;
    }

    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });

    // Development logging
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Event tracked:', { action, category, label, value });
    }
  };

  /**
   * Track page views (for SPA navigation)
   * @param {string} path - The page path
   * @param {string} title - The page title
   */
  const trackPageView = (path, title) => {
    if (!isGtagAvailable()) return;

    window.gtag('config', 'G-64JWQSPKYJ', {
      page_path: path,
      page_title: title,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Page view:', { path, title });
    }
  };

  /**
   * Track file downloads
   * @param {string} fileName - Name of the file downloaded
   */
  const trackDownload = (fileName) => {
    trackEvent('download', 'file', fileName);
  };

  /**
   * Track outbound link clicks
   * @param {string} label - Link label (e.g., 'GitHub', 'LinkedIn')
   * @param {string} url - Destination URL
   */
  const trackOutboundLink = (label, url) => {
    trackEvent('click', 'outbound_link', label);
    
    // Small delay to ensure tracking fires before navigation
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 100);
  };

  /**
   * Track section visibility (scroll tracking)
   * @param {string} sectionName - Name of the section
   */
  const trackSectionView = (sectionName) => {
    trackEvent('view', 'section', sectionName);
  };

  /**
   * Track project interactions
   * @param {string} projectName - Name of the project
   * @param {string} action - Action taken (e.g., 'view', 'click_demo', 'click_github')
   */
  const trackProjectInteraction = (projectName, action) => {
    trackEvent(action, 'project', projectName);
  };

  /**
   * Track form submissions
   * @param {string} formName - Name of the form
   * @param {boolean} success - Whether submission was successful
   */
  const trackFormSubmission = (formName, success = true) => {
    trackEvent(success ? 'submit_success' : 'submit_error', 'form', formName);
  };

  /**
   * Track cursor mode changes (for custom cursor analytics)
   * @param {string} mode - Cursor mode (e.g., 'default', 'button', 'text')
   */
  const trackCursorMode = (mode) => {
    // Only track significant cursor changes to avoid spam
    if (['crosshair', 'text'].includes(mode)) {
      trackEvent('change', 'cursor', mode);
    }
  };

  /**
   * Track user engagement time on page
   * Auto-tracks when component mounts/unmounts
   */
  const trackEngagementTime = () => {
    const startTime = Date.now();

    return () => {
      const endTime = Date.now();
      const engagementSeconds = Math.round((endTime - startTime) / 1000);
      
      // Only track if user spent > 5 seconds
      if (engagementSeconds > 5) {
        trackEvent('engagement', 'time_on_page', window.location.pathname, engagementSeconds);
      }
    };
  };

  /**
   * Track performance metrics
   * @param {string} metricName - Name of the performance metric
   * @param {number} value - Metric value (in milliseconds)
   */
  const trackPerformance = (metricName, value) => {
    if (!isGtagAvailable()) return;

    window.gtag('event', 'timing_complete', {
      name: metricName,
      value: Math.round(value),
      event_category: 'performance',
    });
  };

  /**
   * Track errors
   * @param {string} errorMessage - Error message
   * @param {string} errorLocation - Where error occurred
   */
  const trackError = (errorMessage, errorLocation) => {
    trackEvent('error', 'javascript', `${errorLocation}: ${errorMessage}`);
  };

  return {
    trackEvent,
    trackPageView,
    trackDownload,
    trackOutboundLink,
    trackSectionView,
    trackProjectInteraction,
    trackFormSubmission,
    trackCursorMode,
    trackEngagementTime,
    trackPerformance,
    trackError,
  };
};

/**
 * Hook to auto-track page views on route changes
 */
export const usePageTracking = (location) => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView(location.pathname + location.search, document.title);
  }, [location, trackPageView]);
};

/**
 * Hook to track time spent on page
 */
export const useEngagementTracking = () => {
  const { trackEngagementTime } = useAnalytics();

  useEffect(() => {
    return trackEngagementTime();
  }, []);
};

/**
 * Hook to track scroll depth
 * Tracks when user scrolls to 25%, 50%, 75%, 100% of page
 */
export const useScrollDepthTracking = () => {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const milestones = { 25: false, 50: false, 75: false, 100: false };

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = Math.round(((scrollTop + windowHeight) / documentHeight) * 100);

      Object.keys(milestones).forEach((milestone) => {
        if (scrollPercent >= parseInt(milestone) && !milestones[milestone]) {
          milestones[milestone] = true;
          trackEvent('scroll_depth', 'engagement', `${milestone}%`, parseInt(milestone));
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackEvent]);
};

export default useAnalytics;
