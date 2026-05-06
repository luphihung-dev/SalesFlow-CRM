export default function KpiCard({ label, value, detail, icon: Icon, accent = 'bg-pine' }) {
  return (
    <section className="rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-card backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-ink/45">{label}</p>
          <h3 className="mt-3 font-display text-3xl font-bold text-ink">{value}</h3>
          <p className="mt-2 text-sm font-medium text-ink/55">{detail}</p>
        </div>
        {Icon && (
          <div className={`grid h-12 w-12 place-items-center rounded-2xl ${accent} text-cream shadow-soft`}>
            <Icon size={22} />
          </div>
        )}
      </div>
    </section>
  );
}
