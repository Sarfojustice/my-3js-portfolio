"use client";

import { CV_DATA } from "@/data/cv";

export default function Skills() {
  const categories = [
    { title: "Languages", items: CV_DATA.skills.languages },
    { title: "Web & Frameworks", items: CV_DATA.skills.web },
    { title: "Databases", items: CV_DATA.skills.databases },
    { title: "Cloud & DevOps", items: CV_DATA.skills.cloud },
  ];

  return (
    <section id="skills" className="py-32 px-6 max-w-6xl mx-auto relative z-10">
      <div className="mb-24">
        <h2 className="text-sm font-mono tracking-[0.3em] uppercase text-gray-500 mb-4">
          Stack
        </h2>
        <p className="text-4xl md:text-6xl font-bold tracking-tighter">
          Technical <span className="text-white/30 italic font-light">Expertise</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
        {categories.map((cat, index) => (
          <div key={index} className="bg-[#0a0a0a] p-12 group hover:bg-white/[0.02] transition-colors duration-500">
            <h3 className="text-xs font-mono mb-8 text-gray-500 tracking-[0.2em] uppercase group-hover:text-cyan-500 transition-colors">
              {cat.title}
            </h3>
            <div className="flex flex-wrap gap-x-6 gap-y-4">
              {cat.items.map((skill, sIndex) => (
                <span 
                  key={sIndex}
                  className="text-lg md:text-xl text-white/50 hover:text-white transition-all cursor-default font-light tracking-tight"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
