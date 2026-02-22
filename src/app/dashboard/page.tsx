"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Header from "@/components/Header";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["디지털라이프", "AI소식", "재테크", "편집중", "브리핑"];

export default function Dashboard() {
  const { user, isSignedIn } = useUser();
  const createPost = useMutation(api.posts.create);
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    toolName: "",
    category: "디지털라이프",
    rating: 5,
    summary: "",
    content: "",
    pricing: "",
  });
  const [loading, setLoading] = useState(false);

  if (!isSignedIn) {
    return (
      <>
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <p className="text-6xl mb-4">🔒</p>
          <p className="text-lg text-gray-500">로그인이 필요합니다</p>
        </div>
      </>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createPost({
        ...form,
        authorId: user!.id,
        authorName: user!.fullName || user!.username || "익명",
      });
      router.push("/");
    } catch (err) {
      alert("오류가 발생했습니다: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">✍️ 새 리뷰 작성</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">리뷰 제목</label>
            <input type="text" required placeholder="예: ChatGPT 3개월 사용 후기"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">도구 이름</label>
              <input type="text" required placeholder="예: ChatGPT"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={form.toolName} onChange={(e) => setForm({ ...form, toolName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">가격</label>
              <input type="text" required placeholder="예: 무료 / Pro $20/월"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={form.pricing} onChange={(e) => setForm({ ...form, pricing: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">별점 ({form.rating}점)</label>
              <input type="range" min="1" max="5" className="w-full mt-3"
                value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })} />
              <div className="text-center text-lg">{"⭐".repeat(form.rating)}</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">한줄평</label>
            <input type="text" required placeholder="예: 만능 AI, 안 쓰는 게 이상한 도구"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">리뷰 내용</label>
            <textarea required rows={12} placeholder="AI 도구를 사용해본 경험을 자세히 적어주세요..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y"
              value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50">
            {loading ? "게시 중..." : "🚀 리뷰 게시하기"}
          </button>
        </form>
      </main>
    </>
  );
}
