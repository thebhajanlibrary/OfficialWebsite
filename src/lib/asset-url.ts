import fs from "fs";
import path from "path";

/** Bust browser / Next image cache when local public assets are replaced (dev only). */
export function assetUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (!url.startsWith("/")) return url;

  const base = url.split("?")[0]!;

  if (process.env.NODE_ENV !== "development") return url;

  try {
    const publicPath = path.join(process.cwd(), "public", base);
    const v = Math.floor(fs.statSync(publicPath).mtimeMs);
    return `${base}?v=${v}`;
  } catch {
    return url;
  }
}
