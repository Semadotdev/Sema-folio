import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatButton from "@/components/ChatButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Semadotdev",
    template: "%s | Semadotdev",
  },
  description: "A modern portfolio showcasing projects, skills, and experiences.",
  icons: {
    icon: "/images/Semadotdev-logo.png",
    apple: "/images/Semadotdev-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        {children}
        <ChatButton />
      </body>
    </html>
  );
}
