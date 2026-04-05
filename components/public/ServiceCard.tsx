import Image from "next/image";
import Link from "next/link";
import type { Service } from "@prisma/client";

type Props = { service: Service };

export function ServiceCard({ service }: Props) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-white/10 bg-bg-elevated transition hover:border-gold/40">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={service.imageUrl}
          alt=""
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-semibold text-text">{service.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">{service.description}</p>
        <Link
          href={service.ctaHref || "/contact"}
          className="mt-6 inline-flex text-sm font-semibold text-gold hover:underline"
        >
          {service.ctaText || "Learn more"} →
        </Link>
      </div>
    </article>
  );
}
