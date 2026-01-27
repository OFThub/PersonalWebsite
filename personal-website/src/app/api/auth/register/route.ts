import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoDb';
import User from '@/models/User';
import { generateToken, setAuthToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const { email, password, name } = await req.json();

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: 'Tüm alanlar gerekli' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Şifre en az 6 karakter olmalı' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Bu email zaten kayıtlı' },
        { status: 400 }
      );
    }

    // Create user
    const user = await User.create({
      email,
      password,
      name,
      role: 'user' // First user can be manually changed to admin in DB
    });

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    // Set cookie
    await setAuthToken(token);

    return NextResponse.json({
      message: 'Kayıt başarılı',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json(
      { message: 'Kayıt sırasında hata oluştu' },
      { status: 500 }
    );
  }
}