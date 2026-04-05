import { auth } from "@/auth";
import { COMPANY_LEGAL_NAME } from "@/lib/brand";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user) redirect("/admin/dashboard");

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-xl backdrop-blur">
        <h1 className="font-display text-center text-lg font-semibold leading-snug text-white sm:text-xl">
          {COMPANY_LEGAL_NAME}
          <span className="mt-1 block text-sm font-normal text-zinc-400">Admin</span>
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-500">Private access · Authorized personnel only</p>
        <div className="mt-8">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
