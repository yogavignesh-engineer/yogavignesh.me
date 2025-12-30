import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './BeamVisualizer.css';

const BeamVisualizer = () => {
  // 1. STATE
  const [force, setForce] = useState(5000); // Newtons
  const [material, setMaterial] = useState('steel'); // steel | aluminum | wood
  const [hoveredMaterial, setHoveredMaterial] = useState(null);
  
  // Material Properties (Young's Modulus E in GPa)
  const materials = {
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
  };

  // 2. PHYSICS CALCULATION
  const calculateDeflection = () => {
    const E = materials[material].E;
    const rawDeflection = (force / E); 
    return rawDeflection;
  };

  // Calculate stress level
  const calculateStress = () => {
    const deflection = calculateDeflection();
    const maxDeflection = 20000 / materials[material].E;
    const stressLevel = (deflection / maxDeflection) * 100;
    
    return {
      level: Math.min(stressLevel, 100),
      status: stressLevel < 30 ? 'safe' : stressLevel < 70 ? 'warning' : 'critical',
      color: stressLevel < 30 ? '#10b981' : stressLevel < 70 ? '#f59e0b' : '#ef4444'
    };
  };

  // 3. VISUALIZATION LOGIC
  const deflectionVal = calculateDeflection();
  const maxPixels = 80; 
  const curveDepth = Math.min(deflectionVal * 0.8, maxPixels); 
  const beamPath = `M 10 100 Q 150 ${100 + curveDepth} 290 100`;
  const stress = calculateStress();

  return (
    <motion.div 
      className="beam-wrapper"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated grid background */}
      <div className="beam-grid-background" />
      
      <div className="beam-container">
        
        {/* LEFT CARD: CONTROLS */}
        <motion.div 
          className="beam-card controls-card"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          whileHover={{ y: -3 }}
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
        </motion.div>

        {/* RIGHT CARD: VISUALIZATION */}
        <motion.div 
          className="beam-card visualization-card"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
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
            {/* Force Arrow */}
            <motion.div 
              className="load-arrow"
              style={{ transform: `translate(-50%, ${curveDepth / 2}px)` }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <motion.div 
                className="arrow-label"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {force}N
              </motion.div>
              <div 
                className="arrow-shaft" 
                style={{ height: `${40 + (force/500)}px` }}
              />
              <motion.div 
                className="arrow-head"
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* SVG Beam with 3D effect */}
            <svg width="300" height="250" viewBox="0 0 300 250">
              <defs>
                <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={materials[material].gradient.from} />
                  <stop offset="100%" stopColor={materials[material].gradient.to} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Grid pattern */}
              <pattern id="grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(147, 51, 234, 0.1)" strokeWidth="0.5"/>
              </pattern>
              <rect width="300" height="250" fill="url(#grid)" />

              {/* Support structures */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {/* Left support */}
                <polygon points="5,110 15,130 -5,130" fill="url(#beamGradient)" opacity="0.8" />
                <rect x="3" y="130" width="4" height="15" fill={materials[material].color} opacity="0.6" />
                <circle cx="5" cy="145" r="3" fill={materials[material].color} />
                
                {/* Right support */}
                <polygon points="285,110 295,130 275,130" fill="url(#beamGradient)" opacity="0.8" />
                <rect x="283" y="130" width="4" height="15" fill={materials[material].color} opacity="0.6" />
                <circle cx="285" cy="145" r="3" fill={materials[material].color} />
              </motion.g>

              {/* Main beam - Top flange */}
              <motion.path 
                d={beamPath.replace('100', '98')}
                stroke="url(#beamGradient)"
                strokeWidth="10"
                fill="none" 
                strokeLinecap="butt"
                filter="url(#glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
              />

              {/* Main beam - Web */}
              <motion.path 
                d={beamPath}
                stroke="url(#beamGradient)"
                strokeWidth="5"
                fill="none" 
                strokeLinecap="butt"
                opacity="0.9"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.75 }}
              />

              {/* Main beam - Bottom flange */}
              <motion.path 
                d={beamPath.replace('100', '102')}
                stroke="url(#beamGradient)"
                strokeWidth="10"
                fill="none" 
                strokeLinecap="butt"
                filter="url(#glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
              />

              {/* Stress visualization - subtle wave */}
              {stress.level > 20 && (
                <motion.path 
                  d={beamPath}
                  stroke={stress.color}
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5 5"
                  opacity="0.4"
                  animate={{ strokeDashoffset: [0, -10] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              )}

              {/* Neutral axis */}
              <motion.line
                x1="10"
                y1="100"
                x2="290"
                y2="100"
                stroke="rgba(147, 197, 253, 0.3)"
                strokeWidth="1"
                strokeDasharray="3 3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              />

              {/* Deflection indicator */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <line 
                  x1="295" 
                  y1="100" 
                  x2="295" 
                  y2={100 + curveDepth} 
                  stroke="#f472b6" 
                  strokeWidth="1.5" 
                  strokeDasharray="3 3"
                />
                <circle cx="295" cy="100" r="2" fill="#f472b6" />
                <circle cx="295" cy={100 + curveDepth} r="2" fill="#f472b6" />
                <text 
                  x="298" 
                  y={100 + curveDepth/2} 
                  fill="#f472b6" 
                  fontSize="8"
                  fontWeight="bold"
                >
                  δ
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
                <span className="info-text">Beam Length: 300mm</span>
              </div>
              <div className="info-item">
                <span className="info-icon">⚡</span>
                <span className="info-text">Load Position: Center</span>
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
};

export default BeamVisualizer;
