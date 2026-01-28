'use client';

import { useState, useEffect } from 'react';
import {
  Github,
  Linkedin,
  Mail,
  ChevronDown,
  Code,
  Briefcase,
  User,
  ExternalLink,
  Calendar,
  MapPin,
  Phone,
  FileText,
  Send,
  CheckCircle2,
  Twitter,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  
  const [siteData, setSiteData] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [siteRes, skillsRes, experiencesRes, projectsRes] = await Promise.all([
          fetch('/api/site'),
          fetch('/api/skills'),
          fetch('/api/experiences'),
          fetch('/api/projects')
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
    const sections = ['home', 'about', 'experience', 'projects', 'contact'];

    const handleScroll = () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (formData.message.length < 10) {
      setErrors({ message: "Mesaj en az 10 karakter olmalı." });
      return; 
    }

    setSending(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Mesajınız başarıyla gönderildi!' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.message || 'Bir hata oluştu' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Bağlantı hatası' });
    } finally {
      setSending(false);
    }
  };

  if (!siteData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, any[]>);

  const categoryNames: Record<string, string> = {
    frontend: 'Frontend',
    backend: 'Backend',
    database: 'Veritabanı',
    tools: 'Araçlar',
    other: 'Diğer'
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-slate-900/95 backdrop-blur-lg shadow-lg shadow-cyan-500/10' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {siteData.name
                .split(' ')            
                .map((word: string) => word[0]) 
                .join('')             
                .toUpperCase()}        
            </div>
            
            <div className="hidden md:flex gap-8">
              {['home', 'about', 'experience', 'projects', 'contact'].map((s) => (
                <button
                  key={s}
                  onClick={() => scrollToSection(s)}
                  className={`text-sm font-medium transition-colors relative group ${activeSection === s ? 'text-cyan-400' : 'text-gray-300 hover:text-white'}`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-cyan-400 to-blue-400 transition-transform origin-left ${activeSection === s ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100`}></span>
                </button>
              ))}
            </div>

            <Link href="/auth/login" className="text-sm px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-600 rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300">
              Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative px-6">
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
              <a href={siteData.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 hover:bg-white/10 border border-cyan-500/20 rounded-full transition-all hover:scale-110 hover:border-cyan-500/50">
                <Github size={24} />
              </a>
            )}
            {siteData.linkedin && (
              <a href={siteData.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 hover:bg-white/10 border border-cyan-500/20 rounded-full transition-all hover:scale-110 hover:border-cyan-500/50">
                <Linkedin size={24} />
              </a>
            )}
            {siteData.email && (
              <a href={`mailto:${siteData.email}`} className="p-3 bg-white/5 hover:bg-white/10 border border-cyan-500/20 rounded-full transition-all hover:scale-110 hover:border-cyan-500/50">
                <Mail size={24} />
              </a>
            )}
            {siteData.twitter && (
              <a href={siteData.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 hover:bg-white/10 border border-cyan-500/20 rounded-full transition-all hover:scale-110 hover:border-cyan-500/50">
                <Twitter size={24} />
              </a>
            )}
          </div>

          {siteData.resumeUrl && (
            <a href={siteData.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300">
              <FileText size={20} />
              CV İndir
            </a>
          )}

          <button onClick={() => scrollToSection('about')} className="mt-12 animate-bounce">
            <ChevronDown size={32} className="text-cyan-400" />
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold mb-12 flex items-center gap-3">
            <User className="text-cyan-400" />
            <span className="bg-linear-to-r from-white to-cyan-200 bg-clip-text text-transparent">Hakkımda</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8">
                <p className="text-gray-300 text-lg leading-relaxed">{siteData.bio || siteData.description}</p>
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
              
              {Object.entries(skillsByCategory as Record<string, any[]>).map(
                ([category, categorySkills]) => (
                  <div key={category} className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-300 mb-3">
                      {categoryNames[category] || category}
                    </h4>

                    <div className="space-y-3">
                      {categorySkills.map((skill: any) => (
                        <div key={skill._id} className="bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-4">
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
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="min-h-screen py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold mb-12 flex items-center gap-3">
            <Briefcase className="text-cyan-400" />
            <span className="bg-linear-to-r from-white to-cyan-200 bg-clip-text text-transparent">Deneyimler</span>
          </h2>

          <div className="space-y-6">
            {experiences.map((exp: any) => (
              <div key={exp._id} className="bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-500/50 transition-all group">
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
                    {exp.technologies.map((tech: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-300 text-sm">
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

      {/* Projects Section */}
      <section id="projects" className="min-h-screen py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold mb-12 flex items-center gap-3">
            <Code className="text-cyan-400" />
            <span className="bg-linear-to-r from-white to-cyan-200 bg-clip-text text-transparent">Projeler</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: any) => (
              <div key={project._id} className="bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-500/50 transition-all group relative overflow-hidden">
                {project.featured && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-linear-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-full">
                      Featured
                    </span>
                  </div>
                )}

                {project.image && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                  </div>
                )}

                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                <p className="text-gray-400 mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-300 text-sm">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
                      <Github size={18} />
                      <span className="text-sm">GitHub</span>
                    </a>
                  )}
                  {project.demo && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
                      <ExternalLink size={18} />
                      <span className="text-sm">Demo</span>
                    </a>
                  )}
                </div>

                <div className="mt-3">
                  <span className={`text-xs px-2 py-1 rounded ${project.status === 'completed' ? 'bg-green-500/20 text-green-400' : project.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {project.status === 'completed' ? 'Tamamlandı' : project.status === 'in-progress' ? 'Devam Ediyor' : 'Planlanıyor'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen py-20 px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold mb-12 flex items-center gap-3">
            <Mail className="text-cyan-400" />
            <span className="bg-linear-to-r from-white to-cyan-200 bg-clip-text text-transparent">İletişim</span>
          </h2>

          {message.text && (
            <div className={`mb-6 p-4 rounded-lg border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'}`}>
              <div className="flex items-center gap-2">
                {message.type === 'success' && <CheckCircle2 size={20} />}
                <span>{message.text}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ad Soyad</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                  placeholder="Adınız Soyadınız"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                  placeholder="email@ornek.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Konu</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                placeholder="Mesaj konusu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mesaj</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                className={`w-full px-4 py-3 bg-white/5 border ${
                  errors.message ? 'border-red-500' : 'border-cyan-500/30'
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition resize-none`}
                placeholder="Mesajınızı buraya yazın..."
                required
              />
              {errors.message && (
                <p className="mt-1 text-xs text-red-400 animate-pulse">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Gönderiliyor...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Gönder</span>
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-cyan-500/20 relative z-10">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>© 2026 {siteData.name}. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}