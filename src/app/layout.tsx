import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/AppShell";
import { DataProvider } from "@/lib/data/store";
import "./globals.css";


export const metadata: Metadata = {
  title: "SPEAK LAB — 토익스피킹 데일리 트레이닝",
  description: "강의 복습, 만능문장 암기, 실전 타이머 녹음까지. 로컬에 저장되는 토익스피킹 학습 도구.",
};

export const viewport: Viewport = {
  themeColor: "#e7f0f9",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="antialiased">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        <DataProvider>
          <AppShell>{children}</AppShell>
        </DataProvider>
      </body>
    </html>
  );
}
