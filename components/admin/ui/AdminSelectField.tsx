type Opt = { value: string; label: string };

type Props = {
  label: string;
  helper?: string;
  value: string;
  onChange: (v: string) => void;
  options: Opt[];
};

export function AdminSelectField({ label, helper, value, onChange, options }: Props) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      {helper ? <p className="mt-0.5 text-xs text-zinc-500">{helper}</p> : null}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/40"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
