import React, { useRef, useState, useMemo, useEffect, Suspense, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import styled from 'styled-components';

// --- STYLED COMPONENTS ---
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #111; /* Fallback background */
`;

// --- SHADER (Liquid Distortion) ---
const WaveShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uTexture: { value: new THREE.Texture() },
    uHover: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform float uHover;
    varying vec2 vUv;
    void main() {
      vec2 uv = vUv;
      // Wave Math
      float wave = sin(uv.y * 5.0 + uTime) * 0.005;
      float distortion = wave + (sin(uv.y * 10.0 + uTime * 2.0) * 0.02 * uHover);
      uv.x += distortion;
      
      vec4 color = texture2D(uTexture, uv);
      gl_FragColor = color;
    }
  `
};

// --- R3F COMPONENT ---
const ImagePlane = React.memo(({ src }) => {
  const mesh = useRef();
  
  // THIS IS THE RISKY PART - Wrapped in Error Boundary below
  const texture = useTexture(src);
  
  const hoverState = useRef({ target: 0 });

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: texture },
        uHover: { value: 0 },
      },
      vertexShader: WaveShaderMaterial.vertexShader,
      fragmentShader: WaveShaderMaterial.fragmentShader,
    });
  }, []); // Run once

  useEffect(() => {
    if (material && texture) {
      material.uniforms.uTexture.value = texture;
    }
  }, [material, texture]);

  useFrame((state, delta) => {
    if (mesh.current && material) {
      material.uniforms.uTime.value += delta * 1.2; // Slower animation for better performance
      material.uniforms.uHover.value += 
        (hoverState.current.target - material.uniforms.uHover.value) * 0.08; // Smoother interpolation
    }
  });
  
  const handlePointerOver = useCallback(() => { hoverState.current.target = 1; }, []);
  const handlePointerOut = useCallback(() => { hoverState.current.target = 0; }, []);

  return (
    <mesh 
      ref={mesh} 
      onPointerOver={handlePointerOver} 
      onPointerOut={handlePointerOut}
    >
      <planeGeometry args={[5, 3.5]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
});
ImagePlane.displayName = 'ImagePlane';

// --- ERROR BOUNDARY CLASS (Prevents White Screen) ---
class TextureErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Texture failed to load:", error);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI (Grey Plane)
      return (
        <mesh>
          <planeGeometry args={[5, 3.5]} />
          <meshBasicMaterial color="#333" wireframe />
        </mesh>
      );
    }
    return this.props.children;
  }
}

// --- MAIN EXPORT ---
const DistortedImage = React.memo(({ src }) => {
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Safety Check: If src is missing, don't even try to render
  if (!src) return <div style={{background: '#222', width: '100%', height: '100%'}} />;

  return (
    <Wrapper>
      <Canvas 
        camera={{ position: [0, 0, 2.5] }} 
        dpr={isMobile ? [0.75, 0.75] : [1, 1.5]} 
        gl={{ 
          antialias: false,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
          depth: false,
          precision: 'lowp'
        }}
        frameloop="always"
        performance={{ min: 0.8 }}
        flat
        legacy={false}
      >
        <TextureErrorBoundary>
          <Suspense fallback={null}>
            <ImagePlane src={src} />
          </Suspense>
        </TextureErrorBoundary>
      </Canvas>
    </Wrapper>
  );
});
DistortedImage.displayName = 'DistortedImage';

export default DistortedImage;