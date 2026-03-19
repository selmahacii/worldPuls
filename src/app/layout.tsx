import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "World Pulse - Real-Time Global Intelligence",
  description: "Live visualization of global data: flights, blockchain transactions, market indices, and sports events. Powered by OpenSky, Blockchain.com, Yahoo Finance, and ESPN APIs.",
  keywords: ["real-time", "data visualization", "flights", "blockchain", "markets", "sports", "Next.js", "TypeScript", "React"],
  authors: [{ name: "World Pulse" }],
  icons: {
    icon: "/globe.svg",
  },
  openGraph: {
    title: "World Pulse - Real-Time Global Intelligence",
    description: "Live visualization of global data streams",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "World Pulse - Real-Time Global Intelligence",
    description: "Live visualization of global data streams",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
