import { useState } from 'react';
import ErrorBanner from '../ErrorBanner';
import { FormActions, SelectField, TextField } from './FormFields';

const blankForm = {
  name: '',
  email: '',
  phone: '',
  country: 'VN',
  company: '',
  status: 'PROSPECT'
};

const countryOptions = {
  VN: {
    label: 'Vietnam',
    hint: 'Phone must contain 9-10 digits.',
    isValidLength: (length) => length === 9 || length === 10
  },
  US: {
    label: 'United States',
    hint: 'Phone must contain 10-11 digits.',
    isValidLength: (length) => length === 10 || length === 11
  },
  JP: {
    label: 'Japan',
    hint: 'Phone must contain 10-11 digits.',
    isValidLength: (length) => length === 10 || length === 11
  }
};

export default function CustomerForm({ initialData, onSubmit, onCancel, error, submitLabel = 'Create customer' }) {
  const [form, setForm] = useState({ ...blankForm, ...initialData });
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const validateForm = () => {
    const errors = {};
    const phone = form.phone || '';
    const digits = phone.replace(/\D/g, '');
    const countryRule = countryOptions[form.country || 'VN'] || countryOptions.VN;

    if (phone && !countryRule.isValidLength(digits.length)) {
      errors.phone = countryRule.hint;
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateForm();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ ...form, country: form.country || 'VN' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ErrorBanner message={error} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Name" required value={form.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Acme Corp" />
        <TextField label="Email" required type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} placeholder="buyer@acme.com" />
        <SelectField label="Country" required value={form.country || 'VN'} onChange={(event) => updateField('country', event.target.value)} hint={countryOptions[form.country || 'VN'].hint}>
          {Object.entries(countryOptions).map(([value, option]) => <option key={value} value={value}>{option.label}</option>)}
        </SelectField>
        <TextField label="Phone" value={form.phone || ''} onChange={(event) => updateField('phone', event.target.value)} placeholder="+84 901 234 567" error={fieldErrors.phone} />
        <TextField label="Company" value={form.company || ''} onChange={(event) => updateField('company', event.target.value)} placeholder="Acme" />
        <SelectField label="Status" value={form.status} onChange={(event) => updateField('status', event.target.value)}>
          <option value="PROSPECT">Prospect</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </SelectField>
      </div>
      <FormActions submitting={submitting} submitLabel={submitLabel} onCancel={onCancel} />
    </form>
  );
}
