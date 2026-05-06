import { Edit3, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { crmApi } from '../api/crmApi';
import Badge from '../components/Badge';
import ConfirmDialog from '../components/ConfirmDialog';
import ErrorBanner from '../components/ErrorBanner';
import DealForm from '../components/forms/DealForm';
import LoadingState from '../components/LoadingState';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import { dealStages, stageLabels } from '../utils/constants';
import { getApiErrorMessage } from '../utils/apiErrors';
import { formatCurrency } from '../utils/formatters';
import { canDeleteRecords } from '../utils/permissions';
import { notifySearchDataChanged } from '../utils/searchEvents';

export default function DealsPage() {
  const canDelete = canDeleteRecords();
  const [deals, setDeals] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [deletingDeal, setDeletingDeal] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    Promise.all([crmApi.deals.list(), crmApi.customers.list(), crmApi.users.list()])
      .then(([dealsData, customersData, usersData]) => {
        setDeals(dealsData);
        setCustomers(customersData);
        setUsers(usersData);
      })
      .catch((apiError) => setError(getApiErrorMessage(apiError, 'Unable to load pipeline data.')))
      .finally(() => setLoading(false));
  }, []);

  const groupedDeals = useMemo(() => Object.fromEntries(dealStages.map((stage) => [stage, deals.filter((deal) => deal.stage === stage)])), [deals]);

  const saveDeal = async (payload) => {
    setFormError('');
    try {
      if (editingDeal) {
        const deal = await crmApi.deals.update(editingDeal.id, payload);
        setDeals((current) => current.map((item) => (item.id === deal.id ? deal : item)));
        notifySearchDataChanged();
      } else {
        const deal = await crmApi.deals.create(payload);
        setDeals((current) => [deal, ...current]);
        notifySearchDataChanged();
      }
      setEditingDeal(null);
      setIsModalOpen(false);
    } catch (apiError) {
      setFormError(getApiErrorMessage(apiError, 'Unable to save deal.'));
    }
  };

  const deleteDeal = async () => {
    if (!deletingDeal) return;
    setDeleteBusy(true);
    setError('');
    try {
      await crmApi.deals.remove(deletingDeal.id);
      setDeals((current) => current.filter((deal) => deal.id !== deletingDeal.id));
      notifySearchDataChanged();
      setDeletingDeal(null);
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to delete deal.'));
    } finally {
      setDeleteBusy(false);
    }
  };

  const updateDealStage = async (deal, stage) => {
    if (deal.stage === stage) return;
    setUpdatingId(deal.id);
    setError('');
    try {
      const updatedDeal = await crmApi.deals.update(deal.id, {
        name: deal.name,
        amount: deal.amount,
        stage,
        customerId: deal.customerId,
        ownerId: deal.ownerId
      });
      setDeals((current) => current.map((item) => (item.id === deal.id ? updatedDeal : item)));
      notifySearchDataChanged();
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to update deal stage.'));
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <LoadingState label="Loading pipeline..." />;

  return (
    <>
      <PageHeader
        eyebrow="Deals"
        title="Pipeline board"
        description="Create opportunities and move them through the pipeline. High-value deals trigger backend activity automation."
        action={<button className="inline-flex items-center gap-2 rounded-2xl bg-pine px-5 py-3 text-sm font-extrabold text-cream shadow-soft" onClick={() => { setEditingDeal(null); setFormError(''); setIsModalOpen(true); }} type="button"><Plus size={18} /> Add Deal</button>}
      />
      <ErrorBanner message={error} onDismiss={() => setError('')} />

      <div className="grid gap-5 xl:grid-cols-4">
        {dealStages.map((stage) => (
          <section key={stage} className="rounded-[2rem] border border-white/70 bg-white/70 p-4 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-ink">{stageLabels[stage]}</h2>
                <p className="text-sm font-bold text-ink/45">{groupedDeals[stage].length} deals</p>
              </div>
              <Badge>{stage}</Badge>
            </div>
            <div className="space-y-3">
              {groupedDeals[stage].map((deal) => (
                <article key={deal.id} className="rounded-3xl border border-ink/5 bg-cream p-4 shadow-card transition hover:-translate-y-1">
                  <p className="font-display text-lg font-bold text-ink">{deal.name}</p>
                  <p className="mt-1 text-sm font-semibold text-ink/55">{deal.customerName}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-display text-xl font-bold text-pine">{formatCurrency(deal.amount)}</span>
                    <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-ink/40">{deal.ownerName}</span>
                  </div>
                  {deal.requiresManagerApproval && (
                    <div className="mt-3">
                      <Badge tone="APPROVAL">Manager approval</Badge>
                    </div>
                  )}
                  <select className="mt-4 h-10 w-full rounded-2xl border border-ink/10 bg-white px-3 text-sm font-bold outline-none" value={deal.stage} disabled={updatingId === deal.id} onChange={(event) => updateDealStage(deal, event.target.value)}>
                    {dealStages.map((option) => <option key={option} value={option}>{stageLabels[option]}</option>)}
                  </select>
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 rounded-2xl bg-white px-3 py-2 text-sm font-extrabold text-pine shadow-card" type="button" onClick={() => { setEditingDeal(deal); setFormError(''); setIsModalOpen(true); }}><Edit3 className="mr-1 inline" size={15} /> Edit</button>
                    {canDelete && <button className="flex-1 rounded-2xl bg-white px-3 py-2 text-sm font-extrabold text-clay shadow-card" type="button" onClick={() => setDeletingDeal(deal)}><Trash2 className="mr-1 inline" size={15} /> Delete</button>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <Modal title={editingDeal ? 'Edit deal' : 'Add deal'} description={editingDeal ? 'Update opportunity details.' : 'Attach the deal to a customer and owner. Amounts above 10000 create an automatic note.'} open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DealForm initialData={editingDeal} customers={customers} users={users} onSubmit={saveDeal} onCancel={() => setIsModalOpen(false)} error={formError} submitLabel={editingDeal ? 'Save changes' : 'Create deal'} />
      </Modal>
      <ConfirmDialog open={Boolean(deletingDeal)} title="Delete deal?" description="This removes the opportunity from the pipeline." onCancel={() => setDeletingDeal(null)} onConfirm={deleteDeal} busy={deleteBusy} />
    </>
  );
}
