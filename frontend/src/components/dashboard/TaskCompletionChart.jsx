import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import ChartCard from './ChartCard';

const colors = {
  Completed: '#214E34',
  Pending: '#C86F4A'
};

export default function TaskCompletionChart({ completed, pending }) {
  const total = completed + pending;
  const rate = total ? Math.round((completed / total) * 100) : 0;
  const data = [
    { name: 'Completed', value: completed },
    { name: 'Pending', value: pending }
  ];

  return (
    <ChartCard title="Task Completion Rate" description="Completed vs pending work.">
      <div className="grid items-center gap-5 md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={70} outerRadius={100} paddingAngle={4}>
                {data.map((entry) => <Cell key={entry.name} fill={colors[entry.name]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 18, border: '1px solid #E8DFC9' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="text-center">
              <p className="font-display text-4xl font-bold text-ink">{rate}%</p>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/40">Complete</p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between rounded-2xl bg-cream p-4">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full" style={{ background: colors[item.name] }} />
                <span className="font-bold text-ink">{item.name}</span>
              </div>
              <span className="font-display text-xl font-bold text-ink">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}
