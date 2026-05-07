import { X } from 'lucide-react';

export default function Modal({ title, description, open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/45 px-4 py-8 backdrop-blur-sm">
      <section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-cream p-6 shadow-soft">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">{title}</h2>
            {description && <p className="mt-2 text-sm font-semibold leading-6 text-ink/55">{description}</p>}
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-xl bg-white text-ink shadow-card" type="button" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
