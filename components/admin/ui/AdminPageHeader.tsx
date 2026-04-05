type Props = {
  title: string;
  description?: string;
};

export function AdminPageHeader({ title, description }: Props) {
  return (
    <header className="mb-8 border-b border-zinc-800 pb-6">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h1>
      {description ? <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">{description}</p> : null}
    </header>
  );
}
