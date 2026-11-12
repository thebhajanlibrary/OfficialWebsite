import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — lyrics beside the recording`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  manifest: "/manifest.webmanifest",
  keywords: [
    "bhajan",
    "bhajans",
    "satsang",
    "Hanuman Chalisa",
    "aarti",
    "kirtan",
    "Hindi lyrics",
    "Roman lyrics",
    "bhajan lyrics",
    "devotional songs",
    "Indo-Caribbean bhajan",
    "chutney",
    "chowtal",
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — lyrics beside the recording`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/icons/logo-512.png",
        width: 512,
        height: 512,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} — lyrics beside the recording`,
    description: SITE_DESCRIPTION,
    images: ["/icons/logo-512.png"],
  },
  robots: { index: true, follow: true },
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
