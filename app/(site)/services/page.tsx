import { SectionHeader } from "@/components/public/SectionHeader";
import { ServiceCard } from "@/components/public/ServiceCard";
import { COMPANY_SHORT_NAME } from "@/lib/brand";
import { getPublishedServices } from "@/lib/cms-queries";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services",
};

export default async function ServicesPage() {
  const services = await getPublishedServices();

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="What we deliver"
        title="Integrated services across the gold value chain"
        subtitle={`From first drill hole to refined product and export documentation, ${COMPANY_SHORT_NAME} aligns technical, operational, and commercial teams under one accountable program structure.`}
      />
      <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <ServiceCard key={s.id} service={s} />
        ))}
      </div>
    </div>
  );
}
