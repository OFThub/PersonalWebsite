'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, Eye, Tag, ArrowLeft, Share2 } from 'lucide-react';
import Loading from '@/components/Common/Loading';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  views: number;
  author: {
    name: string;
    email: string;
  };
}

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  useEffect(() => {
    if (params.slug) {
      fetchPost(params.slug as string);
    }
  }, [params.slug]);

  const fetchPost = async (slug: string) => {
    try {
      const res = await fetch(`/api/blog/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data.post);
        setRelatedPosts(data.relatedPosts || []);
        
        // Track view
        await fetch(`/api/blog/${slug}/view`, { method: 'POST' });
      } else {
        router.push('/blog');
      }
    } catch (error) {
      console.error('Blog post fetch error:', error);
      router.push('/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: url,
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link kopyalandı!');
    }
  };

  if (loading) return <Loading />;
  if (!post) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-lg border-b border-cyan-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <ArrowLeft size={20} />
            <span>Blog</span>
          </Link>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-cyan-500/20 rounded-lg transition"
          >
            <Share2 size={18} />
            <span className="hidden md:inline">Paylaş</span>
          </button>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 py-12">
        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-900 to-transparent" />
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm">
            {post.category}
          </span>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Calendar size={16} />
            {new Date(post.publishedAt).toLocaleDateString('tr-TR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Clock size={16} />
            {post.readTime} dakika okuma
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Eye size={16} />
            {post.views} görüntülenme
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-linear-to-r from-white to-cyan-200 bg-clip-text text-transparent">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Author Info */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-cyan-500/20">
          <div className="w-12 h-12 bg-linear-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {post.author.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{post.author.name}</p>
            <p className="text-sm text-gray-400">{post.author.email}</p>
          </div>
        </div>

        {/* Content */}
        <div 
          className="prose prose-invert prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap mb-12">
            <Tag size={20} className="text-cyan-400" />
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${tag}`}
                className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-full text-cyan-300 text-sm transition"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="border-t border-cyan-500/20 pt-12">
            <h2 className="text-2xl font-bold mb-6">İlgili Yazılar</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related._id}
                  href={`/blog/${related.slug}`}
                  className="group bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/50 transition"
                >
                  {related.coverImage && (
                    <div className="relative h-32 rounded-lg overflow-hidden mb-4">
                      <img
                        src={related.coverImage}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <h3 className="font-bold mb-2 group-hover:text-cyan-400 transition line-clamp-2">
                    {related.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{related.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}