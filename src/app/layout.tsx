import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { QueuePlaybackProvider } from "@/components/bhajan/QueuePlayback";
import { YouTubePlaybackProvider } from "@/components/bhajan/YouTubePlayback";
import { MediaSessionBridge } from "@/components/bhajan/MediaSessionBridge";
import { MiniPlayer } from "@/components/bhajan/MiniPlayer";
import { FloatingPlaybackSync } from "@/components/bhajan/FloatingPlaybackSync";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Bhajan Library",
    template: "%s · Bhajan Library",
  },
  description:
    "A satsang library of bhajans — lyrics, recordings, and collections organised by deity, occasion, and artist.",
  applicationName: "Bhajan Library",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Bhajan Library",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col antialiased"
        suppressHydrationWarning
      >
        <QueuePlaybackProvider>
          <YouTubePlaybackProvider>
            <MediaSessionBridge />
            <Header />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
              {children}
            </main>
            <Footer />
            <FloatingPlaybackSync />
            <MiniPlayer />
          </YouTubePlaybackProvider>
        </QueuePlaybackProvider>
      </body>
    </html>
  );
}
