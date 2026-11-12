import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Write to Bhajan Library about a song, a correction, or anything else.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 py-4 sm:py-8">
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
          <Mail className="h-3.5 w-3.5" />
          Library inbox
        </div>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
          Contact
        </h1>
        <p className="mx-auto max-w-xl text-base text-muted sm:text-lg">
          Questions, lyric corrections, or a song you would like added — send a
          note and we will write back.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-flex items-center gap-2 font-medium text-primary underline decoration-accent/60 underline-offset-4 transition hover:text-accent"
        >
          {CONTACT_EMAIL}
        </a>
      </div>

      <ContactForm />
    </div>
  );
}
