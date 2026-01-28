import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SiteProvider } from '@/context/SiteContext';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Personal Portfolio',
  description: 'Modern portfolio website built with Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <AuthProvider>
          <SiteProvider>{children}</SiteProvider>
        </AuthProvider>
      </body>
    </html>
  );
}