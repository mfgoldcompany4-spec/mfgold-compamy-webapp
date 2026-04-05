"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { GalleryImage, Project } from "@prisma/client";
import { ProjectCategory } from "@prisma/client";
import { ProjectCard } from "@/components/public/ProjectCard";

type Props = {
  projects: Project[];
  gallery: GalleryImage[];
  categoryLabels: Record<ProjectCategory, string>;
};

const filters: { id: ProjectCategory | "ALL"; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: ProjectCategory.EXPLORATION, label: "Exploration" },
  { id: ProjectCategory.MINING, label: "Mining" },
  { id: ProjectCategory.PROCESSING, label: "Processing" },
  { id: ProjectCategory.EXPORT, label: "Export" },
];

export function ProjectsClient({ projects, gallery, categoryLabels }: Props) {
  const [cat, setCat] = useState<ProjectCategory | "ALL">("ALL");

  const filteredProjects = useMemo(() => {
    if (cat === "ALL") return projects;
    return projects.filter((p) => p.category === cat);
  }, [projects, cat]);

  const filteredGallery = useMemo(() => {
    if (cat === "ALL") return gallery;
    return gallery.filter((g) => g.category === cat);
  }, [gallery, cat]);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setCat(f.id)}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition focus-ring ${
              cat === f.id
                ? "bg-gold text-bg"
                : "border border-white/20 text-text-muted hover:border-gold/50 hover:text-gold"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-semibold text-text">Projects</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((p) => (
            <ProjectCard key={p.id} project={p} categoryLabel={categoryLabels} />
          ))}
        </div>
        {filteredProjects.length === 0 ? (
          <p className="mt-8 text-center text-text-muted">No projects in this category.</p>
        ) : null}
      </section>

      <section className="mt-24">
        <h2 className="font-display text-2xl font-semibold text-text">Gallery</h2>
        <p className="mt-2 text-sm text-text-muted">Operations, processing, and logistics imagery.</p>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filteredGallery.map((g) => (
            <figure
              key={g.id}
              className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-bg-elevated"
            >
              <Image
                src={g.imageUrl}
                alt={g.title ?? "Gallery"}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width:640px) 50vw, 25vw"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg to-transparent p-3 opacity-0 transition group-hover:opacity-100">
                {g.title ? <span className="text-xs font-medium text-text">{g.title}</span> : null}
              </figcaption>
            </figure>
          ))}
        </div>
        {filteredGallery.length === 0 ? (
          <p className="mt-8 text-center text-text-muted">No gallery items for this filter.</p>
        ) : null}
      </section>
    </>
  );
}
