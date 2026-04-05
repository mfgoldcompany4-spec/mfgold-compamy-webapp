"use server";

import { revalidatePath } from "next/cache";
import { ProjectCategory, SitePageKey } from "@prisma/client";
import { auth } from "@/auth";
import {
  defaultAboutContent,
  defaultHomeContent,
  type AboutContentData,
  type HomeContentData,
} from "@/lib/cms-types";
import { prisma } from "@/lib/prisma";
import { deleteFromR2ByPublicUrl, uploadToR2 } from "@/lib/r2";
import { z } from "zod";

export type AdminResult = { ok?: true; error?: string };

async function guard(): Promise<{ userId: string } | AdminResult> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  return { userId: session.user.id };
}

function revalidateSite() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath("/projects");
  revalidatePath("/contact");
}

const homeStatSchema = z.object({
  label: z.string().min(1, "Please enter a label for each highlight."),
  value: z.string().min(1, "Please enter a value for each highlight (e.g. 25+)."),
});

const homeWhySchema = z.object({
  title: z.string().min(1, "Please enter a title for each “Why choose us” item."),
  body: z.string().min(1, "Please enter a description for each “Why choose us” item."),
});

const saveHomePageContentSchema = z.object({
  heroHeadline: z.string().min(1, "Please enter a headline for the top of the home page."),
  heroSubheadline: z.string().min(1, "Please enter supporting text under the headline."),
  heroImageUrl: z.string().min(4, "Please add a hero image (upload or paste an image URL)."),
  introTitle: z.string().min(1, "Please enter the introduction section title."),
  introBody: z.string().min(1, "Please enter the introduction text."),
  stats: z.array(homeStatSchema).min(1, "Add at least one company highlight."),
  servicesSectionTitle: z.string().min(1, "Please enter the services section title."),
  servicesSectionSubtitle: z.string().min(1, "Please enter the services section subtitle."),
  whyTitle: z.string().min(1, "Please enter the “Why choose us” section title."),
  whyItems: z.array(homeWhySchema).min(1, "Add at least one “Why choose us” item."),
  featuredProjectsTitle: z.string().min(1, "Please enter the featured projects title."),
  featuredProjectsSubtitle: z.string().min(1, "Please enter the featured projects subtitle."),
  ctaTitle: z.string().min(1, "Please enter the call-to-action title."),
  ctaBody: z.string().min(1, "Please enter the call-to-action text."),
  ctaButtonText: z.string().min(1, "Please enter the button label."),
  ctaButtonHref: z.string().min(1, "Please enter where the button should link (e.g. /contact)."),
  contactPreviewTitle: z.string().min(1, "Please enter the contact preview title."),
  contactPreviewBody: z.string().min(1, "Please enter the contact preview text."),
  published: z.boolean(),
});

export type SaveHomePageContentInput = z.infer<typeof saveHomePageContentSchema>;

export async function saveHomePageContent(input: SaveHomePageContentInput): Promise<AdminResult> {
  const g = await guard();
  if ("error" in g && g.error) return g;

  const parsed = saveHomePageContentSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(" ") };
  }

  const v = parsed.data;
  const data: HomeContentData = {
    ...defaultHomeContent(),
    ...v,
  };

  await prisma.siteContent.upsert({
    where: { pageKey: SitePageKey.HOME },
    create: { pageKey: SitePageKey.HOME, data, published: v.published },
    update: { data, published: v.published },
  });

  revalidateSite();
  return { ok: true };
}

const aboutValueSchema = z.object({
  title: z.string().min(1, "Please enter a name for each core value."),
  body: z.string().min(1, "Please describe each core value."),
});

const saveAboutPageContentSchema = z.object({
  overviewTitle: z.string().min(1, "Please enter the overview title."),
  overviewBody: z.string().min(1, "Please enter the overview text."),
  missionTitle: z.string().min(1, "Please enter the mission title."),
  missionBody: z.string().min(1, "Please enter the mission text."),
  visionTitle: z.string().min(1, "Please enter the vision title."),
  visionBody: z.string().min(1, "Please enter the vision text."),
  valuesTitle: z.string().min(1, "Please enter the core values section title."),
  values: z.array(aboutValueSchema).min(1, "Add at least one core value."),
  historyTitle: z.string().min(1, "Please enter the history section title."),
  historyBody: z.string().min(1, "Please enter the history text."),
  sustainabilityTitle: z.string().min(1, "Please enter the sustainability section title."),
  sustainabilityBody: z.string().min(1, "Please enter the sustainability text."),
  teamTitle: z.string().min(1, "Please enter the team section title."),
  teamBody: z.string().min(1, "Please enter the team section text."),
  published: z.boolean(),
});

export type SaveAboutPageContentInput = z.infer<typeof saveAboutPageContentSchema>;

export async function saveAboutPageContent(input: SaveAboutPageContentInput): Promise<AdminResult> {
  const g = await guard();
  if ("error" in g && g.error) return g;

  const parsed = saveAboutPageContentSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(" ") };
  }

  const v = parsed.data;
  const data: AboutContentData = {
    ...defaultAboutContent(),
    ...v,
  };

  await prisma.siteContent.upsert({
    where: { pageKey: SitePageKey.ABOUT },
    create: { pageKey: SitePageKey.ABOUT, data, published: v.published },
    update: { data, published: v.published },
  });

  revalidateSite();
  return { ok: true };
}

const saveContactPageSchema = z.object({
  heroTitle: z.string().min(1, "Please enter the page headline."),
  heroSubtitle: z.string().min(1, "Please enter the subtitle under the headline."),
  email: z.string().min(1, "Please enter a contact email."),
  phone: z.string().min(1, "Please enter a phone number."),
  address: z.string().min(1, "Please enter the office address."),
  businessHours: z.string().min(1, "Please enter your business hours."),
  mapPlaceholder: z.string().min(1, "Please add a short map note or embed instructions."),
  ctaTitle: z.string().min(1, "Please enter the bottom call-to-action title."),
  ctaBody: z.string().min(1, "Please enter the bottom call-to-action text."),
});

export type SaveContactPageInput = z.infer<typeof saveContactPageSchema>;

export async function saveContactPageContent(input: SaveContactPageInput): Promise<AdminResult> {
  const g = await guard();
  if ("error" in g && g.error) return g;

  const parsed = saveContactPageSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(" ") };
  }

  const v = parsed.data;
  await prisma.contactInfo.upsert({
    where: { id: "default" },
    create: { id: "default", ...v },
    update: v,
  });

  revalidateSite();
  return { ok: true };
}

const saveFooterPageSchema = z.object({
  companyDescription: z.string().min(1, "Please enter a short company description for the footer."),
  socialTwitter: z.string().optional(),
  socialLinkedin: z.string().optional(),
  socialFacebook: z.string().optional(),
  socialInstagram: z.string().optional(),
  copyrightLine: z.string().optional(),
});

export type SaveFooterPageInput = z.infer<typeof saveFooterPageSchema>;

export async function saveFooterPageContent(input: SaveFooterPageInput): Promise<AdminResult> {
  const g = await guard();
  if ("error" in g && g.error) return g;

  const parsed = saveFooterPageSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(" ") };
  }

  const v = parsed.data;
  await prisma.footerContent.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      companyDescription: v.companyDescription,
      socialTwitter: v.socialTwitter?.trim() || null,
      socialLinkedin: v.socialLinkedin?.trim() || null,
      socialFacebook: v.socialFacebook?.trim() || null,
      socialInstagram: v.socialInstagram?.trim() || null,
      copyrightLine: v.copyrightLine?.trim() || null,
    },
    update: {
      companyDescription: v.companyDescription,
      socialTwitter: v.socialTwitter?.trim() || null,
      socialLinkedin: v.socialLinkedin?.trim() || null,
      socialFacebook: v.socialFacebook?.trim() || null,
      socialInstagram: v.socialInstagram?.trim() || null,
      copyrightLine: v.copyrightLine?.trim() || null,
    },
  });

  revalidateSite();
  return { ok: true };
}

const serviceSchema = z.object({
  title: z.string().min(1, "Please enter a service title.").max(200),
  description: z.string().min(1, "Please enter a service description.").max(8000),
  imageUrl: z.string().min(4, "Please upload an image or paste an image URL (JPG, PNG, or WebP).").max(2000),
  ctaText: z.string().max(120).optional().or(z.literal("")),
  ctaHref: z.string().max(500).optional().or(z.literal("")),
  order: z.coerce.number().int().min(0).max(9999),
});

export async function upsertService(formData: FormData): Promise<AdminResult> {
  const g = await guard();
  if ("error" in g && g.error) return g;

  const id = formData.get("id");
  const published =
    formData.get("published") === "on" || formData.get("published") === "true";
  const imageUrlMerged =
    String(formData.get("imageUrl") ?? "").trim() ||
    String(formData.get("imageUrlText") ?? "").trim();
  const parsed = serviceSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    imageUrl: imageUrlMerged,
    ctaText: formData.get("ctaText") || "Request consultation",
    ctaHref: formData.get("ctaHref") || "/contact",
    order: formData.get("order") ?? 0,
  });

  if (!parsed.success) return { error: parsed.error.issues.map((i) => i.message).join(", ") };

  const v = parsed.data;
  if (id) {
    await prisma.service.update({
      where: { id: String(id) },
      data: {
        title: v.title,
        description: v.description,
        imageUrl: v.imageUrl,
        ctaText: v.ctaText || "Request consultation",
        ctaHref: v.ctaHref || "/contact",
        order: v.order,
        published,
      },
    });
  } else {
    await prisma.service.create({
      data: {
        title: v.title,
        description: v.description,
        imageUrl: v.imageUrl,
        ctaText: v.ctaText || "Request consultation",
        ctaHref: v.ctaHref || "/contact",
        order: v.order,
        published,
      },
    });
  }

  revalidatePath("/services");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteService(id: string): Promise<AdminResult> {
  const g = await guard();
  if ("error" in g && g.error) return g;
  await prisma.service.delete({ where: { id } });
  revalidatePath("/services");
  revalidatePath("/");
  return { ok: true };
}

const projectSchema = z.object({
  title: z.string().min(1, "Please enter a project title.").max(200),
  description: z.string().min(1, "Please enter a project description.").max(8000),
  category: z.nativeEnum(ProjectCategory),
  imageUrl: z.string().min(4, "Please upload an image or paste an image URL.").max(2000),
  order: z.coerce.number().int().min(0).max(9999),
});

export async function upsertProject(formData: FormData): Promise<AdminResult> {
  const g = await guard();
  if ("error" in g && g.error) return g;

  const id = formData.get("id");
  const featured = formData.get("featured") === "on" || formData.get("featured") === "true";
  const published =
    formData.get("published") === "on" || formData.get("published") === "true";
  const imageUrlMerged =
    String(formData.get("imageUrl") ?? "").trim() ||
    String(formData.get("imageUrlText") ?? "").trim();
  const parsed = projectSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    imageUrl: imageUrlMerged,
    order: formData.get("order") ?? 0,
  });

  if (!parsed.success) return { error: parsed.error.issues.map((i) => i.message).join(", ") };

  const v = { ...parsed.data, featured, published };
  if (id) {
    await prisma.project.update({
      where: { id: String(id) },
      data: v,
    });
  } else {
    await prisma.project.create({ data: v });
  }

  revalidatePath("/projects");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteProject(id: string): Promise<AdminResult> {
  const g = await guard();
  if ("error" in g && g.error) return g;
  await prisma.project.delete({ where: { id } });
  revalidatePath("/projects");
  revalidatePath("/");
  return { ok: true };
}

const gallerySchema = z.object({
  title: z.string().max(200).optional().or(z.literal("")),
  description: z.string().max(8000).optional().or(z.literal("")),
  imageUrl: z.string().min(4, "Please upload a gallery image or paste an image URL.").max(2000),
  category: z.nativeEnum(ProjectCategory).nullable(),
  projectId: z.string().max(200).optional().or(z.literal("")),
  order: z.coerce.number().int().min(0).max(9999),
});

export async function upsertGalleryImage(formData: FormData): Promise<AdminResult> {
  const g = await guard();
  if ("error" in g && g.error) return g;

  const id = formData.get("id");
  const cat = formData.get("category");
  const published =
    formData.get("published") === "on" || formData.get("published") === "true";
  const imageUrlMerged =
    String(formData.get("imageUrl") ?? "").trim() ||
    String(formData.get("imageUrlText") ?? "").trim();
  const parsed = gallerySchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    imageUrl: imageUrlMerged,
    category: cat === "" || cat == null ? null : String(cat),
    projectId: formData.get("projectId"),
    order: formData.get("order") ?? 0,
  });

  if (!parsed.success) return { error: parsed.error.issues.map((i) => i.message).join(", ") };

  const v = { ...parsed.data, published };
  const projectId = v.projectId ? v.projectId : null;

  if (id) {
    await prisma.galleryImage.update({
      where: { id: String(id) },
      data: {
        title: v.title || null,
        description: v.description || null,
        imageUrl: v.imageUrl,
        category: v.category ?? null,
        projectId,
        order: v.order,
        published: v.published,
      },
    });
  } else {
    await prisma.galleryImage.create({
      data: {
        title: v.title || null,
        description: v.description || null,
        imageUrl: v.imageUrl,
        category: v.category ?? null,
        projectId,
        order: v.order,
        published: v.published,
      },
    });
  }

  revalidatePath("/projects");
  return { ok: true };
}

export async function deleteGalleryImage(id: string): Promise<AdminResult> {
  const g = await guard();
  if ("error" in g && g.error) return g;
  const row = await prisma.galleryImage.findUnique({ where: { id } });
  if (row?.imageUrl) {
    try {
      await deleteFromR2ByPublicUrl(row.imageUrl);
    } catch {
      /* ignore storage errors */
    }
  }
  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath("/projects");
  return { ok: true };
}

export type UploadAdminImageResult =
  | { url: string; key: string; bucket: string; contentType: string; size: number }
  | { error: string };

export async function uploadAdminImage(formData: FormData): Promise<UploadAdminImageResult> {
  const g = await guard();
  if ("error" in g && g.error) return { error: g.error };

  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "No file provided." };

  const prefix = String(formData.get("prefix") ?? "uploads").replace(/[^a-zA-Z0-9/_-]/g, "") || "uploads";
  const result = await uploadToR2(file, prefix);
  if ("error" in result) return { error: result.error };
  return {
    url: result.url,
    key: result.key,
    bucket: result.bucket,
    contentType: result.contentType,
    size: result.size,
  };
}

export async function deleteStoredImage(publicUrl: string): Promise<AdminResult> {
  const g = await guard();
  if ("error" in g && g.error) return g;
  try {
    await deleteFromR2ByPublicUrl(publicUrl);
  } catch {
    return { error: "Could not delete object from storage." };
  }
  return { ok: true };
}
