import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';

/**
 * ELITE CIPHER REVEAL - Award-Winning Text Animation
 * 
 * Features:
 * - Scrambling characters that resolve one by one
 * - Staggered letter reveal
 * - Glitch effect during scramble
 * - Smooth transition to final text
 * - Works on scroll into view
 */

const Wrapper = styled.span`
  display: inline-block;
  position: relative;
  font-family: 'JetBrains Mono', monospace;
  white-space: nowrap;
`;

const CharSpan = styled(motion.span)`
  display: inline-block;
  color: ${props => props.$resolved ? 'inherit' : '#66FCF1'};
  transition: color 0.2s ease;
  text-shadow: ${props => props.$resolved ? 'none' : '0 0 10px rgba(102, 252, 241, 0.5)'};
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

// Cyber characters for scrambling effect
const CHARS = "!@#$%^&*():{};|,.<>/?[]-_=+~0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const CipherReveal = React.memo(({
  text,
  delay = 0,
  speed = 25,
  className,
  style
}) => {
  const [displayChars, setDisplayChars] = useState([]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);
  const intervalRef = useRef(null);

  // More reliable in-view detection
  const isInView = useInView(ref, {
    once: true,
    margin: "0px 0px -10% 0px",
    amount: 0.5
  });

  const getRandomChar = useCallback(() => {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }, []);

  useEffect(() => {
    if (!text) return;

    // Initialize with empty spaces
    setDisplayChars(text.split('').map((char, index) => ({
      char: ' ',
      resolved: false,
      index
    })));
  }, [text]);

  useEffect(() => {
    if (!isInView || hasAnimated || !text) return;

    setHasAnimated(true);

    const chars = text.split('');
    let currentIndex = 0;
    let scrambleCount = 0;

    // Start after delay
    const startTimeout = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        scrambleCount++;

        setDisplayChars(prev => {
          return prev.map((item, index) => {
            // Already resolved characters stay resolved
            if (index < currentIndex) {
              return { char: chars[index], resolved: true, index };
            }

            // Current character being resolved
            if (index === currentIndex && scrambleCount % 3 === 0) {
              return { char: chars[index], resolved: true, index };
            }

            // Characters still scrambling
            if (index >= currentIndex) {
              // Keep spaces as spaces
              if (chars[index] === ' ') {
                return { char: ' ', resolved: true, index };
              }
              return { char: getRandomChar(), resolved: false, index };
            }

            return item;
          });
        });

        // Move to next character every 3 scrambles
        if (scrambleCount % 3 === 0) {
          currentIndex++;
        }

        // Finish when all characters resolved
        if (currentIndex >= chars.length) {
          clearInterval(intervalRef.current);
          setDisplayChars(chars.map((char, index) => ({
            char,
            resolved: true,
            index
          })));
        }
      }, speed);
    }, delay * 1000);

    return () => {
      clearTimeout(startTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isInView, hasAnimated, text, delay, speed, getRandomChar]);

  return (
    <Wrapper ref={ref} className={className} style={style}>
      <SRText>{text}</SRText>

      <span aria-hidden="true">
        {displayChars.map((item, i) => (
          <CharSpan
            key={i}
            $resolved={item.resolved}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.2,
              delay: 0.02 * i,
              ease: "easeOut"
            }}
          >
            {item.char === ' ' ? '\u00A0' : item.char}
          </CharSpan>
        ))}
      </span>
    </Wrapper>
  );
});

CipherReveal.displayName = 'CipherReveal';

export default CipherReveal;