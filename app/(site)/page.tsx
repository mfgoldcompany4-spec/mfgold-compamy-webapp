import Link from "next/link";
import { CTASection } from "@/components/public/CTASection";
import { HeroSection } from "@/components/public/HeroSection";
import { ProjectCard } from "@/components/public/ProjectCard";
import { SectionHeader } from "@/components/public/SectionHeader";
import { ServiceCard } from "@/components/public/ServiceCard";
import {
  categoryLabels,
  getFeaturedProjects,
  getHomeContent,
  getPublishedProjects,
  getPublishedServices,
} from "@/lib/cms-queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getHomeContent();
  const services = await getPublishedServices();
  const featured = await getFeaturedProjects(4);
  const fallbackProjects =
    featured.length > 0 ? featured : (await getPublishedProjects()).slice(0, 4);
  const displayServices = services.slice(0, 3);

  return (
    <>
      <HeroSection
        headline={content.heroHeadline}
        subheadline={content.heroSubheadline}
        imageUrl={content.heroImageUrl}
      />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeader title={content.introTitle} subtitle={content.introBody} />
      </section>

      <section className="border-y border-white/10 bg-bg-elevated/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {content.stats.map((s) => (
              <div key={s.label} className="text-center lg:text-left">
                <p className="font-display text-3xl font-semibold text-gold">{s.value}</p>
                <p className="mt-2 text-sm text-text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Capabilities"
          title={content.servicesSectionTitle}
          subtitle={content.servicesSectionSubtitle}
        />
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {displayServices.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/services" className="text-sm font-semibold text-gold hover:underline">
            View all services →
          </Link>
        </div>
      </section>

      <section className="border-t border-white/10 bg-bg-elevated/40 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title={content.whyTitle} />
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {content.whyItems.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-white/10 bg-bg p-8 transition hover:border-gold/30"
              >
                <h3 className="font-display text-lg font-semibold text-gold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Portfolio"
          title={content.featuredProjectsTitle}
          subtitle={content.featuredProjectsSubtitle}
        />
        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {fallbackProjects.map((p) => (
            <ProjectCard key={p.id} project={p} categoryLabel={categoryLabels} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/projects" className="text-sm font-semibold text-gold hover:underline">
            View projects & gallery →
          </Link>
        </div>
      </section>

      <CTASection
        title={content.ctaTitle}
        body={content.ctaBody}
        buttonText={content.ctaButtonText}
        buttonHref={content.ctaButtonHref}
      />

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 rounded-xl border border-gold/25 bg-bg-elevated p-10 md:flex-row md:p-14">
          <div>
            <h2 className="font-display text-2xl font-semibold text-text">{content.contactPreviewTitle}</h2>
            <p className="mt-3 max-w-xl text-text-muted">{content.contactPreviewBody}</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold text-bg hover:bg-gold-dim"
          >
            Contact us
          </Link>
        </div>
      </section>
    </>
  );
}
