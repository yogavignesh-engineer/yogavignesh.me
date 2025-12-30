import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import VelocityText from '../animations/VelocityText';
import CipherReveal from '../animations/CipherReveal';

const FooterContainer = styled.footer`
  padding-top: 15vh;
  background: #050505;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  position: relative;
  z-index: 10;
  padding-bottom: 0;
`;

const ContactTag = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 5vh;
  text-transform: uppercase;
  display: flex;
  gap: 10px;
  align-items: center;

  &::before {
    content: '';
    width: 8px; height: 8px;
    background: #444;
    border-radius: 50%;
    display: inline-block;
  }
`;

const BigName = styled(motion.h1)`
  font-family: 'Oswald', sans-serif;
  font-size: 15vw;
  line-height: 0.8;
  color: #EAEAEA;
  text-transform: uppercase;
  margin-bottom: 5vh;
  text-align: center;
  letter-spacing: -0.02em;
`;

const Links = styled.div`
  display: flex;
  gap: 4vw;
  margin-bottom: 10vh;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
  }
`;

const SocialLink = styled(motion.a)`
  color: #888;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  text-transform: uppercase;
  position: relative;
  cursor: pointer;
  padding: 10px 20px;
  border: 1px solid transparent;
  border-radius: 30px;
  transition: all 0.3s ease;

  &:hover {
    color: #050505;
    background: #EAEAEA;
    border-color: #EAEAEA;
  }
`;

const TickerWrapper = styled.div`
  width: 100%;
  border-top: 1px solid #222;
  padding: 3rem 0;
  background: #050505; /* Seamless blend */
  position: relative;
`;

// --- MOTION PROPS ---
const bigNameAnim = {
  initial: { y: 50, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  transition: { duration: 0.8 }
};

const socialLinkAnim = {
  whileHover: { scale: 1.1 },
  whileTap: { scale: 0.95 }
};

const socialLinks = [
  { name: 'LinkedIn', href: '#' },
  { name: 'GitHub', href: '#' },
  { name: 'Instagram', href: '#' },
  { name: 'Email', href: '#' },
];

const BigFooter = React.memo(() => {
  return (
    <FooterContainer>
      <ContactTag>
        <CipherReveal text="[ CONTACT ]" />
      </ContactTag>
      
      <BigName {...bigNameAnim}>
        YOGA VIGNESH
      </BigName>
      
      <Links>
        {socialLinks.map((item) => (
          <SocialLink 
            key={item.name} 
            href={item.href}
            {...socialLinkAnim}
          >
            {item.name}
          </SocialLink>
        ))}
      </Links>
      
      <TickerWrapper>
         <VelocityText baseVelocity={3} />
      </TickerWrapper>
    </FooterContainer>
  );
});

BigFooter.displayName = 'BigFooter';

export default BigFooter;