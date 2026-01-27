import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoDb';
import Experience from '@/models/Experience';
import { requireAdmin } from '@/lib/auth';

// GET all experiences
export async function GET() {
  try {
    await connectDB();
    const experiences = await Experience.find().sort({ order: 1, startDate: -1 });
    return NextResponse.json(experiences);
  } catch (error) {
    return NextResponse.json(
      { message: 'Deneyimler alınamadı' },
      { status: 500 }
    );
  }
}

// POST new experience (admin only)
export async function POST(req: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const body = await req.json();
    const { title, company, location, startDate, endDate, current, description, technologies, order } = body;

    if (!title || !company || !startDate || !description) {
      return NextResponse.json(
        { message: 'Zorunlu alanlar eksik' },
        { status: 400 }
      );
    }

    const experience = await Experience.create({
      title,
      company,
      location,
      startDate,
      endDate: current ? undefined : endDate,
      current: current || false,
      description,
      technologies: technologies || [],
      order: order || 0
    });

    return NextResponse.json(experience, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { message: 'Yetkiniz yok' },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { message: 'Deneyim eklenemedi' },
      { status: 500 }
    );
  }
}