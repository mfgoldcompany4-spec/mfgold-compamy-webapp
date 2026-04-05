import type { Metadata } from "next";
import { Cinzel, DM_Sans } from "next/font/google";
import { Providers } from "@/components/Providers";
import { COMPANY_SHORT_NAME } from "@/lib/brand";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${COMPANY_SHORT_NAME} | Premium gold & mineral operations`,
    template: `%s | ${COMPANY_SHORT_NAME}`,
  },
  description:
    "Exploration, mining, processing, refining, and export logistics for gold and mineral programs worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${cinzel.variable} h-full`}>
      <body className="min-h-full antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
