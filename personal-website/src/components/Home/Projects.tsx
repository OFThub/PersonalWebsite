'use client';

import { Code, Github, ExternalLink } from 'lucide-react';
import { Project } from '@/types';

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="min-h-screen py-20 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold mb-12 flex items-center gap-3">
          <Code className="text-cyan-400" />
          <span className="bg-linear-to-r from-white to-cyan-200 bg-clip-text text-transparent">
            Projeler
          </span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-500/50 transition-all group relative overflow-hidden"
            >
              {project.featured && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-linear-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-full">
                    Featured
                  </span>
                </div>
              )}

              {project.image && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-gray-400 mb-4">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-300 text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-3 mb-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <Github size={18} />
                    <span className="text-sm">GitHub</span>
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <ExternalLink size={18} />
                    <span className="text-sm">Demo</span>
                  </a>
                )}
              </div>

              <StatusBadge status={project.status} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    completed: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Tamamlandı' },
    'in-progress': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Devam Ediyor' },
    planned: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Planlanıyor' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.completed;

  return (
    <span className={`text-xs px-2 py-1 rounded ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}