import { COMPANY_SHORT_NAME } from "@/lib/brand";

export type HomeContentData = {
  heroHeadline: string;
  heroSubheadline: string;
  heroImageUrl: string;
  introTitle: string;
  introBody: string;
  stats: { label: string; value: string }[];
  servicesSectionTitle: string;
  servicesSectionSubtitle: string;
  whyTitle: string;
  whyItems: { title: string; body: string }[];
  featuredProjectsTitle: string;
  featuredProjectsSubtitle: string;
  ctaTitle: string;
  ctaBody: string;
  ctaButtonText: string;
  ctaButtonHref: string;
  contactPreviewTitle: string;
  contactPreviewBody: string;
};

export type AboutContentData = {
  overviewTitle: string;
  overviewBody: string;
  missionTitle: string;
  missionBody: string;
  visionTitle: string;
  visionBody: string;
  valuesTitle: string;
  values: { title: string; body: string }[];
  historyTitle: string;
  historyBody: string;
  sustainabilityTitle: string;
  sustainabilityBody: string;
  teamTitle: string;
  teamBody: string;
};

export function defaultHomeContent(): HomeContentData {
  return {
    heroHeadline: "Excellence in gold discovery and responsible extraction",
    heroSubheadline: `${COMPANY_SHORT_NAME} combines technical rigor, field experience, and disciplined operations to deliver premium mineral outcomes for partners worldwide.`,
    heroImageUrl:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80",
    introTitle: "A trusted partner across the mineral value chain",
    introBody:
      "From early-stage exploration through processing and export logistics, we operate with transparency, safety, and long-term stewardship of the communities where we work.",
    stats: [
      { label: "Years of combined leadership", value: "25+" },
      { label: "Active jurisdictions", value: "12" },
      { label: "Tons processed (annually)", value: "50K+" },
      { label: "Safety incidents target", value: "Zero harm" },
    ],
    servicesSectionTitle: "What we deliver",
    servicesSectionSubtitle:
      "Integrated capabilities designed for complex gold and mineral programs.",
    whyTitle: `Why partners choose ${COMPANY_SHORT_NAME}`,
    whyItems: [
      {
        title: "Technical depth",
        body: "Geologists, engineers, and operators aligned on outcomes—not shortcuts.",
      },
      {
        title: "Operational discipline",
        body: "Rigorous planning, transparent reporting, and accountable execution.",
      },
      {
        title: "Global logistics",
        body: "Refining partnerships and export pathways that meet international standards.",
      },
    ],
    featuredProjectsTitle: "Field-proven delivery",
    featuredProjectsSubtitle:
      "A snapshot of programs that showcase our exploration, mining, and processing expertise.",
    ctaTitle: "Plan your next move with confidence",
    ctaBody:
      "Request a confidential consultation with our leadership team to align on scope, timeline, and partnership models.",
    ctaButtonText: "Request consultation",
    ctaButtonHref: "/contact",
    contactPreviewTitle: "Speak with our team",
    contactPreviewBody:
      "Share your objectives and we will respond with a tailored path forward.",
  };
}

export function defaultAboutContent(): AboutContentData {
  return {
    overviewTitle: "Built on geology, governed by integrity",
    overviewBody: `${COMPANY_SHORT_NAME} is a premium mineral enterprise focused on gold exploration, mining, processing, and export. We partner with investors, operators, and governments to unlock value responsibly.`,
    missionTitle: "Mission",
    missionBody:
      "Deliver superior mineral outcomes through disciplined science, safe operations, and transparent collaboration.",
    visionTitle: "Vision",
    visionBody:
      "To be the reference partner for ethical gold programs across emerging and established mining regions.",
    valuesTitle: "Core values",
    values: [
      { title: "Safety first", body: "People, communities, and environments come before production metrics." },
      { title: "Integrity", body: "We say what we do and do what we say—especially when it is difficult." },
      { title: "Precision", body: "Data-driven decisions at every stage of the value chain." },
      { title: "Partnership", body: "Shared risk, shared learning, and aligned incentives." },
    ],
    historyTitle: "Our background",
    historyBody: `Headquartered in Magburaka, Tonkolili District, Northern Province, Sierra Leone, ${COMPANY_SHORT_NAME} unifies exploration, mine planning, and downstream logistics under one accountable team, with experience across West Africa and beyond.`,
    sustainabilityTitle: "Sustainability & responsibility",
    sustainabilityBody:
      "We integrate environmental management, community engagement, and regulatory compliance into program design—not as an afterthought. Rehabilitation planning and water stewardship are standard on every site we touch.",
    teamTitle: "Leadership philosophy",
    teamBody:
      "Our leadership blends mine-site pragmatism with boardroom clarity—ensuring decisions are safe, investable, and executable.",
  };
}

export function parseHomeContent(raw: unknown): HomeContentData {
  const d = defaultHomeContent();
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  return {
    ...d,
    heroHeadline: typeof o.heroHeadline === "string" ? o.heroHeadline : d.heroHeadline,
    heroSubheadline:
      typeof o.heroSubheadline === "string" ? o.heroSubheadline : d.heroSubheadline,
    heroImageUrl: typeof o.heroImageUrl === "string" ? o.heroImageUrl : d.heroImageUrl,
    introTitle: typeof o.introTitle === "string" ? o.introTitle : d.introTitle,
    introBody: typeof o.introBody === "string" ? o.introBody : d.introBody,
    stats: Array.isArray(o.stats) ? (o.stats as { label: string; value: string }[]) : d.stats,
    servicesSectionTitle:
      typeof o.servicesSectionTitle === "string"
        ? o.servicesSectionTitle
        : d.servicesSectionTitle,
    servicesSectionSubtitle:
      typeof o.servicesSectionSubtitle === "string"
        ? o.servicesSectionSubtitle
        : d.servicesSectionSubtitle,
    whyTitle: typeof o.whyTitle === "string" ? o.whyTitle : d.whyTitle,
    whyItems: Array.isArray(o.whyItems) ? (o.whyItems as { title: string; body: string }[]) : d.whyItems,
    featuredProjectsTitle:
      typeof o.featuredProjectsTitle === "string"
        ? o.featuredProjectsTitle
        : d.featuredProjectsTitle,
    featuredProjectsSubtitle:
      typeof o.featuredProjectsSubtitle === "string"
        ? o.featuredProjectsSubtitle
        : d.featuredProjectsSubtitle,
    ctaTitle: typeof o.ctaTitle === "string" ? o.ctaTitle : d.ctaTitle,
    ctaBody: typeof o.ctaBody === "string" ? o.ctaBody : d.ctaBody,
    ctaButtonText: typeof o.ctaButtonText === "string" ? o.ctaButtonText : d.ctaButtonText,
    ctaButtonHref: typeof o.ctaButtonHref === "string" ? o.ctaButtonHref : d.ctaButtonHref,
    contactPreviewTitle:
      typeof o.contactPreviewTitle === "string" ? o.contactPreviewTitle : d.contactPreviewTitle,
    contactPreviewBody:
      typeof o.contactPreviewBody === "string" ? o.contactPreviewBody : d.contactPreviewBody,
  };
}

export function parseAboutContent(raw: unknown): AboutContentData {
  const d = defaultAboutContent();
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  return {
    ...d,
    overviewTitle: typeof o.overviewTitle === "string" ? o.overviewTitle : d.overviewTitle,
    overviewBody: typeof o.overviewBody === "string" ? o.overviewBody : d.overviewBody,
    missionTitle: typeof o.missionTitle === "string" ? o.missionTitle : d.missionTitle,
    missionBody: typeof o.missionBody === "string" ? o.missionBody : d.missionBody,
    visionTitle: typeof o.visionTitle === "string" ? o.visionTitle : d.visionTitle,
    visionBody: typeof o.visionBody === "string" ? o.visionBody : d.visionBody,
    valuesTitle: typeof o.valuesTitle === "string" ? o.valuesTitle : d.valuesTitle,
    values: Array.isArray(o.values) ? (o.values as { title: string; body: string }[]) : d.values,
    historyTitle: typeof o.historyTitle === "string" ? o.historyTitle : d.historyTitle,
    historyBody: typeof o.historyBody === "string" ? o.historyBody : d.historyBody,
    sustainabilityTitle:
      typeof o.sustainabilityTitle === "string" ? o.sustainabilityTitle : d.sustainabilityTitle,
    sustainabilityBody:
      typeof o.sustainabilityBody === "string" ? o.sustainabilityBody : d.sustainabilityBody,
    teamTitle: typeof o.teamTitle === "string" ? o.teamTitle : d.teamTitle,
    teamBody: typeof o.teamBody === "string" ? o.teamBody : d.teamBody,
  };
}
