import type { Metadata } from "next";
import { Staatliches } from "next/font/google";
import "./globals.css";

const geistSans = Staatliches({ variable: "--font-custom", weight: "400" });

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
        className={`${geistSans.variable} antialiased bg-black grid h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
