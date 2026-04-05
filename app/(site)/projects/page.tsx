import { ProjectsClient } from "@/components/public/ProjectsClient";
import { SectionHeader } from "@/components/public/SectionHeader";
import {
  categoryLabels,
  getPublishedGallery,
  getPublishedProjects,
} from "@/lib/cms-queries";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects & Gallery",
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();
  const gallery = await getPublishedGallery();

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Portfolio"
        title="Projects & gallery"
        subtitle="Explore active and representative programs across exploration, mining, processing, and export—filter by category to focus the view."
      />
      <div className="mt-12">
        <ProjectsClient projects={projects} gallery={gallery} categoryLabels={categoryLabels} />
      </div>
    </div>
  );
}
