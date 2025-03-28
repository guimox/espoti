import type { Metadata } from "next";
import { Staatliches } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header";

const geistSans = Staatliches({
  variable: "--font-custom",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Sinalos",
  description: "Share your favorite songs organically.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} *:selection:bg-green-600 antialiased max-w-[1100px] duration-500 transition-all mx-auto flex flex-col justify-between bg-zinc-900 h-screen relative`}
      >
        <div className="noise-overlay" />
        <Header />
        <main className="h-fit">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
