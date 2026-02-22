import { getConvexClient } from "@/lib/convex";
import { api } from "../../../convex/_generated/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
const SITE_TITLE = "AI 도구 리뷰 블로그";
const SITE_DESCRIPTION = "최신 AI 도구를 직접 써보고 솔직하게 리뷰합니다";

export async function GET() {
  const client = getConvexClient();
  let posts: any[] = [];

  try {
    posts = await client.query(api.posts.list);
  } catch {
    posts = [];
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
