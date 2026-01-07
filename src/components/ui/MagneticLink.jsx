import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * ELITE Magnetic Link
 * 
 * - Magnetic cursor attraction
 * - Animated underline on hover
 * - Smooth color transitions
 */

const LinkWrapper = styled(motion.span)`
  position: relative;
  display: inline-block;
`;

const StyledLink = styled(motion.a)`
  position: relative;
  font-family: 'JetBrains Mono', monospace;
  font-size: ${props => props.$size || '0.85rem'};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${props => props.$color || '#111'};
  text-decoration: none;
  cursor: none;
  padding: 0.25rem 0;
  transition: color 0.3s ease;
  
  &:hover {
    color: #FF6B35;
  }
`;

const Underline = styled(motion.span)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #FF6B35, #F7931E);
  transform-origin: left center;
`;

const MagneticLink = ({
    children,
    href = '#',
    onClick,
    color = '#111',
    size = '0.85rem',
    magneticStrength = 0.2,
    className = '',
    ...props
}) => {
    const linkRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { stiffness: 200, damping: 20 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    const handleMouseMove = (e) => {
        if (!linkRef.current) return;

        const rect = linkRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        x.set(distanceX * magneticStrength);
        y.set(distanceY * magneticStrength);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    return (
        <LinkWrapper
            ref={linkRef}
            style={{ x: xSpring, y: ySpring }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            className={className}
        >
            <StyledLink
                href={href}
                onClick={onClick}
                $color={color}
                $size={size}
                {...props}
            >
                {children}
                <Underline
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                />
            </StyledLink>
        </LinkWrapper>
    );
};

export default MagneticLink;
