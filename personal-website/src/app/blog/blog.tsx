'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Tag, Search, TrendingUp, Eye } from 'lucide-react';
import Loading from '@/components/Common/Loading';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  views: number;
  featured: boolean;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blog');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Blog posts fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtreleme
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesCategory && matchesTag;
  });

  // Kategoriler
  const categories = ['all', ...new Set(posts.map(p => p.category))];
  
  // En popüler taglar
  const allTags = posts.flatMap(p => p.tags);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const popularTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-lg border-b border-cyan-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="text-2xl font-bold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Portfolio
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-linear-to-r from-white to-cyan-200 bg-clip-text text-transparent">
            Blog
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Teknoloji, yazılım geliştirme ve kişisel deneyimler hakkında yazılar
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Blog yazılarında ara..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-linear-to-r from-cyan-500 to-blue-600 text-white'
                    : 'bg-white/5 hover:bg-white/10 border border-cyan-500/20'
                }`}
              >
                {cat === 'all' ? 'Tümü' : cat}
              </button>
            ))}
          </div>

          {/* Popular Tags */}
          {popularTags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag size={18} className="text-cyan-400" />
              <span className="text-sm text-gray-400">Popüler Etiketler:</span>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                  className={`text-sm px-3 py-1 rounded-full transition ${
                    selectedTag === tag
                      ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-cyan-500/10'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Featured Posts */}
        {selectedCategory === 'all' && !searchQuery && !selectedTag && (
          <>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="text-cyan-400" />
              Öne Çıkanlar
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {posts.filter(p => p.featured).slice(0, 2).map((post) => (
                <FeaturedPostCard key={post._id} post={post} />
              ))}
            </div>
          </>
        )}

        {/* All Posts */}
        <h2 className="text-2xl font-bold mb-6">
          {searchQuery || selectedTag ? 'Arama Sonuçları' : 'Tüm Yazılar'} ({filteredPosts.length})
        </h2>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Yazı bulunamadı</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogPostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FeaturedPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="group relative bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all h-full">
        {post.coverImage && (
          <div className="relative h-64 overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-900 to-transparent" />
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-linear-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-full">
                Featured
              </span>
            </div>
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs">
              {post.category}
            </span>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Eye size={14} />
              {post.views}
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
            {post.title}
          </h3>
          
          <p className="text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              {new Date(post.publishedAt).toLocaleDateString('tr-TR')}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} />
              {post.readTime} dk
            </div>
          </div>

          {post.tags.length > 0 && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 bg-white/5 text-gray-400 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="group bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all h-full">
        {post.coverImage && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs">
              {post.category}
            </span>
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Eye size={12} />
              {post.views}
            </div>
          </div>

          <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
            {post.title}
          </h3>
          
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">{post.excerpt}</p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              {new Date(post.publishedAt).toLocaleDateString('tr-TR')}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              {post.readTime} dk
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}