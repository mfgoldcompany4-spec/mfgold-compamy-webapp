import { CTASection } from "@/components/public/CTASection";
import { ContactForm } from "@/components/public/ContactForm";
import { SectionHeader } from "@/components/public/SectionHeader";
import { getContactInfo } from "@/lib/cms-queries";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const c = await getContactInfo();

  return (
    <>
      <section className="border-b border-white/10 bg-bg-elevated/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title={c.heroTitle} subtitle={c.heroSubtitle} />
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-16 px-4 py-20 lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="font-display text-xl font-semibold text-text">Send a message</h2>
          <p className="mt-2 text-sm text-text-muted">
            Fields are validated on the server. Connect email delivery (e.g. Resend) in production if
            required.
          </p>
          <div className="mt-8">
            <ContactForm />
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <h2 className="font-display text-xl font-semibold text-text">Office</h2>
            <p className="mt-4 whitespace-pre-line text-text-muted">{c.address}</p>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-text">Email</h2>
            <a href={`mailto:${c.email}`} className="mt-2 inline-block text-gold hover:underline">
              {c.email}
            </a>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-text">Phone</h2>
            <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="mt-2 inline-block text-gold hover:underline">
              {c.phone}
            </a>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-text">Business hours</h2>
            <p className="mt-4 whitespace-pre-line text-text-muted">{c.businessHours}</p>
          </div>
          <div className="rounded-lg border border-dashed border-gold/30 bg-bg-elevated/50 p-8 text-sm text-text-muted">
            <p className="font-medium text-text">Map</p>
            <p className="mt-2">{c.mapPlaceholder}</p>
          </div>
        </div>
      </div>

      <CTASection title={c.ctaTitle} body={c.ctaBody} buttonText="Email us" buttonHref={`mailto:${c.email}`} />
    </>
  );
}
