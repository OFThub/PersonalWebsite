import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoDb';
import Contact from '@/models/Contact';
import { requireAdmin } from '@/lib/auth';
import nodemailer from 'nodemailer';

// GET all contacts (admin only)
export async function GET() {
  try {
    await requireAdmin();
    await connectDB();
    
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json(contacts);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { message: 'Yetkiniz yok' },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { message: 'Mesajlar alınamadı' },
      { status: 500 }
    );
  }
}

// POST new contact (public)
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'İsim, email ve mesaj gerekli' },
        { status: 400 }
      );
    }

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      status: 'new'
    });

    // Send email notification (optional)
    if (process.env.MAIL_USER && process.env.MAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.MAIL_USER,
          to: process.env.MAIL_USER,
          replyTo: email,
          subject: `Portfolio İletişim: ${subject || 'Yeni Mesaj'}`,
          text: `İsim: ${name}\nEmail: ${email}\n\nMesaj:\n${message}`,
        });
      } catch (emailError) {
        console.error('Email gönderme hatası:', emailError);
      }
    }

    return NextResponse.json({
      message: 'Mesajınız başarıyla gönderildi',
      contact
    }, { status: 201 });
  } catch (error: any) {
    console.error('Contact error:', error);
    return NextResponse.json(
      { message: 'Mesaj gönderilemedi' },
      { status: 500 }
    );
  }
}