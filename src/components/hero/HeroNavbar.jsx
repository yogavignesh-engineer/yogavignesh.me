import React, { useCallback, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * OLHALAZARIEVA-STYLE NAVBAR + MOBILE MENU
 * 
 * - mix-blend-mode: difference for auto color inversion
 * - Brackets [ ] around links using ::before/::after
 * - MOBILE: Full-screen animated menu with staggered links
 */

const Header = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 4vw;
  z-index: 10000;
  mix-blend-mode: difference;
  pointer-events: none;
  
  & > * {
    pointer-events: auto;
  }

  @media (max-width: 768px) {
    padding: 1.5rem 5vw;
  }
`;

const Logo = styled(motion.div)`
  font-family: 'Oswald', 'Sofia Sans Condensed', sans-serif;
  font-size: clamp(1.5rem, 2vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.075em;
  text-transform: uppercase;
  color: #EFEFEF;
  cursor: pointer;
  line-height: 1;
  z-index: 10001;
  
  span {
    display: block;
  }
`;

const NavLinks = styled(motion.nav)`
  display: flex;
  align-items: center;
  gap: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(motion.a)`
  font-family: 'JetBrains Mono', 'Spline Sans Mono', monospace;
  font-size: clamp(0.75rem, 1.2vw, 1.2rem);
  font-weight: 300;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #EFEFEF;
  text-decoration: none;
  padding: 0 1.75rem;
  cursor: pointer;
  position: relative;
  display: inline-flex;
  align-items: center;
  
  &::before {
    content: '[';
    margin-right: 0.5rem;
    opacity: 0;
    transform: translateX(10px);
    transition: all 0.5s cubic-bezier(0.11, 0.82, 0.39, 0.92);
  }
  
  &::after {
    content: ']';
    margin-left: 0.5rem;
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.5s cubic-bezier(0.11, 0.82, 0.39, 0.92);
  }
  
  &:hover::before,
  &:hover::after {
    opacity: 1;
    transform: translateX(0);
  }
  
  &:focus-visible {
    outline: 2px solid #EFEFEF;
    outline-offset: 4px;
  }
`;

const ContactLink = styled(motion.a)`
  font-family: 'JetBrains Mono', 'Spline Sans Mono', monospace;
  font-size: clamp(0.75rem, 1.2vw, 1.2rem);
  font-weight: 300;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #EFEFEF;
  text-decoration: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 1px;
    background: #EFEFEF;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.5s cubic-bezier(0.11, 0.82, 0.39, 0.92);
  }
  
  &:hover::after {
    transform: scaleX(1);
    transform-origin: left;
  }
  
  svg {
    width: 12px;
    height: 12px;
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translate(3px, -3px);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

// ===== MOBILE MENU =====

const HamburgerButton = styled(motion.button)`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 10001;
  mix-blend-mode: difference;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
`;

const HamburgerLine = styled(motion.span)`
  display: block;
  width: 28px;
  height: 2px;
  background: #EFEFEF;
  transform-origin: center;
`;

const MobileMenuOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #0a0a0a;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
`;

const MobileNavLink = styled(motion.a)`
  font-family: 'Oswald', sans-serif;
  font-size: clamp(2.5rem, 10vw, 4rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: #EFEFEF;
  text-decoration: none;
  cursor: pointer;
  position: relative;
  display: block;
  margin: 0.5rem 0;
  overflow: hidden;
  
  /* Bracket animation on hover */
  &::before {
    content: '[';
    position: absolute;
    left: -2rem;
    opacity: 0;
    transform: translateX(20px);
    transition: all 0.4s cubic-bezier(0.11, 0.82, 0.39, 0.92);
  }
  
  &::after {
    content: ']';
    position: absolute;
    right: -2rem;
    opacity: 0;
    transform: translateX(-20px);
    transition: all 0.4s cubic-bezier(0.11, 0.82, 0.39, 0.92);
  }
  
  &:hover::before,
  &:hover::after {
    opacity: 1;
    transform: translateX(0);
  }
  
  &:hover {
    color: #FF6B35;
  }
`;

const MobileContactLink = styled(motion.a)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #666;
  text-decoration: none;
  cursor: pointer;
  margin-top: 3rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #FF6B35;
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const ScrollProgressBar = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #FF6B35, #F7931E, #66FCF1);
  transform-origin: 0%;
  z-index: 10001;
`;

// Animation variants - synced with gear entrance for cinematic stagger
const headerAnim = {
  initial: { opacity: 0, y: -30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.8 }
};

const linkAnim = {
  initial: { opacity: 0, y: -15 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 1.2 + i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  })
};

const menuOverlayAnim = {
  initial: { clipPath: 'circle(0% at calc(100% - 3rem) 3rem)' },
  animate: { clipPath: 'circle(150% at calc(100% - 3rem) 3rem)' },
  exit: { clipPath: 'circle(0% at calc(100% - 3rem) 3rem)' },
  transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
};

const mobileNavLinkAnim = {
  initial: { opacity: 0, y: 50 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  }),
  exit: { opacity: 0, y: -30, transition: { duration: 0.2 } }
};

const links = ['ABOUT ME', 'WORKS', 'SKILLS', 'RESUME'];

const HeroNavbar = ({ onNavClick }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = documentHeight > 0 ? scrollY / documentHeight : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleClick = useCallback((section) => {
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      onNavClick?.(section);
    }, 100);
  }, [onNavClick]);

  const handleLogoClick = () => {
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <ScrollProgressBar style={{ scaleX: scrollProgress }} />

      <Header {...headerAnim}>
        {/* Logo - Left */}
        <Logo
          onClick={handleLogoClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          role="button"
          tabIndex={0}
          aria-label="Go to top"
        >
          <span>S. YOGA</span>
          <span>VIGNESH</span>
        </Logo>

        {/* Desktop Nav Links - Center */}
        <NavLinks>
          {links.map((link, i) => (
            <NavLink
              key={link}
              href={`#${link.toLowerCase().replace(' ', '-')}`}
              custom={i}
              initial="initial"
              animate="animate"
              variants={linkAnim}
              onClick={(e) => {
                e.preventDefault();
                if (link === 'RESUME') {
                  handleClick('footer');
                } else {
                  handleClick(link.toLowerCase().replace(' me', ''));
                }
              }}
            >
              {link}
            </NavLink>
          ))}
        </NavLinks>

        {/* Desktop Contact - Right */}
        <ContactLink
          href="#contact"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          onClick={(e) => {
            e.preventDefault();
            handleClick('footer');
          }}
        >
          CONTACT ME
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </ContactLink>

        {/* Mobile Hamburger Button */}
        <HamburgerButton
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          <HamburgerLine
            animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
          <HamburgerLine
            animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <HamburgerLine
            animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
        </HamburgerButton>
      </Header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenuOverlay
            initial="initial"
            animate="animate"
            exit="exit"
            variants={menuOverlayAnim}
          >
            {links.map((link, i) => (
              <MobileNavLink
                key={link}
                href={`#${link.toLowerCase().replace(' ', '-')}`}
                custom={i}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={mobileNavLinkAnim}
                onClick={(e) => {
                  e.preventDefault();
                  if (link === 'RESUME') {
                    handleClick('footer');
                  } else {
                    handleClick(link.toLowerCase().replace(' me', ''));
                  }
                }}
              >
                {link}
              </MobileNavLink>
            ))}

            <MobileContactLink
              href="#contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
              onClick={(e) => {
                e.preventDefault();
                handleClick('footer');
              }}
            >
              CONTACT ME
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </MobileContactLink>
          </MobileMenuOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default React.memo(HeroNavbar);