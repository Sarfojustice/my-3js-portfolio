"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

type ShapeData = {
  position: [number, number, number],
  scale: number,
  speed: number,
  rotationSpeed: number,
  type: 'ring' | 'cube' | 'octa'
};

const generateShapes = (): ShapeData[] => {
  const items: ShapeData[] = [];
  // Large outer rings
  for (let i = 0; i < 5; i++) {
    items.push({
      position: [0, 0, -5],
      scale: 4 + i * 1.5,
      speed: 1 + i * 0.2,
      rotationSpeed: 0.1 * (i % 2 === 0 ? 1 : -1),
      type: 'ring'
    });
  }
  // Floating nodes
  for (let i = 0; i < 12; i++) {
    items.push({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15 - 5
      ],
      scale: 0.2 + Math.random() * 0.8,
      speed: 2 + Math.random() * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.5,
      type: (Math.random() > 0.5 ? 'cube' : 'octa')
    });
  }
  return items;
};

function CoreShape({ position, scale, speed, rotationSpeed, type }: ShapeData) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = time * rotationSpeed;
      meshRef.current.rotation.y = time * rotationSpeed * 0.8;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {type === 'ring' && <torusGeometry args={[1, 0.02, 16, 100]} />}
        {type === 'cube' && <boxGeometry args={[1, 1, 1]} />}
        {type === 'octa' && <octahedronGeometry args={[1, 0]} />}
        
        <meshBasicMaterial 
          color="#22d3ee" 
          transparent 
          opacity={0.1} 
          wireframe={type !== 'cube'} 
        />
        {type === 'cube' && (
          <MeshDistortMaterial 
            color="#22d3ee" 
            speed={2} 
            distort={0.3} 
            transparent 
            opacity={0.03} 
          />
        )}
      </mesh>
    </Float>
  );
}

export default function AbstractDataCore() {
  // Use a stable state for initialization to avoid render-time impurity warnings
  const [shapes] = useState(() => generateShapes());

  return (
    <group>
      {shapes.map((props, i) => (
        <CoreShape key={i} {...props} />
      ))}
      
      {/* Central Core Glow */}
      <mesh position={[0, 0, -8]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.02} />
      </mesh>
    </group>
  );
}
