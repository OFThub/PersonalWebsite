'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useState } from 'react';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Mevcut dili pathname'den al
  const currentLocale = pathname.startsWith('/en') ? 'en' : 'tr';

  const languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];

  const switchLanguage = (locale: string) => {
    // Pathname'den mevcut dili çıkar
    let newPath = pathname;
    if (pathname.startsWith('/tr')) {
      newPath = pathname.replace('/tr', '');
    } else if (pathname.startsWith('/en')) {
      newPath = pathname.replace('/en', '');
    }

    // Yeni dili ekle (tr default olduğu için eklenmez)
    if (locale === 'en') {
      newPath = `/en${newPath}`;
    } else {
      newPath = newPath || '/';
    }

    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-cyan-500/20 rounded-lg transition-colors"
        aria-label="Change language"
      >
        <Globe size={18} />
        <span className="hidden md:inline">
          {languages.find(l => l.code === currentLocale)?.flag}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 py-2 w-48 bg-slate-800 border border-cyan-500/20 rounded-lg shadow-xl z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                className={`w-full px-4 py-2 text-left hover:bg-white/10 transition flex items-center gap-3 ${
                  currentLocale === lang.code ? 'text-cyan-400 bg-white/5' : 'text-white'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span>{lang.name}</span>
                {currentLocale === lang.code && (
                  <span className="ml-auto text-cyan-400">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}