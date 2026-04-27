import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "@/src/components/ThemeToggle";
import LenisProvider from "@/src/components/LenisProvider";

export const metadata: Metadata = {
  title: "影评社主题网站",
  description: "基于 Next.js 15 的前卫影评沉浸式体验",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <LenisProvider>{children}</LenisProvider>
        <ThemeToggle />
      </body>
    </html>
  );
}
