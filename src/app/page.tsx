import type { Metadata } from "next";
import Header from "@/components/Header";
import HomeContent from "@/components/HomeContent";
import { getConvexClient } from "@/lib/convex";
import { api } from "../../convex/_generated/api";

export const metadata: Metadata = {
  title: "AI Tool Review Blog | Practical Guides and Honest Reviews",
  description:
    "Hands-on AI tool reviews, usage guides, and practical workflows you can apply right away.",
  openGraph: {
    title: "AI Tool Review Blog",
    description:
      "Hands-on AI tool reviews, usage guides, and practical workflows you can apply right away.",
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
        <section className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Practical AI tool reviews and real usage notes
          </h1>
          <p className="text-lg text-gray-500">
            We test recent AI tools directly and publish concise, practical takeaways.
          </p>
        </section>

        <HomeContent posts={posts} />
      </main>
    </>
  );
}
