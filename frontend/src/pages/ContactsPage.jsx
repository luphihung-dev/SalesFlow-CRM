import { Edit3, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crmApi } from '../api/crmApi';
import Badge from '../components/Badge';
import ConfirmDialog from '../components/ConfirmDialog';
import DataTable from '../components/DataTable';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import CustomerForm from '../components/forms/CustomerForm';
import LoadingState from '../components/LoadingState';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import { getApiErrorMessage } from '../utils/apiErrors';
import { formatDate, normalize } from '../utils/formatters';
import { canDeleteRecords, canManageCustomers } from '../utils/permissions';
import { notifySearchDataChanged } from '../utils/searchEvents';

export default function ContactsPage() {
  const navigate = useNavigate();
  const canManage = canManageCustomers();
  const canDelete = canDeleteRecords();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deletingCustomer, setDeletingCustomer] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');

  useEffect(() => {
    crmApi.customers.list()
      .then(setCustomers)
      .catch((apiError) => setError(getApiErrorMessage(apiError, 'Unable to load customers.')))
      .finally(() => setLoading(false));
  }, []);

  const saveCustomer = async (payload) => {
    setFormError('');
    try {
      if (editingCustomer) {
        const customer = await crmApi.customers.update(editingCustomer.id, payload);
        setCustomers((current) => current.map((item) => (item.id === customer.id ? customer : item)));
        notifySearchDataChanged();
      } else {
        const customer = await crmApi.customers.create(payload);
        setCustomers((current) => [customer, ...current]);
        notifySearchDataChanged();
      }
      setEditingCustomer(null);
      setIsModalOpen(false);
    } catch (apiError) {
      setFormError(getApiErrorMessage(apiError, 'Unable to save customer.'));
    }
  };

  const deleteCustomer = async () => {
    if (!deletingCustomer) return;
    setDeleteBusy(true);
    setError('');
    try {
      await crmApi.customers.remove(deletingCustomer.id);
      setCustomers((current) => current.filter((customer) => customer.id !== deletingCustomer.id));
      notifySearchDataChanged();
      setDeletingCustomer(null);
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to delete customer.'));
    } finally {
      setDeleteBusy(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    const search = normalize(query);
    return customers.filter((customer) => {
      const matchesSearch = [customer.name, customer.email, customer.company, customer.phone, customer.country].some((value) => normalize(value).includes(search));
      const matchesStatus = status === 'ALL' || customer.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [customers, query, status]);

  if (loading) return <LoadingState label="Loading contacts..." />;

  return (
    <>
      <PageHeader
        eyebrow="Contacts"
        title="Customer directory"
        description={canManage ? "Search, filter, create, and jump into customer records with their deal and activity context." : "Search, filter, and view customer records with their deal and activity context."}
        action={canManage ? <button className="inline-flex items-center gap-2 rounded-xl bg-pine px-5 py-3 text-sm font-extrabold text-cream shadow-soft" onClick={() => { setEditingCustomer(null); setFormError(''); setIsModalOpen(true); }} type="button"><Plus size={18} /> Add Customer</button> : null}
      />
      <ErrorBanner message={error} onDismiss={() => setError('')} />

      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-ink/10 bg-white p-3 shadow-card md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" size={18} />
          <input className="h-12 w-full rounded-xl border border-ink/10 bg-white pl-11 pr-4 font-semibold outline-none ring-pine/20 focus:ring-4" placeholder="Search contacts..." value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <select className="h-12 rounded-xl border border-ink/10 bg-white px-4 font-bold text-ink outline-none" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="ALL">All statuses</option>
          <option value="PROSPECT">Prospect</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {filteredCustomers.length ? (
        <DataTable
          rows={filteredCustomers}
          onRowClick={(customer) => navigate(`/contacts/${customer.id}`)}
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'email', header: 'Email' },
            { key: 'company', header: 'Company', render: (customer) => customer.company || 'Independent' },
            { key: 'team', header: 'Team', render: (customer) => customer.teamName || 'Workspace' },
            { key: 'phone', header: 'Phone', render: (customer) => customer.phone || 'No phone' },
            { key: 'country', header: 'Country', render: (customer) => customer.country || 'VN' },
            { key: 'status', header: 'Status', render: (customer) => <Badge>{customer.status}</Badge> },
            { key: 'createdAt', header: 'Created', render: (customer) => formatDate(customer.createdAt) },
            ...(canManage || canDelete ? [{ key: 'actions', header: 'Actions', render: (customer) => (
              <div className="flex gap-2" onClick={(event) => event.stopPropagation()}>
                {canManage && <button className="rounded-lg bg-fog p-2 text-pine transition hover:bg-pine hover:text-cream" type="button" onClick={() => { setEditingCustomer(customer); setFormError(''); setIsModalOpen(true); }} aria-label="Edit customer"><Edit3 size={16} /></button>}
                {canDelete && <button className="rounded-lg bg-fog p-2 text-clay transition hover:bg-clay hover:text-cream" type="button" onClick={() => setDeletingCustomer(customer)} aria-label="Delete customer"><Trash2 size={16} /></button>}
              </div>
            ) }] : [])
          ]}
        />
      ) : (
        <EmptyState title="No customers found" description={canManage ? "Try another search or status filter, or create a new customer." : "Try another search or status filter."} />
      )}

      <Modal title={editingCustomer ? 'Edit customer' : 'Add customer'} description={editingCustomer ? 'Update customer details.' : 'Creating a customer also triggers the backend follow-up task automation.'} open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CustomerForm initialData={editingCustomer} onSubmit={saveCustomer} onCancel={() => setIsModalOpen(false)} error={formError} submitLabel={editingCustomer ? 'Save changes' : 'Create customer'} />
      </Modal>
      <ConfirmDialog open={Boolean(deletingCustomer)} title="Delete customer?" description="This may fail if the customer still has related deals, tasks, or activities." onCancel={() => setDeletingCustomer(null)} onConfirm={deleteCustomer} busy={deleteBusy} />
    </>
  );
}
