import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import VanillaTilt from 'vanilla-tilt';

const TiltContainer = styled.div`
  transform-style: preserve-3d;
  
  .tilt-inner {
    transform: translateZ(50px);
  }
  
  .tilt-glare {
    pointer-events: none;
  }
`;

const Tilt3D = ({
    children,
    options = {},
    className = '',
    style = {}
}) => {
    const tiltRef = useRef(null);

    const defaultOptions = {
        max: 15,
        speed: 400,
        glare: true,
        'max-glare': 0.3,
        scale: 1.02,
        perspective: 1000,
        transition: true,
        axis: null,
        reset: true,
        easing: 'cubic-bezier(.03,.98,.52,.99)',
        ...options
    };

    useEffect(() => {
        const node = tiltRef.current;
        if (node) {
            VanillaTilt.init(node, defaultOptions);
        }

        return () => {
            if (node && node.vanillaTilt) {
                node.vanillaTilt.destroy();
            }
        };
    }, []);

    return (
        <TiltContainer
            ref={tiltRef}
            className={`tilt-3d ${className}`}
            style={style}
        >
            {children}
        </TiltContainer>
    );
};

export default Tilt3D;
