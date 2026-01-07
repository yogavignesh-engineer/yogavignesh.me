import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';

const LetterContainer = styled(motion.div)`
  display: inline;
  overflow: hidden;
`;

const Letter = styled(motion.span)`
  display: inline-block;
  will-change: transform, opacity;
  
  &.space {
    width: 0.25em;
  }
`;

const Word = styled.span`
  display: inline-block;
  white-space: nowrap;
`;

const letterVariants = {
    hidden: {
        opacity: 0,
        y: 50,
        rotateX: -90,
        filter: 'blur(4px)'
    },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        rotateX: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.5,
            delay: i * 0.03,
            ease: [0.215, 0.61, 0.355, 1]
        }
    })
};

const wordVariants = {
    hidden: {
        opacity: 0,
        y: 30
    },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            delay: i * 0.1,
            ease: [0.215, 0.61, 0.355, 1]
        }
    })
};

const LetterReveal = ({
    text,
    className = '',
    type = 'letter', // 'letter' | 'word'
    once = true,
    threshold = 0.5,
    as: Component = 'span',
    style = {}
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once,
        amount: threshold
    });

    if (type === 'word') {
        const words = text.split(' ');

        return (
            <LetterContainer
                ref={ref}
                as={Component}
                className={`letter-reveal ${className}`}
                style={style}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                {words.map((word, i) => (
                    <React.Fragment key={i}>
                        <Word>
                            <Letter
                                variants={wordVariants}
                                custom={i}
                            >
                                {word}
                            </Letter>
                        </Word>
                        {i < words.length - 1 && ' '}
                    </React.Fragment>
                ))}
            </LetterContainer>
        );
    }

    const letters = text.split('');

    return (
        <LetterContainer
            ref={ref}
            as={Component}
            className={`letter-reveal ${className}`}
            style={style}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            {letters.map((letter, i) => (
                <Letter
                    key={i}
                    variants={letterVariants}
                    custom={i}
                    className={letter === ' ' ? 'space' : ''}
                >
                    {letter === ' ' ? '\u00A0' : letter}
                </Letter>
            ))}
        </LetterContainer>
    );
};

export default LetterReveal;
