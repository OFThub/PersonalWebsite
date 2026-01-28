import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoDb';
import BlogPost from '@/models/BlogPost';
import { requireAdmin } from '@/lib/auth';

// Tip tanımlaması (Next.js 15+ standartlarına uygun)
type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET single blog post
export async function GET(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params; // Promise'i çözüyoruz
    await connectDB();
    
    // Klasör [id] olsa bile veritabanında slug ile arama yapıyorsan 
    // buradaki id aslında slug değeridir.
    const post = await BlogPost.findOne({ slug: id })
      .populate('author', 'name email');
    
    if (!post) {
      return NextResponse.json(
        { message: 'Blog yazısı bulunamadı' },
        { status: 404 }
      );
    }

    post.views += 1;
    await post.save();

    return NextResponse.json(post);
  } catch (error) {
    console.error('Blog fetch error:', error);
    return NextResponse.json(
      { message: 'Blog yazısı alınamadı' },
      { status: 500 }
    );
  }
}

// PUT update blog post (admin only)
export async function PUT(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    await requireAdmin();
    await connectDB();

    const body = await req.json();
    const { title, slug, excerpt, content, coverImage, tags, category, published, featured } = body;

    // Eğer slug değişiyorsa kontrol et
    if (slug && slug !== id) {
      const existingPost = await BlogPost.findOne({ slug });
      if (existingPost) {
        return NextResponse.json(
          { message: 'Bu slug zaten kullanılıyor' },
          { status: 400 }
        );
      }
    }

    const post = await BlogPost.findOneAndUpdate(
      { slug: id },
      { title, slug, excerpt, content, coverImage, tags, category, published, featured },
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    if (!post) {
      return NextResponse.json({ message: 'Blog yazısı bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error: any) {
    console.error('Blog update error:', error);
    return NextResponse.json({ message: 'Güncellenemedi' }, { status: 500 });
  }
}

// DELETE blog post (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    await requireAdmin();
    await connectDB();

    const post = await BlogPost.findOneAndDelete({ slug: id });

    if (!post) {
      return NextResponse.json({ message: 'Blog yazısı bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog yazısı silindi' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Silinemedi' }, { status: 500 });
  }
}