"use client";

import { useState } from "react";
import { uploadAdminImage } from "@/actions/admin";

type Props = {
  fieldName: string;
  label: string;
  prefix: string;
  initialUrl: string;
};

export function ImageUploadField({ fieldName, label, prefix, initialUrl }: Props) {
  const [url, setUrl] = useState(initialUrl);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPending(true);
    setError("");
    const fd = new FormData();
    fd.set("file", file);
    fd.set("prefix", prefix);
    const res = await uploadAdminImage(fd);
    if ("error" in res) setError(res.error);
    else setUrl(res.url);
    setPending(false);
    e.target.value = "";
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-zinc-400">{label}</label>
      <input type="hidden" name={fieldName} value={url} />
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onChange}
        className="block w-full text-sm text-zinc-300 file:mr-4 file:rounded file:border-0 file:bg-amber-600/20 file:px-3 file:py-2 file:text-sm file:font-medium file:text-amber-200"
      />
      {pending ? <p className="text-xs text-amber-200/80">Uploading…</p> : null}
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          className="mt-2 h-32 w-full max-w-xs rounded border border-zinc-700 object-cover"
        />
      ) : null}
      <p className="text-xs text-zinc-500">JPEG, PNG, or WebP · max 5MB · stored on Cloudflare R2 when configured.</p>
    </div>
  );
}
