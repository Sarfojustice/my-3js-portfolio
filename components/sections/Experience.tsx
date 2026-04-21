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
      
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: "top 90%", // Trigger slightly later
          toggleActions: "play none none reverse",
        },
        y: 30, // Move up instead of sideways
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
      });
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="experience" className="py-24 px-6 max-w-6xl mx-auto relative z-10">
      <h2 className="text-4xl md:text-6xl font-bold mb-16 text-center tracking-tighter">
        Professional <span className="text-gray-500 italic font-light">Experience</span>
      </h2>

      <div className="space-y-12 relative">
        {/* Central Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 hidden md:block" />

        {CV_DATA.experience.map((exp, index) => (
          <div 
            key={index}
            ref={(el) => { itemsRef.current[index] = el; }}
            className={`flex flex-col md:flex-row items-center gap-8 ${
              index % 2 === 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Timeline Circle */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-white/20 border border-white/10 hidden md:block" />

            {/* Content Card */}
            <div className="w-full md:w-[45%] p-8 bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:border-white/20 transition-colors duration-500">
              <span className="text-gray-500 font-mono text-xs tracking-widest uppercase">{exp.period}</span>
              <h3 className="text-xl font-bold mt-2 text-white">{exp.role}</h3>
              <p className="text-gray-400 text-sm mb-4 font-light">{exp.company}</p>
              
              <ul className="space-y-3">
                {exp.highlights.map((highlight, hIndex) => (
                  <li key={hIndex} className="text-gray-400 text-xs flex items-start gap-3 leading-relaxed">
                    <span className="mt-1.5 w-1 h-1 bg-white/30 rounded-full shrink-0" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Spacer */}
            <div className="hidden md:block w-[45%]" />
          </div>
        ))}
      </div>
    </section>
  );
}
