import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ゆるストレッチ",
  description: "部位と時間を選ぶだけ。運動が苦手な方でも始めやすい、短時間のストレッチガイド。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf6ef",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className="min-h-dvh font-sans leading-relaxed">{children}</body>
    </html>
  );
}
