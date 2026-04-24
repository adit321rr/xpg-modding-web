import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// =========================================================================
// SEO & META TAGS (Untuk Google, WhatsApp, FB, dll)
// =========================================================================
export const metadata: Metadata = {
  title: 'XPG ADATA - Mod To Xtreme 2026',
  description: 'The premier PC modding competition in Indonesia. Vote your favorite elite modder and win IDR 16 Million!',
  keywords: 'xpg, adata, pc modding, lomba pc, mod to xtreme, gaming pc indonesia',
  
  // TINGGAL TAMBAHKAN BLOK ICONS INI
  icons: {
    icon: '/images/favicon.png', // Logo untuk tab browser PC
    apple: '/images/favicon.png', // Logo kalau webnya di-save ke Homescreen iPhone
  },

  openGraph: {
    title: 'XPG ADATA - Mod To Xtreme 2026',
    description: 'Vote for your favorite elite modder and win IDR 16 Million!',
    url: 'https://xpg-modding2026.com', 
    siteName: 'XPG ADATA Mod To Xtreme',
    images: [
      {
        url: '/images/favicon.png', 
        width: 1200,
        height: 630,
        alt: 'XPG Mod To Xtreme Cover',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  );
}