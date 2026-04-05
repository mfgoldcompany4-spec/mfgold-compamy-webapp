type Props = {
  label: string;
  helper?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function AdminCheckboxField({ label, helper, checked, onChange }: Props) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-zinc-600 text-amber-500 focus:ring-amber-500"
      />
      <span>
        <span className="block text-sm font-medium text-zinc-200">{label}</span>
        {helper ? <span className="mt-0.5 block text-xs text-zinc-500">{helper}</span> : null}
      </span>
    </label>
  );
}
