"use client";

import { useState, useEffect } from "react";
import { CV_DATA } from "@/data/cv";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false }));
    }, 1000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(timer);
    };
  }, []);

  const navLinks = [
    { name: "Exp", href: "#experience" },
    { name: "Stack", href: "#skills" },
    { name: "Cert", href: "#certifications" },
    { name: "Link", href: "#contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${
      isScrolled ? "bg-background/80 backdrop-blur-md py-4" : "bg-transparent py-8"
    }`}>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="max-w-[1800px] mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-accent/40 flex items-center justify-center relative">
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-accent" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-accent" />
            <span className="text-foreground font-bold text-xs">JS</span>
          </div>
          <div className="hidden lg:block">
            <div className="text-[8px] font-mono text-accent/60 uppercase leading-none mb-1">Status</div>
            <div className="text-[10px] font-mono text-foreground uppercase tracking-widest leading-none">System_Active</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="group relative px-6 py-2"
            >
              <div className="absolute inset-0 border border-foreground/0 group-hover:border-foreground/10 group-hover:bg-foreground/[0.02] transition-all duration-300" />
              <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-text-muted group-hover:text-accent transition-colors">
                {link.name}
              </div>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden xl:flex flex-col items-end">
            <div className="text-[8px] font-mono text-accent/60 uppercase leading-none mb-1">Local_Time</div>
            <div className="text-xs font-mono text-foreground leading-none tracking-widest">{time || "00:00:00"}</div>
          </div>
          
          <button 
            className="md:hidden w-10 h-10 flex items-center justify-center border border-foreground/5 hover:border-accent/40 transition-colors z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Full-screen Mobile Menu */}
      <div className={`fixed inset-0 bg-background/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8 transition-all duration-500 md:hidden ${
        isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-y-10"
      }`}>
        <div className="flex flex-col items-center gap-12">
          {navLinks.map((link, index) => (
            <a 
              key={link.name} 
              href={link.href}
              className={`text-2xl font-mono text-text-muted hover:text-accent tracking-[0.4em] uppercase transition-all duration-500 delay-[${index * 100}ms] ${
                isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
        
        <div className={`mt-12 flex flex-col items-center gap-2 transition-all duration-700 delay-500 ${
          isMobileMenuOpen ? "opacity-40" : "opacity-0"
        }`}>
          <div className="text-[8px] font-mono uppercase tracking-[0.5em]">System_Status</div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-accent">Connected_Ready</div>
        </div>
      </div>
    </nav>
  );
}
