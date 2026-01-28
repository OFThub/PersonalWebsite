'use client';

import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { Experience } from '@/types';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section id="experience" className="min-h-screen py-20 px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold mb-12 flex items-center gap-3">
          <Briefcase className="text-cyan-400" />
          <span className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
            Deneyimler
          </span>
        </h2>

        <div className="space-y-6">
          {experiences.map((exp) => (
            <div
              key={exp._id}
              className="bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-500/50 transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-2">{exp.title}</h3>
                  <p className="text-xl text-gray-300 flex items-center gap-2">
                    <Briefcase size={18} />
                    {exp.company}
                  </p>
                </div>
                <div className="text-gray-400 mt-2 md:mt-0">
                  <p className="flex items-center gap-2">
                    <Calendar size={18} />
                    {exp.startDate} - {exp.current ? 'Devam ediyor' : exp.endDate}
                  </p>
                  {exp.location && (
                    <p className="flex items-center gap-2 mt-1">
                      <MapPin size={18} />
                      {exp.location}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-gray-300 mb-4">{exp.description}</p>

              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-300 text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}