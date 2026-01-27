import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoDb';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const user = await User.findById(currentUser.userId);
    if (!user) {
      return NextResponse.json(
        { message: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('Me error:', error);
    return NextResponse.json(
      { message: 'Kullanıcı bilgileri alınamadı' },
      { status: 500 }
    );
  }
}