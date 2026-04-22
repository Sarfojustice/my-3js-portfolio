"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function SubtleMeshWaves() {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  // Use a highly segmented plane for smoother waves
  const segments = 50;
  const size = 60;

  // Store the original positions to calculate waves relative to them
  const initialPositions = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    return geometry.attributes.position.array.slice() as Float32Array;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const posAttr = meshRef.current.geometry.attributes.position;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < array.length; i += 3) {
      const x = initialPositions[i];
      const y = initialPositions[i + 1];
      
      // Calculate a wave based on time and position
      // Using multiple sine waves for a more natural look
      const wave1 = Math.sin(x * 0.15 + time * 0.5) * 0.8;
      const wave2 = Math.cos(y * 0.15 + time * 0.3) * 0.8;
      const wave3 = Math.sin((x + y) * 0.1 + time * 0.2) * 0.4;
      
      // Update the Z coordinate (since it's a PlaneGeometry)
      array[i + 2] = initialPositions[i + 2] + wave1 + wave2 + wave3;
    }
    
    posAttr.needsUpdate = true;
  });

  return (
    <mesh 
      ref={meshRef} 
      rotation={[-Math.PI / 2.2, 0, 0]} 
      position={[0, -5, -10]}
    >
      <planeGeometry args={[size, size, segments, segments]} />
      <meshBasicMaterial 
        color="#22d3ee" 
        wireframe 
        transparent 
        opacity={0.05} 
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
