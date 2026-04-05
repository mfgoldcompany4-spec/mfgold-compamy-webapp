"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveAboutPageContent } from "@/actions/admin";
import type { AboutContentData } from "@/lib/cms-types";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminSectionCard } from "@/components/admin/ui/AdminSectionCard";
import { AdminFormField } from "@/components/admin/ui/AdminFormField";
import { AdminTextareaField } from "@/components/admin/ui/AdminTextareaField";
import { AdminCheckboxField } from "@/components/admin/ui/AdminCheckboxField";
import { AdminTitleBodyRepeater } from "@/components/admin/ui/AdminTitleBodyRepeater";
import { AdminPrimaryButton } from "@/components/admin/ui/AdminButtons";
import { AdminAlert } from "@/components/admin/ui/AdminAlert";

type Props = {
  about: AboutContentData & { published: boolean };
};

export function AboutEditorTab({ about }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [overviewTitle, setOverviewTitle] = useState(about.overviewTitle);
  const [overviewBody, setOverviewBody] = useState(about.overviewBody);
  const [missionTitle, setMissionTitle] = useState(about.missionTitle);
  const [missionBody, setMissionBody] = useState(about.missionBody);
  const [visionTitle, setVisionTitle] = useState(about.visionTitle);
  const [visionBody, setVisionBody] = useState(about.visionBody);
  const [valuesTitle, setValuesTitle] = useState(about.valuesTitle);
  const [values, setValues] = useState(about.values);
  const [historyTitle, setHistoryTitle] = useState(about.historyTitle);
  const [historyBody, setHistoryBody] = useState(about.historyBody);
  const [sustainabilityTitle, setSustainabilityTitle] = useState(about.sustainabilityTitle);
  const [sustainabilityBody, setSustainabilityBody] = useState(about.sustainabilityBody);
  const [teamTitle, setTeamTitle] = useState(about.teamTitle);
  const [teamBody, setTeamBody] = useState(about.teamBody);
  const [published, setPublished] = useState(about.published);

  function submit() {
    setMessage(null);
    start(async () => {
      const r = await saveAboutPageContent({
        overviewTitle,
        overviewBody,
        missionTitle,
        missionBody,
        visionTitle,
        visionBody,
        valuesTitle,
        values,
        historyTitle,
        historyBody,
        sustainabilityTitle,
        sustainabilityBody,
        teamTitle,
        teamBody,
        published,
      });
      if (r.ok) {
        setMessage({ type: "ok", text: "About page saved successfully." });
        router.refresh();
      } else {
        setMessage({ type: "err", text: r.error ?? "Please check the form." });
      }
    });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-16">
      <AdminPageHeader
        title="About page"
        description="Tell your story: who you are, what you stand for, and how you work responsibly."
      />

      {message?.type === "ok" ? <AdminAlert variant="success">{message.text}</AdminAlert> : null}
      {message?.type === "err" ? <AdminAlert variant="error">{message.text}</AdminAlert> : null}

      <AdminSectionCard title="Company overview" description="Opening section at the top of the About page.">
        <AdminFormField label="Title" value={overviewTitle} onChange={setOverviewTitle} />
        <AdminTextareaField label="Text" value={overviewBody} onChange={setOverviewBody} rows={5} />
      </AdminSectionCard>

      <AdminSectionCard title="Mission & vision" description="Side-by-side blocks on the public page.">
        <AdminFormField label="Mission title" value={missionTitle} onChange={setMissionTitle} />
        <AdminTextareaField label="Mission text" value={missionBody} onChange={setMissionBody} rows={4} />
        <AdminFormField label="Vision title" value={visionTitle} onChange={setVisionTitle} />
        <AdminTextareaField label="Vision text" value={visionBody} onChange={setVisionBody} rows={4} />
      </AdminSectionCard>

      <AdminSectionCard
        title="Core values"
        description="Principles that define how you work — each appears as its own card."
      >
        <AdminFormField label="Section title" value={valuesTitle} onChange={setValuesTitle} />
        <AdminTitleBodyRepeater
          items={values}
          onChange={setValues}
          titleFieldLabel="Value name"
          bodyFieldLabel="What it means"
          titlePlaceholder="e.g. Safety first"
          bodyPlaceholder="Explain this value in plain language"
          sectionHelper="Add or remove values as needed."
          itemLabel={(i) => `Value ${i + 1}`}
          addButtonLabel="+ Add another core value"
        />
      </AdminSectionCard>

      <AdminSectionCard title="History & background" description="How the company came to be and key milestones.">
        <AdminFormField label="Section title" value={historyTitle} onChange={setHistoryTitle} />
        <AdminTextareaField label="Text" value={historyBody} onChange={setHistoryBody} rows={6} />
      </AdminSectionCard>

      <AdminSectionCard
        title="Sustainability & responsibility"
        description="Environmental and community commitments."
      >
        <AdminFormField
          label="Section title"
          value={sustainabilityTitle}
          onChange={setSustainabilityTitle}
        />
        <AdminTextareaField
          label="Text"
          value={sustainabilityBody}
          onChange={setSustainabilityBody}
          rows={5}
        />
      </AdminSectionCard>

      <AdminSectionCard title="Team & leadership" description="How you describe leadership (no individual bios required).">
        <AdminFormField label="Section title" value={teamTitle} onChange={setTeamTitle} />
        <AdminTextareaField label="Text" value={teamBody} onChange={setTeamBody} rows={4} />
      </AdminSectionCard>

      <AdminSectionCard title="Visibility">
        <AdminCheckboxField
          label="Show About page on the website"
          checked={published}
          onChange={setPublished}
        />
      </AdminSectionCard>

      <div className="sticky bottom-4 z-10 flex justify-end rounded-xl border border-zinc-800 bg-zinc-950/95 p-4 shadow-xl backdrop-blur">
        <AdminPrimaryButton type="button" disabled={pending} onClick={submit}>
          {pending ? "Saving…" : "Save about page"}
        </AdminPrimaryButton>
      </div>
    </div>
  );
}
