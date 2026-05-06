export default function ChartCard({ title, description, children }) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-card backdrop-blur">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-bold text-ink">{title}</h2>
        {description && <p className="mt-2 text-sm font-semibold leading-6 text-ink/55">{description}</p>}
      </div>
      {children}
    </section>
  );
}
