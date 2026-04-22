"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CV_DATA } from "@/data/cv";
import { Award, ShieldCheck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Certifications() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header Animation
    gsap.fromTo(".cert-header", 
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".cert-header",
          start: "top 95%",
          toggleActions: "play none none reverse",
        }
      }
    );

    // Cards Animation - Individual trigger for each card
    const cards = gsap.utils.toArray(".cert-card");
    cards.forEach((card: any) => {
      gsap.fromTo(card,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none reverse",
          }
        }
      );
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="certifications" className="py-24 md:py-32 px-6 max-w-5xl mx-auto relative z-20">
      <div className="mb-16 md:mb-24 text-center cert-header">
        <h2 className="text-[10px] font-mono tracking-[0.5em] uppercase text-cyan-500/50 mb-4">
          // Verification_Status
        </h2>
        <p className="text-5xl md:text-8xl font-bold tracking-tighter text-white leading-tight">
          Specialized <span className="text-white/10 font-light italic">Credentials</span>
        </p>
      </div>

      <div className="space-y-8">
        {CV_DATA.certifications.map((cert, index) => (
          <div 
            key={index} 
            className="cert-card p-8 md:p-14 bg-black/70 border border-white/10 backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-700 rounded-2xl shadow-2xl"
          >
            {/* Decorative background icon */}
            <Award className="absolute -right-16 -bottom-16 w-80 h-80 text-white/[0.01] rotate-12 group-hover:rotate-0 transition-transform duration-1000 group-hover:text-cyan-500/[0.03]" />
            
            <div className="absolute top-0 left-0 p-6 opacity-40">
              <ShieldCheck className="w-6 h-6 text-cyan-500" />
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6 relative z-10">
              <div>
                <span className="text-[10px] font-mono text-cyan-500/50 tracking-[0.4em] uppercase mb-2 block">{cert.issuer}</span>
                <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors leading-none">{cert.title}</h3>
              </div>
              <div className="px-5 py-2 bg-white/[0.05] border border-white/10 text-white/70 text-[11px] font-mono tracking-[0.3em] uppercase group-hover:border-cyan-500/30 group-hover:text-cyan-500 transition-colors rounded-sm">
                {cert.date}
              </div>
            </div>

            <p className="text-gray-300 mb-10 max-w-3xl text-base md:text-lg leading-relaxed font-light relative z-10">
              Successfully completed rigorous validation projects and technical assessments. Key domains include:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 relative z-10">
              {cert.projects.map((project, pIndex) => (
                <div key={pIndex} className="flex items-center gap-4 text-gray-300 group/item">
                  <div className="w-2 h-2 rounded-full bg-cyan-500/30 group-hover/item:bg-cyan-500 transition-colors shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
                  <span className="text-sm md:text-base font-light tracking-wide group-hover/item:text-white transition-colors">{project}</span>
                </div>
              ))}
            </div>

            {/* Bottom Tech Detail */}
            <div className="absolute bottom-6 right-10 text-[8px] font-mono text-white/5 uppercase tracking-[0.4em]">
              Auth_Node: CERT_0{index + 1}_STABLE
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
