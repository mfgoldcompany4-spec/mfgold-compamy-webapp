import Link from "next/link";

type Props = {
  title: string;
  body: string;
  buttonText: string;
  buttonHref: string;
};

export function CTASection({ title, body, buttonText, buttonHref }: Props) {
  return (
    <section className="border-y border-gold/20 bg-gradient-to-br from-bg-elevated to-bg py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-text-muted">{body}</p>
        <Link
          href={buttonHref}
          className="mt-8 inline-flex rounded-sm bg-gold px-10 py-3.5 text-sm font-semibold text-bg transition hover:bg-gold-dim focus-ring"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
}
