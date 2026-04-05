import Image from "next/image";
import type { Project } from "@prisma/client";
import type { ProjectCategory } from "@prisma/client";

type Props = {
  project: Project;
  categoryLabel: Record<ProjectCategory, string>;
};

export function ProjectCard({ project, categoryLabel }: Props) {
  return (
    <article className="group overflow-hidden rounded-lg border border-white/10 bg-bg-elevated transition hover:border-gold/40">
      <div className="relative aspect-[16/10]">
        <Image
          src={project.imageUrl}
          alt=""
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 33vw"
        />
      </div>
      <div className="p-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-gold">
          {categoryLabel[project.category]}
        </span>
        <h3 className="mt-2 font-display text-xl font-semibold text-text">{project.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">{project.description}</p>
      </div>
    </article>
  );
}
