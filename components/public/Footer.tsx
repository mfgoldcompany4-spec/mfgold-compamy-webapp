import Link from "next/link";
import type { FooterContent } from "@prisma/client";
import { COMPANY_LEGAL_NAME } from "@/lib/brand";

type Props = { footer: FooterContent };

export function Footer({ footer }: Props) {
  const year = new Date().getFullYear();
  const line =
    footer.copyrightLine?.trim() ||
    `© ${year} ${COMPANY_LEGAL_NAME}. All rights reserved.`;

  return (
    <footer className="border-t border-white/10 bg-bg-elevated">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="font-display text-base font-semibold leading-snug text-text sm:text-lg">{COMPANY_LEGAL_NAME}</p>
            <p className="mt-4 text-sm leading-relaxed text-text-muted">{footer.companyDescription}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gold">Quick links</p>
            <ul className="mt-4 space-y-2 text-sm text-text-muted">
              <li>
                <Link href="/" className="hover:text-gold">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-gold">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-gold">
                  Projects / Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gold">Services</p>
            <ul className="mt-4 space-y-2 text-sm text-text-muted">
              <li>
                <Link href="/services" className="hover:text-gold">
                  Exploration
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-gold">
                  Mining operations
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-gold">
                  Processing & refining
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-gold">
                  Export & logistics
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gold">Connect</p>
            <p className="mt-4 text-sm text-text-muted">Social (placeholders)</p>
            <ul className="mt-3 flex flex-wrap gap-3 text-sm">
              {footer.socialLinkedin ? (
                <li>
                  <a href={footer.socialLinkedin} className="text-gold hover:underline" rel="noreferrer" target="_blank">
                    LinkedIn
                  </a>
                </li>
              ) : null}
              {footer.socialTwitter ? (
                <li>
                  <a href={footer.socialTwitter} className="text-gold hover:underline" rel="noreferrer" target="_blank">
                    X / Twitter
                  </a>
                </li>
              ) : null}
              {footer.socialFacebook ? (
                <li>
                  <a href={footer.socialFacebook} className="text-gold hover:underline" rel="noreferrer" target="_blank">
                    Facebook
                  </a>
                </li>
              ) : null}
              {footer.socialInstagram ? (
                <li>
                  <a href={footer.socialInstagram} className="text-gold hover:underline" rel="noreferrer" target="_blank">
                    Instagram
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-text-muted">
          {line}
        </div>
      </div>
    </footer>
  );
}
