"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";
import * as THREE from "three";

// Types for particle data to keep it organized
type ParticleSystemData = {
  positions: Float32Array;
  velocities: Float32Array;
  seeds: Float32Array;
};

// Pure initialization helper moved out of render cycle
const createParticles = (count: number): ParticleSystemData => {
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const seeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 25;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
    
    velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.01;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    seeds[i] = Math.random() * Math.PI * 2;
  }
  return { positions, velocities, seeds };
};

export default function Particles({ count = 120 }) {
  const { theme } = useTheme();
  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);

  // Standard R3F approach for high-performance mutations
  const data = useMemo(() => createParticles(count), [count]);
  
  // We move the velocities into a separate ref to avoid React 19 linting errors 
  // about mutating memoized objects, while keeping performance high.
  const velocitiesRef = useRef(data.velocities);
  
  const linePositions = useMemo(() => new Float32Array(count * 4 * 3), [count]);

  useFrame((state) => {
    if (!pointsRef.current || !linesRef.current) return;
    
    const posArr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const linePosArr = linesRef.current.geometry.attributes.position.array as Float32Array;
    const vels = velocitiesRef.current;
    let lineIdx = 0;

    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      // Subtle drift
      posArr[i * 3 + 0] += vels[i * 3 + 0] + Math.sin(time + data.seeds[i]) * 0.002;
      posArr[i * 3 + 1] += vels[i * 3 + 1] + Math.cos(time + data.seeds[i]) * 0.002;
      posArr[i * 3 + 2] += vels[i * 3 + 2];

      // Boundary check
      if (Math.abs(posArr[i * 3 + 0]) > 12) vels[i * 3 + 0] *= -1;
      if (Math.abs(posArr[i * 3 + 1]) > 12) vels[i * 3 + 1] *= -1;
      if (Math.abs(posArr[i * 3 + 2]) > 12) vels[i * 3 + 2] *= -1;
    }

    // Connect only if close, but limit total lines for cleaner look
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = posArr[i * 3 + 0] - posArr[j * 3 + 0];
        const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
        const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < 4 && lineIdx < linePosArr.length - 6) {
          linePosArr[lineIdx++] = posArr[i * 3 + 0];
          linePosArr[lineIdx++] = posArr[i * 3 + 1];
          linePosArr[lineIdx++] = posArr[i * 3 + 2];
          linePosArr[lineIdx++] = posArr[j * 3 + 0];
          linePosArr[lineIdx++] = posArr[j * 3 + 1];
          linePosArr[lineIdx++] = posArr[j * 3 + 2];
        }
      }
    }

    // Reset remaining positions to a single point to "hide" them
    for (let i = lineIdx; i < linePosArr.length; i++) {
      linePosArr[i] = posArr[0];
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Slow rotation
    pointsRef.current.rotation.y += 0.0002;
    linesRef.current.rotation.y += 0.0002;
  });

  const particleColor = theme === "dark" ? "#22d3ee" : "#0891b2";

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[data.positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color={particleColor}
          transparent
          opacity={theme === "dark" ? 0.3 : 0.5}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial 
          color={particleColor} 
          transparent 
          opacity={theme === "dark" ? 0.03 : 0.06} 
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}
