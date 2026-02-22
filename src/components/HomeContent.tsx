"use client";

import { useState } from "react";
import PostCard from "@/components/PostCard";

const CATEGORIES = ["전체", "디지털라이프", "AI소식", "재테크", "편집중", "브리핑"];

interface Post {
  _id: string;
  title: string;
  toolName: string;
  category: string;
  rating: number;
  summary: string;
  pricing: string;
  createdAt: number;
}

export default function HomeContent({ posts }: { posts: Post[] }) {
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const filteredPosts = posts?.filter(
    (post) => selectedCategory === "전체" || post.category === selectedCategory
  );

  return (
    <>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      {filteredPosts && filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-20">
          <p className="text-6xl mb-4">📝</p>
          <p className="text-lg">아직 작성된 리뷰가 없습니다</p>
          <p className="text-sm mt-2">로그인 후 첫 번째 리뷰를 작성해 보세요!</p>
        </div>
      )}
    </>
  );
}
