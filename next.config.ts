import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this folder: a stray package-lock.json exists
  // in a parent directory (unrelated project), which Next.js would otherwise
  // mistake for a monorepo root.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
