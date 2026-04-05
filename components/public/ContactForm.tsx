"use client";

import { useActionState } from "react";
import { submitContactForm, type ContactPublicState } from "@/actions/contact-public";

const initial: ContactPublicState = {};

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, initial);

  if (state.ok) {
    return (
      <p className="rounded-lg border border-gold/30 bg-bg-elevated p-6 text-text">
        Thank you. Your inquiry has been received. Our team will respond shortly.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          className="mt-2 w-full rounded-md border border-white/15 bg-bg px-4 py-3 text-text placeholder:text-text-muted focus-ring"
          placeholder="Your name"
        />
        {state.fieldErrors?.name ? (
          <p className="mt-1 text-sm text-red-400">{state.fieldErrors.name[0]}</p>
        ) : null}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-md border border-white/15 bg-bg px-4 py-3 text-text placeholder:text-text-muted focus-ring"
          placeholder="you@company.com"
        />
        {state.fieldErrors?.email ? (
          <p className="mt-1 text-sm text-red-400">{state.fieldErrors.email[0]}</p>
        ) : null}
      </div>
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-text">
          Company <span className="text-text-muted">(optional)</span>
        </label>
        <input
          id="company"
          name="company"
          className="mt-2 w-full rounded-md border border-white/15 bg-bg px-4 py-3 text-text placeholder:text-text-muted focus-ring"
          placeholder="Organization"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-text">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="mt-2 w-full rounded-md border border-white/15 bg-bg px-4 py-3 text-text placeholder:text-text-muted focus-ring"
          placeholder="Describe your objectives, timeline, and jurisdiction."
        />
        {state.fieldErrors?.message ? (
          <p className="mt-1 text-sm text-red-400">{state.fieldErrors.message[0]}</p>
        ) : null}
      </div>
      {state.error ? <p className="text-sm text-red-400">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-sm bg-gold py-3.5 text-sm font-semibold text-bg transition hover:bg-gold-dim disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
