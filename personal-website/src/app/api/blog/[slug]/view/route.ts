import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoDb';
import BlogPost from '@/models/BlogPost';
import Analytics from '@/models/Analytics';

// POST /api/blog/[slug]/view
export async function POST(
  req: NextRequest,
  // params'ı Promise olarak tanımlıyoruz
  context: { params: Promise<{ slug: string }> } 
) {
  try {
    await connectDB();

    // params'ı await ederek içindeki slug'ı çıkarıyoruz
    const { slug } = await context.params;

    // Blog görüntülenme sayısını artır
    const post = await BlogPost.findOneAndUpdate(
      { slug: slug },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!post) {
      return NextResponse.json(
        { message: 'Blog yazısı bulunamadı' },
        { status: 404 }
      );
    }

    // Analytics'e kaydet
    await Analytics.create({
      type: 'blog_view',
      path: `/blog/${slug}`,
      referrer: req.headers.get('referer') || undefined,
      userAgent: req.headers.get('user-agent') || undefined,
      resourceId: slug
    });

    return NextResponse.json({ views: post.views });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}