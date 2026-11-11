import type { Metadata } from "next";
import { BhajanForm } from "@/components/bhajan/BhajanForm";
import { saveBhajanAction } from "@/lib/actions";
import { getCategories } from "@/lib/queries";

export const metadata: Metadata = { title: "Add bhajan" };

export default async function NewBhajanPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-primary">
          Add bhajan
        </h1>
        <p className="mt-1 text-muted">
          Add in any order — categories organise it automatically.
        </p>
      </div>
      <BhajanForm categories={categories} action={saveBhajanAction} />
    </div>
  );
}
