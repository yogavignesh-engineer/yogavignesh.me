import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Magnetic from '../interactive/Magnetic';

// --- STYLED COMPONENTS ---
const NavbarContainer = styled(motion.nav)`
  position: fixed; top: 0; left: 0; right: 0;
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 2rem 2vw 2rem 4vw; z-index: 100;
  color: ${props => props.$isDark ? '#EAEAEA' : '#000000'};
  font-size: 0.75rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.5px;
  pointer-events: none; 
  transition: color 0.3s ease;
  text-shadow: ${props => props.$isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.1)'};
  & > * { pointer-events: auto; }
  @media (max-width: 768px) {
    padding: 1.5rem 2vw 1.5rem 6vw; font-size: 0.7rem;
  }
`;

const NavLinksContainer = styled(motion.div)`
  display: flex; gap: 4vw;
  @media (max-width: 768px) { display: none; }
`;

const LinkText = styled(motion.span)`
  position: relative; cursor: pointer; display: inline-block;
  &::after {
    content: ''; position: absolute; bottom: -2px; left: 0;
    width: 0%; height: 1px; background: currentColor;
    transition: width 0.3s ease;
  }
  &:hover::after { width: 100%; }
  
  /* Focus state for keyboard navigation */
  &:focus-visible {
    outline: 2px solid #66FCF1;
    outline-offset: 4px;
    border-radius: 2px;
  }
`;

const ContactButtonContainer = styled(motion.div)`
  text-align: right; cursor: pointer;
  display: flex; justify-content: flex-end; align-items: center;
  gap: 4px;
  white-space: nowrap;
  max-width: 120px;
  font-size: 0.7rem;
  svg { 
    width: 10px; 
    height: 10px; 
    flex-shrink: 0;
    min-width: 10px;
  }
  @media (max-width: 768px) { 
    font-size: 0.6rem;
    gap: 3px;
    max-width: 90px;
  }
`;

const ScrollProgressBar = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #FF6B35, #F7931E, #66FCF1);
  transform-origin: 0%;
  z-index: 999;
  box-shadow: 0 0 10px rgba(255, 107, 53, 0.5);
`;

const ResumeIndicator = styled(motion.span)`
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.5rem;
  color: #FF6B35;
  letter-spacing: 1px;
  white-space: nowrap;
  pointer-events: none;
`;

// --- MOTION PROPS ---
const navbarAnim = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut", delay: 0.5 } // 0.5s delay
};
const navLinksContainerAnim = {
  initial: "hidden",
  animate: "visible",
  variants: { visible: { transition: { staggerChildren: 0.1, delayChildren: 1.3 } } } // 0.8 + 0.5
};
const navLinkAnim = {
  variants: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  },
  whileHover: { scale: 1.1 }
};
const logoLineAnim = {
  variants: {
    hidden: { y: "100%", opacity: 0 },
    visible: (i) => ({ y: "0%", opacity: 1, transition: { delay: 1.0 + i * 0.15, duration: 0.8, ease: [0.215, 0.61, 0.355, 1] } }) // 0.5 + 0.5
  },
  initial: "hidden",
  animate: "visible",
  whileHover: { x: 5, opacity: 0.7 }
};
const contactButtonAnim = {
  initial: { x: 50, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { delay: 1.5 }, // 1.0 + 0.5
  whileHover: { scale: 1.05 }
};
const contactIconAnim = {
  animate: { x: [0, 5, 0] },
  transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut", repeatDelay: 3 }
};
const links = ['ABOUT ME', 'WORKS', 'SKILLS', 'RESUME'];

// --- SUB-COMPONENTS for PERFORMANCE ---

const LogoText = React.memo(({ text, onClick }) => {
  const lines = text.split('<br/>');
  return (
    <Magnetic>
      <motion.div
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        style={{ overflow: 'hidden', cursor: 'pointer' }}
        role="button"
        tabIndex={0}
        aria-label="Go to top of page"
      >
        {lines.map((line, i) => (
          <motion.div key={i} custom={i} {...logoLineAnim} style={{ lineHeight: 1 }}>
            {line}
          </motion.div>
        ))}
      </motion.div>
    </Magnetic>
  );
});
LogoText.displayName = 'LogoText';

const NavLink = React.memo(({ link, onClick, isResume }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Magnetic>
      <motion.div
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        {...navLinkAnim}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ position: 'relative' }}
        role="button"
        tabIndex={0}
        aria-label={`Navigate to ${link} section`}
      >
        <LinkText>[ {link} ]</LinkText>
        {isResume && isHovered && (
          <ResumeIndicator
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            ↓ SCROLL TO BUTTON
          </ResumeIndicator>
        )}
      </motion.div>
    </Magnetic>
  );
});
NavLink.displayName = 'NavLink';

// --- MAIN COMPONENT ---

const HeroNavbar = ({ onNavClick }) => {
  const [isDark, setIsDark] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleClick = useCallback((section) => {
    onNavClick?.(section);
  }, [onNavClick]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Calculate scroll progress
      const progress = scrollY / (documentHeight - viewportHeight);
      setScrollProgress(progress);

      const worksSection = document.querySelector('[data-section="works"]');

      // Hero section: 0 to 80vh - show black text (isDark = false)
      if (scrollY < viewportHeight * 0.8) {
        setIsDark(false);
        return;
      }

      // Check if in Works section (light background)
      if (worksSection) {
        const worksTop = worksSection.offsetTop;
        const worksBottom = worksTop + worksSection.offsetHeight;
        if (scrollY >= worksTop - 100 && scrollY < worksBottom - 100) {
          setIsDark(false); // Works has light background, use dark text
          return;
        }
      }

      // Default: dark sections (About, Skills, Footer) - show white text
      setIsDark(true);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <ScrollProgressBar
        style={{ scaleX: scrollProgress }}
        initial={{ scaleX: 0 }}
      />
      <NavbarContainer {...navbarAnim} $isDark={isDark} style={{ opacity: 1 }}>
        <LogoText text={"S. YOGA<br/>VIGNESH"} onClick={() => handleClick('hero')} />

        <NavLinksContainer {...navLinksContainerAnim}>
          {links.map((link) => (
            <NavLink
              key={link}
              link={link}
              isResume={link === 'RESUME'}
              onClick={() => {
                if (link === 'RESUME') {
                  const resumeSection = document.getElementById('resume-section');
                  if (resumeSection) {
                    resumeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                } else {
                  handleClick(link.toLowerCase().replace(' me', ''));
                }
              }}
            />
          ))}
        </NavLinksContainer>

        <Magnetic>
          <ContactButtonContainer
            onClick={() => handleClick('footer')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick('footer');
              }
            }}
            {...contactButtonAnim}
            role="button"
            tabIndex={0}
            aria-label="Navigate to contact form"
          >
            CONTACT ME
            <motion.svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...contactIconAnim} aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </motion.svg>
          </ContactButtonContainer>
        </Magnetic>
      </NavbarContainer>
    </>
  );
};

export default React.memo(HeroNavbar);