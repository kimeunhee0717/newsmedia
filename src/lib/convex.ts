import { ConvexHttpClient } from "convex/browser";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;

export function getConvexClient() {
  return new ConvexHttpClient(convexUrl);
}
