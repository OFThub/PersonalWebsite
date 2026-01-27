import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoDb';
import SiteSettings from '@/models/SiteSettings';
import { requireAdmin } from '@/lib/auth';

// GET site settings (public)
export async function GET() {
  try {
    await connectDB();
    const settings = await SiteSettings.findOne();
    
    if (!settings) {
      return NextResponse.json(
        { message: 'Site ayarları bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { message: 'Site bilgileri alınamadı' },
      { status: 500 }
    );
  }
}

// PUT update site settings (admin only)
export async function PUT(req: Request) {
  try {
    await requireAdmin();
    await connectDB();
    
    const body = await req.json();
    const { name, title, description, bio, email, phone, github, linkedin, avatar, resumeUrl } = body;

    if (!name || !title || !description) {
      return NextResponse.json(
        { message: 'Zorunlu alanlar eksik' },
        { status: 400 }
      );
    }

    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = await SiteSettings.create({
        name,
        title,
        description,
        bio,
        email,
        phone,
        github,
        linkedin,
        avatar,
        resumeUrl
      });
    } else {
      settings.name = name;
      settings.title = title;
      settings.description = description;
      settings.bio = bio;
      settings.email = email;
      settings.phone = phone;
      settings.github = github;
      settings.linkedin = linkedin;
      settings.avatar = avatar;
      settings.resumeUrl = resumeUrl;

      await settings.save();
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { message: 'Yetkiniz yok' },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { message: 'Site bilgileri kaydedilemedi' },
      { status: 500 }
    );
  }
}