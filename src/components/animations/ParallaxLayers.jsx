import React, { useRef, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';

const ParallaxContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const Layer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  will-change: transform;
  transition: transform 0.1s ease-out;
  pointer-events: none;
`;

const ParallaxLayers = ({ children, layers = [], className = '' }) => {
    const containerRef = useRef(null);
    const layerRefs = useRef([]);
    const rafId = useRef(null);
    const [scrollY, setScrollY] = useState(0);

    const handleScroll = useCallback(() => {
        if (rafId.current) cancelAnimationFrame(rafId.current);

        rafId.current = requestAnimationFrame(() => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const viewportCenter = window.innerHeight / 2;
                const elementCenter = rect.top + rect.height / 2;
                const distanceFromCenter = elementCenter - viewportCenter;
                const normalizedDistance = distanceFromCenter / window.innerHeight;

                layerRefs.current.forEach((layer, index) => {
                    if (layer) {
                        const speed = layers[index]?.speed || (index + 1) * 0.1;
                        const translateY = normalizedDistance * speed * 100;
                        layer.style.transform = `translateY(${translateY}px) translateZ(0)`;
                    }
                });
            }
        });
    }, [layers]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [handleScroll]);

    return (
        <ParallaxContainer ref={containerRef} className={`parallax-layers ${className}`}>
            {layers.map((layer, index) => (
                <Layer
                    key={index}
                    ref={el => layerRefs.current[index] = el}
                    style={{ zIndex: layer.zIndex || index }}
                >
                    {layer.content}
                </Layer>
            ))}
            <div style={{ position: 'relative', zIndex: layers.length + 1 }}>
                {children}
            </div>
        </ParallaxContainer>
    );
};

export default ParallaxLayers;
