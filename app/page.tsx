"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Certifications from "@/components/sections/Certifications";
import Contact from "@/components/sections/Contact";
import Navbar from "@/components/Navbar";

const CanvasContainer = dynamic(() => import("@/components/3d/CanvasContainer"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative min-h-screen bg-transparent text-white selection:bg-cyan-500/30">
      <Navbar />
      <CanvasContainer />
      
      <div className="relative z-10">
        <Hero />
        <Experience />
        <Skills />
        <Certifications />
        <Contact />
      </div>
    </main>
  );
}
