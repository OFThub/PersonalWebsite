import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoDb';
import BlogPost from '@/models/BlogPost';
import Analytics from '@/models/Analytics';

// GET /api/blog/[slug]
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> } // params artık bir Promise
) {
  try {
    await connectDB();
    
    // params nesnesini await ederek içindeki slug'ı alıyoruz
    const { slug } = await context.params;

    const post = await BlogPost
      .findOne({ slug: slug, published: true })
      .populate('author', 'name email');

    if (!post) {
      return NextResponse.json({ message: 'Blog yazısı bulunamadı' }, { status: 404 });
    }

    // İlgili yazılar araması
    const relatedPosts = await BlogPost
      .find({
        _id: { $ne: post._id },
        published: true,
        $or: [
          { category: post.category },
          { tags: { $in: post.tags } }
        ]
      })
      .limit(3)
      .select('-content')
      .sort({ publishedAt: -1 });

    return NextResponse.json({ post, relatedPosts });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// PUT /api/blog/[slug]
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await context.params; // await ekledik

    const data = await req.json();
    const post = await BlogPost.findOneAndUpdate(
      { slug: slug },
      data,
      { new: true, runValidators: true }
    );

    if (!post) {
      return NextResponse.json({ message: 'Blog yazısı bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE /api/blog/[slug]
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await context.params; // await ekledik

    const post = await BlogPost.findOneAndDelete({ slug: slug });

    if (!post) {
      return NextResponse.json({ message: 'Blog yazısı bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog yazısı silindi' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}