"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPending(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setPending(false);
    if (res?.error) {
      setError(
        "Sign-in failed. Check email/password, or your database connection (see troubleshooting below).",
      );
      return;
    }
    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-xs font-medium text-zinc-400">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-600"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-xs font-medium text-zinc-400">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-600"
        />
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {process.env.NODE_ENV === "development" ? (
        <div className="rounded-md border border-zinc-800 bg-zinc-950/80 p-3 text-left text-xs leading-relaxed text-zinc-500">
          <p className="font-semibold text-zinc-400">Development · troubleshooting</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-4">
            <li>
              Use a normal <code className="text-amber-600/90">postgresql://…</code>{" "}
              <code className="text-zinc-600">DATABASE_URL</code> unless Prisma&apos;s{" "}
              <code className="text-zinc-600">prisma+</code> bridge is running (otherwise login cannot load users).
            </li>
            <li>
              Create the admin user:{" "}
              <code className="text-amber-600/90">npx prisma migrate deploy</code> then{" "}
              <code className="text-amber-600/90">npm run db:seed</code>
            </li>
            <li>
              Defaults after seed:{" "}
              <code className="text-amber-600/90">admin@mfgold-sl.local</code> /{" "}
              <code className="text-amber-600/90">ChangeMe!Secure123</code>
              {" — override with "}
              <code className="text-zinc-600">ADMIN_EMAIL</code> /{" "}
              <code className="text-zinc-600">ADMIN_PASSWORD</code> in <code className="text-zinc-600">.env</code>{" "}
              before seeding.
            </li>
            <li>
              Ensure <code className="text-zinc-600">NEXTAUTH_URL</code> matches your app URL (e.g.{" "}
              <code className="text-amber-600/90">http://localhost:3000</code>).
            </li>
          </ul>
        </div>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-amber-600 py-2.5 text-sm font-semibold text-black hover:bg-amber-500 disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
