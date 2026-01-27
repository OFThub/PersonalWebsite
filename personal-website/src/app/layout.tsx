import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteProvider } from '../context/SiteContext';
import { AuthProvider } from '../context/AuthContext'; // 1. AuthProvider'ı import edin

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kişisel Portfolio | Admin",
  description: "Next.js ile geliştirilmiş dinamik portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* 2. AuthProvider ile SiteProvider'ı iç içe sarmalayın */}
        <AuthProvider>
          <SiteProvider>
            {children}
          </SiteProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 