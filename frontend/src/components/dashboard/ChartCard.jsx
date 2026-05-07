export default function ChartCard({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-bold text-ink">{title}</h2>
        {description && <p className="mt-2 text-sm font-semibold leading-6 text-ink/55">{description}</p>}
      </div>
      {children}
    </section>
  );
}
