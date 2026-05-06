export default function LoadingState({ label = 'Loading CRM data...' }) {
  return (
    <div className="grid min-h-[280px] place-items-center rounded-[2rem] border border-white/70 bg-white/70 p-10 shadow-card">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-pine/15 border-t-pine" />
        <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-ink/50">{label}</p>
      </div>
    </div>
  );
}
