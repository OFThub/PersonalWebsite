'use client';

import { Github, Linkedin, Mail, Twitter, FileText, ChevronDown, Sparkles } from 'lucide-react';
import { SiteData } from '@/types';

interface HeroSectionProps {
  siteData: SiteData;
  onScrollToNext: () => void;
}

export default function HeroSection({ siteData, onScrollToNext }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative px-6"
    >
      <div className="text-center max-w-4xl mx-auto relative z-10">
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm">
          <Sparkles size={16} />
          <span>Portfolio 2026</span>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-linear-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
          {siteData.name}
        </h1>

        <h2 className="text-2xl md:text-3xl text-cyan-400 font-semibold mb-6">
          {siteData.title}
        </h2>

        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          {siteData.description}
        </p>

        <div className="flex justify-center gap-4 mb-12">
          {siteData.github && (
            <SocialLink href={siteData.github} icon={<Github size={24} />} />
          )}
          {siteData.linkedin && (
            <SocialLink href={siteData.linkedin} icon={<Linkedin size={24} />} />
          )}
          {siteData.email && (
            <SocialLink href={`mailto:${siteData.email}`} icon={<Mail size={24} />} />
          )}
          {siteData.twitter && (
            <SocialLink href={siteData.twitter} icon={<Twitter size={24} />} />
          )}
        </div>

        {siteData.resumeUrl && (
          <a
            href={siteData.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
          >
            <FileText size={20} />
            CV İndir
          </a>
        )}

        <button onClick={onScrollToNext} className="mt-12 animate-bounce">
          <ChevronDown size={32} className="text-cyan-400" />
        </button>
      </div>
    </section>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 bg-white/5 hover:bg-white/10 border border-cyan-500/20 rounded-full transition-all hover:scale-110 hover:border-cyan-500/50"
    >
      {icon}
    </a>
  );
}