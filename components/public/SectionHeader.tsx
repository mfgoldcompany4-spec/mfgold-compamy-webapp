type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export function SectionHeader({ eyebrow, title, subtitle, align = "center" }: Props) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">{eyebrow}</p>
      ) : null}
      <h2 className="font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">{title}</h2>
      {subtitle ? (
        <p className="mt-4 text-lg leading-relaxed text-text-muted">{subtitle}</p>
      ) : null}
    </div>
  );
}
