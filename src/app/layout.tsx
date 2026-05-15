import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ContentProvider } from "@/context/ContentContext";
import ChatButton from "@/components/ChatButton";
import AdminPanel from "@/components/AdminPanel";

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
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
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
        <ContentProvider>
          {children}
          <ChatButton />
          <AdminPanel />
        </ContentProvider>
      </body>
    </html>
  );
}
