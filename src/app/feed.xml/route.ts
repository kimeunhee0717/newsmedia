import { getConvexClient } from "@/lib/convex";
import { api } from "../../../convex/_generated/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
const SITE_TITLE = "AI Tool Review Blog";
const SITE_DESCRIPTION =
  "Hands-on AI tool reviews, practical usage notes, and implementation guides.";

type FeedPost = {
  _id: string;
  title: string;
  summary: string;
  category: string;
  authorName: string;
  createdAt: number;
};

export async function GET() {
  const client = getConvexClient();
  let posts: FeedPost[] = [];

  if (client) {
    try {
      posts = (await client.query(api.posts.list)) as FeedPost[];
    } catch {
      posts = [];
    }
  }

  const itemsXml = posts
    .slice(0, 50)
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/blog/${post._id}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post._id}</guid>
      <description><![CDATA[${post.summary}]]></description>
      <category>${post.category}</category>
      <author>${post.authorName}</author>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
    </item>`
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
