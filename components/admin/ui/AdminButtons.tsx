import type { ButtonHTMLAttributes } from "react";

const base =
  "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 disabled:opacity-50";

export function AdminPrimaryButton({
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`${base} bg-amber-500 text-zinc-950 hover:bg-amber-400 ${className}`}
      {...props}
    />
  );
}

export function AdminSecondaryButton({
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`${base} border border-zinc-600 bg-zinc-900 text-zinc-200 hover:border-amber-500/50 hover:text-amber-100 ${className}`}
      {...props}
    />
  );
}

export function AdminDangerButton({
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`text-sm font-medium text-red-400 underline-offset-2 hover:text-red-300 hover:underline ${className}`}
      {...props}
    />
  );
}
