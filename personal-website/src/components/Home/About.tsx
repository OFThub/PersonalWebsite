'use client';

import { User, Mail, Phone } from 'lucide-react';
import { SiteData, Skill } from '@/types';

interface AboutSectionProps {
  siteData: SiteData;
  skillsByCategory: Record<string, Skill[]>;
}

const categoryNames: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Veritabanı',
  tools: 'Araçlar',
  other: 'Diğer',
};

export default function AboutSection({ siteData, skillsByCategory }: AboutSectionProps) {
  return (
    <section id="about" className="min-h-screen py-20 px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold mb-12 flex items-center gap-3">
          <User className="text-cyan-400" />
          <span className="bg-linear-to-r from-white to-cyan-200 bg-clip-text text-transparent">
            Hakkımda
          </span>
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8">
              <p className="text-gray-300 text-lg leading-relaxed">
                {siteData.bio || siteData.description}
              </p>
            </div>

            {siteData.email && (
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="text-cyan-400" size={20} />
                <span>{siteData.email}</span>
              </div>
            )}
            {siteData.phone && (
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="text-cyan-400" size={20} />
                <span>{siteData.phone}</span>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-3xl font-bold text-cyan-400 mb-6">Yetenekler</h3>

            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <div key={category} className="mb-6">
                <h4 className="text-lg font-semibold text-gray-300 mb-3">
                  {categoryNames[category] || category}
                </h4>

                <div className="space-y-3">
                  {skills.map((skill) => (
                    <div
                      key={skill._id}
                      className="bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-cyan-400 text-sm">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-cyan-500 to-blue-600 transition-all duration-1000"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}