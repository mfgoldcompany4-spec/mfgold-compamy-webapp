type Props = {
  variant: "success" | "error";
  children: React.ReactNode;
};

export function AdminAlert({ variant, children }: Props) {
  const styles =
    variant === "success"
      ? "border-amber-500/35 bg-amber-500/10 text-amber-100"
      : "border-red-500/40 bg-red-950/40 text-red-200";

  return (
    <div role="alert" className={`rounded-lg border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}
