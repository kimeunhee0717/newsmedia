import { getConvexClient } from "@/lib/convex";
import { api } from "../../convex/_generated/api";
import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const revalidate = 3600; // 1시간마다 갱신

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = getConvexClient();
  let posts: any[] = [];

  try {
    posts = await client.query(api.posts.list);
  } catch {
    posts = [];
  }

  const blogPosts = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post._id}`,
    lastModified: new Date(post.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...blogPosts,
  ];
}
