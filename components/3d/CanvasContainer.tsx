"use client";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Environment, Stars } from "@react-three/drei";
import { EffectComposer, Noise, Vignette, Bloom } from "@react-three/postprocessing";
import { Suspense, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Particles from "./Particles";
import ProfileFrame from "./ProfileFrame";
import SubtleMeshWaves from "./SubtleMeshWaves";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

function MouseLight() {
  const lightRef = useRef<THREE.PointLight>(null!);
  const { viewport } = useThree();

  useFrame((state) => {
    const { x, y } = state.mouse;
    // Map mouse position (-1 to 1) to viewport size
    const targetX = (x * viewport.width) / 2;
    const targetY = (y * viewport.height) / 2;
    
    lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, targetX, 0.1);
    lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, targetY, 0.1);
  });

  return (
    <pointLight 
      ref={lightRef} 
      intensity={1.5} 
      distance={20} 
      color="#22d3ee" 
      decay={2}
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

    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, -0.15 - (scrollPercent * 0.1), 0.03);
    
    const targetY = isMobile ? -scrollPercent * 3 : -scrollPercent * 4;
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.03);

    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0001;
      starsRef.current.position.y = -scrollY * 0.002;
    }
  });

  return (
    <>
      <color attach="background" args={[fogColor]} />
      <fog attach="fog" args={[fogColor, 10, isMobile ? 35 : 55]} />
      
      <SubtleMeshWaves />
      
      <group ref={starsRef}>
        <Stars radius={150} depth={50} count={isMobile ? 300 : 600} factor={1.5} saturation={0} fade speed={0.5} />
      </group>
      
      <MouseLight />
    </>
  );
}

function ResponsiveFrame() {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null!);
  
  const isMobile = viewport.width < 10;
  
  const initialPosition: [number, number, number] = useMemo(() => {
    if (isMobile) return [0, 1.2, 0];
    return [-viewport.width / 4, -1.2, 0];
  }, [isMobile, viewport.width]);

  const initialScale = isMobile ? 0.6 : 1;

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
      y: isMobile ? initialPosition[1] + 2 : initialPosition[1] + 5,
      z: isMobile ? -2 : -8,
      ease: "none"
    });
  }, [initialPosition, isMobile]);

  return (
    <group 
      ref={groupRef} 
      position={initialPosition} 
      scale={[initialScale, initialScale, initialScale]}
    >
      <ProfileFrame />
      {/* Frame specific highlight */}
      <pointLight position={[1, 1, 2]} intensity={1.5} color="#22d3ee" />
    </group>
  );
}

export default function CanvasContainer() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#0a0a0a]">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: false }}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        <ambientLight intensity={0.4} />
        
        <Suspense fallback={null}>
          <SceneEffects />
          <Particles count={100} />
          <ResponsiveFrame />
          <Environment preset="city" />
          
          <EffectComposer enableNormalPass={false}>
            <Bloom 
              intensity={0.4} 
              luminanceThreshold={0.2} 
              luminanceSmoothing={0.9} 
              height={300} 
            />
            <Noise opacity={0.012} />
            <Vignette eskil={false} offset={0.1} darkness={0.8} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
