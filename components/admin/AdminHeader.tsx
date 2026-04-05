"use client";

import { signOut } from "next-auth/react";

export function AdminHeader({ email }: { email?: string | null }) {
  return (
    <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold text-white">Admin dashboard</h1>
        {email ? <p className="text-xs text-zinc-500">{email}</p> : null}
      </div>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
      >
        Sign out
      </button>
    </header>
  );
}
