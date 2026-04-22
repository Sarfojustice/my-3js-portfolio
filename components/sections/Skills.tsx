"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CV_DATA } from "@/data/cv";

gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header Animation
    gsap.fromTo(".skills-header", 
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".skills-header",
          start: "top 95%",
          toggleActions: "play none none reverse",
        }
      }
    );

    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    // Cards Animation - Individual trigger for each card
    const cards = gsap.utils.toArray(".skill-card");
    cards.forEach((card: any) => {
      gsap.fromTo(card,
        { 
          y: 80, 
          opacity: 0,
          rotateX: isTouchDevice ? 0 : -15,
          z: isTouchDevice ? 0 : -500 
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          z: 0,
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            start: "top 92%",
            toggleActions: "play none none reverse",
          }
        }
      );

      if (!isTouchDevice) {
        // Hover interaction
        const onMouseMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;

          gsap.to(card, {
            rotateY: x * 20,
            rotateX: -y * 20,
            z: 20,
            duration: 0.5,
            ease: "power2.out",
          });
        };

        const onMouseLeave = () => {
          gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            z: 0,
            duration: 0.8,
            ease: "power2.out",
          });
        };

        card.addEventListener("mousemove", onMouseMove as any);
        card.addEventListener("mouseleave", onMouseLeave);
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="skills" className="py-24 md:py-32 px-6 max-w-6xl mx-auto relative z-20" style={{ perspective: "2000px" }}>
      <div className="mb-16 md:mb-24 text-center md:text-left skills-header">
        <h2 className="text-[10px] font-mono tracking-[0.5em] uppercase text-cyan-500/50 mb-4">
          // Core_Tech_Matrix
        </h2>
        <p className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter text-white leading-tight">
          Skill <span className="text-white/10 font-light italic">Vault</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {Object.entries(CV_DATA.skills).map(([key, items], index) => (
          <div 
            key={key} 
            className="skill-card bg-black/60 border border-white/10 backdrop-blur-xl p-8 md:p-14 group transition-all duration-700 relative overflow-hidden rounded-2xl shadow-2xl"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Animated Scanning Line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-500/30 -translate-y-full group-hover:animate-[scan_3s_linear_infinite] opacity-0 group-hover:opacity-100" />
            
            <h3 className="text-[10px] font-mono mb-10 text-cyan-500/40 tracking-[0.4em] uppercase group-hover:text-cyan-400 transition-colors" style={{ transform: "translateZ(30px)" }}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </h3>
            
            <div className="flex flex-wrap gap-x-6 md:gap-x-12 gap-y-4 md:gap-y-8" style={{ transform: "translateZ(15px)" }}>
              {items.map((skill, sIndex) => (
                <div key={sIndex} className="relative group/skill">
                  <span className="text-xl md:text-3xl text-white/20 group-hover/skill:text-white transition-all cursor-default font-light tracking-tighter block leading-none">
                    {skill}
                  </span>
                  <div className="absolute -bottom-2 left-0 w-0 h-px bg-cyan-500/50 group-hover/skill:w-full transition-all duration-300" />
                </div>
              ))}
            </div>

            {/* Tech Decoration */}
            <div className="absolute bottom-6 right-8 text-[7px] font-mono text-white/5 uppercase tracking-[0.3em]">
              Node_Identifier_0{index + 1}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1500%); }
        }
      `}</style>
    </section>
  );
}
