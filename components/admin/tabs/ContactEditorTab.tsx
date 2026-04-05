"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ContactInfo } from "@prisma/client";
import { saveContactPageContent } from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminSectionCard } from "@/components/admin/ui/AdminSectionCard";
import { AdminFormField } from "@/components/admin/ui/AdminFormField";
import { AdminTextareaField } from "@/components/admin/ui/AdminTextareaField";
import { AdminPrimaryButton } from "@/components/admin/ui/AdminButtons";
import { AdminAlert } from "@/components/admin/ui/AdminAlert";

type Props = { contact: ContactInfo };

export function ContactEditorTab({ contact }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [heroTitle, setHeroTitle] = useState(contact.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(contact.heroSubtitle);
  const [email, setEmail] = useState(contact.email);
  const [phone, setPhone] = useState(contact.phone);
  const [address, setAddress] = useState(contact.address);
  const [businessHours, setBusinessHours] = useState(contact.businessHours);
  const [mapPlaceholder, setMapPlaceholder] = useState(contact.mapPlaceholder);
  const [ctaTitle, setCtaTitle] = useState(contact.ctaTitle);
  const [ctaBody, setCtaBody] = useState(contact.ctaBody);

  function submit() {
    setMessage(null);
    start(async () => {
      const r = await saveContactPageContent({
        heroTitle,
        heroSubtitle,
        email,
        phone,
        address,
        businessHours,
        mapPlaceholder,
        ctaTitle,
        ctaBody,
      });
      if (r.ok) {
        setMessage({ type: "ok", text: "Contact information saved." });
        router.refresh();
      } else {
        setMessage({ type: "err", text: r.error ?? "Please check the form." });
      }
    });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-16">
      <AdminPageHeader
        title="Contact page"
        description="Phone, email, address, and hours shown on the Contact page. This is what clients use to reach you."
      />

      {message?.type === "ok" ? <AdminAlert variant="success">{message.text}</AdminAlert> : null}
      {message?.type === "err" ? <AdminAlert variant="error">{message.text}</AdminAlert> : null}

      <AdminSectionCard title="Page header" description="Large title area at the top of the Contact page.">
        <AdminFormField label="Headline" value={heroTitle} onChange={setHeroTitle} />
        <AdminTextareaField label="Subtitle" value={heroSubtitle} onChange={setHeroSubtitle} rows={2} />
      </AdminSectionCard>

      <AdminSectionCard
        title="How to reach you"
        description="These details appear in the contact column and may be used for mail and phone links."
      >
        <AdminFormField
          label="Email"
          helper="Shown as a mail link for visitors."
          value={email}
          onChange={setEmail}
          type="email"
        />
        <AdminFormField
          label="Phone"
          helper="Include country code if you serve international clients."
          value={phone}
          onChange={setPhone}
        />
        <AdminTextareaField
          label="Address"
          helper="Use line breaks for multiple lines — they will display correctly."
          value={address}
          onChange={setAddress}
          rows={5}
        />
        <AdminTextareaField
          label="Business hours"
          value={businessHours}
          onChange={setBusinessHours}
          rows={4}
        />
      </AdminSectionCard>

      <AdminSectionCard
        title="Map area"
        description="For now, add a short note. Your web team can embed a map later using this space."
      >
        <AdminTextareaField
          label="Map note"
          helper="e.g. “Map coming soon” or paste embed instructions for your developer."
          value={mapPlaceholder}
          onChange={setMapPlaceholder}
          rows={3}
        />
      </AdminSectionCard>

      <AdminSectionCard title="Bottom invitation" description="Extra encouragement before the footer on the Contact page.">
        <AdminFormField label="Title" value={ctaTitle} onChange={setCtaTitle} />
        <AdminTextareaField label="Text" value={ctaBody} onChange={setCtaBody} rows={3} />
      </AdminSectionCard>

      <div className="sticky bottom-4 z-10 flex justify-end rounded-xl border border-zinc-800 bg-zinc-950/95 p-4 shadow-xl backdrop-blur">
        <AdminPrimaryButton type="button" disabled={pending} onClick={submit}>
          {pending ? "Saving…" : "Save contact page"}
        </AdminPrimaryButton>
      </div>
    </div>
  );
}
