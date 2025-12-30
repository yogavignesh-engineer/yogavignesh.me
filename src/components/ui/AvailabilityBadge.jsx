/**
 * Availability Badge Component
 * 
 * Animated badge showing current work availability status
 * Perfect for Hero or Footer sections
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useCursor } from '../../context/CursorContext';
import { useSound } from '../../hooks/useSound';

// --- STYLED COMPONENTS ---
const BadgeWrapper = styled(motion.div)`
  position: ${props => props.$position === 'fixed' ? 'fixed' : 'relative'};
  ${props => props.$position === 'fixed' && `
    top: ${props.$top || '2rem'};
    right: ${props.$right || '2rem'};
    z-index: 1000;
  `}
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  background: ${props => props.$isDark ? 
    'rgba(26, 26, 26, 0.8)' : 
    'rgba(255, 255, 255, 0.8)'
  };
  backdrop-filter: blur(20px);
  border-radius: 50px;
  border: 1px solid ${props => props.$available ? '#66FCF1' : '#B0B8C1'};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${props => props.$available ? '#55EBE0' : '#9BA3AB'};
    box-shadow: 0 8px 30px ${props => props.$available ? 
      'rgba(102, 252, 241, 0.3)' : 
      'rgba(0, 0, 0, 0.15)'
    };
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 0.625rem 1.25rem;
    gap: 0.5rem;
    font-size: 0.875rem;
    
    ${props => props.position === 'fixed' && `
      top: 1rem;
      right: 1rem;
    `}
  }
`;

const StatusDot = styled(motion.div)`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.$available ? '#66FCF1' : '#B0B8C1'};
  box-shadow: 0 0 ${props => props.$available ? '12px' : '0px'} ${props => props.$available ? '#66FCF1' : 'transparent'};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    border: 2px solid ${props => props.$available ? '#66FCF1' : 'transparent'};
    opacity: ${props => props.$available ? '0.4' : '0'};
    animation: ${props => props.$available ? 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' : 'none'};
  }
  
  @keyframes ping {
    75%, 100% {
      transform: scale(2);
      opacity: 0;
    }
  }
`;

const BadgeText = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.$isDark ? '#EAEAEA' : '#111'};
  letter-spacing: 0.02em;
  white-space: nowrap;
  
  strong {
    color: ${props => props.$available ? '#66FCF1' : '#B0B8C1'};
    font-weight: 700;
  }
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const PopoverWrapper = styled(motion.div)`
  position: absolute;
  top: calc(100% + 1rem);
  right: 0;
  width: 280px;
  padding: 1.5rem;
  background: ${props => props.$isDark ? '#1a1a1a' : '#fff'};
  border-radius: 12px;
  border: 1px solid ${props => props.$isDark ? '#333' : '#E0E0E0'};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  
  @media (max-width: 768px) {
    width: 240px;
    padding: 1.25rem;
  }
`;

const PopoverTitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.$isDark ? '#EAEAEA' : '#111'};
  margin: 0 0 0.5rem 0;
`;

const PopoverText = styled.p`
  font-size: 0.875rem;
  color: ${props => props.$isDark ? '#B0B8C1' : '#666'};
  line-height: 1.6;
  margin: 0 0 1rem 0;
`;

const ContactButton = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background: #66FCF1;
  color: #111;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background: #55EBE0;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 252, 241, 0.3);
  }
`;

// --- MAIN COMPONENT ---
export default function AvailabilityBadge({
  status = 'internship', // 'internship' | 'freelance' | 'both' | 'unavailable'
  position = 'fixed', // 'fixed' | 'relative'
  top = '2rem',
  right = '2rem',
  isDark = false,
  email = 'your.email@example.com',
  showPopover = true
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Safe hook usage with fallbacks
  let setCursor = () => {};
  let playClick = () => {};
  let playHover = () => {};
  
  try {
    const cursorContext = useCursor();
    if (cursorContext) setCursor = cursorContext.setCursor || setCursor;
    
    const soundContext = useSound();
    if (soundContext) {
      playClick = soundContext.playClick || playClick;
      playHover = soundContext.playHover || playHover;
    }
  } catch (e) {
    console.warn('AvailabilityBadge: Context hooks not available');
  }
  
  const isAvailable = status !== 'unavailable';
  
  const statusText = {
    internship: 'Open for Internships',
    freelance: 'Available for Freelance',
    both: 'Open for Work',
    unavailable: 'Currently Unavailable'
  };
  
  const popoverContent = {
    internship: {
      title: '🎓 Seeking Internship',
      text: 'Looking for opportunities to learn and contribute. Available for 3-6 months, remote or on-site.'
    },
    freelance: {
      title: '💼 Freelance Available',
      text: 'Taking on new projects. Specialized in web development, UI/UX, and mechanical engineering solutions.'
    },
    both: {
      title: '🚀 Open for Opportunities',
      text: 'Available for both internships and freelance projects. Let\'s build something amazing together!'
    },
    unavailable: {
      title: '⏸️ Currently Busy',
      text: 'Not accepting new work at the moment. Check back soon or drop a message for future opportunities.'
    }
  };
  
  return (
    <BadgeWrapper
      $position={position}
      $top={top}
      $right={right}
      $isDark={isDark}
      $available={isAvailable}
      onClick={() => playClick()}
      onMouseEnter={() => {
        setIsHovered(true);
        playHover();
        setCursor('button');
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setCursor('default');
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <StatusDot
        $available={isAvailable}
        animate={isAvailable ? {
          scale: [1, 1.2, 1],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      
      <BadgeText $isDark={isDark} $available={isAvailable}>
        {statusText[status]}
      </BadgeText>
      
      {showPopover && isHovered && (
        <PopoverWrapper
          $isDark={isDark}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <PopoverTitle $isDark={isDark}>
            {popoverContent[status].title}
          </PopoverTitle>
          <PopoverText $isDark={isDark}>
            {popoverContent[status].text}
          </PopoverText>
          <ContactButton
            href={`mailto:${email}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              playClick();
            }}
          >
            <span>📧</span>
            <span>Get in Touch</span>
          </ContactButton>
        </PopoverWrapper>
      )}
    </BadgeWrapper>
  );
}

// --- HERO VARIANT (Inline Badge) ---
export function HeroAvailabilityBadge({ status = 'both', isDark = false, email }) {
  return (
    <AvailabilityBadge
      status={status}
      position="relative"
      isDark={isDark}
      email={email}
      showPopover={false}
    />
  );
}

// --- FOOTER VARIANT (Full Width Banner) ---
const BannerWrapper = styled(motion.div)`
  width: 100%;
  padding: 1.5rem 2rem;
  background: ${props => props.$available ? 
    'linear-gradient(135deg, rgba(102, 252, 241, 0.1) 0%, rgba(102, 252, 241, 0.05) 100%)' :
    'rgba(176, 184, 193, 0.05)'
  };
  border-top: 2px solid ${props => props.$available ? '#66FCF1' : '#B0B8C1'};
  border-bottom: 2px solid ${props => props.$available ? '#66FCF1' : '#B0B8C1'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
  }
`;

const BannerContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BannerTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.$isDark ? '#EAEAEA' : '#111'};
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const BannerSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${props => props.$isDark ? '#B0B8C1' : '#666'};
  margin: 0.25rem 0 0 0;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const CTAButton = styled(motion.a)`
  padding: 1rem 2rem;
  background: #66FCF1;
  color: #111;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s ease;
  
  &:hover {
    background: #55EBE0;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 252, 241, 0.4);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    padding: 0.875rem 1.5rem;
    font-size: 0.875rem;
  }
`;

export function FooterAvailabilityBanner({ 
  status = 'both', 
  isDark = false, 
  email,
  phone 
}) {
  // Safe hook usage with fallbacks
  let playClick = () => {};
  let playHover = () => {};
  
  try {
    const soundContext = useSound();
    if (soundContext) {
      playClick = soundContext.playClick || playClick;
      playHover = soundContext.playHover || playHover;
    }
  } catch (e) {
    console.warn('FooterAvailabilityBanner: Sound hook not available');
  }
  
  const isAvailable = status !== 'unavailable';
  
  const content = {
    internship: {
      title: '🎓 Open for Internships',
      subtitle: 'Looking for opportunities to learn and grow in a dynamic team',
      cta: 'View Resume'
    },
    freelance: {
      title: '💼 Available for Freelance Work',
      subtitle: 'Let\'s collaborate on your next project',
      cta: 'Start a Project'
    },
    both: {
      title: '🚀 Open for Opportunities',
      subtitle: 'Internships, freelance projects, or full-time roles - let\'s talk!',
      cta: 'Get in Touch'
    },
    unavailable: {
      title: '⏸️ Currently Unavailable',
      subtitle: 'Not accepting new work right now, but feel free to reach out for future opportunities',
      cta: 'Stay in Touch'
    }
  };
  
  return (
    <BannerWrapper
      $available={isAvailable}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <BannerContent>
        <StatusDot
          $available={isAvailable}
          animate={isAvailable ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div>
          <BannerTitle $isDark={isDark}>
            {content[status].title}
          </BannerTitle>
          <BannerSubtitle $isDark={isDark}>
            {content[status].subtitle}
          </BannerSubtitle>
        </div>
      </BannerContent>
      
      <CTAButton
        href={`mailto:${email}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={playHover}
        onClick={playClick}
      >
        {content[status].cta} →
      </CTAButton>
    </BannerWrapper>
  );
}

// --- USAGE EXAMPLES ---
/*
// 1. HERO SECTION (Inline badge)
import { HeroAvailabilityBadge } from './components/AvailabilityBadge';

<HeroContent>
  <h1>Your Name</h1>
  <HeroAvailabilityBadge 
    status="both" 
    isDark={false}
    email="your.email@example.com"
  />
  <p>Your tagline...</p>
</HeroContent>

// 2. FIXED POSITION (Top-right corner)
import AvailabilityBadge from './components/AvailabilityBadge';

<AvailabilityBadge 
  status="internship"
  position="fixed"
  top="2rem"
  right="2rem"
  isDark={true}
  email="your.email@example.com"
  showPopover={true}
/>

// 3. FOOTER SECTION (Full-width banner)
import { FooterAvailabilityBanner } from './components/AvailabilityBadge';

<Footer>
  <FooterAvailabilityBanner
    status="freelance"
    isDark={true}
    email="your.email@example.com"
    phone="+1234567890"
  />
  <FooterContent>...</FooterContent>
</Footer>
*/
