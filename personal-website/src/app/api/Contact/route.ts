import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const { name, email, message } = await req.json();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: email,
    to: 'omerfarukturkdogdu@gmail.com',
    subject: `${name} - Web Sitesi İletişim`,
    text: message,
  });

  return NextResponse.json({ success: true });
}
