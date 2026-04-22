"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CV_DATA } from "@/data/cv";
import { Award, CheckCircle2 } from "lucide-react";

export default function Certifications() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".cert-card", {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      y: 30,
      opacity: 0,
      duration: 1.2,
      ease: "power2.out",
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="certifications" className="py-20 md:py-24 px-6 max-w-4xl mx-auto relative z-10">
      <h2 className="text-4xl md:text-6xl font-bold mb-12 md:mb-16 text-center tracking-tighter">
        Specialized <span className="text-gray-500 font-light italic">Certifications</span>
      </h2>

      {CV_DATA.certifications.map((cert, index) => (
        <div 
          key={index} 
          className="cert-card p-6 md:p-10 bg-white/[0.02] border border-white/5 backdrop-blur-sm relative overflow-hidden group hover:border-white/20 transition-all duration-500"
        >
          {/* Decorative background icon */}
          <Award className="absolute -right-12 -bottom-12 w-64 h-64 text-white/[0.02] rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{cert.title}</h3>
              <p className="text-gray-500 font-mono text-sm tracking-widest uppercase">{cert.issuer}</p>
            </div>
            <span className="px-3 py-1 bg-white/5 text-white border border-white/10 text-[10px] font-mono tracking-widest uppercase">
              {cert.date}
            </span>
          </div>

          <p className="text-gray-400 mb-8 max-w-2xl text-sm leading-relaxed font-light">
            Completed intensive, hands-on deep learning projects covering real-world computer vision tasks:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cert.projects.map((project, pIndex) => (
              <div key={pIndex} className="flex items-center gap-3 text-gray-300 text-xs font-light">
                <CheckCircle2 className="w-4 h-4 text-white/40" />
                <span>{project}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
