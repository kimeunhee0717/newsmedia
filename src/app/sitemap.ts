import type { MetadataRoute } from "next";
import { getConvexClient } from "@/lib/convex";
import { api } from "../../convex/_generated/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

type SitemapPost = {
  _id: string;
  createdAt: number;
};

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = getConvexClient();
  let posts: SitemapPost[] = [];

  if (client) {
    try {
      posts = (await client.query(api.posts.list)) as SitemapPost[];
    } catch {
      posts = [];
    }
  }

  const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post._id}`,
    lastModified: new Date(post.createdAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...blogPosts,
  ];
}
