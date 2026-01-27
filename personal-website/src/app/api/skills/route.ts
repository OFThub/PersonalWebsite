import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoDb';
import Skill from '@/models/Skill';
import { requireAdmin } from '@/lib/auth';

// GET all skills
export async function GET() {
  try {
    await connectDB();
    const skills = await Skill.find().sort({ order: 1, category: 1 });
    return NextResponse.json(skills);
  } catch (error) {
    return NextResponse.json(
      { message: 'Yetenekler alınamadı' },
      { status: 500 }
    );
  }
}

// POST new skill (admin only)
export async function POST(req: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const body = await req.json();
    const { name, category, level, icon, order } = body;

    if (!name || !category) {
      return NextResponse.json(
        { message: 'İsim ve kategori gerekli' },
        { status: 400 }
      );
    }

    const skill = await Skill.create({
      name,
      category,
      level: level || 50,
      icon,
      order: order || 0
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { message: 'Yetkiniz yok' },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { message: 'Yetenek eklenemedi' },
      { status: 500 }
    );
  }
}