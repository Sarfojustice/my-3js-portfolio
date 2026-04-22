"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP as useGsapReact } from "@gsap/react";
import { CV_DATA } from "@/data/cv";

function DataReadout() {
  const [data, setData] = useState("");
  
  useEffect(() => {
    const interval = setInterval(() => {
      const strings = ["LOAD_CORE", "MEM_SYNC", "NET_ACTIVE", "VOID_INIT", "SRC_MAP"];
      setData(strings[Math.floor(Math.random() * strings.length)]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
      <span className="text-[8px] font-mono text-cyan-500 tracking-[0.2em] uppercase">{data}</span>
    </div>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

  useGsapReact(() => {
    // Add a slight delay to ensure preloader is fading out
    const tl = gsap.timeline({ delay: 0.8 });
    
    const scrambleText = (el: HTMLElement, finalResult: string) => {
      const chars = "!<>-_\\/[]{}—=+*^?#________";
      let iteration = 0;
      const interval = setInterval(() => {
        el.innerText = finalResult
          .split("")
          .map((letter, index) => {
            if (index < iteration) return finalResult[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");

        if (iteration >= finalResult.length) clearInterval(interval);
        iteration += 1 / 3;
      }, 30);
    };

    tl.from(".reveal-text", {
      y: 30,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: "power3.out",
      onStart: () => {
        if (nameRef.current) {
          const first = CV_DATA.name.split(" ")[0];
          const firstEl = nameRef.current.querySelector(".name-first") as HTMLElement;
          if (firstEl) scrambleText(firstEl, first);
        }
      }
    });

    tl.from(".reveal-btn", {
      y: 10,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out"
    }, "-=0.8");

    tl.from(".cyber-line", {
      scaleX: 0,
      duration: 1.5,
      ease: "power4.inOut"
    }, 0);
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef}
      id="hero"
      className="relative min-h-[100dvh] flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 px-6 py-12 md:py-0 overflow-hidden"
    >
      {/* Decorative Cyber Grid Background Element */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 cyber-line origin-left hidden md:block" />
      
      {/* Image Spacer (for 3D Frame) */}
      <div className="w-full md:w-1/2 h-[280px] sm:h-[350px] md:h-screen flex items-center justify-center pointer-events-none relative z-10 shrink-0">
        <div className="w-full h-full max-w-[500px] border border-white/5 rounded-lg opacity-0" />
      </div>

      {/* Content */}
      <div className="w-full md:w-1/2 text-center md:text-left z-20 relative flex flex-col justify-center">
        {/* Tech Decor */}
        <div className="absolute -top-16 -left-8 hidden lg:block">
          <DataReadout />
          <div className="w-px h-12 bg-gradient-to-b from-cyan-500/50 to-transparent mt-2 ml-0.5" />
        </div>

        <div className="relative inline-block px-4 py-2 mb-4 md:mb-6 self-center md:self-start">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/50" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/50" />
          <h2 className="reveal-text text-gray-500 text-[9px] md:text-[10px] font-mono tracking-[0.3em] md:tracking-[0.5em] uppercase">
            Full Stack Engineer & Cloud Practitioner // 01
          </h2>
        </div>

        <h1 ref={nameRef} className="reveal-text text-white text-5xl sm:text-6xl lg:text-8xl xl:text-9xl font-bold mb-4 md:mb-8 leading-[1.1] md:leading-[0.9] tracking-tighter">
          <span className="name-first">{CV_DATA.name.split(" ")[0]}</span> <br />
          <span className="text-white/20 italic font-light">
            {CV_DATA.name.split(" ").slice(1).join(" ")}
          </span>
        </h1>
        
        <p className="reveal-text text-gray-400 text-sm md:text-xl max-w-lg mb-8 md:mb-12 leading-relaxed font-light tracking-tight border-l-2 md:border-l border-white/10 pl-6 mx-auto md:mx-0">
          {CV_DATA.about}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center md:justify-start items-center">
          <button className="reveal-btn w-full sm:w-auto group relative px-8 py-4 bg-white text-black text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-cyan-500 hover:text-white overflow-hidden">
            <span className="relative z-10">Access_Experience</span>
            <div className="absolute inset-0 bg-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
          <button className="reveal-btn w-full sm:w-auto group relative px-8 py-4 border border-white/10 text-white text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:border-white">
            Establish_Contact
          </button>
        </div>
      </div>
    </section>
  );
}
