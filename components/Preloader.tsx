"use client";

import { useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Center } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";

function LoadingMesh() {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = t * 0.5;
    meshRef.current.rotation.y = t * 0.2;
    meshRef.current.scale.setScalar(Math.sin(t * 2) * 0.1 + 1);
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[1, 2]} />
      <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.3} />
    </mesh>
  );
}

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          // Fade out sequence
          const tl = gsap.timeline({
            onComplete: () => setIsVisible(false)
          });
          tl.to(".loading-ui", { opacity: 0, duration: 0.5 });
          tl.to(containerRef.current, { 
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)", 
            duration: 1, 
            ease: "power4.inOut" 
          });
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden"
      style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
    >
      <div className="absolute inset-0 opacity-20">
        <Canvas>
          <LoadingMesh />
        </Canvas>
      </div>

      <div className="loading-ui z-10 text-center">
        <div className="text-[10px] font-mono tracking-[0.5em] text-cyan-500 mb-4 uppercase animate-pulse">
          Initializing Portfolio
        </div>
        <div className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-2">
          {progress}%
        </div>
        <div className="w-48 h-[2px] bg-white/5 relative overflow-hidden mx-auto">
          <div 
            className="absolute inset-0 bg-cyan-500 origin-left transition-transform duration-100"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
        <div className="mt-4 text-[8px] font-mono text-gray-500 uppercase tracking-widest">
          Establishing Secure Connection...
        </div>
      </div>
    </div>
  );
}
