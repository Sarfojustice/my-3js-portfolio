"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Environment, Stars } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Particles from "./Particles";
import ProfileFrame from "./ProfileFrame";

gsap.registerPlugin(ScrollTrigger);

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

    // Reset to initial state before creating the trigger to ensure absolute precision
    gsap.set(groupRef.current.position, { 
      x: initialPosition[0], 
      y: initialPosition[1], 
      z: initialPosition[2] 
    });
    gsap.set(groupRef.current.scale, { 
      x: initialScale, 
      y: initialScale, 
      z: initialScale 
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 1, // slightly faster scrub for better responsiveness
        invalidateOnRefresh: true,
      }
    });

    tl.to(groupRef.current.position, {
      y: initialPosition[1] + 2,
      z: -5,
      ease: "none"
    }, 0);

    tl.to(groupRef.current.scale, {
      x: 0.001,
      y: 0.001,
      z: 0.001,
      ease: "none"
    }, 0);
  }, [initialPosition, initialScale]);

  return (
    <group 
      ref={groupRef} 
      position={initialPosition} 
      scale={[initialScale, initialScale, initialScale]} 
      rotation={[0, 0.2, 0]}
    >
      <ProfileFrame />
    </group>
  );
}

export default function CanvasContainer() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#0a0a0a]">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />
        
        <Suspense fallback={null}>
          <Particles count={1500} />
          <Stars radius={100} depth={50} count={2000} factor={2} saturation={0} fade speed={0.5} />
          
          <ResponsiveFrame />

          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
