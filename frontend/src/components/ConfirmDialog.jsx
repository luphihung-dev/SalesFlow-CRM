import Modal from './Modal';

export default function ConfirmDialog({ open, title, description, confirmLabel = 'Delete', onConfirm, onCancel, busy }) {
  return (
    <Modal title={title} description={description} open={open} onClose={onCancel}>
      <div className="flex justify-end gap-3">
        <button className="rounded-2xl bg-white px-5 py-3 text-sm font-extrabold text-ink shadow-card" type="button" onClick={onCancel}>Cancel</button>
        <button className="rounded-2xl bg-clay px-5 py-3 text-sm font-extrabold text-cream shadow-soft disabled:opacity-60" type="button" onClick={onConfirm} disabled={busy}>
          {busy ? 'Deleting...' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
