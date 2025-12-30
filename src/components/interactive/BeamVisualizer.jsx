import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './BeamVisualizer.css';

const BeamVisualizer = React.memo(() => {
  // 1. STATE
  const [force, setForce] = useState(5000); // Newtons
  const [material, setMaterial] = useState('steel'); // steel | aluminum | wood
  const [hoveredMaterial, setHoveredMaterial] = useState(null);
  const wrapperRef = useRef(null);
  
  // Pause grid animation when off-screen for scroll performance
  useEffect(() => {
    if (!wrapperRef.current) return;
    
    const gridBg = wrapperRef.current.querySelector('.beam-grid-background');
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (gridBg) {
          if (entries[0].isIntersecting) {
            gridBg.classList.remove('paused');
          } else {
            gridBg.classList.add('paused');
          }
        }
      },
      { rootMargin: '100px', threshold: 0.01 }
    );
    
    observer.observe(wrapperRef.current);
    
    return () => observer.disconnect();
  }, []);
  
  // Material Properties (Young's Modulus E in GPa) - memoized
  const materials = useMemo(() => ({
    steel: { 
      name: 'Structural Steel', 
      E: 200, 
      color: '#60a5fa',
      gradient: { from: '#60a5fa', to: '#3b82f6' },
      icon: '🔩',
      density: 7850
    },
    aluminum: { 
      name: 'Aluminum 6061', 
      E: 69, 
      color: '#e2e8f0',
      gradient: { from: '#d1d5db', to: '#9ca3af' },
      icon: '⚡',
      density: 2700
    },
    wood: { 
      name: 'Oak Timber', 
      E: 11, 
      color: '#d97706',
      gradient: { from: '#d97706', to: '#92400e' },
      icon: '🌳',
      density: 750
    }
  }), []);

  // 2. PHYSICS CALCULATION - memoized for performance
  const calculateDeflection = useCallback(() => {
    const E = materials[material].E;
    const rawDeflection = (force / E); 
    return rawDeflection;
  }, [force, material, materials]);

  // Calculate stress level - memoized
  const calculateStress = useCallback(() => {
    const deflection = calculateDeflection();
    const maxDeflection = 20000 / materials[material].E;
    const stressLevel = (deflection / maxDeflection) * 100;
    
    return {
      level: Math.min(stressLevel, 100),
      status: stressLevel < 30 ? 'safe' : stressLevel < 70 ? 'warning' : 'critical',
      color: stressLevel < 30 ? '#10b981' : stressLevel < 70 ? '#f59e0b' : '#ef4444'
    };
  }, [calculateDeflection, material, materials]);

  // 3. VISUALIZATION LOGIC - memoized
  const deflectionVal = useMemo(() => calculateDeflection(), [calculateDeflection]);
  const maxPixels = 100; 
  const curveDepth = useMemo(() => Math.min(deflectionVal * 0.8, maxPixels), [deflectionVal]); 
  const beamPath = useMemo(() => `M 40 150 Q 250 ${150 + curveDepth} 460 150`, [curveDepth]);
  const stress = useMemo(() => calculateStress(), [calculateStress]);

  return (
    <motion.div 
      className="beam-wrapper"
      ref={wrapperRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Animated grid background */}
      <div className="beam-grid-background" />
      
      <div className="beam-container">
        
        {/* LEFT CARD: CONTROLS */}
        <motion.div 
          className="beam-card controls-card"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08, duration: 0.3, ease: "easeOut" }}
          whileHover={{ y: -3, transition: { duration: 0.15 } }}
        >
          {/* Corner accents */}
          <div className="corner-accent top-left" />
          <div className="corner-accent top-right" />
          <div className="corner-accent bottom-left" />
          <div className="corner-accent bottom-right" />

          <div className="beam-header">
            <h2 className="beam-title">
              <span className="title-icon">⚙️</span>
              Structural Stress Test
            </h2>
            <p className="subtitle">Interactive Beam Deflection Analysis</p>
          </div>

          {/* Force Slider */}
          <div className="control-group">
            <div className="control-label">
              <span>
                <span className="label-icon">💪</span>
                Applied Load
              </span>
              <motion.span 
                className="force-value"
                key={force}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {force.toLocaleString()} N
              </motion.span>
            </div>
            <div className="slider-wrapper">
              <input 
                type="range" 
                min="0" 
                max="20000" 
                step="100"
                value={force}
                onChange={(e) => setForce(Number(e.target.value))}
                className="range-slider"
              />
              <motion.div 
                className="slider-fill"
                style={{ width: `${(force / 20000) * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <div className="slider-markers">
                {[0, 5000, 10000, 15000, 20000].map(val => (
                  <div key={val} className="marker">
                    <div className="marker-line" />
                    <span className="marker-label">{val / 1000}k</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Material Selector */}
          <div className="control-group">
            <div className="control-label">
              <span>
                <span className="label-icon">🔬</span>
                Material Selection
              </span>
            </div>
            <div className="material-btn-group">
              {Object.keys(materials).map((key) => (
                <motion.button
                  key={key}
                  className={`mat-btn ${material === key ? 'active' : ''}`}
                  onClick={() => setMaterial(key)}
                  onMouseEnter={() => setHoveredMaterial(key)}
                  onMouseLeave={() => setHoveredMaterial(null)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <span className="mat-icon">{materials[key].icon}</span>
                  <span className="mat-name">{materials[key].name}</span>
                  {material === key && (
                    <motion.div
                      className="active-indicator"
                      layoutId="activeMaterial"
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
            
            {/* Material tooltip */}
            <AnimatePresence>
              {hoveredMaterial && (
                <motion.div
                  className="material-tooltip"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="tooltip-row">
                    <span>Modulus:</span>
                    <span>{materials[hoveredMaterial].E} GPa</span>
                  </div>
                  <div className="tooltip-row">
                    <span>Density:</span>
                    <span>{materials[hoveredMaterial].density} kg/m³</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stress Indicator */}
          <motion.div 
            className="stress-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="stress-header">
              <span className="stress-label">Stress Level</span>
              <span className={`stress-status ${stress.status}`}>
                {stress.status.toUpperCase()}
              </span>
            </div>
            <div className="stress-bar-container">
              <motion.div 
                className="stress-bar"
                style={{ 
                  width: `${stress.level}%`,
                  backgroundColor: stress.color
                }}
                initial={{ width: 0 }}
                animate={{ width: `${stress.level}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <div className="stress-markers">
              <span className="marker safe">0%</span>
              <span className="marker warning">30%</span>
              <span className="marker critical">70%</span>
              <span className="marker">100%</span>
            </div>
          </motion.div>

          {/* Engineering Equation - Euler-Bernoulli Beam Theory */}
          <motion.div 
            className="formula-block"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              background: 'rgba(0,0,0,0.3)', 
              borderRadius: '8px',
              border: '1px solid rgba(102, 252, 241, 0.1)'
            }}
          >
            <div style={{ fontSize: '0.8rem', color: '#999', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>GOVERNING EQUATION</div>
            <code style={{ 
              fontFamily: 'JetBrains Mono, monospace', 
              color: '#66FCF1', 
              fontSize: '0.9rem',
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              δ = (F × L³) / (48 × E × I)
            </code>
            <div style={{ 
              fontSize: '0.7rem', 
              color: '#666', 
              marginTop: '0.5rem', 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem'
            }}>
              <span>F = Load ({force}N)</span>
              <span>E = Modulus ({materials[material].E} GPa)</span>
              <span style={{ gridColumn: '1 / -1', color: '#888', marginTop: '0.25rem' }}>L = Beam Length (1m assumed) | I = Moment of Inertia</span>
            </div>
            <div style={{ 
              fontSize: '0.65rem', 
              color: '#555', 
              marginTop: '0.75rem',
              fontStyle: 'italic',
              borderTop: '1px solid rgba(102, 252, 241, 0.05)',
              paddingTop: '0.5rem'
            }}>
              Note: Visualization uses normalized deflection index for clarity. Real-world calculations require specific beam geometry (I = bh³/12).
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <motion.div 
              className="stat-box"
              whileHover={{ scale: 1.03 }}
            >
              <div className="stat-icon">📏</div>
              <motion.div 
                className="stat-val deflection-val"
                key={deflectionVal}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {(deflectionVal * 0.1).toFixed(2)} 
                <span className="stat-unit">mm</span>
              </motion.div>
              <div className="stat-label">Est. Deflection</div>
            </motion.div>
            
            <motion.div 
              className="stat-box"
              whileHover={{ scale: 1.03 }}
            >
              <div className="stat-icon">💎</div>
              <motion.div 
                className="stat-val modulus-val"
                key={material}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {materials[material].E} 
                <span className="stat-unit">GPa</span>
              </motion.div>
              <div className="stat-label">Young's Modulus</div>
            </motion.div>
          </div>

          {/* --- NEW ENGINEERING FORMULA BLOCK (PASTE THIS HERE) --- */}
          <motion.div 
            className="formula-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ 
              marginTop: '20px', 
              padding: '15px', 
              background: 'rgba(0,0,0,0.3)', 
              borderRadius: '8px', 
              border: '1px solid rgba(147, 51, 234, 0.2)' 
            }}
          >
            <div style={{ fontSize: '0.7rem', color: '#999', marginBottom: '8px', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Governing Equation (Euler-Bernoulli)
            </div>
            <code style={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', color: '#66FCF1', fontSize: '0.9rem', marginBottom: '8px', background: 'rgba(0,0,0,0.5)', padding: '8px', borderRadius: '4px' }}>
              δ = (F × L³) / (48 × E × I)
            </code>
            <div style={{ fontSize: '0.7rem', color: '#666', fontFamily: 'Inter, sans-serif', display: 'flex', justifyContent: 'space-between' }}>
              <span>F = {force}N (Load)</span>
              <span>E = {materials[material].E} GPa</span>
            </div>
          </motion.div>
          {/* --- END OF NEW BLOCK --- */}

        </motion.div>

        {/* RIGHT CARD: VISUALIZATION */}
        <motion.div 
          className="beam-card visualization-card"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          whileHover={{ y: -3 }}
        >
          {/* Corner accents */}
          <div className="corner-accent top-left" />
          <div className="corner-accent top-right" />
          <div className="corner-accent bottom-left" />
          <div className="corner-accent bottom-right" />

          <div className="beam-header">
            <h3 className="beam-title">
              <span className="title-icon">📊</span>
              Deflection Profile
            </h3>
          </div>

          <div className="canvas-area">
            {/* Force Arrow - Enhanced (Positioned at beam surface with arrow pointing down) */}
            <motion.div 
              className="load-arrow"
              style={{ 
                position: 'absolute',
                left: '68%',
                top: `${100 + curveDepth * 0.85}px`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 10
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, type: "spring", stiffness: 150, damping: 20 }}
            >
              <motion.div 
                className="arrow-label"
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#f472b6',
                  textShadow: '0 0 15px rgba(244, 114, 182, 0.7)',
                  marginBottom: '4px',
                  whiteSpace: 'nowrap'
                }}
              >
                {force}N
              </motion.div>
              <motion.div 
                className="arrow-shaft" 
                style={{ 
                  height: `${50 + (force/400)}px`,
                  background: 'linear-gradient(180deg, #f472b6, #ec4899)',
                  boxShadow: '0 0 20px rgba(244, 114, 182, 0.6)'
                }}
              />
              <motion.div 
                className="arrow-head"
              />
            </motion.div>

            {/* SVG Beam with STUNNING 3D I-BEAM STRUCTURE */}
            <svg width="100%" height="350" viewBox="0 0 600 350" style={{ margin: '0 auto', display: 'block', maxWidth: '600px' }}>
              <defs>
                {/* Enhanced metallic gradient */}
                <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={materials[material].gradient.from} />
                  <stop offset="50%" stopColor={materials[material].color} />
                  <stop offset="100%" stopColor={materials[material].gradient.to} />
                </linearGradient>
                
                {/* 3D depth gradients */}
                <linearGradient id="topFlange" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                  <stop offset="50%" stopColor={materials[material].color} />
                  <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
                </linearGradient>
                
                <linearGradient id="bottomFlange" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(0,0,0,0.3)" />
                  <stop offset="50%" stopColor={materials[material].color} />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
                </linearGradient>
                
                <linearGradient id="web" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={materials[material].gradient.from} />
                  <stop offset="50%" stopColor={materials[material].color} />
                  <stop offset="100%" stopColor={materials[material].gradient.to} />
                </linearGradient>

                {/* Metallic shimmer */}
                <linearGradient id="metalShimmer" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
                </linearGradient>
                
                {/* Enhanced 3D shadow filter */}
                <filter id="beam3d">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
                  <feOffset dx="0" dy="6" result="offsetblur" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.5" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                
                <filter id="strongGlow">
                  <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                
                {/* Stress heat visualization */}
                <radialGradient id="stressGlow">
                  <stop offset="0%" stopColor={stress.color} stopOpacity="0.8" />
                  <stop offset="50%" stopColor={stress.color} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={stress.color} stopOpacity="0" />
                </radialGradient>
                
                {/* Rivet pattern */}
                <pattern id="rivets" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.3)" />
                  <circle cx="20" cy="20" r="1.5" fill="rgba(0,0,0,0.2)" />
                </pattern>
              </defs>

              {/* Engineering grid background */}
              <pattern id="grid" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
                <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(147, 51, 234, 0.08)" strokeWidth="0.5"/>
              </pattern>
              <rect width="600" height="350" fill="url(#grid)" />

              {/* Dimension lines */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <line x1="50" y1="50" x2="550" y2="50" stroke="rgba(192, 38, 211, 0.5)" strokeWidth="1" strokeDasharray="5,5" />
                <text x="300" y="40" fill="#c026d3" fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono">L = 5m (Span)</text>
              </motion.g>

              {/* Enhanced support structures */}
              <motion.g
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4, ease: "easeOut" }}
              >
                {/* Left fixed support */}
                <g>
                  <polygon points="60,180 80,220 40,220" fill="url(#beamGradient)" opacity="0.95" filter="url(#beam3d)" />
                  <rect x="57" y="220" width="20" height="40" fill={materials[material].color} opacity="0.85" rx="3" filter="url(#beam3d)" />
                  <rect x="52" y="260" width="30" height="15" fill={materials[material].gradient.to} opacity="0.9" rx="3" />
                  <circle cx="60" cy="267" r="3" fill="#fff" opacity="0.6" />
                  <circle cx="74" cy="267" r="3" fill="#fff" opacity="0.6" />
                  <line x1="67" y1="170" x2="67" y2="220" stroke={materials[material].color} strokeWidth="2" opacity="0.5" strokeDasharray="4 4" />
                  <text x="67" y="295" fill="rgba(234, 179, 240, 0.8)" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono">FIXED</text>
                </g>
                
                {/* Right roller support */}
                <g>
                  <polygon points="540,180 560,220 520,220" fill="url(#beamGradient)" opacity="0.95" filter="url(#beam3d)" />
                  <rect x="537" y="220" width="20" height="40" fill={materials[material].color} opacity="0.85" rx="3" filter="url(#beam3d)" />
                  {/* Rollers */}
                  <circle cx="537" cy="270" r="6" fill={materials[material].gradient.to} opacity="0.9" />
                  <circle cx="547" cy="270" r="6" fill={materials[material].gradient.to} opacity="0.9" />
                  <circle cx="557" cy="270" r="6" fill={materials[material].gradient.to} opacity="0.9" />
                  <rect x="527" y="276" width="40" height="3" fill={materials[material].gradient.to} opacity="0.8" />
                  <line x1="547" y1="170" x2="547" y2="220" stroke={materials[material].color} strokeWidth="2" opacity="0.5" strokeDasharray="4 4" />
                  <text x="547" y="295" fill="rgba(234, 179, 240, 0.8)" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono">ROLLER</text>
                </g>
              </motion.g>

              {/* Stress concentration visualization */}
              {stress.level > 20 && (
                <motion.ellipse
                  cx="340"
                  cy={180 + curveDepth}
                  rx="150"
                  ry="70"
                  fill="url(#stressGlow)"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 0.4 + (stress.level / 200),
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    opacity: { duration: 0.5 },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
              )}

              {/* REALISTIC I-BEAM STRUCTURE */}
              <g filter="url(#beam3d)">
                {/* Top Flange */}
                <motion.path 
                  d={`M 60 ${175} Q 200 ${175 + curveDepth * 0.3}, 340 ${175 + curveDepth}, 480 ${175 + curveDepth * 0.3}, 540 ${175}`}
                  stroke="url(#topFlange)"
                  strokeWidth="20"
                  fill="none" 
                  strokeLinecap="butt"
                  filter="url(#strongGlow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                />
                
                {/* Top flange highlight */}
                <motion.path 
                  d={`M 60 ${172} Q 200 ${172 + curveDepth * 0.3}, 340 ${172 + curveDepth}, 480 ${172 + curveDepth * 0.3}, 540 ${172}`}
                  stroke="url(#metalShimmer)"
                  strokeWidth="8"
                  fill="none" 
                  strokeLinecap="butt"
                  opacity="0.8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
                />
                
                {/* Top flange rivets */}
                <motion.path 
                  d={`M 60 ${175} Q 200 ${175 + curveDepth * 0.3}, 340 ${175 + curveDepth}, 480 ${175 + curveDepth * 0.3}, 540 ${175}`}
                  stroke="url(#rivets)"
                  strokeWidth="20"
                  fill="none" 
                  strokeLinecap="butt"
                  opacity="0.6"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
                />

                {/* Web (vertical part) */}
                <motion.path 
                  d={`M 60 ${180} Q 200 ${180 + curveDepth * 0.3}, 340 ${180 + curveDepth}, 480 ${180 + curveDepth * 0.3}, 540 ${180}`}
                  stroke="url(#web)"
                  strokeWidth="10"
                  fill="none" 
                  strokeLinecap="butt"
                  opacity="0.95"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.95 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.75 }}
                />
                
                {/* Web shimmer */}
                <motion.path 
                  d={`M 60 ${180} Q 200 ${180 + curveDepth * 0.3}, 340 ${180 + curveDepth}, 480 ${180 + curveDepth * 0.3}, 540 ${180}`}
                  stroke="url(#metalShimmer)"
                  strokeWidth="10"
                  fill="none" 
                  strokeLinecap="butt"
                  opacity="0.4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
                />

                {/* Bottom Flange */}
                <motion.path 
                  d={`M 60 ${185} Q 200 ${185 + curveDepth * 0.3}, 340 ${185 + curveDepth}, 480 ${185 + curveDepth * 0.3}, 540 ${185}`}
                  stroke="url(#bottomFlange)"
                  strokeWidth="20"
                  fill="none" 
                  strokeLinecap="butt"
                  filter="url(#strongGlow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.85 }}
                />
                
                {/* Bottom flange shadow */}
                <motion.path 
                  d={`M 60 ${188} Q 200 ${188 + curveDepth * 0.3}, 340 ${188 + curveDepth}, 480 ${188 + curveDepth * 0.3}, 540 ${188}`}
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth="8"
                  fill="none" 
                  strokeLinecap="butt"
                  opacity="0.6"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
                />
                
                {/* Bottom flange rivets */}
                <motion.path 
                  d={`M 60 ${185} Q 200 ${185 + curveDepth * 0.3}, 340 ${185 + curveDepth}, 480 ${185 + curveDepth * 0.3}, 540 ${185}`}
                  stroke="url(#rivets)"
                  strokeWidth="20"
                  fill="none" 
                  strokeLinecap="butt"
                  opacity="0.6"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.95 }}
                />
              </g>

              {/* Deflection measurement indicators */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                {/* Center deflection indicator */}
                <line 
                  x1="340" 
                  y1="180" 
                  x2="340" 
                  y2={180 + curveDepth + 30} 
                  stroke="#c026d3" 
                  strokeWidth="1.5" 
                  strokeDasharray="3 3"
                  opacity="0.7"
                />
                <motion.circle 
                  cx="340" 
                  cy={180 + curveDepth} 
                  r="5" 
                  fill="#c026d3" 
                  stroke="#fff" 
                  strokeWidth="2"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <rect 
                  x="310" 
                  y={180 + curveDepth + 35} 
                  width="60" 
                  height="20" 
                  fill="rgba(192, 38, 211, 0.2)" 
                  stroke="#c026d3" 
                  strokeWidth="1" 
                  rx="4"
                />
                <text 
                  x="340" 
                  y={180 + curveDepth + 48} 
                  fill="#c026d3" 
                  fontSize="11" 
                  textAnchor="middle" 
                  fontFamily="JetBrains Mono"
                  fontWeight="700"
                >
                  δ = {(deflectionVal * 0.1).toFixed(1)}mm
                </text>
              </motion.g>

              {/* Stress visualization - energy waves */}
              {stress.level > 20 && (
                <>
                  {/* Pulsing stress wave */}
                  <motion.path 
                    d={`M 60 ${180} Q 200 ${180 + curveDepth * 0.3}, 340 ${180 + curveDepth}, 480 ${180 + curveDepth * 0.3}, 540 ${180}`}
                    stroke={stress.color}
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="10 10"
                    opacity="0.6"
                    animate={{ strokeDashoffset: [0, -20] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  
                  {/* Stress particles along beam */}
                  {[...Array(6)].map((_, i) => {
                    const xPos = 60 + (i * 96);
                    const yOffset = i === 3 ? curveDepth : (i === 2 || i === 4 ? curveDepth * 0.5 : curveDepth * 0.2);
                    return (
                      <motion.circle
                        key={i}
                        cx={xPos}
                        cy={180 + yOffset}
                        r="3"
                        fill={stress.color}
                        opacity="0.8"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    );
                  })}
                  
                  {/* Critical stress warning at max deflection */}
                  {stress.level > 60 && (
                    <motion.g
                      animate={{
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <circle 
                        cx="340" 
                        cy={180 + curveDepth} 
                        r="25" 
                        fill="none" 
                        stroke={stress.color} 
                        strokeWidth="2" 
                        strokeDasharray="3 3"
                      />
                      <text 
                        x="340" 
                        y={180 + curveDepth - 35} 
                        fill={stress.color} 
                        fontSize="12" 
                        textAnchor="middle" 
                        fontFamily="JetBrains Mono"
                        fontWeight="700"
                      >
                        ⚠ {stress.status.toUpperCase()}
                      </text>
                    </motion.g>
                  )}
                </>
              )}

              {/* Neutral axis indicator (dashed line through center) */}
              <motion.line 
                x1="60" 
                y1="180" 
                x2="540" 
                y2="180" 
                stroke="rgba(102, 252, 241, 0.3)" 
                strokeWidth="1" 
                strokeDasharray="8 4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
              />
              <text 
                x="570" 
                y="183" 
                fill="rgba(102, 252, 241, 0.6)" 
                fontSize="9" 
                fontFamily="JetBrains Mono"
              >
                NA
              </text>

              {/* Material property indicators */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1.3, duration: 0.5 }}
              >
                <rect x="490" y="100" width="90" height="60" fill="rgba(0,0,0,0.5)" stroke="rgba(147, 51, 234, 0.4)" strokeWidth="1" rx="6" />
                <text x="535" y="118" fill="#c026d3" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono" fontWeight="700">
                  MATERIAL
                </text>
                <text x="535" y="135" fill={materials[material].color} fontSize="12" textAnchor="middle" fontFamily="Inter" fontWeight="600">
                  {materials[material].icon} {materials[material].name.split(' ')[0]}
                </text>
                <text x="535" y="150" fill="rgba(234, 179, 240, 0.7)" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono">
                  E = {materials[material].E} GPa
                </text>
              </motion.g>
            </svg>

            {/* Info overlay */}
            <motion.div 
              className="info-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <div className="info-item">
                <span className="info-icon">📐</span>
                <span className="info-text">Beam Length: 420mm</span>
              </div>
              <div className="info-item">
                <span className="info-icon">⚡</span>
                <span className="info-text">Load Position: Center</span>
              </div>
              <div className="info-item">
                <span className="info-icon">🔧</span>
                <span className="info-text">Profile: I-Beam (W150)</span>
              </div>
            </motion.div>

            <p className="disclaimer">
              *Visual exaggeration enabled for clarity
            </p>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
});

BeamVisualizer.displayName = 'BeamVisualizer';

export default BeamVisualizer;
