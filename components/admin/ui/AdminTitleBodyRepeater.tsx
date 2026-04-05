"use client";

import { AdminDangerButton } from "@/components/admin/ui/AdminButtons";
import { AdminSecondaryButton } from "@/components/admin/ui/AdminButtons";
import { AdminFormField } from "@/components/admin/ui/AdminFormField";
import { AdminTextareaField } from "@/components/admin/ui/AdminTextareaField";

export type TitleBodyRow = { title: string; body: string };

type Props = {
  items: TitleBodyRow[];
  onChange: (items: TitleBodyRow[]) => void;
  titleFieldLabel: string;
  bodyFieldLabel: string;
  titlePlaceholder?: string;
  bodyPlaceholder?: string;
  sectionHelper?: string;
  itemLabel: (index: number) => string;
  addButtonLabel: string;
};

export function AdminTitleBodyRepeater({
  items,
  onChange,
  titleFieldLabel,
  bodyFieldLabel,
  titlePlaceholder,
  bodyPlaceholder,
  sectionHelper,
  itemLabel,
  addButtonLabel,
}: Props) {
  function update(i: number, field: keyof TitleBodyRow, v: string) {
    const next = items.map((row, j) => (j === i ? { ...row, [field]: v } : row));
    onChange(next);
  }

  function remove(i: number) {
    onChange(items.filter((_, j) => j !== i));
  }

  function add() {
    onChange([...items, { title: "", body: "" }]);
  }

  return (
    <div className="space-y-4">
      {sectionHelper ? <p className="text-xs text-zinc-500">{sectionHelper}</p> : null}
      {items.map((row, i) => (
        <div key={i} className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-500/90">
            {itemLabel(i)}
          </p>
          <div className="space-y-4">
            <AdminFormField
              label={titleFieldLabel}
              value={row.title}
              onChange={(v) => update(i, "title", v)}
              placeholder={titlePlaceholder}
            />
            <AdminTextareaField
              label={bodyFieldLabel}
              value={row.body}
              onChange={(v) => update(i, "body", v)}
              placeholder={bodyPlaceholder}
              rows={3}
            />
          </div>
          {items.length > 1 ? (
            <AdminDangerButton type="button" className="mt-3" onClick={() => remove(i)}>
              Remove this item
            </AdminDangerButton>
          ) : null}
        </div>
      ))}
      <AdminSecondaryButton type="button" onClick={add}>
        {addButtonLabel}
      </AdminSecondaryButton>
    </div>
  );
}
