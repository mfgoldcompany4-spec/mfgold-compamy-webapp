"use client";

import { AdminDangerButton } from "@/components/admin/ui/AdminButtons";
import { AdminSecondaryButton } from "@/components/admin/ui/AdminButtons";
import { AdminFormField } from "@/components/admin/ui/AdminFormField";

export type StatRow = { label: string; value: string };

type Props = {
  items: StatRow[];
  onChange: (items: StatRow[]) => void;
  sectionHelper?: string;
};

export function AdminStatRepeater({ items, onChange, sectionHelper }: Props) {
  function update(i: number, field: keyof StatRow, v: string) {
    const next = items.map((row, j) => (j === i ? { ...row, [field]: v } : row));
    onChange(next);
  }

  function remove(i: number) {
    onChange(items.filter((_, j) => j !== i));
  }

  function add() {
    onChange([...items, { label: "", value: "" }]);
  }

  return (
    <div className="space-y-4">
      {sectionHelper ? <p className="text-xs text-zinc-500">{sectionHelper}</p> : null}
      {items.map((row, i) => (
        <div
          key={i}
          className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-500/90">
            Highlight {i + 1}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminFormField
              label="Label"
              helper="What this number represents (e.g. Years in operation)"
              value={row.label}
              onChange={(v) => update(i, "label", v)}
              placeholder="e.g. Years of experience"
            />
            <AdminFormField
              label="Value"
              helper="The figure visitors see (e.g. 25+)"
              value={row.value}
              onChange={(v) => update(i, "value", v)}
              placeholder="e.g. 25+"
            />
          </div>
          {items.length > 1 ? (
            <AdminDangerButton type="button" className="mt-3" onClick={() => remove(i)}>
              Remove this highlight
            </AdminDangerButton>
          ) : null}
        </div>
      ))}
      <AdminSecondaryButton type="button" onClick={add}>
        + Add another highlight
      </AdminSecondaryButton>
    </div>
  );
}
