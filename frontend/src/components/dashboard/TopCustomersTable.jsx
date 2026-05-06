import DataTable from '../DataTable';
import EmptyState from '../EmptyState';
import { formatCurrency, formatDate } from '../../utils/formatters';
import ChartCard from './ChartCard';

export default function TopCustomersTable({ customers }) {
  return (
    <ChartCard title="Top Customers" description="Customers ranked by total deal revenue and recent engagement.">
      {customers.length ? (
        <DataTable
          rows={customers}
          keyField="customerId"
          columns={[
            { key: 'customerName', header: 'Customer Name' },
            { key: 'totalDeals', header: 'Total Deals' },
            { key: 'totalRevenue', header: 'Total Revenue', render: (row) => formatCurrency(row.totalRevenue) },
            { key: 'lastActivity', header: 'Last Activity', render: (row) => row.lastActivity ? formatDate(row.lastActivity) : 'No activity' }
          ]}
        />
      ) : <EmptyState title="No customer revenue yet" description="Create deals and activities to populate top customer insights." />}
    </ChartCard>
  );
}
