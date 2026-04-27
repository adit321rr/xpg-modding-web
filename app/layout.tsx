import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// =========================================================================
// SEO & META TAGS (Untuk Google, WhatsApp, FB, dll)
// =========================================================================
export const metadata: Metadata = {
  title: 'XPG ADATA - Mod To Xtreme 2026',
  description: 'Kompetisi PC modding paling bergengsi di Indonesia. Dukung modder elit favoritmu dan menangkan total hadiah Rp 16 Juta!',
  keywords: 'xpg, adata, pc modding, lomba pc, mod to xtreme, gaming pc indonesia',
  
  icons: {
    icon: '/logo-xpg-final.png',
    apple: '/logo-xpg-final.png',
  },

  openGraph: {
    title: 'XPG ADATA - Mod To Xtreme 2026',
    description: 'Dukung modder elit favoritmu dan menangkan total hadiah Rp 16 Juta!',
    url: 'https://xpg-modding2026.com', 
    siteName: 'XPG ADATA Mod To Xtreme',
    images: [
      {
        url: '/images/mte26-logo.webp', // Cover share WhatsApp
        width: 1200,
        height: 630,
        alt: 'Cover XPG Mod To Xtreme',
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
    <html lang="id" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  );
}