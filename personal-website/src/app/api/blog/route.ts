import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoDb';
import BlogPost from '@/models/BlogPost';
import { requireAdmin, getCurrentUser } from '@/lib/auth';

// GET all blog posts
export async function GET(req: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const published = searchParams.get('published');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');

    let query: any = {};

    // Public API: only show published posts
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      query.published = true;
    } else if (published) {
      query.published = published === 'true';
    }

    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await BlogPost.find(query)
      .populate('author', 'name email')
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(100);

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Blog fetch error:', error);
    return NextResponse.json(
      { message: 'Blog yazıları alınamadı' },
      { status: 500 }
    );
  }
}

// POST new blog post (admin only)
export async function POST(req: Request) {
  try {
    const user = await requireAdmin();
    await connectDB();

    const body = await req.json();
    const { title, slug, excerpt, content, coverImage, tags, category, published, featured } = body;

    if (!title || !slug || !excerpt || !content) {
      return NextResponse.json(
        { message: 'Zorunlu alanlar eksik' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await BlogPost.findOne({ slug });
    if (existingPost) {
      return NextResponse.json(
        { message: 'Bu slug zaten kullanılıyor' },
        { status: 400 }
      );
    }

    const post = await BlogPost.create({
      title,
      slug,
      excerpt,
      content,
      coverImage,
      tags: tags || [],
      category: category || 'other',
      author: user.userId,
      published: published || false,
      featured: featured || false
    });

    await post.populate('author', 'name email');

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error('Blog create error:', error);
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { message: 'Yetkiniz yok' },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { message: 'Blog yazısı eklenemedi' },
      { status: 500 }
    );
  }
}