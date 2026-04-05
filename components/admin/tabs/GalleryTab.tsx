"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { GalleryImage, Project } from "@prisma/client";
import { ProjectCategory } from "@prisma/client";
import { deleteGalleryImage, upsertGalleryImage } from "@/actions/admin";
import { categoryLabels } from "@/lib/cms-queries";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminSectionCard } from "@/components/admin/ui/AdminSectionCard";
import { AdminFormField } from "@/components/admin/ui/AdminFormField";
import { AdminTextareaField } from "@/components/admin/ui/AdminTextareaField";
import { AdminCheckboxField } from "@/components/admin/ui/AdminCheckboxField";
import { AdminSelectField } from "@/components/admin/ui/AdminSelectField";
import { AdminImageUploader } from "@/components/admin/ui/AdminImageUploader";
import { AdminPrimaryButton } from "@/components/admin/ui/AdminButtons";
import { AdminSecondaryButton } from "@/components/admin/ui/AdminButtons";
import { AdminDangerButton } from "@/components/admin/ui/AdminButtons";
import { AdminEmptyState } from "@/components/admin/ui/AdminEmptyState";
import { AdminAlert } from "@/components/admin/ui/AdminAlert";

type Props = { gallery: GalleryImage[]; projects: Project[] };

const categoryOptions = [
  { value: "", label: "No category" },
  ...Object.values(ProjectCategory).map((c) => ({ value: c, label: categoryLabels[c] })),
];

function GalleryEditor({
  image,
  projects,
  onClose,
  onSaved,
  pending,
  start,
}: {
  image?: GalleryImage;
  projects: Project[];
  onClose: () => void;
  onSaved: (ok: boolean, msg: string) => void;
  pending: boolean;
  start: (fn: () => void) => void;
}) {
  const [title, setTitle] = useState(image?.title ?? "");
  const [description, setDescription] = useState(image?.description ?? "");
  const [order, setOrder] = useState(String(image?.order ?? 0));
  const [category, setCategory] = useState(image?.category ?? "");
  const [projectId, setProjectId] = useState(image?.projectId ?? "");
  const [imageUrl, setImageUrl] = useState(image?.imageUrl ?? "");
  const [published, setPublished] = useState(image?.published ?? true);

  const projectOptions = [
    { value: "", label: "Not linked" },
    ...projects.map((p) => ({ value: p.id, label: p.title })),
  ];

  function save() {
    start(async () => {
      const fd = new FormData();
      if (image) fd.set("id", image.id);
      fd.set("title", title);
      fd.set("description", description);
      fd.set("order", order);
      fd.set("category", category);
      fd.set("projectId", projectId);
      fd.set("imageUrl", imageUrl);
      fd.set("imageUrlText", imageUrl);
      if (published) fd.set("published", "true");
      const r = await upsertGalleryImage(fd);
      onSaved(!!r.ok, r.ok ? "Gallery image saved." : r.error ?? "Could not save.");
      if (r.ok) onClose();
    });
  }

  return (
    <div className="rounded-xl border border-amber-500/25 bg-zinc-950/80 p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-white">{image ? "Edit image" : "Add image"}</h3>
        <AdminSecondaryButton type="button" className="!py-1.5 !text-xs" onClick={onClose}>
          Close
        </AdminSecondaryButton>
      </div>
      <div className="space-y-4">
        <AdminImageUploader label="Image" prefix="gallery" value={imageUrl} onChange={setImageUrl} />
        <AdminFormField
          label="Caption title (optional)"
          value={title}
          onChange={setTitle}
          placeholder="Shown on hover"
        />
        <AdminTextareaField
          label="Caption description (optional)"
          value={description}
          onChange={setDescription}
          rows={2}
        />
        <AdminSelectField
          label="Category filter"
          helper="Helps visitors filter the gallery."
          value={category}
          onChange={setCategory}
          options={categoryOptions}
        />
        <AdminSelectField
          label="Link to project (optional)"
          value={projectId}
          onChange={setProjectId}
          options={projectOptions}
        />
        <AdminFormField label="Sort order" value={order} onChange={setOrder} type="number" />
        <AdminCheckboxField label="Visible on the website" checked={published} onChange={setPublished} />
        <AdminPrimaryButton type="button" disabled={pending} onClick={save}>
          {pending ? "Saving…" : image ? "Update image" : "Add to gallery"}
        </AdminPrimaryButton>
      </div>
    </div>
  );
}

export function GalleryTab({ gallery, projects }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [editing, setEditing] = useState<string | "new" | null>(null);

  function flash(ok: boolean, text: string) {
    setMessage({ type: ok ? "ok" : "err", text });
    setTimeout(() => setMessage(null), 5000);
    if (ok) router.refresh();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-16">
      <AdminPageHeader
        title="Gallery"
        description="Photos appear in a grid on the Projects & Gallery page. Optional captions and categories help visitors browse."
      />

      {message?.type === "ok" ? <AdminAlert variant="success">{message.text}</AdminAlert> : null}
      {message?.type === "err" ? <AdminAlert variant="error">{message.text}</AdminAlert> : null}

      <AdminSectionCard title="Upload a new image">
        {editing === "new" ? (
          <GalleryEditor
            key="new"
            projects={projects}
            pending={pending}
            start={start}
            onClose={() => setEditing(null)}
            onSaved={(ok, msg) => flash(ok, msg)}
          />
        ) : (
          <AdminPrimaryButton type="button" onClick={() => setEditing("new")}>
            + Add gallery image
          </AdminPrimaryButton>
        )}
      </AdminSectionCard>

      <div>
        <h2 className="mb-4 text-sm font-semibold text-zinc-300">Gallery grid ({gallery.length})</h2>
        {gallery.length === 0 ? (
          <AdminEmptyState
            title="No images in the gallery"
            description="Upload photos of sites, equipment, or your team."
            action={
              <AdminPrimaryButton type="button" onClick={() => setEditing("new")}>
                Add an image
              </AdminPrimaryButton>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((g) => (
              <div
                key={g.id}
                className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40"
              >
                {editing === g.id ? (
                  <div className="p-4">
                    <GalleryEditor
                      key={g.id}
                      image={g}
                      projects={projects}
                      pending={pending}
                      start={start}
                      onClose={() => setEditing(null)}
                      onSaved={(ok, msg) => flash(ok, msg)}
                    />
                  </div>
                ) : (
                  <>
                    <div className="relative aspect-square bg-zinc-800">
                      <Image src={g.imageUrl} alt={g.title ?? ""} fill className="object-cover" sizes="300px" />
                      {!g.published ? (
                        <span className="absolute right-2 top-2 rounded bg-black/70 px-2 py-0.5 text-xs text-zinc-300">
                          Hidden
                        </span>
                      ) : null}
                    </div>
                    <div className="p-3">
                      <p className="truncate text-sm font-medium text-white">{g.title || "Untitled"}</p>
                      {g.category ? (
                        <p className="text-xs text-amber-500/90">{categoryLabels[g.category]}</p>
                      ) : null}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <AdminSecondaryButton type="button" className="!py-1.5 !text-xs" onClick={() => setEditing(g.id)}>
                          Edit / replace
                        </AdminSecondaryButton>
                        <AdminDangerButton
                          type="button"
                          disabled={pending}
                          onClick={() =>
                            start(async () => {
                              if (!confirm("Remove this image from the gallery?")) return;
                              const r = await deleteGalleryImage(g.id);
                              flash(!!r.ok, r.ok ? "Image removed." : r.error ?? "Could not delete.");
                            })
                          }
                        >
                          Delete
                        </AdminDangerButton>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
