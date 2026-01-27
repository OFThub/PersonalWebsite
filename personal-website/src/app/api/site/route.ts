import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoDb';
import SiteSettings from '@/models/SiteSettings';

// 🔹 GET: Site ayarlarını getir
export async function GET() {
  try {
    await connectDB();

    const settings = await SiteSettings.findOne();

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { message: 'Site bilgileri alınamadı' },
      { status: 500 }
    );
  }
}

// 🔹 PUT: Site ayarlarını güncelle / oluştur
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { name, title, description, email, github, linkedin } = body;

    // 🛑 Basic validation
    if (!name || !title || !description) {
      return NextResponse.json(
        { message: 'Zorunlu alanlar eksik' },
        { status: 400 }
      );
    }

    let settings = await SiteSettings.findOne();

    if (!settings) {
      // İlk kez oluştur
      settings = await SiteSettings.create({
        name,
        title,
        description,
        email,
        github,
        linkedin
      });
    } else {
      // Güncelle
      settings.name = name;
      settings.title = title;
      settings.description = description;
      settings.email = email;
      settings.github = github;
      settings.linkedin = linkedin;

      await settings.save();
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { message: 'Site bilgileri kaydedilemedi' },
      { status: 500 }
    );
  }
}
