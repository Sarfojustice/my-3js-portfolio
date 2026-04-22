"use client";

import { CV_DATA } from "@/data/cv";
import { Mail, Phone, MessageSquare, ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header Animation
    gsap.fromTo(".contact-header", 
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-header",
          start: "top 95%",
          toggleActions: "play none none reverse",
        }
      }
    );

    // Nodes Animation - Individual trigger for each node
    const nodes = gsap.utils.toArray(".contact-node");
    nodes.forEach((node: any) => {
      gsap.fromTo(node,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: node,
            start: "top 92%",
            toggleActions: "play none none reverse",
          }
        }
      );
    });
  }, { scope: containerRef });

  return (
    <footer ref={containerRef} id="contact" className="py-24 md:py-32 px-6 max-w-6xl mx-auto relative z-20">
      <div className="text-center mb-16 md:mb-24 contact-header">
        <h2 className="text-[10px] font-mono tracking-[0.5em] uppercase text-cyan-500/50 mb-4">
          // Connection_Protocol
        </h2>
        <p className="text-5xl md:text-8xl font-bold tracking-tighter text-white leading-tight">
          Get In <span className="text-white/10 font-light italic">Touch</span>
        </p>
        <p className="text-gray-500 text-base md:text-lg mt-8 max-w-xl mx-auto leading-relaxed font-light">
          Establish a secure connection via any of the nodes below. I am available for global collaborations and innovative projects.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-24">
        {[
          { icon: Mail, label: "Email", value: CV_DATA.contact.email, href: `mailto:${CV_DATA.contact.email}`, node: "01" },
          { icon: GithubIcon, label: "GitHub", value: "sarfojustice", href: CV_DATA.contact.github, node: "02" },
          { icon: LinkedinIcon, label: "LinkedIn", value: "Justice Osei Sarfo", href: CV_DATA.contact.linkedin, node: "03" },
          { icon: Phone, label: "Phone", value: CV_DATA.contact.phone, href: `tel:${CV_DATA.contact.phone}`, node: "04" }
        ].map((item, index) => (
          <a 
            key={index}
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="contact-node group relative flex flex-col items-center justify-center p-12 md:p-16 bg-black/70 border border-white/10 backdrop-blur-xl hover:border-cyan-500/40 transition-all duration-500 rounded-3xl shadow-2xl overflow-hidden min-h-[250px]"
          >
            <div className="absolute top-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-0 translate-x-2">
              <ArrowUpRight className="w-6 h-6 text-cyan-500" />
            </div>
            
            <div className="mb-8 relative">
              <item.icon className="w-10 h-10 text-gray-500 group-hover:text-cyan-500 transition-all duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="text-center relative z-10 w-full">
              <span className="block text-[10px] font-mono tracking-[0.4em] uppercase text-gray-600 group-hover:text-cyan-500/50 mb-3">Node_{item.node}</span>
              <span className="block text-sm font-mono tracking-widest uppercase text-white/40 group-hover:text-white transition-colors mb-4">{item.label}</span>
              <span className="text-[11px] md:text-sm font-mono text-cyan-500/70 group-hover:text-cyan-400 break-words w-full block mx-auto leading-relaxed">
                {item.value}
              </span>
            </div>
          </a>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-white/10">
        <div className="text-gray-600 text-[9px] font-mono tracking-[0.3em] uppercase order-2 md:order-1">
          &copy; {new Date().getFullYear()} {CV_DATA.name} // Core_System_V1.0
        </div>
        <div className="flex items-center gap-6 order-1 md:order-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-[8px] font-mono text-cyan-500 tracking-[0.2em] uppercase">System_Active</span>
          </div>
          <div className="h-px w-8 bg-white/10 hidden md:block" />
          <span className="text-[8px] font-mono text-gray-600 tracking-[0.2em] uppercase">Built with Next.js & Three.js</span>
        </div>
      </div>
    </footer>
  );
}
