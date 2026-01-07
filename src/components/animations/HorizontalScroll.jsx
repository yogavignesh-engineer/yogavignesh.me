import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HorizontalWrapper = styled.section`
  position: relative;
  overflow: hidden;
`;

const HorizontalTrack = styled.div`
  display: flex;
  width: fit-content;
  will-change: transform;
`;

const Panel = styled.div`
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
`;

const HorizontalScroll = ({
    children,
    panels = [],
    className = '',
    speed = 1
}) => {
    const wrapperRef = useRef(null);
    const trackRef = useRef(null);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        const track = trackRef.current;

        if (!wrapper || !track) return;

        const totalWidth = track.scrollWidth;
        const viewportWidth = window.innerWidth;
        const scrollDistance = totalWidth - viewportWidth;

        // Set wrapper height to create scroll distance
        gsap.set(wrapper, { height: totalWidth });

        // Create horizontal scroll animation
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: wrapper,
                start: 'top top',
                end: () => `+=${scrollDistance}`,
                pin: true,
                scrub: speed,
                anticipatePin: 1,
                invalidateOnRefresh: true
            }
        });

        tl.to(track, {
            x: -scrollDistance,
            ease: 'none'
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [panels.length, speed]);

    return (
        <HorizontalWrapper ref={wrapperRef} className={`horizontal-scroll ${className}`}>
            <HorizontalTrack ref={trackRef}>
                {panels.map((panel, index) => (
                    <Panel key={index} className="horizontal-panel">
                        {panel}
                    </Panel>
                ))}
                {children}
            </HorizontalTrack>
        </HorizontalWrapper>
    );
};

export default HorizontalScroll;
