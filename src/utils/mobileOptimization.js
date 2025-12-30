/**
 * Mobile Optimization Utilities
 * 
 * Touch-optimized interactions, gesture handling, and mobile-specific animations
 */

import { useEffect, useState, useCallback, useRef } from 'react';

// --- DEVICE DETECTION ---
export const useDeviceDetection = () => {
  const [device, setDevice] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    hasTouch: false,
    isIOS: false,
    isAndroid: false
  });

  useEffect(() => {
    const checkDevice = () => {
      const ua = navigator.userAgent;
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isMobile = /iPhone|iPod|Android.*Mobile/i.test(ua);
      const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua);
      const isDesktop = !isMobile && !isTablet;
      const isIOS = /iPhone|iPad|iPod/i.test(ua);
      const isAndroid = /Android/i.test(ua);

      setDevice({
        isMobile,
        isTablet,
        isDesktop,
        hasTouch,
        isIOS,
        isAndroid
      });
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return device;
};

// --- TOUCH GESTURES ---
export const useSwipeGesture = (onSwipe) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = useCallback((e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const onTouchMove = useCallback((e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      onSwipe?.('left');
    } else if (isRightSwipe) {
      onSwipe?.('right');
    }
  }, [touchStart, touchEnd, onSwipe]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
};

// --- SCROLL LOCK (for modals on mobile) ---
export const useScrollLock = () => {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (isLocked) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isLocked]);

  return [isLocked, setIsLocked];
};

// --- VIEWPORT HEIGHT FIX (iOS Safari) ---
export const useViewportHeight = () => {
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);
};

// Usage in CSS:
// height: 100vh; /* Fallback */
// height: calc(var(--vh, 1vh) * 100); /* iOS fix */

// --- SAFE AREA INSETS (notch support) ---
export const useSafeArea = () => {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  });

  useEffect(() => {
    const getSafeArea = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      
      setSafeArea({
        top: parseInt(computedStyle.getPropertyValue('--sat') || '0'),
        right: parseInt(computedStyle.getPropertyValue('--sar') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('--sab') || '0'),
        left: parseInt(computedStyle.getPropertyValue('--sal') || '0')
      });
    };

    // Set CSS variables for safe area
    document.documentElement.style.setProperty('--sat', 'env(safe-area-inset-top)');
    document.documentElement.style.setProperty('--sar', 'env(safe-area-inset-right)');
    document.documentElement.style.setProperty('--sab', 'env(safe-area-inset-bottom)');
    document.documentElement.style.setProperty('--sal', 'env(safe-area-inset-left)');

    getSafeArea();
  }, []);

  return safeArea;
};

// --- HAPTIC FEEDBACK (iOS/Android) ---
export const useHaptic = () => {
  const vibrate = useCallback((pattern = 10) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  const lightTap = useCallback(() => vibrate(10), [vibrate]);
  const mediumTap = useCallback(() => vibrate(20), [vibrate]);
  const heavyTap = useCallback(() => vibrate(30), [vibrate]);
  const success = useCallback(() => vibrate([10, 50, 10]), [vibrate]);
  const error = useCallback(() => vibrate([10, 50, 10, 50, 10]), [vibrate]);

  return {
    vibrate,
    lightTap,
    mediumTap,
    heavyTap,
    success,
    error
  };
};

// --- NETWORK SPEED DETECTION ---
export const useNetworkSpeed = () => {
  const [connection, setConnection] = useState({
    effectiveType: '4g',
    downlink: 10,
    saveData: false
  });

  useEffect(() => {
    const updateConnection = () => {
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      
      if (conn) {
        setConnection({
          effectiveType: conn.effectiveType || '4g',
          downlink: conn.downlink || 10,
          saveData: conn.saveData || false
        });
      }
    };

    updateConnection();

    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
      conn.addEventListener('change', updateConnection);
      return () => conn.removeEventListener('change', updateConnection);
    }
  }, []);

  return connection;
};

// --- TOUCH RIPPLE EFFECT ---
export const useTouchRipple = () => {
  const [ripples, setRipples] = useState([]);

  const addRipple = useCallback((event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.touches ? event.touches[0].clientX - rect.left : event.clientX - rect.left;
    const y = event.touches ? event.touches[0].clientY - rect.top : event.clientY - rect.top;

    const ripple = {
      id: Date.now(),
      x,
      y,
      size: Math.max(rect.width, rect.height)
    };

    setRipples(prev => [...prev, ripple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== ripple.id));
    }, 600);
  }, []);

  return { ripples, addRipple };
};

// --- ORIENTATION DETECTION ---
export const useOrientation = () => {
  const [orientation, setOrientation] = useState({
    isPortrait: window.innerHeight > window.innerWidth,
    isLandscape: window.innerWidth > window.innerHeight,
    angle: window.orientation || 0
  });

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation({
        isPortrait: window.innerHeight > window.innerWidth,
        isLandscape: window.innerWidth > window.innerHeight,
        angle: window.orientation || 0
      });
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return orientation;
};

// --- MOBILE-OPTIMIZED ANIMATION CONFIG ---
export const getMobileAnimationConfig = (device) => {
  // Reduce animation complexity on mobile
  if (device.isMobile) {
    return {
      duration: 0.3, // Shorter animations
      stiffness: 150, // Less bouncy
      damping: 25,
      reduce: true, // Flag to disable complex animations
      particleCount: 3, // Fewer particles
      enableParallax: false // Disable parallax on mobile
    };
  }

  return {
    duration: 0.6,
    stiffness: 100,
    damping: 20,
    reduce: false,
    particleCount: 8,
    enableParallax: true
  };
};

// --- TOUCH-OPTIMIZED BUTTON ---
export const TouchButton = ({ children, onTap, className, ...props }) => {
  const { lightTap } = useHaptic();
  const { ripples, addRipple } = useTouchRipple();

  const handleTouch = (e) => {
    lightTap();
    addRipple(e);
    onTap?.(e);
  };

  return (
    <button
      className={className}
      onTouchStart={addRipple}
      onClick={handleTouch}
      style={{
        position: 'relative',
        overflow: 'hidden',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        userSelect: 'none'
      }}
      {...props}
    >
      {children}
      
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.5)',
            transform: 'translate(-50%, -50%) scale(0)',
            animation: 'ripple 0.6s ease-out',
            pointerEvents: 'none'
          }}
        />
      ))}
    </button>
  );
};

// --- PERFORMANCE THROTTLE FOR MOBILE ---
export const useThrottle = (callback, delay = 16) => {
  const lastRun = useRef(Date.now());

  return useCallback((...args) => {
    const now = Date.now();
    
    if (now - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = now;
    }
  }, [callback, delay]);
};

// --- MOBILE BREAKPOINT HOOK ---
export const useMobileBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true
  });

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      setBreakpoint({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024
      });
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  return breakpoint;
};

export default {
  useDeviceDetection,
  useSwipeGesture,
  useScrollLock,
  useViewportHeight,
  useSafeArea,
  useHaptic,
  useNetworkSpeed,
  useTouchRipple,
  useOrientation,
  getMobileAnimationConfig,
  TouchButton,
  useThrottle,
  useMobileBreakpoint
};
