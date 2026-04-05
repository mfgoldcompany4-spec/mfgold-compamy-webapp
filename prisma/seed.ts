import "dotenv/config";
import { ProjectCategory, SitePageKey } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  COMPANY_LEGAL_NAME,
  COMPANY_SHORT_NAME,
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
} from "../lib/brand";
import { defaultAboutContent, defaultHomeContent } from "../lib/cms-types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "contact@mfgold-sl.com";
  const password = process.env.ADMIN_PASSWORD ?? "Tonkolili@2026";
  const hash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    create: { email, passwordHash: hash, name: "Site Admin" },
    update: { passwordHash: hash },
  });

  await prisma.siteContent.upsert({
    where: { pageKey: SitePageKey.HOME },
    create: { pageKey: SitePageKey.HOME, data: defaultHomeContent(), published: true },
    update: { data: defaultHomeContent(), published: true },
  });

  await prisma.siteContent.upsert({
    where: { pageKey: SitePageKey.ABOUT },
    create: { pageKey: SitePageKey.ABOUT, data: defaultAboutContent(), published: true },
    update: { data: defaultAboutContent(), published: true },
  });

  const contactPayload = {
    heroTitle: `Contact ${COMPANY_SHORT_NAME}`,
    heroSubtitle:
      "Share your program objectives and our leadership team will respond with next steps.",
    email: CONTACT_EMAIL,
    phone: "+1 (555) 010-4200",
    address: CONTACT_ADDRESS,
    businessHours: "Monday – Friday: 08:00 – 18:00 GMT\nSaturday: By appointment",
    mapPlaceholder:
      "Embed a Google Maps iframe or static map URL via the admin dashboard for production.",
    ctaTitle: "Start a confidential conversation",
    ctaBody:
      "Qualified partners receive a technical lead within one business day. All inquiries are handled discreetly.",
  };

  await prisma.contactInfo.upsert({
    where: { id: "default" },
    create: { id: "default", ...contactPayload },
    update: contactPayload,
  });

  const footerPayload = {
    companyDescription: `${COMPANY_SHORT_NAME} delivers exploration, mining, processing, and export capabilities for premium gold programs worldwide.`,
    socialTwitter: "https://twitter.com",
    socialLinkedin: "https://linkedin.com",
    socialFacebook: "https://facebook.com",
    socialInstagram: "https://instagram.com",
    // FooterContent has no separate poweredBy field — include attribution in copyrightLine (editable in admin).
    copyrightLine: `© ${new Date().getFullYear()} ${COMPANY_LEGAL_NAME} All rights reserved. Powered by M'Mah Technology — https://mmahtech.com`,
  };
  await prisma.footerContent.upsert({
    where: { id: "default" },
    create: { id: "default", ...footerPayload },
    update: footerPayload,
  });

  const count = await prisma.service.count();
  if (count === 0) {
    await prisma.service.createMany({
      data: [
        {
          title: "Gold exploration",
          description:
            "Regional targeting, geochemistry, geophysics, and drill program design to derisk discovery and resource growth.",
          imageUrl:
            "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
          order: 0,
        },
        {
          title: "Mining operations",
          description:
            "Open-pit and underground planning, mine scheduling, fleet management, and productivity systems built for safety.",
          imageUrl:
            "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80",
          order: 1,
        },
        {
          title: "Mineral processing",
          description:
            "Crushing, milling, leaching, and recovery circuits tuned for throughput, recovery, and environmental compliance.",
          imageUrl:
            "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80",
          order: 2,
        },
        {
          title: "Gold refining",
          description:
            "Partnership pathways to accredited refiners with chain-of-custody documentation and assay reconciliation.",
          imageUrl:
            "https://images.unsplash.com/photo-1610375461246-83a1b4cb09bc?w=1200&q=80",
          order: 3,
        },
        {
          title: "Export support",
          description:
            "Regulatory filings, customs coordination, and logistics aligned with LBMA and jurisdictional standards.",
          imageUrl:
            "https://images.unsplash.com/photo-1566576721346-d4a3b4e0ce10?w=1200&q=80",
          order: 4,
        },
        {
          title: "Logistics & supply chain",
          description:
            "Secure transport, warehousing, and inventory visibility from mine gate to refinery or vault.",
          imageUrl:
            "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=1200&q=80",
          order: 5,
        },
        {
          title: "Consulting & partnerships",
          description:
            "Technical due diligence, operator selection, and joint-venture structures for investors and governments.",
          imageUrl:
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
          order: 6,
        },
      ],
    });
  }

  const pCount = await prisma.project.count();
  if (pCount === 0) {
    await prisma.project.createMany({
      data: [
        {
          title: "High-grade vein delineation",
          description:
            "Channel sampling and tight-spaced drilling to upgrade inferred resources ahead of feasibility.",
          category: ProjectCategory.EXPLORATION,
          imageUrl:
            "https://images.unsplash.com/photo-1504384308090-c54be3855833?w=1200&q=80",
          order: 0,
          featured: true,
        },
        {
          title: "Open-pit expansion program",
          description:
            "Strip ratio optimization and grade control modeling for a multi-phase pit pushback.",
          category: ProjectCategory.MINING,
          imageUrl:
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80",
          order: 1,
          featured: true,
        },
        {
          title: "Carbon-in-leach optimization",
          description:
            "Metallurgical testwork, reagent strategy, and throughput uplift across the CIL circuit.",
          category: ProjectCategory.PROCESSING,
          imageUrl:
            "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&q=80",
          order: 2,
          featured: true,
        },
        {
          title: "Doré export corridor",
          description:
            "End-to-end logistics with assay exchange, insurance, and customs clearance in three jurisdictions.",
          category: ProjectCategory.EXPORT,
          imageUrl:
            "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&q=80",
          order: 3,
          featured: false,
        },
      ],
    });
  }

  const gCount = await prisma.galleryImage.count();
  if (gCount === 0) {
    const projects = await prisma.project.findMany({ take: 4 });
    await prisma.galleryImage.createMany({
      data: [
        {
          title: "Core logging",
          description: "Geologists reviewing structure and alteration.",
          imageUrl:
            "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80",
          category: ProjectCategory.EXPLORATION,
          order: 0,
        },
        {
          title: "Haul fleet",
          description: "Production shift moving oxide ore to the pad.",
          imageUrl:
            "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80",
          category: ProjectCategory.MINING,
          order: 1,
        },
        {
          title: "Ball mill line",
          description: "Grinding circuit during planned maintenance window.",
          imageUrl:
            "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=80",
          category: ProjectCategory.PROCESSING,
          order: 2,
        },
        {
          title: "Secure packaging",
          description: "Sealed lots prepared for international transport.",
          imageUrl:
            "https://images.unsplash.com/photo-1565008576549-57e09f6b6e4e?w=1200&q=80",
          category: ProjectCategory.EXPORT,
          order: 3,
        },
      ].map((row, i) => ({
        ...row,
        projectId: projects[i % projects.length]?.id ?? null,
      })),
    });
  }

  console.log("Seed complete. Admin:", email, "(set ADMIN_EMAIL / ADMIN_PASSWORD to override)");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
