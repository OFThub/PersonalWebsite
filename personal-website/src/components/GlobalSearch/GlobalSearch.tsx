'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Code, Briefcase, FolderKanban } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  type: 'blog' | 'project' | 'skill' | 'experience';
  id: string;
  title: string;
  description?: string;
  url: string;
}

export default function GlobalSearch() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url);
    setIsOpen(false);
    setQuery('');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'blog':
        return <FileText size={18} className="text-cyan-400" />;
      case 'project':
        return <FolderKanban size={18} className="text-blue-400" />;
      case 'skill':
        return <Code size={18} className="text-purple-400" />;
      case 'experience':
        return <Briefcase size={18} className="text-pink-400" />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-cyan-500/20 rounded-lg transition-colors text-gray-400 hover:text-white"
      >
        <Search size={18} />
        <span className="hidden md:inline">Ara...</span>
        <kbd className="hidden md:inline-block px-2 py-1 text-xs bg-white/10 rounded">
          ⌘K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-slate-800 border border-cyan-500/20 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 p-4 border-b border-cyan-500/20">
              <Search size={20} className="text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Proje, blog, yetenek ara..."
                className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto p-2">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className="w-full flex items-start gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors text-left"
                    >
                      <div className="mt-1">{getIcon(result.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate">
                          {result.title}
                        </div>
                        {result.description && (
                          <div className="text-sm text-gray-400 truncate">
                            {result.description}
                          </div>
                        )}
                        <div className="text-xs text-cyan-400 mt-1">
                          {result.type}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : query ? (
                <div className="text-center py-12 text-gray-400">
                  Sonuç bulunamadı
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Arama yapmak için yazmaya başlayın
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-cyan-500/20 text-xs text-gray-500 flex items-center justify-between">
              <span>↑↓ ile gezin, Enter ile seç</span>
              <span>ESC ile kapat</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}