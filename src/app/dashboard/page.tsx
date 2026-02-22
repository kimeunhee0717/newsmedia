"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import Header from "@/components/Header";
import { api } from "../../../convex/_generated/api";

const CATEGORIES = ["Productivity", "AI News", "Finance", "Interview", "Briefing"];
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

function MissingConvexNotice() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">Dashboard unavailable</h1>
        <p className="text-gray-600">
          Missing <code>NEXT_PUBLIC_CONVEX_URL</code>. Please set the variable in Vercel and redeploy.
        </p>
      </main>
    </>
  );
}

function DashboardForm() {
  const { user, isSignedIn } = useUser();
  const createPost = useMutation(api.posts.create);
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    toolName: "",
    category: CATEGORIES[0],
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
        <main className="mx-auto max-w-3xl px-4 py-20 text-center">
          <p className="text-lg text-gray-600">Please sign in to write a post.</p>
        </main>
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
        authorName: user!.fullName || user!.username || "anonymous",
      });
      router.push("/");
    } catch (err) {
      alert(`Failed to create post: ${String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Write a new review</h1>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-gray-200 bg-white p-8">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Tool Name</label>
              <input
                type="text"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                value={form.toolName}
                onChange={(e) => setForm({ ...form, toolName: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Category</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Pricing</label>
              <input
                type="text"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                value={form.pricing}
                onChange={(e) => setForm({ ...form, pricing: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Rating ({form.rating})</label>
              <input
                type="range"
                min="1"
                max="5"
                className="mt-3 w-full"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number.parseInt(e.target.value, 10) })}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Summary</label>
            <input
              type="text"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Content</label>
            <textarea
              required
              rows={12}
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish review"}
          </button>
        </form>
      </main>
    </>
  );
}

export default function DashboardPage() {
  if (!CONVEX_URL) return <MissingConvexNotice />;
  return <DashboardForm />;
}
