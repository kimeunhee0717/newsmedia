import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("posts").order("desc").collect();
  },
});

export const getById = query({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    toolName: v.string(),
    category: v.string(),
    rating: v.number(),
    summary: v.string(),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    pricing: v.string(),
    authorId: v.string(),
    authorName: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("posts", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const updateCategory = mutation({
  args: {
    id: v.id("posts"),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { category: args.category });
  },
});

export const remove = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
