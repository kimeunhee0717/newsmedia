import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
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
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"])
    .index("by_category", ["category"]),
});
