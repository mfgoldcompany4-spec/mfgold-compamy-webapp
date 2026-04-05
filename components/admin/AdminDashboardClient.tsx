"use client";

import { useState } from "react";
import type { AdminDashboardProps } from "@/components/admin/types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar, ADMIN_NAV, type AdminTab } from "@/components/admin/AdminSidebar";
import { OverviewTab } from "@/components/admin/tabs/OverviewTab";
import { HomeEditorTab } from "@/components/admin/tabs/HomeEditorTab";
import { AboutEditorTab } from "@/components/admin/tabs/AboutEditorTab";
import { ContactEditorTab } from "@/components/admin/tabs/ContactEditorTab";
import { FooterEditorTab } from "@/components/admin/tabs/FooterEditorTab";
import { ServicesTab } from "@/components/admin/tabs/ServicesTab";
import { ProjectsTab } from "@/components/admin/tabs/ProjectsTab";
import { GalleryTab } from "@/components/admin/tabs/GalleryTab";

export type { AdminDashboardProps } from "@/components/admin/types";

export default function AdminDashboardClient(props: AdminDashboardProps) {
  const {
    sessionEmail,
    homeContentUpdatedAt,
    aboutContentUpdatedAt,
    contactUpdatedAt,
    footerUpdatedAt,
    home,
    about,
    contact,
    footer,
    services,
    projects,
    gallery,
  } = props;
  const [tab, setTab] = useState<AdminTab>("overview");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <AdminHeader email={sessionEmail} />
      <div className="flex flex-col md:flex-row">
        <AdminSidebar active={tab} onChange={setTab} />

        <div className="min-h-0 flex-1 border-t border-zinc-800 md:border-t-0">
          <div className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/95 px-4 py-3 backdrop-blur md:hidden">
            <label htmlFor="admin-mobile-nav" className="sr-only">
              Choose admin section
            </label>
            <select
              id="admin-mobile-nav"
              value={tab}
              onChange={(e) => setTab(e.target.value as AdminTab)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/40"
            >
              {ADMIN_NAV.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <main className="overflow-auto px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
            <div className="mx-auto max-w-6xl">
              {tab === "overview" ? (
                <OverviewTab
                  services={services}
                  projects={projects}
                  gallery={gallery}
                  onNavigate={setTab}
                />
              ) : null}
              {tab === "home" ? <HomeEditorTab key={homeContentUpdatedAt} home={home} /> : null}
              {tab === "about" ? <AboutEditorTab key={aboutContentUpdatedAt} about={about} /> : null}
              {tab === "contact" ? <ContactEditorTab key={contactUpdatedAt} contact={contact} /> : null}
              {tab === "footer" ? <FooterEditorTab key={footerUpdatedAt} footer={footer} /> : null}
              {tab === "services" ? <ServicesTab services={services} /> : null}
              {tab === "projects" ? <ProjectsTab projects={projects} /> : null}
              {tab === "gallery" ? <GalleryTab gallery={gallery} projects={projects} /> : null}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
