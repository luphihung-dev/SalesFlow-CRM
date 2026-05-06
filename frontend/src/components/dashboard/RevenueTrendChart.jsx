import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import ChartCard from './ChartCard';

export default function RevenueTrendChart({ data }) {
  return (
    <ChartCard title="Revenue Trend" description="Revenue movement over recent periods.">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 0, right: 12, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#214E34" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#214E34" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#E8DFC9" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#6f746b', fontSize: 12, fontWeight: 700 }} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${Math.round(value / 1000)}k`} tick={{ fill: '#6f746b', fontSize: 12, fontWeight: 700 }} />
            <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} contentStyle={{ borderRadius: 18, border: '1px solid #E8DFC9' }} />
            <Area type="monotone" dataKey="revenue" stroke="#214E34" strokeWidth={3} fill="url(#revenueGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
