import { SectionHeader } from "@/components/public/SectionHeader";
import { COMPANY_SHORT_NAME } from "@/lib/brand";
import { getAboutContent } from "@/lib/cms-queries";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us",
};

export default async function AboutPage() {
  const a = await getAboutContent();

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeader eyebrow={`About ${COMPANY_SHORT_NAME}`} title={a.overviewTitle} subtitle={a.overviewBody} />

      <div className="mt-20 grid gap-16 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-2xl font-semibold text-gold">{a.missionTitle}</h2>
          <p className="mt-4 leading-relaxed text-text-muted">{a.missionBody}</p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold text-gold">{a.visionTitle}</h2>
          <p className="mt-4 leading-relaxed text-text-muted">{a.visionBody}</p>
        </section>
      </div>

      <section className="mt-24">
        <h2 className="text-center font-display text-3xl font-semibold text-text">{a.valuesTitle}</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {a.values.map((v) => (
            <div key={v.title} className="rounded-lg border border-white/10 bg-bg-elevated p-8">
              <h3 className="font-display text-lg font-semibold text-gold">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-24">
        <h2 className="font-display text-2xl font-semibold text-text">{a.historyTitle}</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-text-muted">{a.historyBody}</p>
      </section>

      <section className="mt-24 rounded-xl border border-gold/20 bg-bg-elevated/60 p-10 lg:p-14">
        <h2 className="font-display text-2xl font-semibold text-gold">{a.sustainabilityTitle}</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-text-muted">{a.sustainabilityBody}</p>
      </section>

      <section className="mt-24 text-center">
        <h2 className="font-display text-2xl font-semibold text-text">{a.teamTitle}</h2>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-text-muted">{a.teamBody}</p>
      </section>
    </div>
  );
}
