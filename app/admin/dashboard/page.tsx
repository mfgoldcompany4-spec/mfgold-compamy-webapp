import { auth } from "@/auth";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import { parseAboutContent, parseHomeContent } from "@/lib/cms-types";
import { getContactInfo, getFooterContent } from "@/lib/cms-queries";
import { prisma } from "@/lib/prisma";
import { SitePageKey } from "@prisma/client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const [homeRow, aboutRow, services, projects, gallery, contactRow, footerRow] = await Promise.all([
    prisma.siteContent.findUnique({ where: { pageKey: SitePageKey.HOME } }),
    prisma.siteContent.findUnique({ where: { pageKey: SitePageKey.ABOUT } }),
    prisma.service.findMany({ orderBy: { order: "asc" } }),
    prisma.project.findMany({ orderBy: { order: "asc" } }),
    prisma.galleryImage.findMany({ orderBy: { order: "asc" } }),
    prisma.contactInfo.findUnique({ where: { id: "default" } }),
    prisma.footerContent.findUnique({ where: { id: "default" } }),
  ]);

  const contact = contactRow ?? (await getContactInfo());
  const footer = footerRow ?? (await getFooterContent());

  const home = {
    ...parseHomeContent(homeRow?.data),
    published: homeRow?.published ?? true,
  };
  const about = {
    ...parseAboutContent(aboutRow?.data),
    published: aboutRow?.published ?? true,
  };

  return (
    <AdminDashboardClient
      sessionEmail={session.user.email}
      homeContentUpdatedAt={homeRow?.updatedAt.toISOString() ?? "home-default"}
      aboutContentUpdatedAt={aboutRow?.updatedAt.toISOString() ?? "about-default"}
      contactUpdatedAt={contact.updatedAt.toISOString()}
      footerUpdatedAt={footer.updatedAt.toISOString()}
      home={home}
      about={about}
      contact={contact}
      footer={footer}
      services={services}
      projects={projects}
      gallery={gallery}
    />
  );
}
