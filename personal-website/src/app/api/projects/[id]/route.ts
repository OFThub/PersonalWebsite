import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoDb';
import Project from '@/models/Project';
import { requireAdmin } from '@/lib/auth';

// Tip tanımını ortaklaştıralım
type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET single project
export async function GET(
  req: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params; // 1. Params'ı çöz
    await connectDB();
    
    const project = await Project.findById(id); // 2. id'yi kullan
    
    if (!project) {
      return NextResponse.json(
        { message: 'Proje bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { message: 'Proje alınamadı' },
      { status: 500 }
    );
  }
}

// PUT update project (admin only)
export async function PUT(
  req: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params; // 1. Params'ı çöz
    await requireAdmin();
    await connectDB();

    const body = await req.json();
    const { title, description, longDescription, technologies, github, demo, image, featured, order, status } = body;

    const project = await Project.findByIdAndUpdate(
      id, // 2. id'yi kullan
      {
        title,
        description,
        longDescription,
        technologies,
        github,
        demo,
        image,
        featured,
        order,
        status
      },
      { new: true, runValidators: true }
    );

    if (!project) {
      return NextResponse.json(
        { message: 'Proje bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { message: 'Yetkiniz yok' },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { message: 'Proje güncellenemedi' },
      { status: 500 }
    );
  }
}

// DELETE project (admin only)
export async function DELETE(
  req: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params; // 1. Params'ı çöz
    await requireAdmin();
    await connectDB();

    const project = await Project.findByIdAndDelete(id); // 2. id'yi kullan

    if (!project) {
      return NextResponse.json(
        { message: 'Proje bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Proje silindi' });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { message: 'Yetkiniz yok' },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { message: 'Proje silinemedi' },
      { status: 500 }
    );
  }
}