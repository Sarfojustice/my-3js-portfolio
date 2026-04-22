"use client";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Environment, Stars } from "@react-three/drei";
import { EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { Suspense, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Particles from "./Particles";
import ProfileFrame from "./ProfileFrame";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

function LivingGrid() {
  const { viewport } = useThree();
  const gridRef = useRef<THREE.GridHelper>(null!);
  
  const isMobile = viewport.width < 10;
  // To make grids "smaller", we increase divisions relative to the size
  const gridSize = isMobile ? 60 : 120;
  const divisions = isMobile ? 80 : 60; // More divisions on smaller size = much smaller squares

  useFrame((state) => {
    if (!gridRef.current) return;
    const scrollY = window.scrollY;
    const squareSize = gridSize / divisions; 
    gridRef.current.position.z = (scrollY * 0.04) % squareSize;
  });

  return (
    <gridHelper 
      key={isMobile ? 'mobile-grid' : 'desktop-grid'} 
      ref={gridRef}
      args={[gridSize, divisions, 0x22d3ee, 0x22d3ee]} 
      position={[0, -10, 0]} 
      onUpdate={(self) => {
        if (self.material instanceof THREE.Material) {
          self.material.transparent = true;
          self.material.opacity = isMobile ? 0.1 : 0.15;
        }
      }}
    />
  );
}

function SceneEffects() {
  const { viewport } = useThree();
  const starsRef = useRef<THREE.Group>(null!);
  const isMobile = viewport.width < 10;

  const fogColor = "#0a0a0a";

  useFrame((state) => {
    const { camera } = state;
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollY / (maxScroll || 1);

    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, -0.15 - (scrollPercent * 0.2), 0.03);
    
    const targetY = isMobile ? -scrollPercent * 3 : -scrollPercent * 4;
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.03);

    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0001;
    }
  });

  return (
    <>
      <color attach="background" args={[fogColor]} />
      <fog attach="fog" args={[fogColor, 10, isMobile ? 30 : 45]} />
      <LivingGrid />
      <group ref={starsRef}>
        <Stars radius={150} depth={50} count={isMobile ? 300 : 600} factor={1.5} saturation={0} fade speed={0.5} />
      </group>
    </>
  );
}

function ResponsiveFrame() {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null!);
  
  const isMobile = viewport.width < 10;
  
  const initialPosition: [number, number, number] = useMemo(() => {
    // Corrected placement for mobile and desktop
    if (isMobile) return [0, 0.4, 0]; // Lowered from 1.2 for mobile
    return [-viewport.width / 4, -1.2, 0]; // Lowered from -0.5 for desktop
  }, [isMobile, viewport.width]);

  const initialScale = isMobile ? 0.55 : 1;

  useGSAP(() => {
    if (!groupRef.current) return;

    gsap.set(groupRef.current.position, { 
      x: initialPosition[0], 
      y: initialPosition[1], 
      z: initialPosition[2] 
    });
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      }
    });

    tl.to(groupRef.current.position, {
      y: initialPosition[1] + 5,
      z: -10,
      ease: "none"
    });
  }, [initialPosition]);

  return (
    <group 
      ref={groupRef} 
      position={initialPosition} 
      scale={[initialScale, initialScale, initialScale]}
    >
      <ProfileFrame />
      <pointLight position={[0, 0, 2]} intensity={2.5} color="#ffffff" />
    </group>
  );
}

export default function CanvasContainer() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#22d3ee" />
        
        <Suspense fallback={null}>
          <SceneEffects />
          <Particles count={60} />
          <ResponsiveFrame />
          <Environment preset="city" />
          
          <EffectComposer>
            <Noise opacity={0.015} />
            <Vignette eskil={false} offset={0.1} darkness={0.8} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
