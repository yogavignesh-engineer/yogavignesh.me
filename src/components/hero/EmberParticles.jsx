import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1; 
  /* PERFORMANCE: Removed mix-blend-mode (causes full-page repaints) */
  opacity: 0.7; 
`;

const EmberParticles = React.memo(() => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { 
      alpha: true,
      desynchronized: true,
      willReadFrequently: false // Optimize for write-only operations
    });
    
    let animationFrameId;
    let particles = [];
    let isVisible = true;
    
    let mouse = { x: -1000, y: -1000, vx: 0, vy: 0 };
    let lastMouse = { x: -1000, y: -1000 };
    
    let rafMouseId = null;
    let pendingMouseX = -1000;
    let pendingMouseY = -1000;

    // PERFORMANCE: Reduced particle count for Chrome (30 instead of 50)
    const PARTICLE_COUNT = 30; 
    const MOUSE_RADIUS_SQ = 150 * 150; // Use squared distance for performance
    
    const COLORS = [
      'rgba(17, 17, 17, 0.8)',
      'rgba(80, 80, 80, 0.6)',
      'rgba(160, 160, 160, 0.5)'
    ];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize, { passive: true });
    resize();

    const handleMouseMove = (e) => {
      pendingMouseX = e.clientX;
      pendingMouseY = e.clientY;
      
      if (rafMouseId !== null) return;
      
      rafMouseId = requestAnimationFrame(() => {
        mouse.vx = (pendingMouseX - lastMouse.x) * 0.15;
        mouse.vy = (pendingMouseY - lastMouse.y) * 0.15;
        lastMouse.x = mouse.x;
        lastMouse.y = mouse.y;
        mouse.x = pendingMouseX;
        mouse.y = pendingMouseY;
        rafMouseId = null;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; if (isVisible) animate(); },
      { threshold: 0 }
    );
    observer.observe(canvas);

    class Particle {
      constructor() { this.reset(true); }
      reset(randomStart = false) {
        this.x = Math.random() * canvas.width;
        this.y = randomStart ? Math.random() * canvas.height : canvas.height + 20;
        this.baseVy = -(Math.random() * 0.3 + 0.1); 
        this.vx = 0; this.vy = 0;
        this.size = Math.random() * 2 + 0.5;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.life = Math.random() * 0.5 + 0.5;
        this.friction = 0.96; 
        this.wobble = Math.random() * 10; 
      }

      update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        
        // PERFORMANCE: Avoid Math.sqrt by using squared distance.
        const distSq = dx * dx + dy * dy;
        
        if (distSq < MOUSE_RADIUS_SQ) {
           const dist = Math.sqrt(distSq);
           const force = (150 - dist) / 150;
           this.vx += mouse.vx * force * 0.8; 
           this.vy += mouse.vy * force * 0.8;
        }

        this.vx *= this.friction; 
        this.vy = (this.vy * this.friction) + (this.baseVy * 0.05); 
        this.wobble += 0.05;
        this.x += this.vx + Math.sin(this.wobble) * 0.3; 
        this.y += this.vy + this.baseVy;

        if (this.y < -10 || this.x > canvas.width + 10 || this.x < -10) {
          this.reset(false);
        }
      }

    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }
      // PERFORMANCE: Batch updates before drawing to minimize reflows
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      mouse.vx *= 0.9;
      mouse.vy *= 0.9;
      
      // Update all particles first
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles[i].update();
      }
      
      // PERFORMANCE: Draw all particles in one batch with minimal state changes
      ctx.globalAlpha = 1.0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (rafMouseId) cancelAnimationFrame(rafMouseId);
    };
  }, []);

  return <Canvas ref={canvasRef} />;
});

EmberParticles.displayName = 'EmberParticles';

export default EmberParticles;