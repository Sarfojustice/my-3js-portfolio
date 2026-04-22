"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import gsap from "gsap";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    
    // Cyber transition effect
    const tl = gsap.timeline();
    tl.to("body", { opacity: 0.5, duration: 0.2, yoyo: true, repeat: 1 });
    
    setTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="group relative w-20 h-10 border border-accent/20 hover:border-accent/50 transition-colors flex items-center px-1 overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 bg-accent group-hover:opacity-20 transition-opacity" />
      
      {/* Slider */}
      <div 
        className={`relative w-8 h-8 flex items-center justify-center transition-all duration-500 ease-expo ${
          theme === "dark" ? "translate-x-10" : "translate-x-0"
        }`}
      >
        <div className="absolute inset-0 bg-accent/20 blur-sm" />
        {theme === "dark" ? (
          <Moon className="w-4 h-4 text-accent" />
        ) : (
          <Sun className="w-4 h-4 text-accent" />
        )}
      </div>

      {/* Text Labels */}
      <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
        <span className={`text-[8px] font-mono transition-opacity ${theme === "dark" ? "opacity-40" : "opacity-100"}`}>LT</span>
        <span className={`text-[8px] font-mono transition-opacity ${theme === "dark" ? "opacity-100" : "opacity-40"}`}>DK</span>
      </div>
    </button>
  );
}
