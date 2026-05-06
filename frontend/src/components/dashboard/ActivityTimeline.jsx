import { CheckCircle2, Mail, MessageSquareText, Phone } from 'lucide-react';
import Badge from '../Badge';
import EmptyState from '../EmptyState';
import { formatDate } from '../../utils/formatters';
import ChartCard from './ChartCard';

const icons = {
  CALL: Phone,
  EMAIL: Mail,
  NOTE: MessageSquareText,
  TASK: CheckCircle2
};

export default function ActivityTimeline({ activities }) {
  return (
    <ChartCard title="Activity Timeline" description="Recent customer touchpoints and task events.">
      {activities.length ? (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = icons[activity.type] || MessageSquareText;
            return (
              <article key={`${activity.type}-${activity.id}`} className="flex gap-4 rounded-2xl bg-cream p-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-pine shadow-card"><Icon size={18} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-bold text-ink">{activity.title}</p>
                    <Badge>{activity.type}</Badge>
                  </div>
                  <p className="mt-1 text-sm font-semibold leading-6 text-ink/60">{activity.description}</p>
                  <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.16em] text-ink/35">{formatDate(activity.createdAt)}</p>
                </div>
              </article>
            );
          })}
        </div>
      ) : <EmptyState title="No recent activity" description="Calls, emails, notes, and completed tasks will appear here." />}
    </ChartCard>
  );
}
