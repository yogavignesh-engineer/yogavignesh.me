import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import Testimonials from '../project/Testimonials';
import ContactForm from '../project/ContactForm';
import { FooterAvailabilityBanner } from '../ui/AvailabilityBadge';
import Magnetic from '../interactive/Magnetic';

// --- ANIMATIONS ---
const subtlePulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
`;

const shimmerAnimation = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 107, 53, 0.5),
                0 0 40px rgba(255, 107, 53, 0.3),
                0 0 60px rgba(255, 107, 53, 0.2),
                inset 0 0 20px rgba(255, 255, 255, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 107, 53, 0.8),
                0 0 60px rgba(255, 107, 53, 0.5),
                0 0 90px rgba(255, 107, 53, 0.3),
                inset 0 0 30px rgba(255, 255, 255, 0.2);
  }
`;

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
`;

const rotateIcon = keyframes`
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.2);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
`;

const particleFloat = keyframes`
  0% {
    transform: translateY(0) translateX(0) scale(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) translateX(20px) scale(1);
    opacity: 0;
  }
`;

// --- STYLES ---
const FooterSection = styled(motion.footer)`
  background-color: #050505;
  color: #EAEAEA;
  position: relative;
  z-index: 13;
  overflow-x: hidden;
  padding: 5vh 5vw;
  border-top: 1px solid #222;
  font-family: 'JetBrains Mono', monospace;
  width: 100%;
  margin: 0;
  
  /* GPU Acceleration */
  transform: translate3d(0, 0, 0);
  will-change: transform;
  backface-visibility: hidden;
`;

const FooterTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 2rem;
  border-bottom: 1px dashed #333;
  margin-bottom: 4rem;
`;

const FooterName = styled.h2`
  font-family: 'Oswald', sans-serif;
  font-size: 1.2rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const FooterStatus = styled.div`
  font-size: 0.8rem;
  color: #888;
  letter-spacing: 1px;
`;

const FooterCTAWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 6rem;
  text-align: center;
`;

const FooterPill = styled.div`
  font-size: 0.8rem;
  color: #66FCF1;
  margin-bottom: 2.5rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  background: rgba(102, 252, 241, 0.1);
  padding: 10px 20px;
  border-radius: 20px;
  border: 1px solid rgba(102, 252, 241, 0.2);
  animation: ${subtlePulse} 2.5s ease-in-out infinite;
  will-change: opacity, transform;
`;

const ReactiveBackground = styled(motion.div)`
  position: absolute;
  inset: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(102, 252, 241, 0.15), transparent 60%);
  opacity: 0;
  pointer-events: none;
  z-index: 0;
  transition: opacity 0.5s ease;
  mix-blend-mode: screen;
`;

const FooterBigText = styled(motion.h1)`
  font-family: 'Oswald', sans-serif;
  font-size: clamp(4rem, 15vw, 14rem);
  font-weight: 700;
  line-height: 0.9;
  text-transform: uppercase;
  cursor: pointer;
  position: relative;
  display: inline-block;
  
  /* Gradient text */
  background: linear-gradient(
    135deg,
    #EAEAEA 0%,
    #66FCF1 25%,
    #EAEAEA 50%,
    #FF6B35 75%,
    #EAEAEA 100%
  );
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 5s ease-in-out infinite;
  
  @keyframes gradientShift {
    0%, 100% { background-position: 0% center; }
    50% { background-position: 100% center; }
  }
  
  /* Underline on hover */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 4px;
    background: linear-gradient(90deg, #66FCF1, #FF6B35);
    transition: width 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  }
  
  &:hover::after {
    width: 100%;
  }
  
  &:hover {
    animation: none;
    background-position: 50% center;
  }
  
  @media (max-width: 768px) {
    font-size: clamp(2.5rem, 12vw, 4rem);
  }
`;

const FooterMetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  font-size: 0.8rem;
  color: #888;
`;

const FooterMetaLeft = styled.div`
  max-width: 250px;
`;

const FooterMetaRight = styled.div`
  display: flex;
  gap: 2rem;
`;

const FooterLink = styled.a`
  color: #888;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #EAEAEA;
  }
`;

const ResumeButton = styled(motion.a)`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem 3.5rem;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 25%, #FF6B35 50%, #F7931E 75%, #FF6B35 100%);
  background-size: 300% 100%;
  color: #FFF;
  font-family: 'Oswald', sans-serif;
  font-size: 1.1rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-decoration: none;
  border-radius: 60px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  margin: 3rem auto;
  overflow: hidden;
  animation: ${glowPulse} 3s ease-in-out infinite, ${floatAnimation} 4s ease-in-out infinite;
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  will-change: transform, box-shadow, background-position;
  
  /* Animated background shimmer */
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 30%,
      rgba(255, 255, 255, 0.8) 50%,
      transparent 70%
    );
    transform: rotate(45deg);
    animation: ${shimmerAnimation} 3s linear infinite;
  }
  
  /* Particles effect */
  &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    animation: ${particleFloat} 2s ease-in-out infinite;
    opacity: 0;
  }
  
  /* Icon container */
  .icon-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transition: all 0.4s ease;
    z-index: 1;
    
    svg {
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    }
  }
  
  /* Text content */
  .button-content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    z-index: 1;
  }
  
  .main-label {
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: 3px;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
  
  .sub-label {
    font-size: 0.7rem;
    font-weight: 400;
    letter-spacing: 2px;
    opacity: 0.95;
    margin-top: 2px;
  }
  
  /* Hover state - EPIC */
  &:hover {
    transform: scale(1.1) translateY(-5px);
    background-position: 100% center;
    border-color: rgba(255, 255, 255, 0.8);
    animation: none;
    box-shadow: 0 0 40px rgba(255, 107, 53, 1),
                0 0 80px rgba(255, 107, 53, 0.6),
                0 0 120px rgba(255, 107, 53, 0.4),
                inset 0 0 40px rgba(255, 255, 255, 0.3),
                0 20px 60px rgba(0, 0, 0, 0.5);
    
    .icon-container {
      transform: scale(1.2);
      background: rgba(255, 255, 255, 0.4);
      animation: ${rotateIcon} 1s ease-in-out infinite;
    }
    
    &::before {
      animation: ${shimmerAnimation} 0.8s linear infinite;
    }
  }
  
  /* Active/Press state */
  &:active {
    transform: scale(1.05) translateY(-2px);
    box-shadow: 0 0 30px rgba(255, 107, 53, 0.8),
                0 10px 40px rgba(0, 0, 0, 0.4);
  }
  
  /* Focus state for accessibility */
  &:focus-visible {
    outline: 4px solid #66FCF1;
    outline-offset: 6px;
    border-radius: 60px;
  }
  
  @media (max-width: 768px) {
    padding: 1.2rem 2.5rem;
    gap: 0.8rem;
    
    .main-label {
      font-size: 0.95rem;
      letter-spacing: 2px;
    }
    
    .sub-label {
      font-size: 0.65rem;
    }
    
    .icon-container {
      width: 28px;
      height: 28px;
    }
  }
`;

const SocialProof = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin: 3rem 0;
  padding: 2rem;
  border-top: 1px dashed #333;
  border-bottom: 1px dashed #333;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
`;

const Metric = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .number {
    font-family: 'Oswald', sans-serif;
    font-size: 2.5rem;
    color: #66FCF1;
    font-weight: bold;
  }
  
  .label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 0.5rem;
  }
`;

// --- MAIN COMPONENT ---
const Footer = React.forwardRef(function Footer(props, ref) {
  // Sample testimonials data
  const testimonials = [
    {
      quote: "Yoga Vignesh's innovative approach to mechanical design and his ability to integrate technology seamlessly into engineering solutions is truly impressive. His Smart Boundary system showcases exceptional problem-solving skills.",
      author: "Dr. Rajesh Kumar",
      role: "Associate Professor, Mechanical Engineering",
      avatar: null
    },
    {
      quote: "Working with Yoga on the AI-powered plant monitoring system was incredible. His technical expertise in IoT and machine learning, combined with practical engineering knowledge, delivered outstanding results.",
      author: "Priya Sharma",
      role: "Project Lead, Agritech Solutions",
      avatar: null
    },
    {
      quote: "His portfolio website itself is a testament to his skills - the perfect blend of engineering precision and creative design. The 3D interactive elements and smooth animations show his dedication to excellence.",
      author: "Arun Patel",
      role: "Senior Developer, Tech Innovations",
      avatar: null
    }
  ];

  return (
    <FooterSection ref={ref}>
      <FooterTopRow>
        <FooterName>S. YOGA VIGNESH</FooterName>
        <FooterStatus>PING: OPEN_FOR_WORK_2025</FooterStatus>
      </FooterTopRow>

      {/* Testimonials Section */}
      <Testimonials
        testimonials={testimonials}
        title="Client Testimonials"
        showRating={false}
      />

      {/* Social Proof Metrics */}
      <SocialProof>
        <Metric>
          <div className="number">15+</div>
          <div className="label">Projects Completed</div>
        </Metric>
        <Metric>
          <div className="number">5+</div>
          <div className="label">Hackathon Projects</div>
        </Metric>
        <Metric>
          <div className="number">90%</div>
          <div className="label">Design Accuracy</div>
        </Metric>
      </SocialProof>

      {/* Contact Form */}
      <ContactForm />

      {/* Resume Download - EPIC BUTTON */}
      <div id="resume-section" style={{ textAlign: 'center', margin: '3rem 0 4rem 0', position: 'relative' }}>
        <ResumeButton
          href="/Yoga_Vignesh_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          download="Yoga_Vignesh_Resume.pdf"
          whileTap={{ scale: 0.95 }}
          aria-label="Download professional resume PDF"
        >
          <div className="icon-container">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div className="button-content">
            <span className="main-label">DOWNLOAD RESUME</span>
            <span className="sub-label">PDF Format (ATS Friendly)</span>
          </div>
        </ResumeButton>
      </div>

      <FooterCTAWrapper
        onMouseMove={(e) => {
          // PERFORMANCE: Use requestAnimationFrame if this causes jank
          // Simple visual effect based on cursor position relative to container
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          e.currentTarget.style.setProperty('--x', `${x}px`);
          e.currentTarget.style.setProperty('--y', `${y}px`);
        }}
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        <ReactiveBackground
          style={{
            left: 'var(--x, 50%)',
            top: 'var(--y, 50%)',
            opacity: 0.6,
            transform: 'translate(-50%, -50%)'
          }}
        />
        <FooterPill style={{ position: 'relative', zIndex: 2 }}>ENGINEERED_WITH · REACT · R3F · FRAMER_MOTION</FooterPill>
        <Magnetic>
          <FooterBigText
            onClick={() => window.location.href = 'mailto:yogavignesh.dev@gmail.com'}
            style={{ position: 'relative', zIndex: 2 }}
          >
            LET'S TALK
          </FooterBigText>
        </Magnetic>
      </FooterCTAWrapper>

      <FooterMetaRow>
        <FooterMetaLeft>
          Mechanical Engineering student · Frontend developer · Madurai, India.
        </FooterMetaLeft>
        <FooterMetaRight>
          <Magnetic>
            <FooterLink href="https://www.linkedin.com/in/yoga-vignesh-62733a377/" target="_blank" rel="noreferrer">
              LINKEDIN
            </FooterLink>
          </Magnetic>
          <Magnetic>
            <FooterLink href="https://github.com/yogavignesh-engineer" target="_blank" rel="noreferrer">
              GITHUB
            </FooterLink>
          </Magnetic>
          <Magnetic>
            <FooterLink href="https://www.instagram.com/wassup_yogavignesh?igsh=NTByMnUyemRtdTYw" target="_blank" rel="noreferrer">
              INSTAGRAM
            </FooterLink>
          </Magnetic>
        </FooterMetaRight>
      </FooterMetaRow>

      {/* Availability Banner */}
      <FooterAvailabilityBanner
        status="freelance"
        isDark={true}
        email="yogavignesh.dev@gmail.com"
      />
    </FooterSection>
  );
});

Footer.displayName = 'Footer';

export default React.memo(Footer);
