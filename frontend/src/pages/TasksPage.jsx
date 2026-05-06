import { CheckCircle2, Edit3, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { crmApi } from '../api/crmApi';
import Badge from '../components/Badge';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import TaskForm from '../components/forms/TaskForm';
import LoadingState from '../components/LoadingState';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import { getApiErrorMessage } from '../utils/apiErrors';
import { formatDate } from '../utils/formatters';
import { canDeleteRecords } from '../utils/permissions';
import { notifySearchDataChanged } from '../utils/searchEvents';

export default function TasksPage() {
  const canDelete = canDeleteRecords();
  const [tasks, setTasks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    Promise.all([crmApi.tasks.list(), crmApi.customers.list(), crmApi.users.list()])
      .then(([tasksData, customersData, usersData]) => {
        setTasks(tasksData);
        setCustomers(customersData);
        setUsers(usersData);
      })
      .catch((apiError) => setError(getApiErrorMessage(apiError, 'Unable to load tasks.')))
      .finally(() => setLoading(false));
  }, []);

  const sortedTasks = useMemo(() => [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)), [tasks]);

  const saveTask = async (payload) => {
    setFormError('');
    try {
      if (editingTask) {
        const task = await crmApi.tasks.update(editingTask.id, payload);
        setTasks((current) => current.map((item) => (item.id === task.id ? task : item)));
        notifySearchDataChanged();
      } else {
        const task = await crmApi.tasks.create(payload);
        setTasks((current) => [task, ...current]);
        notifySearchDataChanged();
      }
      setEditingTask(null);
      setIsModalOpen(false);
    } catch (apiError) {
      setFormError(getApiErrorMessage(apiError, 'Unable to save task.'));
    }
  };

  const deleteTask = async () => {
    if (!deletingTask) return;
    setDeleteBusy(true);
    setError('');
    try {
      await crmApi.tasks.remove(deletingTask.id);
      setTasks((current) => current.filter((task) => task.id !== deletingTask.id));
      notifySearchDataChanged();
      setDeletingTask(null);
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to delete task.'));
    } finally {
      setDeleteBusy(false);
    }
  };

  const markDone = async (task) => {
    if (task.status === 'DONE') return;
    setUpdatingId(task.id);
    setError('');
    const payload = {
      title: task.title,
      dueDate: task.dueDate,
      status: 'DONE',
      userId: task.userId,
      customerId: task.customerId
    };
    try {
      const updatedTask = await crmApi.tasks.update(task.id, payload);
      setTasks((current) => current.map((item) => (item.id === task.id ? updatedTask : item)));
      notifySearchDataChanged();
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to mark task done.'));
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <LoadingState label="Loading tasks..." />;

  return (
    <>
      <PageHeader
        eyebrow="Tasks"
        title="Work queue"
        description="Create follow-ups and check work off. Completing a task creates a backend activity log."
        action={<button className="inline-flex items-center gap-2 rounded-2xl bg-pine px-5 py-3 text-sm font-extrabold text-cream shadow-soft" onClick={() => { setEditingTask(null); setFormError(''); setIsModalOpen(true); }} type="button"><Plus size={18} /> Add Task</button>}
      />
      <ErrorBanner message={error} onDismiss={() => setError('')} />

      {sortedTasks.length ? (
        <div className="space-y-3">
          {sortedTasks.map((task) => (
            <article key={task.id} className="flex flex-col gap-4 rounded-[1.5rem] border border-white/70 bg-white/80 p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <button
                  className={`mt-1 grid h-8 w-8 place-items-center rounded-xl border font-bold transition ${task.status === 'DONE' ? 'border-emerald-200 bg-emerald-100 text-emerald-700' : 'border-ink/10 bg-cream text-ink/30 hover:text-pine'}`}
                  type="button"
                  onClick={() => markDone(task)}
                  disabled={updatingId === task.id || task.status === 'DONE'}
                  title="Mark done"
                >
                  <CheckCircle2 size={18} />
                </button>
                <div>
                  <h2 className="font-display text-xl font-bold text-ink">{task.title}</h2>
                  <p className="mt-1 text-sm font-semibold text-ink/55">{task.customerName} · Due {formatDate(task.dueDate)} · Owner {task.userName || 'Unassigned'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {task.overdue && <Badge tone="OVERDUE">Overdue</Badge>}
                <Badge>{task.status}</Badge>
                <button className="rounded-xl bg-white p-2 text-pine shadow-card" type="button" onClick={() => { setEditingTask(task); setFormError(''); setIsModalOpen(true); }} aria-label="Edit task"><Edit3 size={16} /></button>
                {canDelete && <button className="rounded-xl bg-white p-2 text-clay shadow-card" type="button" onClick={() => setDeletingTask(task)} aria-label="Delete task"><Trash2 size={16} /></button>}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="No tasks yet" description="Create a task manually, or add a customer and let the backend automation create a follow-up." />
      )}

      <Modal title={editingTask ? 'Edit task' : 'Add task'} description={editingTask ? 'Update task details or owner.' : 'Assign a customer and owner so the Spring API can manage task status updates.'} open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TaskForm initialData={editingTask} customers={customers} users={users} onSubmit={saveTask} onCancel={() => setIsModalOpen(false)} error={formError} submitLabel={editingTask ? 'Save changes' : 'Create task'} />
      </Modal>
      <ConfirmDialog open={Boolean(deletingTask)} title="Delete task?" description="This removes the task from the work queue." onCancel={() => setDeletingTask(null)} onConfirm={deleteTask} busy={deleteBusy} />
    </>
  );
}
