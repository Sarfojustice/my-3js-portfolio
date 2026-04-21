"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CV_DATA } from "@/data/cv";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from(textRef.current?.children || [], {
      y: 50, // Reduced from 100
      opacity: 0,
      duration: 1.5, // Slower
      stagger: 0.1, // Reduced stagger
      ease: "power2.out"
    });
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex flex-col md:flex-row items-end md:items-center justify-center gap-12 px-6 py-24 overflow-hidden"
    >
      {/* 3D Frame Container Space (Height for mobile) */}
      <div className="w-full md:w-1/2 h-[350px] md:h-[600px] flex items-center justify-center pointer-events-none">
        <div className="w-full h-full" />
      </div>

      {/* Hero Text */}
      <div ref={textRef} className="w-full md:w-1/2 text-center md:text-left z-20 mix-blend-difference pb-12 md:pb-0">
        <h2 className="text-gray-400 text-sm font-mono mb-4 tracking-[0.3em] uppercase">
          Full Stack Engineer
        </h2>
        <h1 className="text-white text-6xl md:text-8xl font-bold mb-6 leading-tight tracking-tighter">
          {CV_DATA.name.split(" ")[0]} <br />
          <span className="text-gray-500 italic">
            {CV_DATA.name.split(" ").slice(1).join(" ")}
          </span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-light">
          {CV_DATA.about}
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <button className="px-8 py-4 bg-white text-black text-sm font-bold rounded-none transition-all duration-300 hover:bg-gray-200">
            VIEW EXPERIENCE
          </button>
          <button className="px-8 py-4 border border-white/20 text-white text-sm font-bold rounded-none transition-all duration-300 hover:border-white">
            CONTACT ME
          </button>
        </div>
      </div>
    </section>
  );
}
