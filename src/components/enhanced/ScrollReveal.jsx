import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

/**
 * ScrollReveal - Advanced scroll-triggered animation component
 * 
 * Features:
 * - Multiple reveal patterns (fade, slide, scale, rotate, flip)
 * - Stagger children animations
 * - Parallax scrolling effects
 * - Optimal viewport detection
 * - Performance-optimized with GPU acceleration
 */

const ScrollReveal = ({
  children,
  variant = 'fadeUp', // 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'scale' | 'rotate' | 'flip' | 'none'
  delay = 0,
  duration = 0.6,
  once = true, // Only animate once when scrolling into view
  amount = 0.3, // Percentage of element visible to trigger animation (0 to 1)
  stagger = 0, // Delay between children animations
  parallax = false, // Enable parallax scrolling effect
  parallaxSpeed = 0.5, // Parallax intensity (0 to 1)
  className,
  style,
  ...props
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once, 
    amount,
    margin: "-50px" // Start animation slightly before entering viewport
  });

  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    [100 * parallaxSpeed, -100 * parallaxSpeed]
  );

  // Animation variants based on type
  const variants = {
    fadeUp: {
      hidden: { opacity: 0, y: 60 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1]
        }
      }
    },
    fadeDown: {
      hidden: { opacity: 0, y: -60 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1]
        }
      }
    },
    fadeLeft: {
      hidden: { opacity: 0, x: 80 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1]
        }
      }
    },
    fadeRight: {
      hidden: { opacity: 0, x: -80 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1]
        }
      }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: {
          duration,
          delay,
          type: "spring",
          stiffness: 100,
          damping: 20
        }
      }
    },
    rotate: {
      hidden: { opacity: 0, rotate: -45, scale: 0.8 },
      visible: { 
        opacity: 1, 
        rotate: 0,
        scale: 1,
        transition: {
          duration,
          delay,
          type: "spring",
          stiffness: 80,
          damping: 18
        }
      }
    },
    flip: {
      hidden: { opacity: 0, rotateX: -90, transformPerspective: 1000 },
      visible: { 
        opacity: 1, 
        rotateX: 0,
        transformPerspective: 1000,
        transition: {
          duration: duration * 1.2,
          delay,
          ease: [0.25, 0.1, 0.25, 1]
        }
      }
    },
    none: {
      hidden: { opacity: 1 },
      visible: { opacity: 1 }
    }
  };

  // Container variant for stagger effect
  const containerVariant = stagger > 0 ? {
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay
      }
    }
  } : undefined;

  const combinedStyle = {
    willChange: 'transform, opacity',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
    ...(parallax && { y: parallaxY }),
    ...style
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={stagger > 0 ? containerVariant : variants[variant]}
      className={className}
      style={combinedStyle}
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        // If stagger is enabled, wrap each child in motion div
        if (stagger > 0 && React.isValidElement(child)) {
          return (
            <motion.div
              key={index}
              variants={variants[variant]}
              style={{
                willChange: 'transform, opacity',
                transform: 'translateZ(0)'
              }}
            >
              {child}
            </motion.div>
          );
        }
        return child;
      })}
    </motion.div>
  );
};

/**
 * ScrollProgress - Animated progress bar that follows scroll position
 */
export const ScrollProgress = ({ 
  height = 4, 
  color = '#FF6B35',
  backgroundColor = 'rgba(0, 0, 0, 0.1)',
  zIndex = 9998,
  top = true, // Position at top or bottom
  ...props 
}) => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      style={{
        position: 'fixed',
        [top ? 'top' : 'bottom']: 0,
        left: 0,
        right: 0,
        height: `${height}px`,
        backgroundColor,
        zIndex,
        transformOrigin: '0%',
        scaleX: scrollYProgress,
        ...props.style
      }}
    >
      <motion.div
        style={{
          height: '100%',
          background: `linear-gradient(90deg, ${color}, #66FCF1)`,
          boxShadow: `0 0 10px ${color}`,
          transformOrigin: '0%'
        }}
      />
    </motion.div>
  );
};

/**
 * ScrollText - Text that animates characters on scroll
 */
export const ScrollText = ({ 
  children, 
  delay = 0,
  stagger = 0.03,
  className,
  ...props 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const text = typeof children === 'string' ? children : '';
  const characters = Array.from(text);

  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay
      }
    }
  };

  const childVariant = {
    hidden: { 
      opacity: 0, 
      y: 20,
      rotateX: -90
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  return (
    <motion.span
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariant}
      className={className}
      style={{
        display: 'inline-block',
        whiteSpace: 'pre-wrap',
        ...props.style
      }}
      {...props}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={childVariant}
          style={{
            display: 'inline-block',
            transformOrigin: '50% 100%'
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

/**
 * ScrollCounter - Animated number counter on scroll
 */
export const ScrollCounter = ({ 
  from = 0, 
  to, 
  duration = 2,
  suffix = '',
  prefix = '',
  className,
  ...props 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 1 });
  const count = useMotionValue(from);
  const rounded = useTransform(count, latest => Math.round(latest));

  React.useEffect(() => {
    if (isInView) {
      count.set(to);
    }
  }, [isInView, to, count]);

  return (
    <motion.span
      ref={ref}
      className={className}
      {...props}
    >
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  );
};

/**
 * ScrollScale - Element that scales based on scroll position
 */
export const ScrollScale = ({ 
  children, 
  scaleRange = [0.8, 1],
  className,
  ...props 
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [scaleRange[0], 1, scaleRange[1]]);

  return (
    <motion.div
      ref={ref}
      style={{ 
        scale,
        willChange: 'transform',
        transform: 'translateZ(0)'
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
