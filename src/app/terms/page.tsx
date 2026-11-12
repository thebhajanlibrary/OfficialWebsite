import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { LegalDocument, LegalSection } from "@/components/legal/LegalDocument";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata = pageMeta({
  title: "Terms and Conditions",
  description: "The terms for using Bhajan Library.",
  path: "/terms",
});

const updated = "11 November 2026";

export default function TermsPage() {
  return (
    <LegalDocument title="Terms and Conditions" updated={updated}>
      <LegalSection title="Using the library">
        <p>
          Bhajan Library is a satsang library of bhajans, lyrics, and
          recordings. By browsing, playing a song, or sending us anything, you
          agree to these terms and to our{" "}
          <Link href="/privacy" className="font-medium text-primary underline decoration-accent/60 underline-offset-4 hover:text-accent">
            Privacy Policy
          </Link>
          .
        </p>
        <p>
          The library is for listening and reading. It is not a shop, and it
          does not sell the songs.
        </p>
      </LegalSection>

      <LegalSection title="Recordings and lyrics">
        <p>
          Titles, lyrics, recordings, and videos may belong to the artists,
          writers, labels, or other rights holders. Bhajan Library does not
          claim those rights. A page on this site is a place to find and play a
          song, not a transfer of ownership.
        </p>
        <p>
          Some recordings play from YouTube. Those plays follow YouTube's own
          terms. Other recordings are files kept with the library. Lyrics are
          shown so people can sing along. They can contain mistakes. If a line
          is wrong, write to us and we will correct it.
        </p>
      </LegalSection>

      <LegalSection title="What you may do">
        <p>
          You may listen, read the lyrics, and share a link to a page on this
          site. You may not copy the library, sell it, or republish the
          recordings or lyric pages as your own collection.
        </p>
      </LegalSection>

      <LegalSection title="Songs you send us">
        <p>
          If you upload a song, you confirm that you are allowed to share that
          recording, lyric, and any name or picture you include. You allow
          Bhajan Library to review it and, if we accept it, to show it on the
          site.
        </p>
        <p>
          We can edit, refuse, or remove a submission. Sending a song does not
          guarantee that it will be published.
        </p>
      </LegalSection>

      <LegalSection title="Taking something down">
        <p>
          If a recording, lyric, or other material on the site should be
          removed, email{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-primary underline decoration-accent/60 underline-offset-4 hover:text-accent"
          >
            {CONTACT_EMAIL}
          </a>{" "}
          with the page address and the reason. We will look at it and take
          down material that should not be here.
        </p>
      </LegalSection>

      <LegalSection title="The site itself">
        <p>
          We keep the library as carefully as we can. Pages can be incomplete,
          a link can fail, and the site can be unavailable. We can change,
          move, or remove songs and these terms. The date at the top of this
          page is the version in force.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these terms go to{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-primary underline decoration-accent/60 underline-offset-4 hover:text-accent"
          >
            {CONTACT_EMAIL}
          </a>{" "}
          or the{" "}
          <Link href="/contact" className="font-medium text-primary underline decoration-accent/60 underline-offset-4 hover:text-accent">
            contact form
          </Link>
          .
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
