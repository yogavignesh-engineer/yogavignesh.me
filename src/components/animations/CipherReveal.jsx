import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';

// --- STYLED COMPONENTS ---
const Wrapper = styled.span`
  display: inline-block;
  position: relative;
  font-family: 'JetBrains Mono', monospace; /* The Tech Font */
  white-space: nowrap; /* Prevent breaking mid-animation */
`;

const VisibleText = styled(motion.span)`
  display: inline-block;
  color: ${props => props.$color || 'inherit'};
  
  /* Optional: Add a subtle glow to the active scrambling text */
  &.scrambling {
    color: #66FCF1; /* Cyber Cyan for the random chars */
    opacity: 0.7;
  }
`;

const SRText = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const CHARS = "!@#$%^&*():{};|,.<>/?[]-_=+~";

export default function CipherReveal({ text, delay = 0, speed = 30 }) {
  const [display, setDisplay] = useState(text.split('').map(() => ' ')); // Start empty
  const [isScrambling, setIsScrambling] = useState(true);
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });
  
  useEffect(() => {
    if (!isInView || !text) return;

    let iteration = 0;
    const maxIterations = text.length;
    
    // Delay start
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplay(prev => {
          return text.split("").map((char, index) => {
            if (index < iteration) {
              return text[index]; // Resolved character
            }
            // Return random character for unresolved parts
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          });
        });

        // Speed of reveal
        iteration += 1 / 3; 

        if (iteration >= maxIterations) {
          clearInterval(interval);
          setIsScrambling(false); // Animation done
          setDisplay(text.split('')); // Ensure final state is clean
        }
      }, speed);

      // Cleanup interval on unmount
      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(startTimeout);
  }, [isInView, text, delay, speed]);

  return (
    <Wrapper ref={ref}>
      {/* 1. Accessibility: Read the real text, ignore the glitch */}
      <SRText>{text}</SRText>
      
      {/* 2. Visuals: The Glitch Effect */}
      <span aria-hidden="true">
        {display.map((char, i) => (
          <VisibleText 
            key={i}
            // If this character hasn't resolved yet (it doesn't match real text), make it "scrambling" color
            className={char !== text[i] ? "scrambling" : ""}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {char}
          </VisibleText>
        ))}
      </span>
    </Wrapper>
  );
}