import type { Metadata } from "next";
import { loginAction } from "@/lib/actions";

export const metadata: Metadata = { title: "Admin login" };

type Props = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error, next = "/admin" } = await searchParams;

  return (
    <div className="mx-auto max-w-md space-y-8">
      <div className="text-center">
        <h1 className="font-display text-4xl font-semibold text-primary">
          Admin login
        </h1>
        <p className="mt-2 text-muted">
          Sign in to add and edit bhajans in the library.
        </p>
      </div>

      <form action={loginAction} className="space-y-4 border border-border bg-surface p-6">
        <input type="hidden" name="next" value={next} />
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Password</span>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5"
          />
        </label>
        {error && (
          <p className="bg-accent-soft px-3 py-2 text-sm text-danger">{error}</p>
        )}
        <button
          type="submit"
          className="btn-primary w-full rounded-lg px-4 py-3 text-sm font-semibold"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
