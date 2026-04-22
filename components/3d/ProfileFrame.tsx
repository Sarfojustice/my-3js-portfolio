"use client";

import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

export default function ProfileFrame() {
  const meshRef = useRef<THREE.Group>(null!);
  const texture = useLoader(THREE.TextureLoader, "/profile.jpg");

  useFrame((state) => {
    if (!meshRef.current) return;
    const { x, y } = state.mouse;
    
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, x * 0.15, 0.05);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -y * 0.15, 0.05);
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={meshRef}>
        {/* Glow backdrop */}
        <mesh position={[0, 0, -0.05]}>
          <planeGeometry args={[3.2, 4.2]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.03} />
        </mesh>
        
        {/* Clean Image */}
        <mesh scale={[3, 4, 1]}>
          <planeGeometry />
          <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>

        {/* Minimalist Tech Border */}
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(3, 4)]} />
          <lineBasicMaterial color="#22d3ee" transparent opacity={0.2} />
        </lineSegments>
      </group>
    </Float>
  );
}
