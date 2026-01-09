import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const serif = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "只属于你",
  description: "romance",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={`${serif.variable} ${sans.variable}`}>{children}</body>
    </html>
  );
}
