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
} from 'lucide-react';
import { useSite } from '../context/SiteContext';

/* ------------------ DUMMY DATA ------------------ */
const skills = [
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'MongoDB',
];

const experiences = [
  {
    title: 'Software Development Intern',
    company: 'TNC Group',
    date: '2025',
    desc: 'Web tabanlı uygulamalar geliştirme ve backend entegrasyonları.',
  },
];

const projects = [
  {
    title: 'Personal Portfolio',
    desc: 'Next.js ve MongoDB ile geliştirilen kişisel web sitesi.',
    tech: ['Next.js', 'TypeScript', 'MongoDB'],
  },
];

/* ------------------ COMPONENT ------------------ */
export default function HomePage() {
  const { siteData } = useSite();

  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('home');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [particles, setParticles] = useState<
    {
      width: number;
      height: number;
      top: number;
      left: number;
      duration: number;
      delay: number;
    }[]
  >([]);

  /* ------------------ HELPERS ------------------ */
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    alert('Mesaj gönderildi ✅');
    setFormData({ name: '', email: '', message: '' });
  };

  /* ------------------ EFFECTS ------------------ */
  useEffect(() => {
    const sections = ['home', 'about', 'experience', 'projects', 'contact'];

    setParticles(
      Array.from({ length: 50 }).map(() => ({
        width: Math.random() * 3 + 1,
        height: Math.random() * 3 + 1,
        top: Math.random() * 100,
        left: Math.random() * 100,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
      }))
    );

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

  /* ------------------ LOADING ------------------ */
  if (!siteData) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        Yükleniyor...
      </div>
    );
  }

  /* ------------------ JSX ------------------ */
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* NAV */}
      <nav
        className={`fixed top-0 w-full z-50 transition ${
          scrollY > 50 ? 'bg-slate-900/90 backdrop-blur shadow-lg' : ''
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between">
          <div className="text-2xl font-bold text-cyan-400">
            Ömer Faruk TÜRKDOĞDU
          </div>
          <div className="flex gap-6">
            {['home', 'about', 'experience', 'projects', 'contact'].map(s => (
              <button
                key={s}
                onClick={() => scrollToSection(s)}
                className={
                  activeSection === s
                    ? 'text-cyan-400'
                    : 'hover:text-cyan-400'
                }
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-2">Merhaba, Ben</h1>
          <h2 className="text-4xl text-cyan-400 font-bold mb-4">
            {siteData.name}
          </h2>
          <p className="text-xl text-gray-300 mb-4">{siteData.title}</p>
          <p className="max-w-xl mx-auto text-gray-400">
            {siteData.description}
          </p>

          <div className="flex justify-center gap-4 mt-6">
            <Github />
            <Linkedin />
            <Mail />
          </div>

          <button
            onClick={() => scrollToSection('about')}
            className="mt-10 animate-bounce"
          >
            <ChevronDown size={32} />
          </button>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="min-h-screen py-20 px-6">
        <h2 className="text-4xl font-bold mb-6 flex items-center gap-3">
          <User /> Hakkımda
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <p className="text-gray-300 mb-4">
              Modern web teknolojileri ile kullanıcı odaklı uygulamalar
              geliştiriyorum.
            </p>
          </div>

          <div>
            <h3 className="text-2xl text-cyan-400 mb-4">Yetenekler</h3>
            <div className="grid grid-cols-2 gap-3">
              {skills.map(skill => (
                <div
                  key={skill}
                  className="p-3 bg-white/5 rounded border border-cyan-500/20"
                >
                  <Code size={18} className="mb-1 text-cyan-400" />
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="min-h-screen py-20 px-6">
        <h2 className="text-4xl font-bold mb-6 flex items-center gap-3">
          <Briefcase /> Tecrübeler
        </h2>

        {experiences.map((e, i) => (
          <div key={i} className="bg-white/5 p-6 rounded-xl mb-4">
            <h3 className="text-xl text-cyan-400 font-bold">{e.title}</h3>
            <p className="text-gray-400">{e.company} • {e.date}</p>
            <p className="mt-2 text-gray-300">{e.desc}</p>
          </div>
        ))}
      </section>

      {/* PROJECTS */}
      <section id="projects" className="min-h-screen py-20 px-6">
        <h2 className="text-4xl font-bold mb-6">Projeler</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <div key={i} className="bg-white/5 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-2">{p.title}</h3>
              <p className="text-gray-400 mb-3">{p.desc}</p>
              <div className="flex gap-2 flex-wrap">
                {p.tech.map(t => (
                  <span
                    key={t}
                    className="px-3 py-1 bg-cyan-500/20 rounded-full text-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="min-h-screen py-20 px-6">
        <h2 className="text-4xl font-bold mb-6">İletişim</h2>

        <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ad"
            className="w-full p-3 bg-white/5 rounded"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 bg-white/5 rounded"
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Mesaj"
            className="w-full p-3 bg-white/5 rounded"
          />
          <button className="w-full py-3 bg-cyan-500 rounded font-bold">
            Gönder
          </button>
        </form>
      </section>
    </div>
  );
}
