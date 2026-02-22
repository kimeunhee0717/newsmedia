import { getConvexClient } from "@/lib/convex";
import { api } from "../../convex/_generated/api";
import Header from "@/components/Header";
import HomeContent from "@/components/HomeContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 도구 리뷰 블로그 | 직접 써보고 알려드립니다",
  description: "최신 AI 도구를 솔직하게 리뷰하고, 실제 활용법을 공유합니다. ChatGPT, Gemini, Midjourney 등 다양한 AI 도구 리뷰.",
  openGraph: {
    title: "AI 도구 리뷰 블로그",
    description: "최신 AI 도구를 솔직하게 리뷰하고, 실제 활용법을 공유합니다",
    type: "website",
  },
};

export const revalidate = 60; // 60초마다 서버에서 새로 가져옴

export default async function Home() {
  const client = getConvexClient();
  const posts = await client.query(api.posts.list);

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🤖 AI 도구, 직접 써보고 알려드립니다
          </h1>
          <p className="text-lg text-gray-500">
            최신 AI 도구를 솔직하게 리뷰하고, 실제 활용법을 공유합니다
          </p>
        </section>

        {/* Client Component for interactive filtering */}
        <HomeContent posts={posts as any} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16 py-8 text-center text-gray-400 text-sm">
        © 2026 AI 도구 리뷰 블로그. All rights reserved.
      </footer>
    </>
  );
}
