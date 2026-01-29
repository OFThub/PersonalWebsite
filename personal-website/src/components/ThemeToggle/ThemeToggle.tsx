'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions to avoid layout shift
    return (
      <div className="p-2 rounded-lg bg-white/5 border border-cyan-500/20 w-10 h-10" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-cyan-500/20 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Moon size={20} className="text-blue-400" />
      ) : (
        <Sun size={20} className="text-yellow-400" />
      )}
    </button>
  );
}