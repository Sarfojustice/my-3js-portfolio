"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CV_DATA } from "@/data/cv";
import { ExternalLink } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    // Header Animation
    gsap.from(".experience-header", {
      scrollTrigger: {
        trigger: ".experience-header",
        start: "top 95%",
        toggleActions: "play none none reverse",
      },
      y: 30,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });

    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    itemsRef.current.forEach((item, index) => {
      if (!item) return;
      
      const content = item.querySelector(".experience-content") as HTMLElement;
      const line = item.querySelector(".experience-line");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 92%",
          toggleActions: "play none none reverse",
        }
      });

      tl.fromTo(line, 
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 1, duration: 1, ease: "power4.out" }
      )
      .fromTo(content,
        { 
          z: isTouchDevice ? 0 : -100, 
          rotateX: isTouchDevice ? 0 : -20, 
          opacity: 0, 
          y: 50 
        },
        { 
          z: 0, 
          rotateX: 0, 
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          ease: "expo.out" 
        }, 
        "-=0.6"
      );

      if (!isTouchDevice) {
        const onMouseMove = (e: MouseEvent) => {
          if (!content) return;
          const rect = content.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;

          gsap.to(content, {
            rotateY: x * 15,
            rotateX: -y * 15,
            z: 30,
            duration: 0.6,
            ease: "power2.out",
          });
        };

        const onMouseLeave = () => {
          gsap.to(content, {
            rotateY: 0,
            rotateX: 0,
            z: 0,
            duration: 0.8,
            ease: "power2.out",
          });
        };

        content?.addEventListener("mousemove", onMouseMove as any);
        content?.addEventListener("mouseleave", onMouseLeave);
      }
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="experience" className="py-20 md:py-32 px-6 max-w-6xl mx-auto relative z-20">
      <div className="mb-16 md:mb-24 experience-header text-center md:text-left">
        <h2 className="text-xs font-mono tracking-[0.5em] uppercase text-cyan-500/50 mb-4">
          // Data_Stream
        </h2>
        <p className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter text-white">
          Experience <span className="text-white/10 font-light">Logs</span>
        </p>
      </div>

      <div className="space-y-16 md:space-y-32 relative" style={{ perspective: "1500px" }}>
        {CV_DATA.experience.map((exp, index) => (
          <div 
            key={index}
            ref={(el) => { itemsRef.current[index] = el; }}
            className="group relative pl-8 md:pl-20 py-4"
          >
            <div className="experience-line absolute left-0 top-0 bottom-0 w-[2px] bg-white/5 group-hover:bg-cyan-500/50 transition-colors duration-700 origin-top">
              <div className="absolute top-0 left-0 w-full h-1/4 bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
            </div>
            
            <div className="experience-content p-6 md:p-10 bg-white/[0.02] border border-white/5 backdrop-blur-[4px] relative group-hover:bg-white/[0.04] group-hover:border-white/20 transition-all duration-500" style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}>
              {/* Corner Accents */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-cyan-500/30" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-cyan-500/30" />

              <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4 gap-2" style={{ transform: "translateZ(30px)" }}>
                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors">{exp.role}</h3>
                <span className="text-[10px] font-mono text-cyan-500/40 tracking-[0.3em] uppercase">{exp.period}</span>
              </div>
              
              <div className="flex items-center justify-between mb-8 md:mb-10" style={{ transform: "translateZ(20px)" }}>
                <p className="text-cyan-500/70 font-mono text-xs uppercase tracking-[0.4em]">{exp.company}</p>
                
                {/* @ts-ignore */}
                {exp.url && (
                  /* @ts-ignore */
                  <a 
                    href={exp.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="relative z-50 pointer-events-auto flex items-center gap-2 text-[10px] font-mono text-white/40 hover:text-cyan-400 transition-colors group/link px-2 py-1"
                  >
                    <span className="tracking-widest relative">
                      [VISIT]
                    </span>
                    <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                )}
              </div>
              
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8" style={{ transform: "translateZ(10px)" }}>
                {exp.highlights.map((highlight, hIndex) => (
                  <li key={hIndex} className="text-gray-400 text-sm leading-relaxed border-l border-white/10 pl-6 hover:border-cyan-500/50 hover:text-white transition-all">
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
