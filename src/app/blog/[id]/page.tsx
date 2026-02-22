import { getConvexClient } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Header from "@/components/Header";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 60;

// 글마다 다른 메타 태그 (SEO + SNS 공유)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const client = getConvexClient();
    const post = await client.query(api.posts.getById, { id: id as Id<"posts"> });
    if (!post) return { title: "글을 찾을 수 없습니다" };

    return {
      title: `${post.title} | AI 도구 리뷰`,
      description: post.summary,
      openGraph: {
        title: post.title,
        description: post.summary,
        type: "article",
        publishedTime: new Date(post.createdAt).toISOString(),
        authors: [post.authorName],
      },
    };
  } catch {
    return { title: "AI 도구 리뷰 블로그" };
  }
}

export default async function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = getConvexClient();

  let post;
  try {
    post = await client.query(api.posts.getById, { id: id as Id<"posts"> });
  } catch {
    post = null;
  }

  if (!post) {
    return (
      <>
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <p className="text-6xl mb-4">😢</p>
          <p className="text-lg text-gray-500">글을 찾을 수 없습니다</p>
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">← 홈으로 돌아가기</Link>
        </div>
      </>
    );
  }

  const stars = "⭐".repeat(post.rating);
  const date = new Date(post.createdAt).toLocaleDateString("ko-KR");

  return (
    <>
      <Header />
      <article className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/" className="text-blue-600 hover:underline text-sm mb-6 inline-block">
          ← 목록으로
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
            {post.category}
          </span>

          <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <span>{post.authorName}</span>
            <span>{date}</span>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-400">도구</p>
                <p className="font-bold text-blue-600">{post.toolName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">가격</p>
                <p className="font-bold">{post.pricing}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">별점</p>
                <p>{stars}</p>
              </div>
            </div>
          </div>

          <p className="text-lg text-gray-700 font-medium mb-6 bg-blue-50 p-4 rounded-lg italic">
            &quot;{post.summary}&quot;
          </p>

          <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </div>
        </div>
      </article>
    </>
  );
}
