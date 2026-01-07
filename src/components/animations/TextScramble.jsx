import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';

const ScrambleText = styled.span`
  display: inline-block;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
  cursor: inherit;
  
  .char {
    display: inline-block;
    transition: color 0.1s ease;
  }
  
  .scrambling {
    color: #66FCF1;
  }
`;

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

const TextScramble = ({
    text,
    speed = 30,
    scrambleOnHover = true,
    scrambleOnMount = false,
    className = '',
    as: Component = 'span'
}) => {
    const [displayText, setDisplayText] = useState(text);
    const [isScrambling, setIsScrambling] = useState(false);
    const intervalRef = useRef(null);
    const frameRef = useRef(0);

    const scramble = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        setIsScrambling(true);
        frameRef.current = 0;
        const finalText = text;
        const length = finalText.length;

        intervalRef.current = setInterval(() => {
            frameRef.current++;

            let newText = '';
            for (let i = 0; i < length; i++) {
                if (finalText[i] === ' ') {
                    newText += ' ';
                } else if (i < frameRef.current / 2) {
                    // Character is revealed
                    newText += finalText[i];
                } else {
                    // Character is still scrambling
                    newText += chars[Math.floor(Math.random() * chars.length)];
                }
            }

            setDisplayText(newText);

            if (frameRef.current >= length * 2) {
                clearInterval(intervalRef.current);
                setDisplayText(finalText);
                setIsScrambling(false);
            }
        }, speed);
    }, [text, speed]);

    useEffect(() => {
        if (scrambleOnMount) {
            scramble();
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [scrambleOnMount, scramble]);

    useEffect(() => {
        setDisplayText(text);
    }, [text]);

    const handleMouseEnter = () => {
        if (scrambleOnHover && !isScrambling) {
            scramble();
        }
    };

    return (
        <ScrambleText
            as={Component}
            className={`text-scramble ${isScrambling ? 'scrambling' : ''} ${className}`}
            onMouseEnter={handleMouseEnter}
        >
            {displayText.split('').map((char, i) => (
                <span
                    key={i}
                    className={`char ${isScrambling && char !== text[i] ? 'scrambling' : ''}`}
                >
                    {char}
                </span>
            ))}
        </ScrambleText>
    );
};

export default TextScramble;
