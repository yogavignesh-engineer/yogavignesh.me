import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Text, Center, Resize } from '@react-three/drei';
import * as THREE from 'three';

const MechanicalPointer = React.memo(({ activeId }) => {
  const groupRef = useRef(null);
  
  // LOAD MODEL
  // PERFORMANCE: The 'true' flag enables a declarative, cachable loader, which is good.
  const { scene } = useGLTF('/tool.glb', true); 

  useFrame((state) => {
    if (!groupRef.current) return;

    // --- 1. TARGETING SYSTEM ---
    let targetX = state.pointer.x;
    let targetY = state.pointer.y;

    // LOCK ON LOGIC: 3x2 Grid (6 projects)
    if (activeId === 1) { // Top Left
      targetX = -0.67; 
      targetY = 0.5;
    } else if (activeId === 2) { // Top Center
      targetX = 0; 
      targetY = 0.5;
    } else if (activeId === 3) { // Top Right
      targetX = 0.67; 
      targetY = 0.5;
    } else if (activeId === 4) { // Bottom Left
      targetX = -0.67; 
      targetY = -0.5;
    } else if (activeId === 5) { // Bottom Center
      targetX = 0; 
      targetY = -0.5;
    } else if (activeId === 6) { // Bottom Right
      targetX = 0.67; 
      targetY = -0.5;
    }

    // --- 2. COMPASS MATH ---
    const angle = Math.atan2(targetY, targetX);
    const rotationOffset = -Math.PI / 2; 
    const targetRotationZ = angle + rotationOffset;

    // --- 3. SMOOTH TURN (LERP) ---
    // Increased lerp factor for faster, smoother response
    groupRef.current.rotation.z += (targetRotationZ - groupRef.current.rotation.z) * 0.15;
  });

  const displayNum = activeId ? String(activeId).padStart(2, '0') : "--";

  return (
    <group ref={groupRef}>
      <Resize scale={3.5}>
        <Center>
          <primitive 
            object={scene} 
            rotation={[Math.PI / 2, 0, 0]} 
          />
        </Center>
      </Resize>

      <group position={[0, 0.2, 0.5]} rotation={[0, 0, 0]}> 
        <Text
          fontSize={0.3}
          color="#39ff14"
          anchorX="center"
          anchorY="middle"
        >
          {displayNum}
        </Text>
        <Text position={[0.25, -0.15, 0]} fontSize={0.08} color="#39ff14">
          mm
        </Text>
      </group>
    </group>
  );
});

MechanicalPointer.displayName = 'MechanicalPointer';

// PERFORMANCE: Preload the model so it's ready when the component mounts.
useGLTF.preload('/tool.glb', true);

export default MechanicalPointer;