"use client";

import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminPrimaryButton } from "@/components/admin/ui/AdminButtons";
import type { AdminTab } from "@/components/admin/AdminSidebar";
import type { AdminDashboardProps } from "@/components/admin/types";

type Props = Pick<AdminDashboardProps, "services" | "projects" | "gallery"> & {
  onNavigate: (tab: AdminTab) => void;
};

const cards: {
  tab: AdminTab;
  title: string;
  blurb: string;
  count: (p: Props) => number;
  countLabel: string;
}[] = [
  {
    tab: "home",
    title: "Home Page",
    blurb: "Hero, highlights, services preview, and calls to action.",
    count: () => 1,
    countLabel: "page",
  },
  {
    tab: "about",
    title: "About Page",
    blurb: "Mission, vision, values, and company story.",
    count: () => 1,
    countLabel: "page",
  },
  {
    tab: "services",
    title: "Services",
    blurb: "What you offer — shown on the Services page and home preview.",
    count: (p) => p.services.length,
    countLabel: "items",
  },
  {
    tab: "projects",
    title: "Projects",
    blurb: "Case studies and portfolio entries.",
    count: (p) => p.projects.length,
    countLabel: "items",
  },
  {
    tab: "gallery",
    title: "Gallery",
    blurb: "Photos for the Projects & Gallery page.",
    count: (p) => p.gallery.length,
    countLabel: "images",
  },
  {
    tab: "contact",
    title: "Contact",
    blurb: "Address, email, phone, hours, and map note.",
    count: () => 1,
    countLabel: "page",
  },
  {
    tab: "footer",
    title: "Footer",
    blurb: "Site-wide footer text and social links.",
    count: () => 1,
    countLabel: "section",
  },
];

export function OverviewTab({ services, projects, gallery, onNavigate }: Props) {
  const props = { services, projects, gallery, onNavigate };

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="Dashboard overview"
        description="Update your website without touching code. Choose a section below or use the quick actions. Changes save to your database and appear on the public site after you click Save."
      />

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <button
            key={c.tab}
            type="button"
            onClick={() => onNavigate(c.tab)}
            className="group flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-left transition hover:border-amber-500/40 hover:bg-zinc-900/80"
          >
            <span className="text-sm font-semibold text-white group-hover:text-amber-100">{c.title}</span>
            <span className="mt-2 text-xs leading-relaxed text-zinc-500">{c.blurb}</span>
            <span className="mt-4 text-2xl font-semibold text-amber-400">{c.count(props)}</span>
            <span className="text-xs uppercase tracking-wider text-zinc-600">{c.countLabel}</span>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="text-sm font-semibold text-white">Quick actions</h2>
        <p className="mt-1 text-xs text-zinc-500">Jump straight to common tasks.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <AdminPrimaryButton type="button" onClick={() => onNavigate("home")}>
            Edit home page
          </AdminPrimaryButton>
          <AdminPrimaryButton type="button" onClick={() => onNavigate("services")}>
            Add or edit services
          </AdminPrimaryButton>
          <AdminPrimaryButton type="button" onClick={() => onNavigate("projects")}>
            Add or edit projects
          </AdminPrimaryButton>
          <AdminPrimaryButton type="button" onClick={() => onNavigate("gallery")}>
            Manage gallery
          </AdminPrimaryButton>
          <AdminPrimaryButton type="button" onClick={() => onNavigate("contact")}>
            Update contact info
          </AdminPrimaryButton>
        </div>
      </div>
    </div>
  );
}
