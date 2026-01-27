import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoDb';
import Experience from '@/models/Experience';
import { requireAdmin } from '@/lib/auth';

// Tip tanımını buraya alarak tekrarı önleyelim
type Context = {
  params: Promise<{ id: string }>;
};

// GET single experience
export async function GET(
  req: Request,
  { params }: Context
) {
  try {
    const { id } = await params; // 1. Params'ı çöz
    await connectDB();
    
    const experience = await Experience.findById(id); // 2. id'yi kullan
    
    if (!experience) {
      return NextResponse.json(
        { message: 'Deneyim bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(experience);
  } catch (error) {
    return NextResponse.json(
      { message: 'Deneyim alınamadı' },
      { status: 500 }
    );
  }
}

// PUT update experience (admin only)
export async function PUT(
  req: Request,
  { params }: Context
) {
  try {
    const { id } = await params; // 1. Params'ı çöz
    await requireAdmin();
    await connectDB();

    const body = await req.json();
    const { title, company, location, startDate, endDate, current, description, technologies, order } = body;

    const experience = await Experience.findByIdAndUpdate(
      id, // 2. id'yi kullan
      {
        title,
        company,
        location,
        startDate,
        endDate: current ? undefined : endDate,
        current,
        description,
        technologies,
        order
      },
      { new: true, runValidators: true }
    );

    if (!experience) {
      return NextResponse.json(
        { message: 'Deneyim bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(experience);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { message: 'Yetkiniz yok' },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { message: 'Deneyim güncellenemedi' },
      { status: 500 }
    );
  }
}

// DELETE experience (admin only)
export async function DELETE(
  req: Request,
  { params }: Context
) {
  try {
    const { id } = await params; // 1. Params'ı çöz
    await requireAdmin();
    await connectDB();

    const experience = await Experience.findByIdAndDelete(id); // 2. id'yi kullan

    if (!experience) {
      return NextResponse.json(
        { message: 'Deneyim bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Deneyim silindi' });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { message: 'Yetkiniz yok' },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { message: 'Deneyim silinemedi' },
      { status: 500 }
    );
  }
}