import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoDb';
import Project from '@/models/Project';
import { requireAdmin } from '@/lib/auth';

// GET all projects
export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find().sort({ featured: -1, order: 1 });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { message: 'Projeler alınamadı' },
      { status: 500 }
    );
  }
}

// POST new project (admin only)
export async function POST(req: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const body = await req.json();
    const { title, description, longDescription, technologies, github, demo, image, featured, order, status } = body;

    if (!title || !description || !technologies || technologies.length === 0) {
      return NextResponse.json(
        { message: 'Zorunlu alanlar eksik' },
        { status: 400 }
      );
    }

    const project = await Project.create({
      title,
      description,
      longDescription,
      technologies,
      github,
      demo,
      image,
      featured: featured || false,
      order: order || 0,
      status: status || 'completed'
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { message: 'Yetkiniz yok' },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { message: 'Proje eklenemedi' },
      { status: 500 }
    );
  }
}