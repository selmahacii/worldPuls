/// <reference types="react" />
import React from "react";
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

/**
 * The Root Layout of World Pulse.
 * 
 * We set up our global fonts here (Geist and Geist Mono for that tech look) 
 * and define all our SEO metadata. This is the shell that wraps everything.
 */
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
    description: "Catch the world's live data streams as they happen.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "World Pulse - Real-Time Global Intelligence",
    description: "Experience the planet's data heartbeat in real-time.",
  },
};

/**
 * Main application container.
 * 
 * We use suppressHydrationWarning on <html> because some of our 
 * dynamic data points might cause slight mismatches between server and client.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): any {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  ) as any;
}
