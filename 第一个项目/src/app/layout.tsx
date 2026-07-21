import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "店铺搭建工作台",
  description: "可视化亚马逊风格店铺搭建工具",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
