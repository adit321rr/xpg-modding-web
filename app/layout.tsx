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
  
  // JURUS TIPUAN (CACHE BUSTING): Tambahkan ?v=1 agar browser mengira ini file baru!
  icons: {
    icon: '/favicon.png?v=1',
    apple: '/favicon.png?v=1',
  },

  openGraph: {
    title: 'XPG ADATA - Mod To Xtreme 2026',
    description: 'Vote for your favorite elite modder and win IDR 16 Million!',
    url: 'https://xpg-modding2026.com', 
    siteName: 'XPG ADATA Mod To Xtreme',
    images: [
      {
        url: '/images/mte26-logo.webp', 
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