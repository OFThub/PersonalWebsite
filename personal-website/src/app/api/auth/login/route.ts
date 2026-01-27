import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongoDb';
import User from '../../../../models/User';
import { generateToken, setAuthToken } from '../../../../lib/auth';

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const { email, password } = await req.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email ve şifre gerekli' },
        { status: 400 }
      );
    }

    // Find user (include password field)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json(
        { message: 'Email veya şifre hatalı' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Email veya şifre hatalı' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    // Set cookie
    await setAuthToken(token);

    return NextResponse.json({
      message: 'Giriş başarılı',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Giriş sırasında hata oluştu' },
      { status: 500 }
    );
  }
}