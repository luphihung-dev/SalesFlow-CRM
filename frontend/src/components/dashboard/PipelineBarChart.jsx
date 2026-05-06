import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartCard from './ChartCard';

const colors = ['#3B82F6', '#60A5FA', '#6E8B3D', '#214E34'];

export default function PipelineBarChart({ data, title = 'Sales Pipeline', description = 'Deal count across pipeline stages.' }) {
  return (
    <ChartCard title={title} description={description}>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -20, right: 8, top: 10, bottom: 0 }}>
            <CartesianGrid stroke="#E8DFC9" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#6f746b', fontSize: 12, fontWeight: 700 }} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: '#6f746b', fontSize: 12, fontWeight: 700 }} />
            <Tooltip contentStyle={{ borderRadius: 18, border: '1px solid #E8DFC9' }} />
            <Bar dataKey="count" radius={[12, 12, 0, 0]}>
              {data.map((entry, index) => <Cell key={entry.stage || entry.label} fill={colors[index % colors.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
