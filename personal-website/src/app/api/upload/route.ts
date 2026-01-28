import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '../../../lib/cloudinary';
import { requireAuth } from '../../../lib/auth';

export async function POST(req: Request) {
  try {
    await requireAuth();
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'portfolio';

    if (!file) {
      return NextResponse.json(
        { message: 'Dosya bulunamadı' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'Geçersiz dosya tipi. Sadece resim dosyaları yüklenebilir.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'Dosya boyutu 5MB\'dan küçük olmalıdır' },
        { status: 400 }
      );
    }

    const result = await uploadToCloudinary(file, folder) as any;

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { message: error.message || 'Upload başarısız' },
      { status: 500 }
    );
  }
}