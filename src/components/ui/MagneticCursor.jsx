import React, { useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';

const CursorContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 99999;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const CursorDot = styled.div`
  position: fixed;
  width: 8px;
  height: 8px;
  background: #FF6B35;
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 99999;
  mix-blend-mode: difference;
  transition: transform 0.15s ease, width 0.3s ease, height 0.3s ease, background 0.3s ease;
  
  &.hovered {
    width: 60px;
    height: 60px;
    background: rgba(255, 107, 53, 0.3);
    backdrop-filter: blur(4px);
    border: 2px solid #FF6B35;
  }
  
  &.clicking {
    transform: translate(-50%, -50%) scale(0.8);
  }
  
  &.magnetic {
    width: 80px;
    height: 80px;
    background: rgba(102, 252, 241, 0.2);
    border: 2px solid #66FCF1;
  }
`;

const CursorRing = styled.div`
  position: fixed;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 107, 53, 0.5);
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 99998;
  transition: width 0.4s ease, height 0.4s ease, border 0.3s ease, opacity 0.3s ease;
  
  &.hovered {
    width: 80px;
    height: 80px;
    border: 1px solid rgba(102, 252, 241, 0.8);
    opacity: 0.5;
  }
  
  &.hidden {
    opacity: 0;
  }
`;

const MagneticCursor = () => {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const pos = useRef({ x: 0, y: 0 });
    const dotPos = useRef({ x: 0, y: 0 });
    const ringPos = useRef({ x: 0, y: 0 });
    const rafId = useRef(null);
    const magneticElement = useRef(null);

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animate = useCallback(() => {
        // Smooth follow for dot (faster)
        dotPos.current.x = lerp(dotPos.current.x, pos.current.x, 0.2);
        dotPos.current.y = lerp(dotPos.current.y, pos.current.y, 0.2);

        // Smooth follow for ring (slower, trailing effect)
        ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.1);
        ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.1);

        if (dotRef.current) {
            dotRef.current.style.left = `${dotPos.current.x}px`;
            dotRef.current.style.top = `${dotPos.current.y}px`;
        }

        if (ringRef.current) {
            ringRef.current.style.left = `${ringPos.current.x}px`;
            ringRef.current.style.top = `${ringPos.current.y}px`;
        }

        rafId.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;

            // Check if hovering over magnetic element
            if (magneticElement.current) {
                const rect = magneticElement.current.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                // Magnetic pull effect
                const pullStrength = 0.4;
                pos.current.x = clientX + (centerX - clientX) * pullStrength;
                pos.current.y = clientY + (centerY - clientY) * pullStrength;
            } else {
                pos.current.x = clientX;
                pos.current.y = clientY;
            }
        };

        const handleMouseEnter = (e) => {
            const target = e.target.closest('[data-magnetic]');
            if (target) {
                magneticElement.current = target;
                dotRef.current?.classList.add('magnetic');
                ringRef.current?.classList.add('hidden');
            } else if (e.target.closest('a, button, [role="button"], .interactive')) {
                dotRef.current?.classList.add('hovered');
                ringRef.current?.classList.add('hovered');
            }
        };

        const handleMouseLeave = (e) => {
            if (e.target.closest('[data-magnetic]')) {
                magneticElement.current = null;
                dotRef.current?.classList.remove('magnetic');
                ringRef.current?.classList.remove('hidden');
            }
            if (e.target.closest('a, button, [role="button"], .interactive')) {
                dotRef.current?.classList.remove('hovered');
                ringRef.current?.classList.remove('hovered');
            }
        };

        const handleMouseDown = () => {
            dotRef.current?.classList.add('clicking');
        };

        const handleMouseUp = () => {
            dotRef.current?.classList.remove('clicking');
        };

        // Start animation loop
        rafId.current = requestAnimationFrame(animate);

        // Add event listeners
        document.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mouseover', handleMouseEnter, { passive: true });
        document.addEventListener('mouseout', handleMouseLeave, { passive: true });
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            if (rafId.current) cancelAnimationFrame(rafId.current);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseover', handleMouseEnter);
            document.removeEventListener('mouseout', handleMouseLeave);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [animate]);

    return (
        <CursorContainer>
            <CursorDot ref={dotRef} />
            <CursorRing ref={ringRef} />
        </CursorContainer>
    );
};

export default MagneticCursor;
