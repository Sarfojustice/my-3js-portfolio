"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CV_DATA } from "@/data/cv";

gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const categories = [
    { title: "Languages", items: CV_DATA.skills.languages },
    { title: "Web & Frameworks", items: CV_DATA.skills.web },
    { title: "Databases", items: CV_DATA.skills.databases },
    { title: "Cloud & DevOps", items: CV_DATA.skills.cloud },
  ];

  useGSAP(() => {
    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      // Entrance - Assemble from scattered state
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
        x: index % 2 === 0 ? -100 : 100,
        z: -1000,
        rotateY: index % 2 === 0 ? 45 : -45,
        opacity: 0,
        duration: 1.5,
        ease: "expo.out",
      });

      // Hover interaction
      const onMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(card, {
          rotateY: x * 30,
          rotateX: -y * 30,
          scale: 1.05,
          duration: 0.5,
          ease: "power2.out",
        });
      };

      const onMouseLeave = () => {
        gsap.to(card, {
          rotateY: 0,
          rotateX: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
        });
      };

      card.addEventListener("mousemove", onMouseMove as any);
      card.addEventListener("mouseleave", onMouseLeave);
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="skills" className="py-32 px-6 max-w-6xl mx-auto relative z-10" style={{ perspective: "2000px" }}>
      <div className="mb-24">
        <h2 className="text-sm font-mono tracking-[0.5em] uppercase text-cyan-500/50 mb-4">
          // Core_Tech
        </h2>
        <p className="text-4xl md:text-7xl font-bold tracking-tighter text-white">
          Skill <span className="text-white/10 font-light">Matrix</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 overflow-visible">
        {categories.map((cat, index) => (
          <div 
            key={index} 
            ref={(el) => { cardRefs.current[index] = el; }}
            className="bg-[#0a0a0a] p-12 group transition-all duration-500 relative overflow-hidden"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Animated Scanning Line */}
            <div className="absolute top-0 left-0 w-full h-px bg-cyan-500/20 -translate-y-full group-hover:animate-[scan_2s_linear_infinite]" />
            
            <h3 className="text-xs font-mono mb-8 text-cyan-500/40 tracking-[0.3em] uppercase group-hover:text-cyan-400 transition-colors" style={{ transform: "translateZ(40px)" }}>
              {cat.title}
            </h3>
            
            <div className="flex flex-wrap gap-x-8 gap-y-6" style={{ transform: "translateZ(20px)" }}>
              {cat.items.map((skill, sIndex) => (
                <div key={sIndex} className="relative group/skill">
                  <span className="text-lg md:text-2xl text-white/30 group-hover/skill:text-white transition-all cursor-default font-light tracking-tight block">
                    {skill}
                  </span>
                  <div className="absolute -bottom-1 left-0 w-0 h-px bg-cyan-500/50 group-hover/skill:w-full transition-all duration-300" />
                </div>
              ))}
            </div>

            {/* Tech Decoration */}
            <div className="absolute bottom-4 right-4 text-[8px] font-mono text-white/5 uppercase tracking-widest">
              Sec_Unit_{index + 1}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1000%); }
        }
      `}</style>
    </section>
  );
}
