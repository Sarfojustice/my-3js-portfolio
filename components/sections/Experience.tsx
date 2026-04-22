"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CV_DATA } from "@/data/cv";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    itemsRef.current.forEach((item, index) => {
      if (!item) return;
      
      const content = item.querySelector(".experience-content");
      const line = item.querySelector(".experience-line");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          toggleActions: "play none none reverse",
        }
      });

      tl.from(line, {
        scaleY: 0,
        transformOrigin: "top",
        duration: 1,
        ease: "power3.out",
      })
      .from(content, {
        y: 40,
        rotateX: -15,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.6");
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="experience" className="py-32 px-6 max-w-6xl mx-auto relative z-10">
      <div className="mb-24">
        <h2 className="text-sm font-mono tracking-[0.3em] uppercase text-gray-500 mb-4">
          History
        </h2>
        <p className="text-4xl md:text-6xl font-bold tracking-tighter">
          Professional <span className="text-white/30 italic font-light">Experience</span>
        </p>
      </div>

      <div className="space-y-24 relative" style={{ perspective: "1000px" }}>
        {CV_DATA.experience.map((exp, index) => (
          <div 
            key={index}
            ref={(el) => { itemsRef.current[index] = el; }}
            className="group relative pl-8 md:pl-12"
          >
            <div className="experience-line absolute left-0 top-0 bottom-0 w-px bg-white/10 group-hover:bg-cyan-500 transition-colors duration-500" />
            
            <div className="experience-content">
              <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4">
                <h3 className="text-2xl font-bold text-white tracking-tight">{exp.role}</h3>
                <span className="text-xs font-mono text-gray-500 tracking-widest uppercase">{exp.period}</span>
              </div>
              
              <p className="text-cyan-500 font-mono text-xs uppercase tracking-widest mb-6">{exp.company}</p>
              
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exp.highlights.map((highlight, hIndex) => (
                  <li key={hIndex} className="text-gray-400 text-sm leading-relaxed border-l border-white/5 pl-4 hover:border-white/20 transition-colors">
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
