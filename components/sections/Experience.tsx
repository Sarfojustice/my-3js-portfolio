"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CV_DATA } from "@/data/cv";
import { ExternalLink, Terminal } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    // Header Animation
    gsap.fromTo(".experience-header", 
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".experience-header",
          start: "top 95%",
          toggleActions: "play none none reverse",
        }
      }
    );

    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    // Items Animation - Individual trigger for each item
    const items = gsap.utils.toArray(".experience-item");
    items.forEach((item: any) => {
      const content = item.querySelector(".experience-content");
      const line = item.querySelector(".experience-line");

      gsap.fromTo(line, 
        { scaleY: 0, opacity: 0 },
        { 
          scaleY: 1, 
          opacity: 1, 
          duration: 1, 
          ease: "power4.out",
          scrollTrigger: {
            trigger: item,
            start: "top 92%",
            toggleActions: "play none none reverse",
          }
        }
      );

      gsap.fromTo(content,
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
          ease: "expo.out",
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            toggleActions: "play none none reverse",
          }
        }
      );

      if (!isTouchDevice && content) {
        const onMouseMove = (e: MouseEvent) => {
          const rect = (content as HTMLElement).getBoundingClientRect();
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

        content.addEventListener("mousemove", onMouseMove as any);
        content.addEventListener("mouseleave", onMouseLeave);
      }
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="experience" className="py-24 md:py-32 px-6 max-w-6xl mx-auto relative z-20">
      <div className="mb-16 md:mb-24 experience-header text-center md:text-left">
        <h2 className="text-[10px] font-mono tracking-[0.5em] uppercase text-cyan-500/50 mb-4">
          // Data_Stream_02
        </h2>
        <p className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter text-white leading-tight">
          Experience <span className="text-white/10 font-light italic">Logs</span>
        </p>
      </div>

      <div className="space-y-12 md:space-y-24 relative" style={{ perspective: "1500px" }}>
        {CV_DATA.experience.map((exp, index) => (
          <div 
            key={index}
            className="experience-item group relative pl-8 md:pl-20 py-2"
          >
            <div className="experience-line absolute left-0 top-0 bottom-0 w-[1px] md:w-[2px] bg-white/5 group-hover:bg-cyan-500/50 transition-colors duration-700 origin-top">
              <div className="absolute top-0 left-0 w-full h-1/4 bg-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
            </div>
            
            <div className="experience-content p-8 md:p-12 bg-black/40 border border-white/10 backdrop-blur-md relative group-hover:bg-black/60 group-hover:border-cyan-500/30 transition-all duration-700 rounded-lg shadow-2xl" style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}>
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 p-3 opacity-30">
                <Terminal className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-cyan-500/20 group-hover:border-cyan-500/50 transition-colors rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-cyan-500/20 group-hover:border-cyan-500/50 transition-colors rounded-bl-lg" />

              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4" style={{ transform: "translateZ(30px)" }}>
                <div>
                  <span className="text-[9px] font-mono text-cyan-500/50 tracking-[0.4em] uppercase mb-2 block">{exp.period}</span>
                  <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors leading-none">{exp.role}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-white/40 font-mono text-xs uppercase tracking-[0.2em]">{exp.company}</p>
                  
                  {/* @ts-ignore */}
                  {exp.url && (
                    <a 
                      href={exp.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="relative z-50 pointer-events-auto flex items-center justify-center w-8 h-8 border border-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all text-white/20 hover:text-cyan-400"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
              
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12" style={{ transform: "translateZ(15px)" }}>
                {exp.highlights.map((highlight, hIndex) => (
                  <li key={hIndex} className="text-gray-400 text-sm md:text-base leading-relaxed border-l-2 border-white/5 pl-6 hover:border-cyan-500/30 hover:text-gray-200 transition-all">
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
