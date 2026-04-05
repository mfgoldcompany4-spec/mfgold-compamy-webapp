type Props = {
  label: string;
  helper?: string;
  name?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
};

export function AdminTextareaField({
  label,
  helper,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  required,
}: Props) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      {helper ? <p className="mt-0.5 text-xs text-zinc-500">{helper}</p> : null}
      <textarea
        name={name}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/40"
      />
    </label>
  );
}
