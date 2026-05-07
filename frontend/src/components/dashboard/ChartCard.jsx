export default function ChartCard({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-ink/10 bg-white p-4 shadow-card sm:p-6">
      <div className="mb-5">
        <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">{title}</h2>
        {description && <p className="mt-2 text-sm font-semibold leading-6 text-ink/55">{description}</p>}
      </div>
      {children}
    </section>
  );
}
