import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoDb';
import Contact from '@/models/Contact';
import { requireAdmin } from '@/lib/auth';

// Tip tanımını Promise olarak güncelliyoruz
type RouteContext = {
  params: Promise<{ id: string }>;
};

// PUT update contact status (admin only)
export async function PUT(
  req: Request,
  { params }: RouteContext // Params artık bir Promise
) {
  try {
    // 1. Önce params'ı await ediyoruz
    const { id } = await params;

    await requireAdmin();
    await connectDB();

    const body = await req.json();
    const { status } = body;

    if (!status || !['new', 'read', 'replied'].includes(status)) {
      return NextResponse.json(
        { message: 'Geçersiz durum' },
        { status: 400 }
      );
    }

    // 2. Await ettiğimiz id'yi kullanıyoruz
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!contact) {
      return NextResponse.json(
        { message: 'Mesaj bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(contact);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { message: 'Yetkiniz yok' },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { message: 'Mesaj güncellenemedi' },
      { status: 500 }
    );
  }
}

// DELETE contact (admin only)
export async function DELETE(
  req: Request,
  { params }: RouteContext // Burada da aynı şekilde
) {
  try {
    // 1. Params'ı await ediyoruz
    const { id } = await params;

    await requireAdmin();
    await connectDB();

    // 2. id'yi kullanıyoruz
    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return NextResponse.json(
        { message: 'Mesaj bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Mesaj silindi' });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { message: 'Yetkiniz yok' },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { message: 'Mesaj silinemedi' },
      { status: 500 }
    );
  }
}