"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveHomePageContent } from "@/actions/admin";
import type { HomeContentData } from "@/lib/cms-types";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminSectionCard } from "@/components/admin/ui/AdminSectionCard";
import { AdminFormField } from "@/components/admin/ui/AdminFormField";
import { AdminTextareaField } from "@/components/admin/ui/AdminTextareaField";
import { AdminCheckboxField } from "@/components/admin/ui/AdminCheckboxField";
import { AdminStatRepeater } from "@/components/admin/ui/AdminStatRepeater";
import { AdminTitleBodyRepeater } from "@/components/admin/ui/AdminTitleBodyRepeater";
import { AdminImageUploader } from "@/components/admin/ui/AdminImageUploader";
import { AdminPrimaryButton } from "@/components/admin/ui/AdminButtons";
import { AdminAlert } from "@/components/admin/ui/AdminAlert";

type Props = {
  home: HomeContentData & { published: boolean };
};

export function HomeEditorTab({ home }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [heroHeadline, setHeroHeadline] = useState(home.heroHeadline);
  const [heroSubheadline, setHeroSubheadline] = useState(home.heroSubheadline);
  const [heroImageUrl, setHeroImageUrl] = useState(home.heroImageUrl);
  const [introTitle, setIntroTitle] = useState(home.introTitle);
  const [introBody, setIntroBody] = useState(home.introBody);
  const [stats, setStats] = useState(home.stats);
  const [servicesSectionTitle, setServicesSectionTitle] = useState(home.servicesSectionTitle);
  const [servicesSectionSubtitle, setServicesSectionSubtitle] = useState(home.servicesSectionSubtitle);
  const [whyTitle, setWhyTitle] = useState(home.whyTitle);
  const [whyItems, setWhyItems] = useState(home.whyItems);
  const [featuredProjectsTitle, setFeaturedProjectsTitle] = useState(home.featuredProjectsTitle);
  const [featuredProjectsSubtitle, setFeaturedProjectsSubtitle] = useState(home.featuredProjectsSubtitle);
  const [ctaTitle, setCtaTitle] = useState(home.ctaTitle);
  const [ctaBody, setCtaBody] = useState(home.ctaBody);
  const [ctaButtonText, setCtaButtonText] = useState(home.ctaButtonText);
  const [ctaButtonHref, setCtaButtonHref] = useState(home.ctaButtonHref);
  const [contactPreviewTitle, setContactPreviewTitle] = useState(home.contactPreviewTitle);
  const [contactPreviewBody, setContactPreviewBody] = useState(home.contactPreviewBody);
  const [published, setPublished] = useState(home.published);

  function submit() {
    setMessage(null);
    start(async () => {
      const r = await saveHomePageContent({
        heroHeadline,
        heroSubheadline,
        heroImageUrl,
        introTitle,
        introBody,
        stats,
        servicesSectionTitle,
        servicesSectionSubtitle,
        whyTitle,
        whyItems,
        featuredProjectsTitle,
        featuredProjectsSubtitle,
        ctaTitle,
        ctaBody,
        ctaButtonText,
        ctaButtonHref,
        contactPreviewTitle,
        contactPreviewBody,
        published,
      });
      if (r.ok) {
        setMessage({ type: "ok", text: "Home page saved. Visitors will see your updates." });
        router.refresh();
      } else {
        setMessage({ type: "err", text: r.error ?? "Something went wrong. Please check the form." });
      }
    });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-16">
      <AdminPageHeader
        title="Home page"
        description="Edit the main landing page: banner, company highlights, reasons to choose you, and contact teaser. Nothing here is written in code — just fill in the fields."
      />

      {message?.type === "ok" ? <AdminAlert variant="success">{message.text}</AdminAlert> : null}
      {message?.type === "err" ? <AdminAlert variant="error">{message.text}</AdminAlert> : null}

      <AdminSectionCard
        title="Hero section"
        description="The large banner at the top of your home page — first thing visitors see."
      >
        <AdminFormField
          label="Main headline"
          helper="Short, confident line about what you do."
          value={heroHeadline}
          onChange={setHeroHeadline}
          placeholder="e.g. Excellence in gold discovery"
        />
        <AdminTextareaField
          label="Supporting text"
          helper="One or two sentences under the headline."
          value={heroSubheadline}
          onChange={setHeroSubheadline}
          rows={3}
        />
        <AdminImageUploader
          label="Hero image"
          helper="Wide, high-quality photo works best."
          prefix="hero"
          value={heroImageUrl}
          onChange={setHeroImageUrl}
        />
      </AdminSectionCard>

      <AdminSectionCard
        title="Introduction"
        description="Short block that introduces your company below the hero."
      >
        <AdminFormField label="Section title" value={introTitle} onChange={setIntroTitle} />
        <AdminTextareaField label="Text" value={introBody} onChange={setIntroBody} rows={5} />
      </AdminSectionCard>

      <AdminSectionCard
        title="Company highlights"
        description="Key statistics or facts shown in a row on the home page (e.g. years in business, regions served)."
      >
        <AdminStatRepeater
          items={stats}
          onChange={setStats}
          sectionHelper="Add as many rows as you like. Each row is one highlight with a label and a value."
        />
      </AdminSectionCard>

      <AdminSectionCard
        title="Services preview"
        description="Headings above the three service cards on the home page (actual services are managed under Services)."
      >
        <AdminFormField
          label="Section title"
          value={servicesSectionTitle}
          onChange={setServicesSectionTitle}
        />
        <AdminTextareaField
          label="Section subtitle"
          value={servicesSectionSubtitle}
          onChange={setServicesSectionSubtitle}
          rows={2}
        />
      </AdminSectionCard>

      <AdminSectionCard
        title="Why choose us"
        description="Bullet-style reasons customers should trust your company."
      >
        <AdminFormField label="Section title" value={whyTitle} onChange={setWhyTitle} />
        <AdminTitleBodyRepeater
          items={whyItems}
          onChange={setWhyItems}
          titleFieldLabel="Headline"
          bodyFieldLabel="Description"
          titlePlaceholder="e.g. Technical depth"
          bodyPlaceholder="Short explanation for visitors"
          sectionHelper="Each item appears as a card on the home page."
          itemLabel={(i) => `Reason ${i + 1}`}
          addButtonLabel="+ Add another reason"
        />
      </AdminSectionCard>

      <AdminSectionCard
        title="Featured projects"
        description="Intro text above the project cards (which projects show is controlled in Projects — “Featured on home”)."
      >
        <AdminFormField
          label="Section title"
          value={featuredProjectsTitle}
          onChange={setFeaturedProjectsTitle}
        />
        <AdminTextareaField
          label="Section subtitle"
          value={featuredProjectsSubtitle}
          onChange={setFeaturedProjectsSubtitle}
          rows={2}
        />
      </AdminSectionCard>

      <AdminSectionCard
        title="Call to action"
        description="Band near the bottom encouraging visitors to get in touch."
      >
        <AdminFormField label="Title" value={ctaTitle} onChange={setCtaTitle} />
        <AdminTextareaField label="Text" value={ctaBody} onChange={setCtaBody} rows={3} />
        <AdminFormField
          label="Button label"
          value={ctaButtonText}
          onChange={setCtaButtonText}
          placeholder="e.g. Request consultation"
        />
        <AdminFormField
          label="Button link"
          helper="Usually /contact or your contact page path."
          value={ctaButtonHref}
          onChange={setCtaButtonHref}
          placeholder="/contact"
        />
      </AdminSectionCard>

      <AdminSectionCard
        title="Contact preview"
        description="Small teaser before the footer encouraging visitors to reach out."
      >
        <AdminFormField label="Title" value={contactPreviewTitle} onChange={setContactPreviewTitle} />
        <AdminTextareaField
          label="Text"
          value={contactPreviewBody}
          onChange={setContactPreviewBody}
          rows={2}
        />
      </AdminSectionCard>

      <AdminSectionCard title="Visibility" description="Turn off to hide this page from the public site while you draft.">
        <AdminCheckboxField
          label="Show home page on the website"
          helper="When off, visitors see default placeholder content until you turn it back on."
          checked={published}
          onChange={setPublished}
        />
      </AdminSectionCard>

      <div className="sticky bottom-4 z-10 flex justify-end rounded-xl border border-zinc-800 bg-zinc-950/95 p-4 shadow-xl backdrop-blur">
        <AdminPrimaryButton type="button" disabled={pending} onClick={submit}>
          {pending ? "Saving…" : "Save home page"}
        </AdminPrimaryButton>
      </div>
    </div>
  );
}
