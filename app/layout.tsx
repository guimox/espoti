import type { Metadata } from 'next';
import { Staatliches } from 'next/font/google';
import './globals.css';
import Footer from '@/components/footer';
import Header from '@/components/header';

const staatliches = Staatliches({
  variable: '--font-custom',
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Sinalos',
  description: 'Share your favorite songs organically.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <body
        className={`${staatliches.variable} relative mx-auto flex h-screen max-w-[1100px] flex-col justify-between bg-zinc-900 antialiased transition-all duration-500 *:selection:bg-green-700 *:selection:text-white`}
      >
        <div className="noise-overlay" />
        <Header />
        <main className="h-fit">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
