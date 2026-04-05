"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@prisma/client";
import { ProjectCategory } from "@prisma/client";
import { deleteProject, upsertProject } from "@/actions/admin";
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

type Props = { projects: Project[] };

const categoryOptions = Object.values(ProjectCategory).map((c) => ({
  value: c,
  label: categoryLabels[c],
}));

function ProjectEditor({
  project,
  onClose,
  onSaved,
  pending,
  start,
}: {
  project?: Project;
  onClose: () => void;
  onSaved: (ok: boolean, msg: string) => void;
  pending: boolean;
  start: (fn: () => void) => void;
}) {
  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [order, setOrder] = useState(String(project?.order ?? 0));
  const [category, setCategory] = useState(project?.category ?? ProjectCategory.EXPLORATION);
  const [imageUrl, setImageUrl] = useState(project?.imageUrl ?? "");
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [published, setPublished] = useState(project?.published ?? true);

  function save() {
    start(async () => {
      const fd = new FormData();
      if (project) fd.set("id", project.id);
      fd.set("title", title);
      fd.set("description", description);
      fd.set("order", order);
      fd.set("category", category);
      fd.set("imageUrl", imageUrl);
      fd.set("imageUrlText", imageUrl);
      if (featured) fd.set("featured", "true");
      if (published) fd.set("published", "true");
      const r = await upsertProject(fd);
      onSaved(!!r.ok, r.ok ? "Project saved." : r.error ?? "Could not save.");
      if (r.ok) onClose();
    });
  }

  return (
    <div className="rounded-xl border border-amber-500/25 bg-zinc-950/80 p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-white">{project ? "Edit project" : "New project"}</h3>
        <AdminSecondaryButton type="button" className="!py-1.5 !text-xs" onClick={onClose}>
          Close
        </AdminSecondaryButton>
      </div>
      <div className="space-y-4">
        <AdminFormField label="Project title" value={title} onChange={setTitle} />
        <AdminSelectField
          label="Category"
          helper="Used for filters on the Projects page."
          value={category}
          onChange={(v) => setCategory(v as ProjectCategory)}
          options={categoryOptions}
        />
        <AdminFormField label="Display order" value={order} onChange={setOrder} type="number" />
        <AdminTextareaField label="Description" value={description} onChange={setDescription} rows={5} />
        <AdminImageUploader label="Photo" prefix="projects" value={imageUrl} onChange={setImageUrl} />
        <AdminCheckboxField
          label="Feature on home page"
          helper="Only a few projects should be featured — they appear in the home page carousel."
          checked={featured}
          onChange={setFeatured}
        />
        <AdminCheckboxField label="Visible on the website" checked={published} onChange={setPublished} />
        <AdminPrimaryButton type="button" disabled={pending} onClick={save}>
          {pending ? "Saving…" : project ? "Update project" : "Add project"}
        </AdminPrimaryButton>
      </div>
    </div>
  );
}

export function ProjectsTab({ projects }: Props) {
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
    <div className="mx-auto max-w-5xl space-y-8 pb-16">
      <AdminPageHeader
        title="Projects"
        description="Showcase work by category: exploration, mining, processing, or export. Featured items can appear on the home page."
      />

      {message?.type === "ok" ? <AdminAlert variant="success">{message.text}</AdminAlert> : null}
      {message?.type === "err" ? <AdminAlert variant="error">{message.text}</AdminAlert> : null}

      <AdminSectionCard title="Add a new project" description="Add a case study or site photo with a short story.">
        {editing === "new" ? (
          <ProjectEditor
            key="new"
            pending={pending}
            start={start}
            onClose={() => setEditing(null)}
            onSaved={(ok, msg) => flash(ok, msg)}
          />
        ) : (
          <AdminPrimaryButton type="button" onClick={() => setEditing("new")}>
            + Add new project
          </AdminPrimaryButton>
        )}
      </AdminSectionCard>

      <div>
        <h2 className="mb-4 text-sm font-semibold text-zinc-300">Your projects ({projects.length})</h2>
        {projects.length === 0 ? (
          <AdminEmptyState
            title="No projects yet"
            description="Add projects to build trust with photos and short descriptions."
            action={
              <AdminPrimaryButton type="button" onClick={() => setEditing("new")}>
                Add a project
              </AdminPrimaryButton>
            }
          />
        ) : (
          <ul className="space-y-4">
            {projects.map((p) => (
              <li key={p.id} className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
                {editing === p.id ? (
                  <div className="p-5">
                    <ProjectEditor
                      key={p.id}
                      project={p}
                      pending={pending}
                      start={start}
                      onClose={() => setEditing(null)}
                      onSaved={(ok, msg) => flash(ok, msg)}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 p-4 sm:flex-row">
                    <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-lg bg-zinc-800 sm:h-auto sm:w-44">
                      <Image src={p.imageUrl} alt="" fill className="object-cover" sizes="200px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-500/90">
                        {categoryLabels[p.category]}
                      </span>
                      <h3 className="text-base font-semibold text-white">{p.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm text-zinc-400">{p.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        {p.featured ? (
                          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-amber-200">
                            On home page
                          </span>
                        ) : null}
                        {p.published ? (
                          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-300">
                            Live
                          </span>
                        ) : (
                          <span className="rounded-full bg-zinc-700 px-2 py-0.5 text-zinc-400">Hidden</span>
                        )}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <AdminSecondaryButton type="button" className="!py-2 !text-xs" onClick={() => setEditing(p.id)}>
                          Edit
                        </AdminSecondaryButton>
                        <AdminDangerButton
                          type="button"
                          disabled={pending}
                          onClick={() =>
                            start(async () => {
                              if (!confirm(`Remove “${p.title}”?`)) return;
                              const r = await deleteProject(p.id);
                              flash(!!r.ok, r.ok ? "Project removed." : r.error ?? "Could not delete.");
                            })
                          }
                        >
                          Delete
                        </AdminDangerButton>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
