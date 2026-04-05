import Image from "next/image";
import Link from "next/link";
import { COMPANY_LEGAL_NAME } from "@/lib/brand";

type Props = {
  headline: string;
  subheadline: string;
  imageUrl: string;
  eyebrow?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export function HeroSection({
  headline,
  subheadline,
  imageUrl,
  eyebrow = COMPANY_LEGAL_NAME,
  ctaHref = "/contact",
  ctaLabel = "Request consultation",
}: Props) {
  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-bg/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/60" />
      </div>

      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
        <p className="max-w-xl text-xs font-semibold uppercase leading-relaxed tracking-[0.2em] text-gold">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight text-text sm:text-5xl lg:text-6xl">
          {headline}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-muted">{subheadline}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold text-bg transition hover:bg-gold-dim focus-ring"
          >
            {ctaLabel}
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-sm border border-gold/50 px-8 py-3.5 text-sm font-semibold text-text transition hover:border-gold hover:text-gold focus-ring"
          >
            Explore services
          </Link>
        </div>
      </div>
    </section>
  );
}
