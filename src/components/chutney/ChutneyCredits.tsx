import Link from "next/link";
import { chutneyArtistSlug, chutneyPerformerNames } from "@/lib/chutney";

type Props = {
  artist?: string;
  remixer?: string;
  linkClassName?: string;
};

export function ChutneyCredits({
  artist,
  remixer,
  linkClassName = "transition hover:underline",
}: Props) {
  const performers = artist ? chutneyPerformerNames(artist) : [];
  const remixerName = remixer?.trim();

  if (performers.length === 0 && !remixerName) return null;

  return (
    <div className="space-y-1">
      {performers.length > 0 && (
        <p className="text-sm font-medium text-accent">
          {performers.map((name, i) => (
            <span key={name}>
              {i > 0 && <span className="font-normal text-muted"> X </span>}
              <Link
                href={`/chutney/artists/${chutneyArtistSlug(name)}`}
                className={linkClassName}
              >
                {name}
              </Link>
            </span>
          ))}
        </p>
      )}
      {remixerName && (
        <p className="text-sm text-muted">Remixer: {remixerName}</p>
      )}
    </div>
  );
}
