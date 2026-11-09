import type { Metadata } from "next";
import { Fredoka, Mali, Prompt } from "next/font/google";
import "./globals.css";

const mali = Mali({
  subsets: ["thai", "latin"],
  weight: ["500", "600", "700"],
  variable: "--font-mali",
  display: "swap",
});

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-prompt",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nuggetkub Rates · เรทราคาเกมและแอปแท้ iOS & Android",
  description:
    "ตารางเรทราคาเกมและแอปแท้ iOS และ Android ของร้าน Nuggetkub อัปเดตล่าสุด ดูง่าย แยกตามระบบชัดเจน",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${mali.variable} ${prompt.variable} ${fredoka.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
