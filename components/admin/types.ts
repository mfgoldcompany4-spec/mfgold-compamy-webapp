import type {
  ContactInfo,
  FooterContent,
  GalleryImage,
  Project,
  Service,
} from "@prisma/client";
import type { AboutContentData, HomeContentData } from "@/lib/cms-types";

export type AdminDashboardProps = {
  sessionEmail: string | null | undefined;
  /** ISO timestamps from DB — used as React keys so editors remount after `router.refresh()`. */
  homeContentUpdatedAt: string;
  aboutContentUpdatedAt: string;
  contactUpdatedAt: string;
  footerUpdatedAt: string;
  home: HomeContentData & { published: boolean };
  about: AboutContentData & { published: boolean };
  contact: ContactInfo;
  footer: FooterContent;
  services: Service[];
  projects: Project[];
  gallery: GalleryImage[];
};
