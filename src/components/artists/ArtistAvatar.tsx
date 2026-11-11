import Image from "next/image";
import { User } from "lucide-react";

type Props = {
  name: string;
  photoUrl?: string | null;
  /** Tailwind size classes for the circle */
  sizeClassName?: string;
  /** Unused — kept for call-site compatibility */
  textClassName?: string;
  priority?: boolean;
  /** cover for photos; contain for logos so the mark stays fully visible; fill for edge-to-edge circular logos */
  imageFit?: "cover" | "contain" | "fill";
};

export function ArtistAvatar({
  name,
  photoUrl,
  sizeClassName = "h-16 w-16 sm:h-20 sm:w-20",
  priority = false,
  imageFit = "cover",
}: Props) {
  if (photoUrl) {
    const fitClass =
      imageFit === "contain"
        ? "object-contain p-[6%]"
        : imageFit === "fill"
          ? "object-cover object-center"
          : "object-cover object-top";
    const bgClass = imageFit === "fill" ? "bg-black" : "bg-white";

    return (
      <span
        className={`relative shrink-0 overflow-hidden rounded-full border border-border ${bgClass} ${sizeClassName}`}
      >
        <Image
          src={photoUrl}
          alt={name}
          fill
          sizes="144px"
          className={fitClass}
          priority={priority}
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full border border-border bg-accent-soft text-primary/45 ${sizeClassName}`}
    >
      <User className="h-[45%] w-[45%]" strokeWidth={1.5} />
    </span>
  );
}
