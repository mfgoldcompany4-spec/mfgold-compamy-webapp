import type { ContactInfo, FooterContent, GalleryImage, Project, Service } from "@prisma/client";
import { ProjectCategory, SitePageKey } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  defaultAboutContent,
  defaultHomeContent,
  parseAboutContent,
  parseHomeContent,
  type AboutContentData,
  type HomeContentData,
} from "@/lib/cms-types";
import {
  COMPANY_LEGAL_NAME,
  COMPANY_SHORT_NAME,
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
} from "@/lib/brand";
import { readOrFallback } from "@/lib/db-read";

export async function getHomeContent(): Promise<HomeContentData> {
  return readOrFallback("getHomeContent", defaultHomeContent(), async () => {
    const row = await prisma.siteContent.findUnique({
      where: { pageKey: SitePageKey.HOME },
    });
    if (!row || !row.published) return defaultHomeContent();
    return parseHomeContent(row.data);
  });
}

export async function getAboutContent(): Promise<AboutContentData> {
  return readOrFallback("getAboutContent", defaultAboutContent(), async () => {
    const row = await prisma.siteContent.findUnique({
      where: { pageKey: SitePageKey.ABOUT },
    });
    if (!row || !row.published) return defaultAboutContent();
    return parseAboutContent(row.data);
  });
}

export async function getPublishedServices(): Promise<Service[]> {
  return readOrFallback("getPublishedServices", [], async () => {
    return prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  });
}

export async function getPublishedProjects(): Promise<Project[]> {
  return readOrFallback("getPublishedProjects", [], async () => {
    return prisma.project.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  });
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  return readOrFallback("getFeaturedProjects", [], async () => {
    return prisma.project.findMany({
      where: { published: true, featured: true },
      orderBy: { order: "asc" },
      take: limit,
    });
  });
}

export async function getPublishedGallery(): Promise<GalleryImage[]> {
  return readOrFallback("getPublishedGallery", [], async () => {
    return prisma.galleryImage.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  });
}

const defaultContact: ContactInfo = {
  id: "default",
  heroTitle: `Contact ${COMPANY_SHORT_NAME}`,
  heroSubtitle: "Our team responds to qualified inquiries within one business day.",
  email: CONTACT_EMAIL,
  phone: "+1 (555) 010-4200",
  address: CONTACT_ADDRESS,
  businessHours: "Monday – Friday: 08:00 – 18:00 GMT\nSaturday: By appointment",
  mapPlaceholder: "Map integration available — add embed URL from the admin dashboard.",
  ctaTitle: "Start a confidential conversation",
  ctaBody: "Share your project stage, jurisdiction, and objectives. We will align you with the right technical lead.",
  updatedAt: new Date(),
};

export async function getContactInfo(): Promise<ContactInfo> {
  return readOrFallback("getContactInfo", defaultContact, async () => {
    const row = await prisma.contactInfo.findUnique({ where: { id: "default" } });
    return row ?? defaultContact;
  });
}

const defaultFooter: FooterContent = {
  id: "default",
  companyDescription: `${COMPANY_SHORT_NAME} delivers exploration, mining, processing, and export capabilities for premium gold programs worldwide.`,
  socialTwitter: "https://twitter.com",
  socialLinkedin: "https://linkedin.com",
  socialFacebook: "https://facebook.com",
  socialInstagram: "https://instagram.com",
  copyrightLine: `${COMPANY_LEGAL_NAME}. All rights reserved.`,
  updatedAt: new Date(),
};

export async function getFooterContent(): Promise<FooterContent> {
  return readOrFallback("getFooterContent", defaultFooter, async () => {
    const row = await prisma.footerContent.findUnique({ where: { id: "default" } });
    return row ?? defaultFooter;
  });
}

export const categoryLabels: Record<ProjectCategory, string> = {
  [ProjectCategory.EXPLORATION]: "Exploration",
  [ProjectCategory.MINING]: "Mining",
  [ProjectCategory.PROCESSING]: "Processing",
  [ProjectCategory.EXPORT]: "Export",
};

export const categoryList = Object.values(ProjectCategory);
