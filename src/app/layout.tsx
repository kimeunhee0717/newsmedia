import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const metadata: Metadata = {
  title: {
    default: "AI 도구 리뷰 블로그",
    template: "%s | AI 도구 리뷰",
  },
  description: "최신 AI 도구를 직접 써보고 솔직하게 리뷰합니다",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "AI 도구 리뷰 블로그",
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="ko">
        <head>
          {/* 구글 애드센스 스크립트 (승인 후 아래 주석 해제하고 ca-pub-번호 교체) */}
          {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ID" crossOrigin="anonymous"></script> */}
        </head>
        <body className="min-h-screen bg-gray-50">
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
