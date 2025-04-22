import type { Metadata } from 'next';
import { Staatliches } from 'next/font/google';
import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import './globals.css';

const staatliches = Staatliches({
  variable: '--font-custom',
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Espoti - Share your songs organically',
  description:
    'Paste a song and receive a random song that was also pasted. All organically randomized.',
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
        className={`${staatliches.variable} relative mx-auto flex h-dvh max-w-[1100px] flex-col justify-between bg-zinc-900 antialiased transition-all duration-500 *:selection:bg-green-700 *:selection:text-white`}
      >
        <div className="noise-overlay" />
        <Header />
        <main className="h-fit">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
