"use client";

import Link from "next/link";

interface Post {
  _id: string;
  title: string;
  toolName: string;
  category: string;
  rating: number;
  summary: string;
  pricing: string;
  imageUrl?: string;
  createdAt: number;
}

export default function PostCard({ post }: { post: Post }) {
  const stars = "⭐".repeat(post.rating);
  const date = new Date(post.createdAt).toLocaleDateString("ko-KR");

  const categoryColors: Record<string, string> = {
    "디지털라이프": "bg-purple-100 text-purple-700",
    "AI소식": "bg-pink-100 text-pink-700",
    "재테크": "bg-green-100 text-green-700",
    "편집중": "bg-blue-100 text-blue-700",
    "브리핑": "bg-orange-100 text-orange-700",
  };

  return (
    <Link href={`/blog/${post._id}`}>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {post.imageUrl && (
          <div className="w-full h-48 overflow-hidden">
            <img 
              src={post.imageUrl} 
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${categoryColors[post.category] || "bg-gray-100 text-gray-700"}`}>
              {post.category}
            </span>
            <span className="text-xs text-gray-400">{date}</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{post.title}</h2>
          <p className="text-sm text-blue-600 font-medium mb-2">{post.toolName} · {post.pricing}</p>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.summary}</p>
          <div className="text-sm">{stars}</div>
        </div>
      </div>
    </Link>
  );
}
