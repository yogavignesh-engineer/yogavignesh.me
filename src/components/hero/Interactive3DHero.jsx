import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Mechanical Gear Component
 * Rotating gear with industrial orange material
 */
function MechanicalGear({ position = [0, 0, 0], scale = 1, rotationSpeed = 0.5 }) {
  const meshRef = useRef();
  
  // Create gear geometry procedurally
  const gearGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const outerRadius = 2;
    const innerRadius = 1.5;
    const teeth = 12;
    const toothDepth = 0.3;
    
    for (let i = 0; i < teeth; i++) {
      const angle1 = (i / teeth) * Math.PI * 2;
      const angle2 = ((i + 0.4) / teeth) * Math.PI * 2;
      const angle3 = ((i + 0.6) / teeth) * Math.PI * 2;
      const angle4 = ((i + 1) / teeth) * Math.PI * 2;
      
      if (i === 0) {
        shape.moveTo(
          Math.cos(angle1) * outerRadius,
          Math.sin(angle1) * outerRadius
        );
      }
      
      // Tooth
      shape.lineTo(
        Math.cos(angle2) * outerRadius,
        Math.sin(angle2) * outerRadius
      );
      shape.lineTo(
        Math.cos(angle2) * (outerRadius + toothDepth),
        Math.sin(angle2) * (outerRadius + toothDepth)
      );
      shape.lineTo(
        Math.cos(angle3) * (outerRadius + toothDepth),
        Math.sin(angle3) * (outerRadius + toothDepth)
      );
      shape.lineTo(
        Math.cos(angle3) * outerRadius,
        Math.sin(angle3) * outerRadius
      );
      shape.lineTo(
        Math.cos(angle4) * outerRadius,
        Math.sin(angle4) * outerRadius
      );
    }
    
    shape.closePath();
    
    // Create hole in center
    const holePath = new THREE.Path();
    holePath.absarc(0, 0, innerRadius, 0, Math.PI * 2, false);
    shape.holes.push(holePath);
    
    const extrudeSettings = {
      depth: 0.4,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 3,
    };
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * rotationSpeed;
    }
  });
  
  return (
    <mesh ref={meshRef} geometry={gearGeometry} position={position} scale={scale}>
      <meshStandardMaterial 
        color="#FF6B35" 
        metalness={0.8}
        roughness={0.2}
        emissive="#FF6B35"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

/**
 * Sensor Module Component
 * Represents the Smart Boundary pressure sensor
 */
function SensorModule({ position = [0, 0, 0], scale = 1 }) {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });
  
  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Main housing */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 0.4, 2]} />
        <meshStandardMaterial 
          color="#4A90E2" 
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Sensor pad */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.2, 32]} />
        <meshStandardMaterial 
          color="#FF6B35" 
          metalness={0.7}
          roughness={0.3}
          emissive="#FF6B35"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Mounting bolts */}
      {[[-0.6, -0.15, 0.8], [0.6, -0.15, 0.8], [-0.6, -0.15, -0.8], [0.6, -0.15, -0.8]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
          <meshStandardMaterial color="#333" metalness={1} roughness={0.2} />
        </mesh>
      ))}
      
      {/* LED indicator */}
      <mesh position={[0.6, 0, 0.9]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial 
          color="#4CAF50" 
          emissive="#4CAF50"
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
}

/**
 * Floating Particles System
 * Physics-based particles that react to scroll
 */
function FloatingParticles({ count = 50, scrollY = 0 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
      ],
      speed: Math.random() * 0.5 + 0.2,
      scale: Math.random() * 0.3 + 0.1,
    }));
  }, [count]);
  
  return (
    <group>
      {particles.map((particle, i) => (
        <Float
          key={i}
          speed={particle.speed}
          rotationIntensity={0.5}
          floatIntensity={0.5}
        >
          <mesh position={particle.position} scale={particle.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial 
              color="#FF6B35" 
              metalness={0.8}
              roughness={0.2}
              emissive="#FF6B35"
              emissiveIntensity={0.4}
              transparent
              opacity={0.6}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

/**
 * Main 3D Scene
 * Contains all mechanical elements
 */
function Scene({ mouseX = 0, mouseY = 0, scrollProgress = 0 }) {
  return (
    <>
      {/* Lighting setup */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#FF6B35" />
      <spotLight 
        position={[0, 10, 0]} 
        angle={0.3} 
        penumbra={1} 
        intensity={0.5}
        color="#4A90E2"
      />
      
      {/* Mechanical components */}
      <Center>
        <group rotation={[0, scrollProgress * Math.PI * 2, 0]}>
          {/* Main sensor module */}
          <SensorModule position={[0, 0, 0]} scale={1.2} />
          
          {/* Surrounding gears */}
          <MechanicalGear position={[-4, 2, -2]} scale={0.6} rotationSpeed={0.3} />
          <MechanicalGear position={[4, -2, -2]} scale={0.8} rotationSpeed={-0.4} />
          <MechanicalGear position={[0, 3, -3]} scale={0.5} rotationSpeed={0.5} />
          
          {/* Floating particles */}
          <FloatingParticles count={30} scrollY={scrollProgress} />
        </group>
      </Center>
      
      {/* Orbit controls for interaction */}
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
        autoRotate
        autoRotateSpeed={0.3}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

/**
 * Interactive3DHero Component
 * Main export - Canvas wrapper with responsive sizing
 */
const Interactive3DHero = ({ className, mouseX = 0, mouseY = 0, scrollProgress = 0 }) => {
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Canvas
      className={className}
      camera={{ position: [8, 4, 8], fov: 50 }}
      dpr={isMobile ? [0.5, 1] : [1, 1.5]}
      gl={{ 
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true
      }}
      frameloop={isMobile ? "demand" : "always"}
      performance={{ min: 0.5 }}
      touch-action="pan-y"
    >
      <Scene mouseX={mouseX} mouseY={mouseY} scrollProgress={scrollProgress} />
    </Canvas>
  );
};

export default Interactive3DHero;
