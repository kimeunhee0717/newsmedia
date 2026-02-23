import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import HomeContent from "@/components/HomeContent";
import { getConvexClient } from "@/lib/convex";
import { api } from "../../convex/_generated/api";

export const metadata: Metadata = {
  title: "AI 도구 리뷰 블로그 | 실사용 리뷰와 활용 가이드",
  description:
    "최신 AI 도구를 직접 써보고 핵심 장단점, 가격, 추천 대상을 정리해 빠르게 판단할 수 있게 도와드립니다.",
  openGraph: {
    title: "AI 도구 리뷰 블로그",
    description:
      "최신 AI 도구를 직접 써보고 핵심 장단점, 가격, 추천 대상을 정리해 빠르게 판단할 수 있게 도와드립니다.",
    type: "website",
  },
};

export const revalidate = 60;

type HomePost = {
  _id: string;
  title: string;
  toolName: string;
  category: string;
  rating: number;
  summary: string;
  content: string;
  imageUrl?: string;
  pricing: string;
  authorId: string;
  authorName: string;
  createdAt: number;
};

export default async function Home() {
  const client = getConvexClient();
  let posts: HomePost[] = [];

  if (client) {
    try {
      posts = (await client.query(api.posts.list)) as HomePost[];
    } catch {
      posts = [];
    }
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <section className="mb-12 rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-blue-50 px-6 py-12 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-600">
            AI Tool Review
          </p>
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            어떤 도구를 써야 할지 5분 안에 결정할 수 있도록 도와드립니다
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            실제 사용 기준으로 핵심 장단점, 가격, 추천 대상까지 정리해 빠르게 판단하실 수 있게 구성했습니다.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#reviews"
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              최신 리뷰 보기
            </Link>
            <Link
              href="/tools"
              className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              유용한 도구 바로가기
            </Link>
          </div>
        </section>

        <section id="reviews">
          <HomeContent posts={posts} />
        </section>
      </main>
    </>
  );
}
