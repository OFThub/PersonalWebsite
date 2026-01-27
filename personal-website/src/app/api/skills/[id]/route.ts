import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoDb';
import Skill from '@/models/Skill';
import { requireAdmin } from '@/lib/auth';

// Next.js 15 için Promise tabanlı tip tanımı
type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET single skill
export async function GET(
  req: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params; // 1. Params'ı await et
    await connectDB();
    
    const skill = await Skill.findById(id); // 2. Çözülen id'yi kullan
    
    if (!skill) {
      return NextResponse.json(
        { message: 'Yetenek bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(skill);
  } catch (error) {
    return NextResponse.json(
      { message: 'Yetenek alınamadı' },
      { status: 500 }
    );
  }
}

// PUT update skill (admin only)
export async function PUT(
  req: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params; // 1. Params'ı await et
    await requireAdmin();
    await connectDB();

    const body = await req.json();
    const { name, category, level, icon, order } = body;

    const skill = await Skill.findByIdAndUpdate(
      id, // 2. Çözülen id'yi kullan
      { name, category, level, icon, order },
      { new: true, runValidators: true }
    );

    if (!skill) {
      return NextResponse.json(
        { message: 'Yetenek bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(skill);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { message: 'Yetkiniz yok' },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { message: 'Yetenek güncellenemedi' },
      { status: 500 }
    );
  }
}

// DELETE skill (admin only)
export async function DELETE(
  req: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params; // 1. Params'ı await et
    await requireAdmin();
    await connectDB();

    const skill = await Skill.findByIdAndDelete(id); // 2. Çözülen id'yi kullan

    if (!skill) {
      return NextResponse.json(
        { message: 'Yetenek bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Yetenek silindi' });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { message: 'Yetkiniz yok' },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { message: 'Yetenek silinemedi' },
      { status: 500 }
    );
  }
}