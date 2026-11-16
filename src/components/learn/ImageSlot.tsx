import type { LearnImage } from "@/lib/learn/types";

export function ImageSlot({
  image,
  selected = false,
}: {
  image: LearnImage;
  selected?: boolean;
}) {
  return (
    <span
      className={`flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-b-4 p-3 text-center ${
        selected ? "border-[#58b51d] bg-[#edf8e6]" : "border-border bg-surface"
      }`}
    >
      {image.src ? (
        <Image src={image.src} alt={image.alt} width={1254} height={1254} sizes="(max-width: 640px) 50vw, 340px" className="h-full w-full rounded-xl object-contain" />
      ) : (
        <span className="text-sm leading-snug text-muted" role="img" aria-label={image.alt}>
          Reference photograph pending
        </span>
      )}
    </span>
  );
}
import Image from "next/image";
