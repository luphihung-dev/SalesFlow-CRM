export function TextField({ label, error, hint, ...props }) {
  return (
    <label className="block text-sm font-extrabold text-ink">
      {label}
      <input {...props} aria-invalid={Boolean(error)} className={`mt-2 h-12 w-full rounded-xl border bg-white px-4 font-semibold text-ink outline-none ring-pine/20 transition placeholder:text-ink/30 focus:ring-4 ${error ? 'border-clay' : 'border-ink/10'}`} />
      {error ? <span className="mt-1 block text-xs font-bold text-clay">{error}</span> : hint ? <span className="mt-1 block text-xs font-bold text-ink/45">{hint}</span> : null}
    </label>
  );
}

export function SelectField({ label, children, error, hint, ...props }) {
  return (
    <label className="block text-sm font-extrabold text-ink">
      {label}
      <select {...props} aria-invalid={Boolean(error)} className={`mt-2 h-12 w-full rounded-xl border bg-white px-4 font-bold text-ink outline-none ring-pine/20 transition focus:ring-4 ${error ? 'border-clay' : 'border-ink/10'}`}>
        {children}
      </select>
      {error ? <span className="mt-1 block text-xs font-bold text-clay">{error}</span> : hint ? <span className="mt-1 block text-xs font-bold text-ink/45">{hint}</span> : null}
    </label>
  );
}

export function TextAreaField({ label, ...props }) {
  return (
    <label className="block text-sm font-extrabold text-ink">
      {label}
      <textarea {...props} className="mt-2 min-h-28 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 font-semibold text-ink outline-none ring-pine/20 transition placeholder:text-ink/30 focus:ring-4" />
    </label>
  );
}

export function FormActions({ submitting, submitLabel, onCancel }) {
  return (
    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button className="rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-ink shadow-card" type="button" onClick={onCancel}>Cancel</button>
      <button className="rounded-xl bg-pine px-5 py-3 text-sm font-extrabold text-cream shadow-soft disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </div>
  );
}
