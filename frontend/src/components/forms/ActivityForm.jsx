import { useState } from 'react';
import ErrorBanner from '../ErrorBanner';
import { FormActions, SelectField, TextAreaField } from './FormFields';

export default function ActivityForm({ customerId, onSubmit, onCancel, error }) {
  const [form, setForm] = useState({ type: 'NOTE', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ ...form, customerId: Number(customerId) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ErrorBanner message={error} />
      <div className="space-y-4">
        <SelectField label="Type" value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}>
          <option value="NOTE">Note</option>
          <option value="CALL">Call</option>
          <option value="EMAIL">Email</option>
        </SelectField>
        <TextAreaField label="Description" required value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="Capture the customer interaction..." />
      </div>
      <FormActions submitting={submitting} submitLabel="Log activity" onCancel={onCancel} />
    </form>
  );
}
