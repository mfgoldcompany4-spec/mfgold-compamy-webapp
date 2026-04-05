"use server";

import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.email(),
  company: z.string().max(200).optional().or(z.literal("")),
  message: z.string().min(10).max(5000),
});

export type ContactPublicState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string[]> };

export async function submitContactForm(
  _prev: ContactPublicState,
  formData: FormData,
): Promise<ContactPublicState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    message: formData.get("message"),
  };

  const parsed = schema.safeParse({
    name: raw.name,
    email: raw.email,
    company: raw.company || "",
    message: raw.message,
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  // Hook for email integration (e.g. Resend, SMTP). Intentionally no DB persistence per product scope.
  return { ok: true };
}
