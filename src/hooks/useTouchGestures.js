import { useEffect, useRef, useCallback } from 'react';

/**
 * useTouchGestures - Enhanced touch interaction hook
 * Handles swipe gestures, pinch-to-zoom prevention, and touch optimization
 * 
 * @param {Object} options - Configuration options
 * @param {Function} options.onSwipeLeft - Callback for left swipe
 * @param {Function} options.onSwipeRight - Callback for right swipe
 * @param {Function} options.onSwipeUp - Callback for up swipe
 * @param {Function} options.onSwipeDown - Callback for down swipe
 * @param {number} options.threshold - Minimum distance for swipe (default: 50px)
 * @returns {Object} - Touch event handlers
 */
export const useTouchGestures = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  timeThreshold = 500 // Max time for swipe gesture
} = {}) => {
  const touchStartRef = useRef(null);
  const touchStartTimeRef = useRef(null);

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY
    };
    touchStartTimeRef.current = Date.now();
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!touchStartRef.current || !touchStartTimeRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartTimeRef.current;

    // Only trigger if within time threshold (prevents drag detection as swipe)
    if (deltaTime > timeThreshold) {
      touchStartRef.current = null;
      touchStartTimeRef.current = null;
      return;
    }

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Determine swipe direction (horizontal vs vertical)
    if (absX > absY) {
      // Horizontal swipe
      if (absX > threshold) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight(deltaX);
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft(deltaX);
        }
      }
    } else {
      // Vertical swipe
      if (absY > threshold) {
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown(deltaY);
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp(deltaY);
        }
      }
    }

    touchStartRef.current = null;
    touchStartTimeRef.current = null;
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, timeThreshold]);

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd
  };
};

/**
 * usePreventPinchZoom - Prevents pinch-to-zoom on touch devices
 * Useful for app-like experiences where zoom is disruptive
 */
export const usePreventPinchZoom = (enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    const preventZoom = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    const preventGestureZoom = (e) => {
      e.preventDefault();
    };

    document.addEventListener('touchmove', preventZoom, { passive: false });
    document.addEventListener('gesturestart', preventGestureZoom, { passive: false });
    document.addEventListener('gesturechange', preventGestureZoom, { passive: false });
    document.addEventListener('gestureend', preventGestureZoom, { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventZoom);
      document.removeEventListener('gesturestart', preventGestureZoom);
      document.removeEventListener('gesturechange', preventGestureZoom);
      document.removeEventListener('gestureend', preventGestureZoom);
    };
  }, [enabled]);
};

/**
 * useTouchOptimization - General touch performance optimizations
 * Adds CSS properties and event listeners for better touch responsiveness
 */
export const useTouchOptimization = () => {
  useEffect(() => {
    // Add touch-action CSS to body for better touch handling
    document.body.style.touchAction = 'pan-y';
    document.body.style.webkitTapHighlightColor = 'transparent';
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    return () => {
      document.body.style.touchAction = '';
      document.body.style.webkitTapHighlightColor = '';
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };
  }, []);
};
