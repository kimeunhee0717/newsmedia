import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import { getConvexClient } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const revalidate = 60;

type Post = {
  _id: string;
  title: string;
  toolName: string;
  category: string;
  rating: number;
  summary: string;
  content: string;
  pricing: string;
  authorName: string;
  createdAt: number;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const client = getConvexClient();
  if (!client) return { title: "Post" };

  try {
    const post = (await client.query(api.posts.getById, {
      id: id as Id<"posts">,
    })) as Post | null;

    if (!post) return { title: "Post not found" };

    return {
      title: `${post.title} | AI Tool Review Blog`,
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
    return { title: "Post" };
  }
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = getConvexClient();

  let post: Post | null = null;
  if (client) {
    try {
      post = (await client.query(api.posts.getById, {
        id: id as Id<"posts">,
      })) as Post | null;
    } catch {
      post = null;
    }
  }

  if (!post) {
    return (
      <>
        <Header />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <p className="text-6xl mb-4">404</p>
          <p className="text-lg text-gray-500">Post not found</p>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            Back to home
          </Link>
        </div>
      </>
    );
  }

  const stars = "★".repeat(post.rating);
  const date = new Date(post.createdAt).toLocaleDateString("ko-KR");

  return (
    <>
      <Header />
      <article className="mx-auto max-w-3xl px-4 py-8">
        <Link href="/" className="mb-6 inline-block text-sm text-blue-600 hover:underline">
          Back to list
        </Link>

        <div className="rounded-xl border border-gray-200 bg-white p-8">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            {post.category}
          </span>

          <h1 className="mt-4 mb-2 text-3xl font-bold text-gray-900">{post.title}</h1>

          <div className="mb-6 flex items-center gap-4 text-sm text-gray-500">
            <span>{post.authorName}</span>
            <span>{date}</span>
          </div>

          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-400">Tool</p>
                <p className="font-bold text-blue-600">{post.toolName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Pricing</p>
                <p className="font-bold">{post.pricing}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Rating</p>
                <p>{stars}</p>
              </div>
            </div>
          </div>

          <p className="mb-6 rounded-lg bg-blue-50 p-4 text-lg font-medium text-gray-700 italic">
            &quot;{post.summary}&quot;
          </p>

          <div className="prose max-w-none whitespace-pre-wrap leading-relaxed text-gray-700">
            {post.content}
          </div>
        </div>
      </article>
    </>
  );
}
