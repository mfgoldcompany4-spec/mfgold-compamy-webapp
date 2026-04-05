import { Footer } from "@/components/public/Footer";
import { Navbar } from "@/components/public/Navbar";
import { getFooterContent } from "@/lib/cms-queries";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const footer = await getFooterContent();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer footer={footer} />
    </div>
  );
}
