import { useState } from 'react';
import { dealStages, stageLabels } from '../../utils/constants';
import ErrorBanner from '../ErrorBanner';
import { FormActions, SelectField, TextField } from './FormFields';

export default function DealForm({ initialData, customers, users, onSubmit, onCancel, error, submitLabel = 'Create deal' }) {
  const [form, setForm] = useState({ name: '', amount: '', stage: 'NEW', customerId: '', ownerId: '', ...initialData });
  const [submitting, setSubmitting] = useState(false);
  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ ...form, amount: Number(form.amount), customerId: Number(form.customerId), ownerId: Number(form.ownerId) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ErrorBanner message={error} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Deal name" required value={form.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Annual CRM rollout" />
        <TextField label="Amount" required min="1" step="0.01" type="number" value={form.amount} onChange={(event) => updateField('amount', event.target.value)} placeholder="12000" />
        <SelectField label="Stage" value={form.stage} onChange={(event) => updateField('stage', event.target.value)}>
          {dealStages.map((stage) => <option key={stage} value={stage}>{stageLabels[stage]}</option>)}
        </SelectField>
        <SelectField label="Customer" required value={form.customerId} onChange={(event) => updateField('customerId', event.target.value)}>
          <option value="">Select customer</option>
          {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
        </SelectField>
        <SelectField label="Owner" required value={form.ownerId} onChange={(event) => updateField('ownerId', event.target.value)}>
          <option value="">Select owner</option>
          {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
        </SelectField>
      </div>
      <FormActions submitting={submitting} submitLabel={submitLabel} onCancel={onCancel} />
    </form>
  );
}
