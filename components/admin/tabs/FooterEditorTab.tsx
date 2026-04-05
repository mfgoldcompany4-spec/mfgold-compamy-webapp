"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { FooterContent } from "@prisma/client";
import { saveFooterPageContent } from "@/actions/admin";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminSectionCard } from "@/components/admin/ui/AdminSectionCard";
import { AdminFormField } from "@/components/admin/ui/AdminFormField";
import { AdminTextareaField } from "@/components/admin/ui/AdminTextareaField";
import { AdminPrimaryButton } from "@/components/admin/ui/AdminButtons";
import { AdminAlert } from "@/components/admin/ui/AdminAlert";

type Props = { footer: FooterContent };

export function FooterEditorTab({ footer }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [companyDescription, setCompanyDescription] = useState(footer.companyDescription);
  const [socialTwitter, setSocialTwitter] = useState(footer.socialTwitter ?? "");
  const [socialLinkedin, setSocialLinkedin] = useState(footer.socialLinkedin ?? "");
  const [socialFacebook, setSocialFacebook] = useState(footer.socialFacebook ?? "");
  const [socialInstagram, setSocialInstagram] = useState(footer.socialInstagram ?? "");
  const [copyrightLine, setCopyrightLine] = useState(footer.copyrightLine ?? "");

  function submit() {
    setMessage(null);
    start(async () => {
      const r = await saveFooterPageContent({
        companyDescription,
        socialTwitter,
        socialLinkedin,
        socialFacebook,
        socialInstagram,
        copyrightLine,
      });
      if (r.ok) {
        setMessage({ type: "ok", text: "Footer saved. It appears on every page." });
        router.refresh();
      } else {
        setMessage({ type: "err", text: r.error ?? "Please check the form." });
      }
    });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-16">
      <AdminPageHeader
        title="Footer"
        description="The footer shows on all public pages: short about text, social links, and copyright line."
      />

      {message?.type === "ok" ? <AdminAlert variant="success">{message.text}</AdminAlert> : null}
      {message?.type === "err" ? <AdminAlert variant="error">{message.text}</AdminAlert> : null}

      <AdminSectionCard title="About blurb" description="Short paragraph next to your company name in the footer.">
        <AdminTextareaField
          label="Company description"
          value={companyDescription}
          onChange={setCompanyDescription}
          rows={5}
        />
      </AdminSectionCard>

      <AdminSectionCard
        title="Social media"
        description="Full links (https://…). Leave blank to hide a network."
      >
        <AdminFormField
          label="X (Twitter)"
          value={socialTwitter}
          onChange={setSocialTwitter}
          type="url"
          placeholder="https://twitter.com/…"
        />
        <AdminFormField
          label="LinkedIn"
          value={socialLinkedin}
          onChange={setSocialLinkedin}
          type="url"
          placeholder="https://linkedin.com/…"
        />
        <AdminFormField
          label="Facebook"
          value={socialFacebook}
          onChange={setSocialFacebook}
          type="url"
          placeholder="https://facebook.com/…"
        />
        <AdminFormField
          label="Instagram"
          value={socialInstagram}
          onChange={setSocialInstagram}
          type="url"
          placeholder="https://instagram.com/…"
        />
      </AdminSectionCard>

      <AdminSectionCard title="Legal line" description="Usually copyright and optional credit line.">
        <AdminTextareaField
          label="Copyright / credits"
          helper="Shown in small text at the very bottom."
          value={copyrightLine}
          onChange={setCopyrightLine}
          rows={2}
        />
      </AdminSectionCard>

      <div className="sticky bottom-4 z-10 flex justify-end rounded-xl border border-zinc-800 bg-zinc-950/95 p-4 shadow-xl backdrop-blur">
        <AdminPrimaryButton type="button" disabled={pending} onClick={submit}>
          {pending ? "Saving…" : "Save footer"}
        </AdminPrimaryButton>
      </div>
    </div>
  );
}
