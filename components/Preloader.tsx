"use client";

import { useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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
    // Lock scroll during loading
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          const tl = gsap.timeline({
            onComplete: () => {
              setIsVisible(false);
              document.body.style.overflow = "";
              document.body.style.position = "";
              document.body.style.width = "";
            }
          });
          tl.to(".loading-ui", { opacity: 0, duration: 0.4 });
          tl.to(containerRef.current, { 
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)", 
            duration: 0.8, 
            ease: "expo.inOut" 
          });
          return 100;
        }
        return prev + 1;
      });
    }, 25);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center overflow-hidden touch-none"
      style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", willChange: "clip-path" }}
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5] }} dpr={[1, 1.5]}>
          <LoadingMesh />
        </Canvas>
      </div>

      <div className="loading-ui relative z-10 flex flex-col items-center justify-center w-full px-6 text-center">
        <div className="text-[10px] font-mono tracking-[0.5em] text-cyan-500 mb-6 uppercase animate-pulse">
          Initializing Portfolio
        </div>
        <div className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-4 tabular-nums">
          {progress}%
        </div>
        <div className="w-48 md:w-64 h-[2px] bg-white/5 relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cyan-500 origin-left transition-transform duration-150"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
        <div className="mt-6 text-[8px] font-mono text-gray-500 uppercase tracking-widest max-w-[200px] leading-relaxed">
          Establishing Secure Connection...
        </div>
      </div>
    </div>
  );
}
