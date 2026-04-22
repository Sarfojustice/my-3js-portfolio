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
      isScrolled ? "bg-[#0a0a0a]/80 backdrop-blur-md py-4" : "bg-transparent py-8"
    }`}>
      {/* Decorative Cyber Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      <div className="max-w-[1800px] mx-auto px-6 flex items-center justify-between">
        {/* Logo / System Branding */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-cyan-500/40 flex items-center justify-center relative">
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-cyan-500" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-cyan-500" />
            <span className="text-white font-bold text-xs">JS</span>
          </div>
          <div className="hidden lg:block">
            <div className="text-[8px] font-mono text-cyan-500/60 uppercase leading-none mb-1">Status</div>
            <div className="text-[10px] font-mono text-white uppercase tracking-widest leading-none">System_Active</div>
          </div>
        </div>

        {/* Desktop HUD Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="group relative px-6 py-2"
            >
              <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 group-hover:bg-white/[0.02] transition-all duration-300" />
              <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-gray-500 group-hover:text-cyan-400 transition-colors">
                {link.name}
              </div>
            </a>
          ))}
        </div>

        {/* System Time / Meta */}
        <div className="flex items-center gap-8">
          <div className="hidden xl:flex flex-col items-end">
            <div className="text-[8px] font-mono text-cyan-500/60 uppercase leading-none mb-1">Local_Time</div>
            <div className="text-xs font-mono text-white leading-none tracking-widest">{time || "00:00:00"}</div>
          </div>
          
          <button 
            className="md:hidden w-10 h-10 flex items-center justify-center border border-white/5 hover:border-cyan-500/40 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0a0a0a] border-b border-cyan-500/20 py-8 px-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-sm font-mono text-gray-400 hover:text-cyan-400 tracking-[0.2em] uppercase"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
