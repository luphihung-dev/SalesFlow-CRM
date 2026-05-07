export default function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-pine/20 bg-white p-10 text-center">
      <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/60">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
