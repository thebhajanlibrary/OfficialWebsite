"use client";

import Link from "next/link";
import { markBhajanAutoplay } from "@/lib/play-queue";

type Props = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

/** Song link that starts playback without adding autoplay to the address bar */
export function AutoplayLink({ href, className, children }: Props) {
  return (
    <Link href={href} className={className} onClick={() => markBhajanAutoplay()}>
      {children}
    </Link>
  );
}
