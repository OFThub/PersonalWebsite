import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoDb';
import BlogPost from '@/models/BlogPost';
import Analytics from '@/models/Analytics';

// GET /api/blog - Tüm blog yazılarını listele
export async function GET() {
  try {
    await connectDB();

    const posts = await BlogPost
      .find({ published: true })
      .sort({ publishedAt: -1 })
      .populate('author', 'name email')
      .select('-content'); // İçeriği dahil etme, sadece özet

    return NextResponse.json(posts);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/blog - Yeni blog yazısı oluştur (Admin only)
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const data = await req.json();
    const post = await BlogPost.create(data);

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}