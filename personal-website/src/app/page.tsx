'use client';

import { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ChevronDown, Code, Briefcase, User } from 'lucide-react';

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    const sections = ['home', 'about', 'projects', 'contact'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (!el) continue;

        const top = el.offsetTop;
        const height = el.offsetHeight;

        if (scrollPosition >= top && scrollPosition < top + height) {
          setActiveSection(section);
          break;
        }
      }

      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // ilk render’da da çalışsın

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert('Mail başarıyla gönderildi 🚀');
      setFormData({ name: '', email: '', message: '' });
    } else {
      alert('Bir hata oluştu 😢');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const skills = [
    'JavaScript', 'React', 'Next.js', 'Node.js', 
    'TypeScript', 'Python', 'UI/UX Design', 'Git'
  ];

  const projects = [
    {
      title: 'E-Ticaret Platformu',
      desc: 'Modern bir online alışveriş deneyimi',
      tech: ['React', 'Node.js', 'MongoDB']
    },
    {
      title: 'Görev Yönetim Uygulaması',
      desc: 'Ekipler için proje takip sistemi',
      tech: ['Next.js', 'TypeScript', 'PostgreSQL']
    },
    {
      title: 'Portföy Web Sitesi',
      desc: 'Yaratıcı profesyoneller için portföy',
      tech: ['React', 'Tailwind', 'Framer Motion']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-slate-900/95 backdrop-blur-sm shadow-lg' : ''}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            ÖFT
          </div>
          <div className="flex gap-8">
            <button onClick={() => scrollToSection('home')} className={`transition ${activeSection === 'home' ? 'text-cyan-400' : 'hover:text-cyan-400'}`}>Ana Sayfa</button>
            <button onClick={() => scrollToSection('about')} className={`transition ${activeSection === 'about' ? 'text-cyan-400' : 'hover:text-cyan-400'}`}>Hakkımda</button>
            <button onClick={() => scrollToSection('projects')} className={`transition ${activeSection === 'projects' ? 'text-cyan-400' : 'hover:text-cyan-400'}`}>Projeler</button>
            <button onClick={() => scrollToSection('contact')} className={`transition ${activeSection === 'contact' ? 'text-cyan-400' : 'hover:text-cyan-400'}`}>İletişim</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full opacity-10"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
        
        <div className="text-center z-10 px-6">
          <div className="mb-6 inline-block">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-4xl font-bold mx-auto shadow-2xl">
              ÖFT
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
            Merhaba, Ben
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Ömer Faruk Türkdoğdu
          </h2>
          <p className="text-2xl md:text-3xl text-gray-300 mb-8">Full Stack Developer & UI/UX Designer</p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Modern web teknolojileri ile yaratıcı ve kullanıcı dostu çözümler geliştiriyorum
          </p>
          <div className="flex gap-4 justify-center mb-12">
            <a href="https://github.com/OFThub" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition transform hover:scale-110">
              <Github size={24} />
            </a>
            <a href="https://www.linkedin.com/in/omerfarukoft/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition transform hover:scale-110">
              <Linkedin size={24} />
            </a>
            <a href="mailto:oturkdogdu1@gmail.com" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition transform hover:scale-110">
              <Mail size={24} />
            </a>
          </div>
          <button 
            onClick={() => scrollToSection('about')}
            className="animate-bounce"
          >
            <ChevronDown size={32} className="text-cyan-400" />
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <User className="text-cyan-400" size={32} />
            <h2 className="text-4xl md:text-5xl font-bold">Hakkımda</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                5 yılı aşkın deneyimle web geliştirme alanında çalışıyorum. Modern teknolojiler kullanarak 
                kullanıcı odaklı, performanslı ve görsel olarak çekici web uygulamaları geliştiriyorum.
              </p>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Sürekli öğrenmeye ve kendimi geliştirmeye inanıyorum. Her projede yeni bir şeyler öğrenmeyi 
                ve bu bilgileri sonraki projelerime aktarmayı seviyorum.
              </p>
              <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition transform hover:scale-105">
                CV İndir
              </button>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-6 text-cyan-400">Yetenekler</h3>
              <div className="grid grid-cols-2 gap-3">
                {skills.map((skill, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-white/5 rounded-lg border border-cyan-500/20 hover:bg-white/10 transition transform hover:scale-105"
                  >
                    <Code size={20} className="text-cyan-400 mb-2" />
                    <span className="font-semibold">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="min-h-screen py-20 px-6 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <Briefcase className="text-cyan-400" size={32} />
            <h2 className="text-4xl md:text-5xl font-bold">Projeler</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div 
                key={index}
                className="bg-white/5 rounded-xl p-6 border border-cyan-500/20 hover:border-cyan-500/50 transition transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20"
              >
                <div className="w-full h-48 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 rounded-lg mb-4 flex items-center justify-center">
                  <Code size={48} className="text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-400 mb-4">{project.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-cyan-500/20 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex items-center py-20 px-6">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-12">
            <Mail className="text-cyan-400" size={32} />
            <h2 className="text-4xl md:text-5xl font-bold">İletişim</h2>
          </div>
          
          <div className="bg-white/5 rounded-xl p-8 border border-cyan-500/20">
            <p className="text-lg text-gray-300 mb-8">
              Bir proje fikriniz mi var veya birlikte çalışmak ister misiniz? Benimle iletişime geçin!
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" 
                name="name"
                placeholder="Adınız"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-cyan-500/20 rounded-lg focus:outline-none focus:border-cyan-500 transition"
              />
              <input 
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-cyan-500/20 rounded-lg focus:outline-none focus:border-cyan-500 transition"
              />
              <textarea 
                name="message"
                placeholder="Mesajınız"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-cyan-500/20 rounded-lg focus:outline-none focus:border-cyan-500 transition resize-none"
              ></textarea>
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition transform hover:scale-105">
                Gönder
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>© 2026 Tüm hakları saklıdır.</p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}} />
    </div>
  );
}