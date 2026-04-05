"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Service } from "@prisma/client";
import { deleteService, upsertService } from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminSectionCard } from "@/components/admin/ui/AdminSectionCard";
import { AdminFormField } from "@/components/admin/ui/AdminFormField";
import { AdminTextareaField } from "@/components/admin/ui/AdminTextareaField";
import { AdminCheckboxField } from "@/components/admin/ui/AdminCheckboxField";
import { AdminImageUploader } from "@/components/admin/ui/AdminImageUploader";
import { AdminPrimaryButton } from "@/components/admin/ui/AdminButtons";
import { AdminSecondaryButton } from "@/components/admin/ui/AdminButtons";
import { AdminDangerButton } from "@/components/admin/ui/AdminButtons";
import { AdminEmptyState } from "@/components/admin/ui/AdminEmptyState";
import { AdminAlert } from "@/components/admin/ui/AdminAlert";

type Props = { services: Service[] };

function ServiceEditor({
  service,
  onClose,
  onSaved,
  pending,
  start,
}: {
  service?: Service;
  onClose: () => void;
  onSaved: (ok: boolean, msg: string) => void;
  pending: boolean;
  start: (fn: () => void) => void;
}) {
  const [title, setTitle] = useState(service?.title ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [order, setOrder] = useState(String(service?.order ?? 0));
  const [imageUrl, setImageUrl] = useState(service?.imageUrl ?? "");
  const [ctaText, setCtaText] = useState(service?.ctaText ?? "Request consultation");
  const [ctaHref, setCtaHref] = useState(service?.ctaHref ?? "/contact");
  const [published, setPublished] = useState(service?.published ?? true);

  function save() {
    start(async () => {
      const fd = new FormData();
      if (service) fd.set("id", service.id);
      fd.set("title", title);
      fd.set("description", description);
      fd.set("order", order);
      fd.set("imageUrl", imageUrl);
      fd.set("imageUrlText", imageUrl);
      fd.set("ctaText", ctaText);
      fd.set("ctaHref", ctaHref);
      if (published) fd.set("published", "true");
      const r = await upsertService(fd);
      onSaved(!!r.ok, r.ok ? "Service saved." : r.error ?? "Could not save.");
      if (r.ok) onClose();
    });
  }

  return (
    <div className="rounded-xl border border-amber-500/25 bg-zinc-950/80 p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-white">{service ? "Edit service" : "New service"}</h3>
        <AdminSecondaryButton type="button" className="!py-1.5 !text-xs" onClick={onClose}>
          Close
        </AdminSecondaryButton>
      </div>
      <div className="space-y-4">
        <AdminFormField label="Service title" value={title} onChange={setTitle} placeholder="e.g. Gold exploration" />
        <AdminFormField
          label="Display order"
          helper="Lower numbers appear first."
          value={order}
          onChange={setOrder}
          type="number"
        />
        <AdminTextareaField label="Description" value={description} onChange={setDescription} rows={5} />
        <AdminImageUploader
          label="Photo"
          prefix="services"
          value={imageUrl}
          onChange={setImageUrl}
        />
        <AdminFormField
          label="Button text"
          helper="Shown on the service card."
          value={ctaText}
          onChange={setCtaText}
        />
        <AdminFormField label="Button link" value={ctaHref} onChange={setCtaHref} placeholder="/contact" />
        <AdminCheckboxField
          label="Visible on the website"
          checked={published}
          onChange={setPublished}
        />
        <AdminPrimaryButton type="button" disabled={pending} onClick={save}>
          {pending ? "Saving…" : service ? "Update service" : "Add service"}
        </AdminPrimaryButton>
      </div>
    </div>
  );
}

export function ServicesTab({ services }: Props) {
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
        title="Services"
        description="Manage the services that appear on your Services page and in the home page preview. Each service has its own photo and description."
      />

      {message?.type === "ok" ? <AdminAlert variant="success">{message.text}</AdminAlert> : null}
      {message?.type === "err" ? <AdminAlert variant="error">{message.text}</AdminAlert> : null}

      <AdminSectionCard
        title="Add a new service"
        description="Create a service, then use Save. You can edit or remove it anytime below."
      >
        {editing === "new" ? (
          <ServiceEditor
            key="new"
            pending={pending}
            start={start}
            onClose={() => setEditing(null)}
            onSaved={(ok, msg) => flash(ok, msg)}
          />
        ) : (
          <AdminPrimaryButton type="button" onClick={() => setEditing("new")}>
            + Add new service
          </AdminPrimaryButton>
        )}
      </AdminSectionCard>

      <div>
        <h2 className="mb-4 text-sm font-semibold text-zinc-300">Your services ({services.length})</h2>
        {services.length === 0 ? (
          <AdminEmptyState
            title="No services yet"
            description="Add your first service using the button above. Services help visitors understand what you offer."
            action={
              <AdminPrimaryButton type="button" onClick={() => setEditing("new")}>
                Add a service
              </AdminPrimaryButton>
            }
          />
        ) : (
          <ul className="space-y-4">
            {services.map((s) => (
              <li
                key={s.id}
                className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40"
              >
                {editing === s.id ? (
                  <div className="p-5">
                    <ServiceEditor
                      key={s.id}
                      service={s}
                      pending={pending}
                      start={start}
                      onClose={() => setEditing(null)}
                      onSaved={(ok, msg) => flash(ok, msg)}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-stretch">
                    <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-lg bg-zinc-800 sm:h-auto sm:w-44">
                      <Image
                        src={s.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="200px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-white">{s.title}</h3>
                        {s.published ? (
                          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300">
                            Live
                          </span>
                        ) : (
                          <span className="rounded-full bg-zinc-700 px-2 py-0.5 text-xs text-zinc-400">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="mt-2 line-clamp-3 text-sm text-zinc-400">{s.description}</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <AdminSecondaryButton type="button" className="!py-2 !text-xs" onClick={() => setEditing(s.id)}>
                          Edit
                        </AdminSecondaryButton>
                        <AdminDangerButton
                          type="button"
                          disabled={pending}
                          onClick={() =>
                            start(async () => {
                              if (!confirm(`Remove “${s.title}” from the website?`)) return;
                              const r = await deleteService(s.id);
                              flash(!!r.ok, r.ok ? "Service removed." : r.error ?? "Could not delete.");
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
