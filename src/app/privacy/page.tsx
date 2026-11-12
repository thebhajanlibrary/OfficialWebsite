import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { LegalDocument, LegalSection } from "@/components/legal/LegalDocument";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata = pageMeta({
  title: "Privacy Policy",
  description: "How Bhajan Library handles information from visitors.",
  path: "/privacy",
});

const updated = "11 November 2026";

export default function PrivacyPage() {
  return (
    <LegalDocument title="Privacy Policy" updated={updated}>
      <LegalSection title="Who we are">
        <p>
          Bhajan Library is a satsang library of bhajans, lyrics, and
          recordings. For anything in this policy, write to{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-primary underline decoration-accent/60 underline-offset-4 hover:text-accent"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
        <p>
          You can read the catalogue, play songs, and search without creating
          an account.
        </p>
      </LegalSection>

      <LegalSection title="Contact form">
        <p>
          If you write to us, we receive the name, email address, subject, and
          message you type. The form is delivered by FormSubmit to the library
          inbox at {CONTACT_EMAIL}. We use that message only to read it and
          reply. We do not add you to a mailing list.
        </p>
      </LegalSection>

      <LegalSection title="Songs you submit">
        <p>
          The upload form collects the song details you choose to send, and
          your name and email if you include them. An admin uses that
          information to review the song. An email address is used only if we
          need to write back about that submission.
        </p>
      </LegalSection>

      <LegalSection title="Library accounts">
        <p>
          Sign-in is for people who look after the library. A successful
          sign-in stores a login cookie through Supabase so the admin pages
          know who is signed in. Visitors who only browse do not get an
          account.
        </p>
      </LegalSection>

      <LegalSection title="What stays on your device">
        <p>
          The player can remember how far you got in a recording, using the
          browser's local storage on that device. A short autoplay flag can
          sit in session storage until the next song starts. Those notes stay
          in your browser. Clearing the site's data removes them.
        </p>
      </LegalSection>

      <LegalSection title="Players and hosting">
        <p>
          When a song plays from YouTube, YouTube receives the usual player
          information under its own privacy policy. The website is hosted on
          Netlify. The host can keep ordinary server logs, such as the address
          of a request and the browser that made it, so the site can run and
          be kept secure.
        </p>
        <p>
          We do not sell personal information, and we do not run advertising
          trackers on these pages.
        </p>
      </LegalSection>

      <LegalSection title="How long we keep a message">
        <p>
          Contact messages stay in the library inbox for as long as we need
          them to reply and to keep a record of the conversation. A song
          submission stays while it is waiting for review and, if we publish
          the song, the public page remains on the site. You can ask us to
          delete a message or a submission you sent.
        </p>
      </LegalSection>

      <LegalSection title="Your choices">
        <p>
          Email{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-primary underline decoration-accent/60 underline-offset-4 hover:text-accent"
          >
            {CONTACT_EMAIL}
          </a>{" "}
          to ask what we hold from you, to correct it, or to ask us to delete
          it. You can also use the{" "}
          <Link href="/contact" className="font-medium text-primary underline decoration-accent/60 underline-offset-4 hover:text-accent">
            contact form
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          If this policy changes, the new version will be on this page with a
          new date. The current version was updated on {updated}. These pages
          sit alongside our{" "}
          <Link href="/terms" className="font-medium text-primary underline decoration-accent/60 underline-offset-4 hover:text-accent">
            Terms and Conditions
          </Link>
          .
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
