"use client";

import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

export default function ProfileFrame() {
  const meshRef = useRef<THREE.Group>(null!);
  
  // Use manual texture loading for more control and stability
  const texture = useLoader(THREE.TextureLoader, "/profile.jpg");

  useFrame((state) => {
    if (!meshRef.current) return;
    const { x, y } = state.mouse;
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      x * 0.15,
      0.05
    );
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      -y * 0.15,
      0.05
    );
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={meshRef}>
        {/* Subtle Background Glow */}
        <mesh position={[0, 0, -0.05]}>
          <planeGeometry args={[3.05, 4.05]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.03} />
        </mesh>
        
        {/* Your Actual Profile Image as a Mesh */}
        <mesh scale={[3, 4, 1]}>
          <planeGeometry />
          <meshBasicMaterial map={texture} transparent opacity={1} />
        </mesh>

        {/* Minimalist Border */}
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(3, 4)]} />
          <lineBasicMaterial color="#ffffff" transparent opacity={0.15} />
        </lineSegments>
      </group>
    </Float>
  );
}
