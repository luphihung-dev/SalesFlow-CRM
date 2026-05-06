import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function TrendKpiCard({ label, value, trend, detail, icon: Icon, tone = 'neutral' }) {
  const isPositive = trend >= 0;
  const trendClass = isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700';
  const iconClass = tone === 'positive' ? 'bg-pine' : tone === 'warning' ? 'bg-clay' : 'bg-sky-600';
  const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <section className="rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-card backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/45">{label}</p>
          <h3 className="mt-3 font-display text-3xl font-bold text-ink">{value}</h3>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold ${trendClass}`}>
              <TrendIcon size={14} /> {Math.abs(trend)}%
            </span>
            <span className="text-xs font-bold text-ink/45">{detail}</span>
          </div>
        </div>
        {Icon && <div className={`grid h-12 w-12 place-items-center rounded-2xl ${iconClass} text-cream shadow-soft`}><Icon size={22} /></div>}
      </div>
    </section>
  );
}
