import { AlertCircle, X } from 'lucide-react';

export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-clay/20 bg-clay/10 p-4 text-clay shadow-card">
      <AlertCircle className="mt-0.5 shrink-0" size={18} />
      <p className="flex-1 text-sm font-bold leading-6">{message}</p>
      {onDismiss && (
        <button className="rounded-lg p-1 transition hover:bg-clay/10" type="button" onClick={onDismiss} aria-label="Dismiss error">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
