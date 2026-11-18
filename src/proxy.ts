import { NextResponse, type NextRequest } from "next/server";
import { LOCAL_ONLY_BABLA_KANCHAN_SLUGS, TRADITIONAL_CHUTNEY_ENABLED } from "@/lib/features";
import { updateSession } from "@/lib/supabase/middleware";

const sharedArtwork = new Set([
  "/images/chutney/lets-sing-and-dance-with-dropati.png",
  "/images/chutney/lets-sing-and-dance-with-dropati-player-v2.png",
  "/images/chutney/gularie-kay-phool-rasika-dindial.jpg",
  "/images/chutney/lotela-sonny-mann.jpg",
  "/images/chutney/na-manu-na-manu-bidjanwatie-chaitoe.jpg",
  "/images/chutney/payaliya-devanand-gattoo.jpg",
]);

function isPrivateChutneyMedia(path: string) {
  if (path.startsWith("/images/") || path.startsWith("/audio/folders/chutney-style-bhajan/")) {
    const slug = path.slice(path.lastIndexOf("/") + 1).replace(/(?:-player)?\.[^.]+$/, "");
    if (LOCAL_ONLY_BABLA_KANCHAN_SLUGS.has(slug)) return true;
  }
  if (sharedArtwork.has(path)) return false;
  if (path === "/audio/chutney/lets-sing-and-dance-with-dropati/01-gowri-rooja.mp3") {
    return false;
  }
  return path.startsWith("/audio/chutney/") ||
    path.startsWith("/images/chutney/") ||
    path.startsWith("/images/albums/lets-sing-and-dance-with-dropati") ||
    path === "/images/folders/wedding/chutney-wedding.jpg";
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
    return updateSession(request);
  }
  if (TRADITIONAL_CHUTNEY_ENABLED) return NextResponse.next();

  const mediaPath =
    pathname === "/_next/image"
      ? (searchParams.get("url") ?? "").split("?")[0]
      : pathname;
  let path: string;
  try {
    path = decodeURIComponent(mediaPath);
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  if (
    path === "/chutney" || path.startsWith("/chutney/") ||
    path === "/wedding" || path.startsWith("/wedding/") ||
    isPrivateChutneyMedia(path)
  ) {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/auth/:path*",
    "/chutney/:path*",
    "/wedding/:path*",
    "/audio/chutney/:path*",
    "/audio/folders/chutney-style-bhajan/:path*",
    "/images/:path*",
    "/_next/image",
  ],
};
