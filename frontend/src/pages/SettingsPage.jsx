import { BadgeCheck, ClipboardCheck, FileClock, GitBranch, Layers3, LockKeyhole, ShieldCheck, Zap } from 'lucide-react';
import Badge from '../components/Badge';
import PageHeader from '../components/PageHeader';

const automationRules = [
  {
    name: 'New customer follow-up',
    category: 'Flow style',
    trigger: 'Customer created',
    condition: 'Every new customer record',
    action: 'Create an unassigned follow-up task due in 2 days.',
    owner: 'Sales Operations',
    icon: ClipboardCheck
  },
  {
    name: 'High-value deal note',
    category: 'Apex Trigger style',
    trigger: 'Deal created',
    condition: 'Amount > $10,000',
    action: 'Create a NOTE activity on the customer timeline.',
    owner: 'Pipeline Automation',
    icon: GitBranch
  },
  {
    name: 'Manager approval flag',
    category: 'Approval Process',
    trigger: 'Deal created or updated',
    condition: 'Amount > $50,000',
    action: 'Mark deal as requiring manager approval and log an activity.',
    owner: 'Sales Management',
    icon: ShieldCheck
  },
  {
    name: 'Closed deal activity',
    category: 'Apex Trigger style',
    trigger: 'Deal stage changed',
    condition: 'Stage moves to CLOSED',
    action: 'Create a Deal closed NOTE activity.',
    owner: 'Pipeline Automation',
    icon: BadgeCheck
  },
  {
    name: 'Task completion log',
    category: 'Apex Trigger style',
    trigger: 'Task updated',
    condition: 'Status changes from TODO to DONE',
    action: 'Create a Task completed NOTE activity.',
    owner: 'Activity Automation',
    icon: ClipboardCheck
  },
  {
    name: 'Overdue task alert',
    category: 'Escalation Rule',
    trigger: 'Task list loaded',
    condition: 'TODO task due date is in the past',
    action: 'Return an overdue signal so the UI can show work queue alerts.',
    owner: 'Sales Productivity',
    icon: FileClock
  }
];

const automationStats = [
  { label: 'Active rules', value: automationRules.length, detail: 'All enabled', icon: Zap, tone: 'bg-emerald-100 text-emerald-700' },
  { label: 'Trigger styles', value: '4', detail: 'Flow, Trigger, Approval, Escalation', icon: Layers3, tone: 'bg-sky-100 text-sky-700' },
  { label: 'Admin managed', value: 'Yes', detail: 'Visible to admin role', icon: LockKeyhole, tone: 'bg-violet-100 text-violet-700' }
];

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin settings"
        title="Automation rules"
        description="Monitor the CRM business rules that run in the backend and surface operational alerts."
      />

      <section className="grid gap-3 md:grid-cols-3">
        {automationStats.map(({ label, value, detail, icon: Icon, tone }) => (
          <div key={label} className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-4 shadow-card">
            <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${tone}`}>
              <Icon size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink/40">{label}</p>
              <div className="mt-1 flex items-baseline gap-2">
                <p className="font-display text-3xl font-bold text-ink">{value}</p>
                <p className="truncate text-xs font-bold text-ink/45">{detail}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_22rem]">
        <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card">
          <div className="border-b border-ink/5 px-5 py-4">
            <h2 className="font-display text-2xl font-bold text-ink">Rule inventory</h2>
            <p className="mt-1 text-sm font-semibold text-ink/55">Backend event rules currently active in the CRM workflow.</p>
          </div>

          <div className="divide-y divide-ink/5">
            {automationRules.map(({ name, category, trigger, condition, action, owner, icon: Icon }) => (
              <article key={name} className="grid gap-4 px-5 py-4 transition hover:bg-cream/70 lg:grid-cols-[minmax(0,1fr)_11rem_8rem] lg:items-center">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-pine/10 text-pine">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg font-bold text-ink">{name}</h3>
                      <Badge tone="ACTIVE">Active</Badge>
                    </div>
                    <p className="mt-1 text-sm font-bold text-ink/45">{owner}</p>
                    <p className="mt-3 text-sm font-semibold leading-6 text-ink/65">{action}</p>
                  </div>
                </div>

                <div className="text-sm">
                  <p className="font-extrabold text-ink">{trigger}</p>
                  <p className="mt-1 font-semibold text-ink/50">{condition}</p>
                </div>

                <p className="w-fit rounded-full bg-fog px-3 py-1.5 text-xs font-extrabold text-pine">{category}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="rounded-2xl border border-white/10 bg-ink p-5 text-cream shadow-card">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cream/45">Implementation</p>
          <h2 className="mt-3 font-display text-2xl font-bold">Spring events</h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-cream/65">
            Rules are implemented in the backend with Spring domain events, similar to Salesforce Flow and Apex Trigger concepts.
          </p>
          <div className="mt-5 space-y-3 text-sm">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="font-extrabold text-cream">Event listeners</p>
              <p className="mt-1 font-semibold text-cream/60">Customer, deal, and task events publish workflow actions.</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="font-extrabold text-cream">UI signals</p>
              <p className="mt-1 font-semibold text-cream/60">Approval and overdue states surface in badges, search, and notifications.</p>
            </div>
          </div>
          <p className="mt-5 rounded-2xl bg-clay/20 px-4 py-3 text-xs font-bold leading-5 text-sand">
            Admins can review system behavior here; sales users work with the results in Deals, Tasks, and customer timelines.
          </p>
        </aside>
      </section>
    </>
  );
}
