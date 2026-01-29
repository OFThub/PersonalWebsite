'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Loading from '@/components/Common/Loading';
import HeroSection from '@/components/Home/Hero';
import AboutSection from '@/components/Home/About';
import ExperienceSection from '@/components/Home/Experience';
import ProjectsSection from '@/components/Home/Projects';
import ContactSection from '@/components/Home/Contact';
import GlobalSearch from '@/components/GlobalSearch/GlobalSearch';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import { FileText } from 'lucide-react';
import { SiteData, Skill, Experience, Project } from '@/types';

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('home');

  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [siteRes, skillsRes, experiencesRes, projectsRes] = await Promise.all([
          fetch('/api/site'),
          fetch('/api/skills'),
          fetch('/api/experiences'),
          fetch('/api/projects'),
        ]);

        if (siteRes.ok) setSiteData(await siteRes.json());
        if (skillsRes.ok) setSkills(await skillsRes.json());
        if (experiencesRes.ok) setExperiences(await experiencesRes.json());
        if (projectsRes.ok) setProjects(await projectsRes.json());
      } catch (error) {
        console.error('Data fetch error:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'experience', 'projects', 'contact'];
      const pos = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (!el) continue;

        if (pos >= el.offsetTop && pos < el.offsetTop + el.offsetHeight) {
          setActiveSection(section);
          break;
        }
      }

      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (!siteData) {
    return <Loading />;
  }

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute bottom-20 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrollY > 50 ? 'bg-slate-900/95 backdrop-blur-lg shadow-lg shadow-cyan-500/10' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {siteData.name
                .split(' ')
                .map((word) => word[0])
                .join('')
                .toUpperCase()}
            </div>

            <div className="hidden md:flex gap-8">
              {['home', 'about', 'experience', 'projects', 'contact'].map((s) => (
                <button
                  key={s}
                  onClick={() => scrollToSection(s)}
                  className={`text-sm font-medium transition-colors relative group ${
                    activeSection === s ? 'text-cyan-400' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-cyan-400 to-blue-400 transition-transform origin-left ${
                      activeSection === s ? 'scale-x-100' : 'scale-x-0'
                    } group-hover:scale-x-100`}
                  ></span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {/* Blog Link */}
              <Link
                href="/blog"
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-cyan-500/20 rounded-lg transition-colors"
              >
                <FileText size={18} />
                <span className="hidden md:inline">Blog</span>
              </Link>

              {/* Global Search */}
              <GlobalSearch />

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Admin Link */}
              <Link
                href="/auth/login"
                className="text-sm px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-600 rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Sections */}
      <HeroSection siteData={siteData} onScrollToNext={() => scrollToSection('about')} />
      <AboutSection siteData={siteData} skillsByCategory={skillsByCategory} />
      <ExperienceSection experiences={experiences} />
      <ProjectsSection projects={projects} />
      <ContactSection />

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-cyan-500/20 relative z-10">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>© 2026 {siteData.name}. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}