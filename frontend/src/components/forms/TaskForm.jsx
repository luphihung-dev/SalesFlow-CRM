import { useState } from 'react';
import ErrorBanner from '../ErrorBanner';
import { FormActions, SelectField, TextField } from './FormFields';

export default function TaskForm({ initialData, customers, users, onSubmit, onCancel, error, submitLabel = 'Create task' }) {
  const [form, setForm] = useState({ title: '', dueDate: '', status: 'TODO', customerId: '', userId: '', ...initialData });
  const [submitting, setSubmitting] = useState(false);
  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ ...form, customerId: Number(form.customerId), userId: form.userId ? Number(form.userId) : null });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ErrorBanner message={error} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Title" required value={form.title} onChange={(event) => updateField('title', event.target.value)} placeholder="Schedule discovery call" />
        <TextField label="Due date" required type="date" value={form.dueDate} onChange={(event) => updateField('dueDate', event.target.value)} />
        <SelectField label="Status" value={form.status} onChange={(event) => updateField('status', event.target.value)}>
          <option value="TODO">Todo</option>
          <option value="DONE">Done</option>
        </SelectField>
        <SelectField label="Customer" required value={form.customerId} onChange={(event) => updateField('customerId', event.target.value)}>
          <option value="">Select customer</option>
          {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
        </SelectField>
        <SelectField label="Owner" value={form.userId || ''} onChange={(event) => updateField('userId', event.target.value)}>
          <option value="">Unassigned</option>
          {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
        </SelectField>
      </div>
      <FormActions submitting={submitting} submitLabel={submitLabel} onCancel={onCancel} />
    </form>
  );
}
