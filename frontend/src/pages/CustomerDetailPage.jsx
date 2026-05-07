import { Building2, Mail, Phone, Plus, UserRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { crmApi } from '../api/crmApi';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import ActivityForm from '../components/forms/ActivityForm';
import LoadingState from '../components/LoadingState';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import { getApiErrorMessage } from '../utils/apiErrors';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function CustomerDetailPage() {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, customer: null, deals: [], tasks: [], activities: [] });
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  useEffect(() => {
    Promise.all([crmApi.customers.get(id), crmApi.deals.list(), crmApi.tasks.list(), crmApi.activities.list()])
      .then(([customer, deals, tasks, activities]) => setState({ loading: false, customer, deals, tasks, activities }))
      .catch((apiError) => {
        setError(getApiErrorMessage(apiError, 'Unable to load customer profile.'));
        setState((current) => ({ ...current, loading: false }));
      });
  }, [id]);

  const customerDeals = useMemo(() => state.deals.filter((deal) => String(deal.customerId) === String(id)), [state.deals, id]);
  const customerTasks = useMemo(() => state.tasks.filter((task) => String(task.customerId) === String(id)), [state.tasks, id]);
  const customerActivities = useMemo(
    () => state.activities.filter((activity) => String(activity.customerId) === String(id)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [state.activities, id]
  );

  const createActivity = async (payload) => {
    setFormError('');
    try {
      const activity = await crmApi.activities.create(payload);
      setState((current) => ({ ...current, activities: [activity, ...current.activities] }));
      setIsActivityModalOpen(false);
    } catch (apiError) {
      setFormError(getApiErrorMessage(apiError, 'Unable to log activity.'));
    }
  };

  if (state.loading) return <LoadingState label="Opening customer profile..." />;
  if (!state.customer) return <EmptyState title="Customer not found" description={error || 'The requested customer could not be loaded from the API.'} />;

  return (
    <>
      <PageHeader
        eyebrow="Customer profile"
        title={state.customer.name}
        description={state.customer.company || 'Individual customer'}
        action={<div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"><Badge>{state.customer.status}</Badge><button className="inline-flex items-center justify-center gap-2 rounded-xl bg-pine px-5 py-3 text-sm font-extrabold text-cream shadow-soft" onClick={() => setIsActivityModalOpen(true)} type="button"><Plus size={18} /> Log Activity</button></div>}
      />
      <ErrorBanner message={error} onDismiss={() => setError('')} />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-2xl border border-ink/10 bg-white p-4 shadow-card sm:p-6">
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-pine font-display text-2xl font-bold text-cream"><UserRound /></div>
          <h2 className="mt-5 font-display text-2xl font-bold text-ink">Profile info</h2>
          <div className="mt-6 space-y-4 text-sm font-semibold text-ink/70">
            <p className="flex min-w-0 items-center gap-3 break-words"><Mail size={18} className="shrink-0 text-moss" /> {state.customer.email}</p>
            <p className="flex min-w-0 items-center gap-3 break-words"><Phone size={18} className="shrink-0 text-moss" /> {state.customer.phone || 'No phone number'}</p>
            <p className="flex min-w-0 items-center gap-3 break-words"><Building2 size={18} className="shrink-0 text-moss" /> {state.customer.teamName || 'Workspace team'}</p>
            <p>Country {state.customer.country || 'VN'}</p>
            <p>Created {formatDate(state.customer.createdAt)}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-ink/10 bg-white p-4 shadow-card sm:p-6">
          <h2 className="font-display text-2xl font-bold text-ink">Activity timeline</h2>
          <div className="mt-5 space-y-4">
            {customerActivities.length ? customerActivities.map((activity) => (
              <div key={activity.id} className="rounded-xl bg-fog/80 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3"><Badge>{activity.type}</Badge><span className="text-xs font-bold text-ink/45">{formatDate(activity.createdAt)}</span></div>
                <p className="mt-3 text-sm font-semibold leading-6 text-ink/70">{activity.description}</p>
              </div>
            )) : <EmptyState title="No activity yet" description="Calls, emails, notes, and automation logs will appear here." />}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-ink/10 bg-white p-4 shadow-card sm:p-6">
          <h2 className="font-display text-2xl font-bold text-ink">Active deals</h2>
          <div className="mt-5 space-y-3">{customerDeals.length ? customerDeals.map((deal) => <div key={deal.id} className="flex flex-col gap-3 rounded-xl bg-cream p-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="break-words font-bold text-ink">{deal.name}</p><p className="text-sm font-semibold text-ink/55">{formatCurrency(deal.amount)}</p></div><Badge>{deal.stage}</Badge></div>) : <EmptyState title="No deals" description="Create a deal from the deals page to connect it with this customer." />}</div>
        </section>
        <section className="rounded-2xl border border-ink/10 bg-white p-4 shadow-card sm:p-6">
          <h2 className="font-display text-2xl font-bold text-ink">Tasks</h2>
          <div className="mt-5 space-y-3">{customerTasks.length ? customerTasks.map((task) => <div key={task.id} className="flex flex-col gap-3 rounded-xl bg-cream p-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="break-words font-bold text-ink">{task.title}</p><p className="text-sm font-semibold text-ink/55">Due {formatDate(task.dueDate)}</p></div><Badge>{task.status}</Badge></div>) : <EmptyState title="No tasks" description="Tasks created for this customer will appear here." />}</div>
        </section>
      </div>

      <Modal title="Log activity" description={`Add a note, call, or email record for ${state.customer.name}.`} open={isActivityModalOpen} onClose={() => setIsActivityModalOpen(false)}>
        <ActivityForm customerId={id} onSubmit={createActivity} onCancel={() => setIsActivityModalOpen(false)} error={formError} />
      </Modal>
    </>
  );
}
