import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';

const PinnedWrapper = styled.div`
  position: relative;
  height: ${props => props.$scrollHeight || '200vh'};
`;

const StickyContent = styled(motion.div)`
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const AnimatedItem = styled(motion.div)`
  position: absolute;
  will-change: transform, opacity;
`;

const PinnedSection = ({
    children,
    scrollHeight = '200vh',
    items = [],
    className = ''
}) => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    });

    return (
        <PinnedWrapper
            ref={containerRef}
            $scrollHeight={scrollHeight}
            className={`pinned-section ${className}`}
        >
            <StickyContent>
                {items.map((item, index) => {
                    const itemProgress = useTransform(
                        scrollYProgress,
                        item.scrollRange || [0, 1],
                        item.outputRange || [0, 1]
                    );

                    const opacity = useTransform(
                        scrollYProgress,
                        item.opacityRange || [0, 0.2, 0.8, 1],
                        item.opacityOutput || [0, 1, 1, 0]
                    );

                    const scale = useTransform(
                        scrollYProgress,
                        item.scaleRange || [0, 0.5, 1],
                        item.scaleOutput || [0.8, 1, 0.8]
                    );

                    const y = useTransform(
                        scrollYProgress,
                        item.yRange || [0, 1],
                        item.yOutput || ['50%', '-50%']
                    );

                    return (
                        <AnimatedItem
                            key={index}
                            style={{
                                opacity,
                                scale,
                                y,
                                ...item.style
                            }}
                        >
                            {item.content}
                        </AnimatedItem>
                    );
                })}
                {children}
            </StickyContent>
        </PinnedWrapper>
    );
};

export default PinnedSection;
