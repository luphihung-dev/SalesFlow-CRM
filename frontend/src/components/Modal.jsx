import { X } from 'lucide-react';

export default function Modal({ title, description, open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-ink/45 px-3 py-3 backdrop-blur-sm sm:place-items-center sm:px-4 sm:py-8">
      <section className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-cream p-5 shadow-soft sm:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="break-words font-display text-2xl font-bold text-ink">{title}</h2>
            {description && <p className="mt-2 text-sm font-semibold leading-6 text-ink/55">{description}</p>}
          </div>
          <button className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-ink shadow-card" type="button" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
