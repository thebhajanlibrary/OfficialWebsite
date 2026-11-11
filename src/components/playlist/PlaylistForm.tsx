"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import type { Bhajan } from "@/lib/types";

type Item = {
  bhajan_id: string;
  notes: string;
  title: string;
};

type Props = {
  bhajans: Bhajan[];
  initial?: {
    id?: string;
    name?: string;
    description?: string | null;
    items?: { bhajan_id: string; notes: string | null; title: string }[];
  };
  action: (formData: FormData) => Promise<void>;
};

function SortableRow({
  item,
  onNotes,
  onRemove,
}: {
  item: Item;
  onNotes: (notes: string) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.bhajan_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-xl border border-border bg-surface p-3"
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          className="mt-1 rounded p-1 text-muted hover:bg-surface-muted"
          aria-label={`Drag ${item.title}`}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1 space-y-2">
          <p className="font-medium text-primary">{item.title}</p>
          <input
            type="text"
            value={item.notes}
            onChange={(e) => onNotes(e.target.value)}
            placeholder="Optional note for this slot"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="rounded p-2 text-danger hover:bg-surface-muted"
          aria-label={`Remove ${item.title}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function PlaylistForm({ bhajans, initial, action }: Props) {
  const [items, setItems] = useState<Item[]>(
    (initial?.items ?? []).map((i) => ({
      bhajan_id: i.bhajan_id,
      notes: i.notes ?? "",
      title: i.title,
    }))
  );
  const [addId, setAddId] = useState("");

  const available = useMemo(
    () => bhajans.filter((b) => !items.some((i) => i.bhajan_id === b.id)),
    [bhajans, items]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.bhajan_id === active.id);
      const newIndex = prev.findIndex((i) => i.bhajan_id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  function addBhajan() {
    if (!addId) return;
    const bhajan = bhajans.find((b) => b.id === addId);
    if (!bhajan) return;
    setItems((prev) => [
      ...prev,
      { bhajan_id: bhajan.id, notes: "", title: bhajan.title },
    ]);
    setAddId("");
  }

  return (
    <form action={action} className="space-y-6">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}
      {items.map((item) => (
        <span key={item.bhajan_id}>
          <input type="hidden" name="bhajan_ids" value={item.bhajan_id} />
          <input type="hidden" name="notes" value={item.notes} />
        </span>
      ))}

      <section className="space-y-4 rounded-2xl border border-border bg-surface p-4 sm:p-6">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Name *</span>
          <input
            name="name"
            required
            defaultValue={initial?.name ?? ""}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5"
            placeholder="e.g. Diwali Programme 2026"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Description</span>
          <textarea
            name="description"
            defaultValue={initial?.description ?? ""}
            className="min-h-24 w-full rounded-xl border border-border bg-background px-3 py-2.5"
          />
        </label>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-surface p-4 sm:p-6">
        <h2 className="font-display text-xl text-primary">Bhajans</h2>
        <p className="text-sm text-muted">Drag to set the singing order.</p>

        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={addId}
            onChange={(e) => setAddId(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5"
          >
            <option value="">Add a bhajan…</option>
            {available.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addBhajan}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={items.map((i) => i.bhajan_id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {items.map((item) => (
                <SortableRow
                  key={item.bhajan_id}
                  item={item}
                  onNotes={(notes) =>
                    setItems((prev) =>
                      prev.map((i) =>
                        i.bhajan_id === item.bhajan_id ? { ...i, notes } : i
                      )
                    )
                  }
                  onRemove={() =>
                    setItems((prev) =>
                      prev.filter((i) => i.bhajan_id !== item.bhajan_id)
                    )
                  }
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {items.length === 0 && (
          <p className="text-sm text-muted">No bhajans in this playlist yet.</p>
        )}
      </section>

      <button
        type="submit"
        className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
      >
        {initial?.id ? "Save playlist" : "Create playlist"}
      </button>
    </form>
  );
}
