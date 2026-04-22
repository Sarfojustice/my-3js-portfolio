"use client";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Environment, Stars, Float, Text } from "@react-three/drei";
import { EffectComposer, Noise, Vignette, Bloom } from "@react-three/postprocessing";
import { Suspense, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Particles from "./Particles";
import ProfileFrame from "./ProfileFrame";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

function CodeMonoliths() {
  const monoliths = useMemo(() => {
    const symbols = ["{ }", "[ ]", "< >", "//", "=>", "++"];
    return Array.from({ length: 8 }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
      ] as [number, number, number],
      text: symbols[Math.floor(Math.random() * symbols.length)],
      speed: 0.1 + Math.random() * 0.1,
    }));
  }, []);

  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!groupRef.current) return;
    const scrollY = window.scrollY;
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, scrollY * 0.004, 0.05);
  });

  return (
    <group ref={groupRef}>
      {monoliths.map((item, i) => (
        <group key={i} position={item.position}>
          <Float speed={item.speed * 5} rotationIntensity={0.5} floatIntensity={0.5}>
            <Text
              fontSize={0.2}
              color="#22d3ee"
              fillOpacity={0.04}
            >
              {item.text}
            </Text>
          </Float>
        </group>
      ))}
    </group>
  );
}

function ScanningBeam() {
  const beamRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!beamRef.current) return;
    const t = state.clock.getElapsedTime();
    beamRef.current.position.y = Math.sin(t * 0.3) * 12;
    beamRef.current.rotation.x = Math.PI / 2;
  });

  return (
    <mesh ref={beamRef}>
      <planeGeometry args={[100, 0.2]} />
      <meshBasicMaterial 
        color="#22d3ee" 
        transparent 
        opacity={0.03} 
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function LivingGrid() {
  const gridRef = useRef<THREE.GridHelper>(null!);

  useFrame((state) => {
    if (!gridRef.current) return;
    const scrollY = window.scrollY;
    gridRef.current.position.z = (scrollY * 0.01) % 2;
  });

  return (
    <gridHelper 
      ref={gridRef}
      args={[120, 40, 0x22d3ee, 0x0a0a0a]} 
      position={[0, -10, 0]} 
      onUpdate={(self) => {
        if (self.material instanceof THREE.Material) {
          self.material.transparent = true;
          self.material.opacity = 0.08;
        }
      }}
    />
  );
}

function SceneEffects() {
  const { camera } = useThree();
  const starsRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollY / (maxScroll || 1);

    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, -scrollPercent * 0.3, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, -scrollPercent * 6, 0.03);

    if (starsRef.current) {
      starsRef.current.position.y = scrollY * 0.001;
      starsRef.current.rotation.y += 0.0001;
    }
  });

  return (
    <>
      <fog attach="fog" args={["#0a0a0a", 15, 30]} />
      <LivingGrid />
      <ScanningBeam />
      <group ref={starsRef}>
        <Stars radius={150} depth={50} count={600} factor={1.5} saturation={0} fade speed={0.5} />
      </group>
    </>
  );
}

function ResponsiveFrame() {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null!);
  
  const isMobile = viewport.width < 10;
  
  const initialPosition: [number, number, number] = useMemo(() => {
    if (isMobile) return [0, 2, 0];
    return [-viewport.width / 4, 0, 0];
  }, [isMobile, viewport.width]);

  const initialScale = isMobile ? 0.7 : 1;

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
        scrub: 1.5,
      }
    });

    tl.to(groupRef.current.position, {
      y: initialPosition[1] + 5,
      z: -10,
      ease: "none"
    });
  }, [initialPosition]);

  return (
    <group ref={groupRef} position={initialPosition} scale={[initialScale, initialScale, initialScale]}>
      <ProfileFrame />
      <pointLight position={[0, 0, 2]} intensity={2} color="#ffffff" />
    </group>
  );
}

export default function CanvasContainer() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#0a0a0a]">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#22d3ee" />
        
        <Suspense fallback={null}>
          <SceneEffects />
          <Particles count={80} />
          <CodeMonoliths />
          <ResponsiveFrame />
          <Environment preset="city" />
          
          <EffectComposer>
            <Bloom luminanceThreshold={1} intensity={0.5} mipmapBlur />
            <Noise opacity={0.015} />
            <Vignette eskil={false} offset={0.1} darkness={0.8} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
