type Props = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function AdminSectionCard({ title, description, children, className = "" }: Props) {
  return (
    <section
      className={`rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 shadow-sm backdrop-blur-sm sm:p-8 ${className}`}
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {description ? <p className="mt-1.5 text-sm text-zinc-500">{description}</p> : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
