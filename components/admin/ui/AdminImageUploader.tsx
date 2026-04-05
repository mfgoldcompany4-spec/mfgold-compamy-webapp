"use client";

import { useState } from "react";
import { uploadAdminImage } from "@/actions/admin";

type Props = {
  label: string;
  helper?: string;
  prefix: string;
  value: string;
  onChange: (url: string) => void;
  urlFallbackLabel?: string;
};

export function AdminImageUploader({
  label,
  helper,
  prefix,
  value,
  onChange,
  urlFallbackLabel = "Or paste an image URL",
}: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPending(true);
    setError("");
    const fd = new FormData();
    fd.set("file", file);
    fd.set("prefix", prefix);
    const res = await uploadAdminImage(fd);
    if ("error" in res) setError(res.error);
    else onChange(res.url);
    setPending(false);
    e.target.value = "";
  }

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      {helper ? <p className="text-xs text-zinc-500">{helper}</p> : null}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onFile}
        className="block w-full text-sm text-zinc-300 file:mr-4 file:rounded-lg file:border-0 file:bg-amber-600/20 file:px-4 file:py-2 file:text-sm file:font-medium file:text-amber-100"
      />
      <label className="mt-2 block">
        <span className="text-xs text-zinc-500">{urlFallbackLabel}</span>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://…"
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/40"
        />
      </label>
      {pending ? <p className="text-xs text-amber-200/80">Uploading…</p> : null}
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="mt-2 h-40 max-w-md rounded-lg border border-zinc-700 object-cover"
        />
      ) : null}
      <p className="text-xs text-zinc-600">
        Images must be JPG, PNG, or WebP and under 5MB. Cloudflare R2 uploads require R2 environment variables.
      </p>
    </div>
  );
}
