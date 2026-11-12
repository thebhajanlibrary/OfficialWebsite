"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    if (String(data.get("_honey") ?? "").trim()) {
      setStatus("sent");
      return;
    }

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (name.length < 2) {
      setStatus("error");
      setError("Please enter your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setError("Please enter a valid email address.");
      return;
    }
    if (message.length < 10) {
      setStatus("error");
      setError("Please write a message of at least a few words.");
      return;
    }

    setStatus("sending");
    setError("");

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${CONTACT_EMAIL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            subject,
            message,
            _replyto: email,
            _subject: subject
              ? `Bhajan Library: ${subject}`
              : "Message from the Bhajan Library website",
            _template: "table",
            _captcha: "false",
          }),
        }
      );
      const body = (await response.json().catch(() => null)) as {
        success?: string | boolean;
        message?: string;
      } | null;
      const accepted = body?.success === true || body?.success === "true";
      const waitingToActivate = /activ/i.test(body?.message ?? "");

      if (accepted || waitingToActivate) {
        setStatus("sent");
        return;
      }

      setStatus("error");
      setError(
        body?.message?.trim() ||
          "That message did not go through. Please email us directly and we will reply."
      );
    } catch {
      setStatus("error");
      setError(
        "That message did not go through. Please email us directly and we will reply."
      );
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-3xl border border-border/80 bg-surface/80 px-6 py-12 text-center shadow-sm sm:px-10">
        <CheckCircle2 className="mx-auto h-8 w-8 text-accent" aria-hidden />
        <h2 className="mt-4 font-display text-3xl font-semibold text-primary">
          Message sent
        </h2>
        <p className="mx-auto mt-2 max-w-md text-muted">
          Thank you. We will reply to the email address you gave us.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-accent transition hover:text-primary"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative space-y-5 rounded-3xl border border-border/80 bg-surface/80 p-6 shadow-sm sm:p-8"
    >
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label>
          Leave this empty
          <input
            type="text"
            name="_honey"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-foreground">Name</span>
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-foreground shadow-sm focus:border-accent focus:outline-none"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-foreground">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-foreground shadow-sm focus:border-accent focus:outline-none"
          />
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-foreground">Subject</span>
        <input
          type="text"
          name="subject"
          placeholder="What is this about?"
          className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-foreground shadow-sm focus:border-accent focus:outline-none"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-foreground">Message</span>
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Write your message…"
          className="w-full resize-y rounded-xl border border-border bg-surface px-3.5 py-2.5 text-foreground shadow-sm focus:border-accent focus:outline-none"
        />
      </label>

      {status === "error" ? (
        <p className="text-sm text-danger" role="alert">
          {error}{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium underline underline-offset-2"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      ) : null}

      <div className="flex flex-col items-start justify-between gap-4 pt-1 sm:flex-row sm:items-center">
        <p className="text-xs text-muted">
          We read every note and reply from the library inbox.
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="flex items-center gap-2 rounded-2xl bg-primary px-8 py-3.5 font-display text-base font-semibold text-white shadow-lg transition hover:bg-primary-hover disabled:opacity-50"
        >
          {status === "sending" ? (
            "Sending…"
          ) : (
            <>
              Send message
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
