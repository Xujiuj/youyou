import type { Metadata } from "next";
import { Cormorant_Garamond, Great_Vibes } from "next/font/google";
import "./globals.css";

const serif = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif" 
});
const script = Great_Vibes({ 
  subsets: ["latin"], 
  weight: ["400"],
  variable: "--font-script" 
});

export const metadata: Metadata = {
  title: "世界上最好的优优",
  description: "romance",
  icons: {
    icon: "/youyou.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={`${serif.variable} ${script.variable}`}>{children}</body>
    </html>
  );
}
