import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current device is mobile.
 * Uses both window width and touch capability detection.
 * 
 * @param {number} breakpoint - The breakpoint width in pixels (default 768)
 * @returns {boolean} - True if the device is mobile
 */
export function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check if running in browser
        if (typeof window === 'undefined') return;

        const checkMobile = () => {
            const width = window.innerWidth;
            const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

            // Consider mobile if width is below breakpoint OR it's a touch device with narrow width
            setIsMobile(width <= breakpoint || (isTouch && width <= 1024));
        };

        // Initial check
        checkMobile();

        // Listen for resize
        window.addEventListener('resize', checkMobile, { passive: true });

        return () => window.removeEventListener('resize', checkMobile);
    }, [breakpoint]);

    return isMobile;
}

export default useIsMobile;
