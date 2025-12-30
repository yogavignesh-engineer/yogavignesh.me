import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';
import { useSound } from '../../hooks/useSound';

const CardContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: 12px;
  overflow: hidden;
  cursor: none;
  transform-style: preserve-3d;
  perspective: 1000px;
  
  @media (max-width: 768px) {
    cursor: pointer;
  }
`;

const CardInner = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  border: 2px solid transparent;
  transition: border-color 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    padding: 2px;
    background: linear-gradient(135deg, #66FCF1, #45A29E, #FF6B35);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  ${CardContainer}:hover &::before {
    opacity: 1;
  }
`;

const Image = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

const Overlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.4) 50%,
    rgba(0, 0, 0, 0.9) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 24px;
  opacity: 0;
  transition: opacity 0.4s ease;
  
  ${CardContainer}:hover & {
    opacity: 1;
  }
`;

const Title = styled(motion.h3)`
  font-family: 'Oswald', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #EAEAEA;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Category = styled(motion.p)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #66FCF1;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const ParticleCanvas = styled.canvas`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
`;

const HapticIndicator = styled(motion.div)`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(102, 252, 241, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(102, 252, 241, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #66FCF1;
  font-size: 1.2rem;
  z-index: 20;
  opacity: 0;
  
  ${CardContainer}:hover & {
    opacity: 1;
  }
`;

class Particle {
  constructor(x, y, canvas) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 1;
    this.speedX = (Math.random() - 0.5) * 2;
    this.speedY = (Math.random() - 0.5) * 2;
    this.color = `hsl(${Math.random() * 60 + 170}, 100%, 70%)`;
    this.life = 1;
    this.decay = Math.random() * 0.02 + 0.01;
    this.canvas = canvas;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= this.decay;
    this.size *= 0.98;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.life;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  isDead() {
    return this.life <= 0 || this.size <= 0.5;
  }
}

const EnhancedProjectCard = ({ project, onClick }) => {
  const { setCursor } = useCursor();
  const { playHover, playClick } = useSound();
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);
  const scale = useSpring(1, springConfig);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);

    // Create particles on mouse trail
    if (canvasRef.current && particlesRef.current.length < 50) {
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      
      for (let i = 0; i < 2; i++) {
        particlesRef.current.push(new Particle(relX, relY, canvasRef.current));
      }
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setCursor('text', 'VIEW');
    scale.set(1.05);
    playHover();
    
    // Start particle animation
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particlesRef.current = particlesRef.current.filter(particle => {
          particle.update();
          particle.draw(ctx);
          return !particle.isDead();
        });
        
        if (isHovered || particlesRef.current.length > 0) {
          rafRef.current = requestAnimationFrame(animate);
        }
      };
      
      animate();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCursor('default');
    scale.set(1);
    mouseX.set(0);
    mouseY.set(0);
    
    // Cancel animation loop
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const handleClick = () => {
    playClick();
    if (onClick) onClick(project);
  };

  return (
    <CardContainer
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        rotateX,
        rotateY,
        scale
      }}
    >
      <CardInner>
        <Image
          src={project.img || project.img2}
          alt={project.title}
          loading="lazy"
          style={{
            scale: isHovered ? 1.1 : 1
          }}
        />
        
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
        >
          <Title
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            transition={{ delay: 0.1 }}
          >
            {project.title}
          </Title>
          <Category
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            transition={{ delay: 0.15 }}
          >
            {project.cat}
          </Category>
        </Overlay>
        
        <ParticleCanvas ref={canvasRef} />
        
        <HapticIndicator
          initial={{ scale: 0, rotate: -180 }}
          animate={{ 
            scale: isHovered ? 1 : 0,
            rotate: isHovered ? 0 : -180
          }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        >
          ⚡
        </HapticIndicator>
      </CardInner>
    </CardContainer>
  );
};

export default EnhancedProjectCard;
