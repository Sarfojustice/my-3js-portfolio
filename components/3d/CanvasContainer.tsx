"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Environment, Stars, Float, Text } from "@react-three/drei";
import { EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { Suspense, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Particles from "./Particles";
import ProfileFrame from "./ProfileFrame";

gsap.registerPlugin(ScrollTrigger);

function FloatingData() {
  const data = useMemo(() => {
    const symbols = ["{ }", "[ ]", "< >", "//", "=>", "++", "( )", "??"];
    return Array.from({ length: 12 }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 8,
      ] as [number, number, number],
      text: symbols[Math.floor(Math.random() * symbols.length)],
      speed: 0.5 + Math.random() * 0.5,
    }));
  }, []);

  return (
    <>
      {data.map((item, i) => (
        <Float key={i} speed={item.speed} rotationIntensity={0.2} floatIntensity={0.5}>
          <Text
            position={item.position}
            fontSize={0.2}
            color="#22d3ee"
            opacity={0.08}
            transparent
            depthWrite={false}
          >
            {item.text}
          </Text>
        </Float>
      ))}
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
        scrub: 1,
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
      {/* Light specific to the frame */}
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
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        
        <Suspense fallback={null}>
          <gridHelper 
            args={[40, 40, 0x22d3ee, 0x111111]} 
            position={[0, -10, 0]} 
            rotation={[0, 0, 0]} 
          />
          
          <Particles count={150} />
          <FloatingData />
          
          <Stars radius={100} depth={50} count={500} factor={1} saturation={0} fade speed={0.1} />
          
          <ResponsiveFrame />

          <Environment preset="city" />

          <EffectComposer>
            <Noise opacity={0.02} />
            <Vignette eskil={false} offset={0.1} darkness={0.8} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
