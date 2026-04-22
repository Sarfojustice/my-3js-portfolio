"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function TechHUD() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 20;
      const yPos = (clientY / window.innerHeight - 0.5) * 20;

      gsap.to(".hud-element", {
        x: (i) => xPos * (i + 1) * 0.5,
        y: (i) => yPos * (i + 1) * 0.5,
        duration: 2,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[5] overflow-hidden opacity-20">
      {/* Corner Brackets */}
      <div className="hud-element absolute top-12 left-12 w-8 h-8 border-t border-l border-white" />
      <div className="hud-element absolute top-12 right-12 w-8 h-8 border-t border-r border-white" />
      <div className="hud-element absolute bottom-12 left-12 w-8 h-8 border-b border-l border-white" />
      <div className="hud-element absolute bottom-12 right-12 w-8 h-8 border-b border-r border-white" />

      {/* Floating Crosshairs */}
      <div className="hud-element absolute top-1/4 left-1/4 w-4 h-4">
        <div className="absolute top-1/2 left-0 w-full h-px bg-white/40" />
        <div className="absolute top-0 left-1/2 w-px h-full bg-white/40" />
      </div>
      <div className="hud-element absolute bottom-1/4 right-1/4 w-4 h-4">
        <div className="absolute top-1/2 left-0 w-full h-px bg-white/40" />
        <div className="absolute top-0 left-1/2 w-px h-full bg-white/40" />
      </div>

      {/* Side Scanners */}
      <div className="hud-element absolute top-1/2 left-6 -translate-y-1/2 flex flex-col gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-1 h-1 bg-white/40" />
        ))}
      </div>
      <div className="hud-element absolute top-1/2 right-6 -translate-y-1/2 flex flex-col gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-1 h-1 bg-white/40" />
        ))}
      </div>
    </div>
  );
}
