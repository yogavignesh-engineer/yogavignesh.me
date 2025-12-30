import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import styled from 'styled-components';

const CanvasContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
`;

// Simple floating gear (extruded circle with notches)
function SimpleGear({ position, scale, rotationSpeed, color }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += rotationSpeed;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <torusGeometry args={[0.5, 0.15, 8, 16]} />
      <meshStandardMaterial
        color={color}
        metalness={0.8}
        roughness={0.2}
        emissive={color}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

// Floating bolt (cylinder)
function FloatingBolt({ position, scale }) {
  const meshRef = useRef();
  const speed = useMemo(() => 0.3 + Math.random() * 0.5, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed) * 0.5;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={meshRef} position={position} scale={scale}>
      {/* Bolt head (hexagonal approximation) */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 6]} />
        <meshStandardMaterial color="#555" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Bolt shaft */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.4, 12]} />
        <meshStandardMaterial color="#666" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

// Floating cube (representing mechanical parts)
function FloatingCube({ position, scale, color }) {
  const meshRef = useRef();
  const speed = useMemo(() => 0.2 + Math.random() * 0.4, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed * 0.01;
      meshRef.current.rotation.y += speed * 0.015;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshStandardMaterial
        color={color}
        metalness={0.7}
        roughness={0.3}
        emissive={color}
        emissiveIntensity={0.05}
      />
    </mesh>
  );
}

// Floating sphere (representing nuts/bearings)
function FloatingSphere({ position, scale, color }) {
  const meshRef = useRef();
  const speed = useMemo(() => 0.2 + Math.random() * 0.4, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial
        color={color}
        metalness={0.8}
        roughness={0.2}
        emissive={color}
        emissiveIntensity={0.15}
      />
    </mesh>
  );
}

// Mouse-following particles
function MouseParticles({ count = 40 }) {
  const mesh = useRef();
  const { mouse, viewport } = useThree();

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 5 - 5
        ),
        originalPosition: new THREE.Vector3(
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 5 - 5
        ),
        speed: 0.01 + Math.random() * 0.02,
        scale: 0.03 + Math.random() * 0.08
      });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!mesh.current) return;

    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;

    particles.forEach((particle, i) => {
      // Gentle attraction to mouse
      const dx = mouseX - particle.position.x;
      const dy = mouseY - particle.position.y;

      particle.position.x += dx * 0.001;
      particle.position.y += dy * 0.001;

      // Return to original position slowly
      particle.position.x += (particle.originalPosition.x - particle.position.x) * 0.005;
      particle.position.y += (particle.originalPosition.y - particle.position.y) * 0.005;

      // Floating motion
      particle.position.y += Math.sin(state.clock.elapsedTime * particle.speed * 10 + i) * 0.002;

      dummy.position.copy(particle.position);
      dummy.scale.setScalar(particle.scale);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });

    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        color="#66FCF1"
        emissive="#66FCF1"
        emissiveIntensity={0.5}
        transparent
        opacity={0.6}
      />
    </instancedMesh>
  );
}

// Main particle scene - simplified without postprocessing
function ParticleScene() {
  const gears = useMemo(() => {
    const items = [];
    for (let i = 0; i < 6; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 10,
          -3 - Math.random() * 6
        ],
        scale: 0.4 + Math.random() * 1,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        color: Math.random() > 0.5 ? '#66FCF1' : '#444'
      });
    }
    return items;
  }, []);

  const bolts = useMemo(() => {
    const items = [];
    for (let i = 0; i < 4; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 8,
          -2 - Math.random() * 5
        ],
        scale: 0.6 + Math.random() * 0.8
      });
    }
    return items;
  }, []);

  const cubes = useMemo(() => {
    const items = [];
    for (let i = 0; i < 5; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 10,
          -4 - Math.random() * 4
        ],
        scale: 0.5 + Math.random() * 0.8,
        color: Math.random() > 0.6 ? '#FF6B35' : '#333'
      });
    }
    return items;
  }, []);

  const spheres = useMemo(() => {
    const items = [];
    for (let i = 0; i < 6; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 10,
          -2 - Math.random() * 4
        ],
        scale: 0.4 + Math.random() * 0.7,
        color: '#66FCF1'
      });
    }
    return items;
  }, []);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} color="#fff" />
      <pointLight position={[-10, -10, -5]} intensity={0.4} color="#66FCF1" />
      <pointLight position={[10, -5, 0]} intensity={0.2} color="#FF6B35" />

      {/* Floating mechanical elements */}
      {gears.map((gear, i) => (
        <Float key={`gear-${i}`} speed={1} rotationIntensity={0.2} floatIntensity={0.4}>
          <SimpleGear {...gear} />
        </Float>
      ))}

      {bolts.map((bolt, i) => (
        <Float key={`bolt-${i}`} speed={0.8} rotationIntensity={0.3} floatIntensity={0.3}>
          <FloatingBolt {...bolt} />
        </Float>
      ))}

      {cubes.map((cube, i) => (
        <Float key={`cube-${i}`} speed={0.6} rotationIntensity={0.4} floatIntensity={0.3}>
          <FloatingCube {...cube} />
        </Float>
      ))}

      {spheres.map((sphere, i) => (
        <Float key={`sphere-${i}`} speed={0.7} rotationIntensity={0.2} floatIntensity={0.4}>
          <FloatingSphere {...sphere} />
        </Float>
      ))}

      {/* Mouse-following particles */}
      <MouseParticles count={35} />
    </>
  );
}

// Error boundary for 3D canvas
class Canvas3DErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('3D Canvas Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null; // Silently fail - the rest of hero will still work
    }
    return this.props.children;
  }
}

// Main exported component
const ParticleField3D = React.memo(function ParticleField3D() {
  return (
    <CanvasContainer>
      <Canvas3DErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 60 }}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: true
          }}
          dpr={1}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <React.Suspense fallback={null}>
            <ParticleScene />
          </React.Suspense>
        </Canvas>
      </Canvas3DErrorBoundary>
    </CanvasContainer>
  );
});

export default ParticleField3D;
