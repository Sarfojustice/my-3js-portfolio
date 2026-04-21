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
    <section id="skills" className="py-24 px-6 max-w-6xl mx-auto relative z-10">
      <h2 className="text-4xl md:text-6xl font-bold mb-16 text-center tracking-tighter">
        Technical <span className="text-gray-500 font-light italic">Expertise</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, index) => (
          <div key={index} className="skill-category p-8 bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:border-white/20 transition-all duration-500">
            <h3 className="text-sm font-bold mb-6 text-white font-mono tracking-widest uppercase">
              {cat.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((skill, sIndex) => (
                <span 
                  key={sIndex}
                  className="px-3 py-1 bg-white/5 text-gray-300 text-xs font-mono rounded-none border border-white/5 hover:text-white hover:border-white/20 transition-all cursor-default"
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
