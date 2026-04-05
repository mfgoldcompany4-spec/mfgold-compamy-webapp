type Props = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function AdminEmptyState({ title, description, action }: Props) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 px-6 py-12 text-center">
      <p className="text-sm font-medium text-zinc-300">{title}</p>
      {description ? <p className="mx-auto mt-2 max-w-md text-xs text-zinc-500">{description}</p> : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
