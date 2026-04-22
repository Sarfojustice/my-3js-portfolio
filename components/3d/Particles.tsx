"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";
import * as THREE from "three";

export default function Particles({ count = 200 }) {
  const { theme } = useTheme();
  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    return { positions, velocities };
  }, [count]);

  const linePositions = useMemo(() => new Float32Array(count * 10 * 3), [count]);

  useFrame((state) => {
    if (!pointsRef.current || !linesRef.current) return;
    
    const posArr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const linePosArr = linesRef.current.geometry.attributes.position.array as Float32Array;
    let lineIdx = 0;

    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 0] += particles.velocities[i * 3 + 0];
      posArr[i * 3 + 1] += particles.velocities[i * 3 + 1];
      posArr[i * 3 + 2] += particles.velocities[i * 3 + 2];

      if (Math.abs(posArr[i * 3 + 0]) > 10) particles.velocities[i * 3 + 0] *= -1;
      if (Math.abs(posArr[i * 3 + 1]) > 10) particles.velocities[i * 3 + 1] *= -1;
      if (Math.abs(posArr[i * 3 + 2]) > 10) particles.velocities[i * 3 + 2] *= -1;
    }

    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = posArr[i * 3 + 0] - posArr[j * 3 + 0];
        const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
        const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 3 && lineIdx < linePosArr.length - 6) {
          linePosArr[lineIdx++] = posArr[i * 3 + 0];
          linePosArr[lineIdx++] = posArr[i * 3 + 1];
          linePosArr[lineIdx++] = posArr[i * 3 + 2];
          linePosArr[lineIdx++] = posArr[j * 3 + 0];
          linePosArr[lineIdx++] = posArr[j * 3 + 1];
          linePosArr[lineIdx++] = posArr[j * 3 + 2];
        }
      }
    }

    for (let i = lineIdx; i < linePosArr.length; i++) {
      linePosArr[i] = posArr[0];
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y += 0.001;
    linesRef.current.rotation.y += 0.001;
  });

  const particleColor = theme === "dark" ? "#22d3ee" : "#0891b2";

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles.positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color={particleColor}
          transparent
          opacity={theme === "dark" ? 0.4 : 0.6}
          sizeAttenuation
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
          opacity={theme === "dark" ? 0.05 : 0.1} 
        />
      </lineSegments>
    </group>
  );
}
