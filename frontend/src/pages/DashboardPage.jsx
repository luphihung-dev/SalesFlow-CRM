import { BriefcaseBusiness, DollarSign, Percent, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { crmApi } from '../api/crmApi';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import PipelineBarChart from '../components/dashboard/PipelineBarChart';
import RevenueTrendChart from '../components/dashboard/RevenueTrendChart';
import TaskCompletionChart from '../components/dashboard/TaskCompletionChart';
import TopCustomersTable from '../components/dashboard/TopCustomersTable';
import TrendKpiCard from '../components/dashboard/TrendKpiCard';
import { getApiErrorMessage } from '../utils/apiErrors';
import { buildDashboardAnalytics } from '../utils/dashboard/analytics';
import { formatCurrency } from '../utils/formatters';
import { getCurrentUser, isSales } from '../utils/permissions';

export default function DashboardPage() {
  const [state, setState] = useState({ loading: true, customers: [], deals: [], tasks: [], activities: [] });
  const [error, setError] = useState('');
  const currentUser = getCurrentUser();
  const salesView = isSales();

  useEffect(() => {
    Promise.all([crmApi.customers.list(), crmApi.deals.list(), crmApi.tasks.list(), crmApi.activities.list()])
      .then(([customers, deals, tasks, activities]) => setState({ loading: false, customers, deals, tasks, activities }))
      .catch((apiError) => {
        setError(getApiErrorMessage(apiError, 'Unable to load dashboard analytics.'));
        setState((current) => ({ ...current, loading: false }));
      });
  }, []);

  const scopedData = useMemo(() => {
    if (!salesView) return state;

    const deals = state.deals.filter((deal) => deal.ownerId === currentUser?.userId);
    const tasks = state.tasks.filter((task) => task.userId === currentUser?.userId);
    const customerIds = new Set([...deals.map((deal) => deal.customerId), ...tasks.map((task) => task.customerId)]);
    const customers = state.customers.filter((customer) => customerIds.has(customer.id));
    const activities = state.activities.filter((activity) => customerIds.has(activity.customerId));

    return { ...state, customers, deals, tasks, activities };
  }, [currentUser?.userId, salesView, state]);

  const analytics = useMemo(() => buildDashboardAnalytics(scopedData), [scopedData]);

  if (state.loading) return <LoadingState label="Loading CRM analytics..." />;

  const hasData = scopedData.deals.length || scopedData.tasks.length || scopedData.activities.length;

  return (
    <>
      <PageHeader
        eyebrow="Analytics"
        title={salesView ? 'My CRM analytics' : 'CRM analytics dashboard'}
        description={salesView ? 'Revenue, conversion, customer activity, and execution insights for your assigned pipeline.' : 'Revenue trends, conversion health, pipeline distribution, customer value, and activity insights.'}
      />
      <ErrorBanner message={error} onDismiss={() => setError('')} />

      {!hasData ? (
        <EmptyState title="No analytics data yet" description="Create customers, deals, tasks, and activities to populate CRM insights." />
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <TrendKpiCard label="Total Revenue" value={formatCurrency(analytics.totalRevenue)} trend={analytics.revenueGrowth} detail="vs previous period" icon={DollarSign} tone="positive" />
            <TrendKpiCard label="Total Deals" value={analytics.totalDeals} trend={analytics.dealsTrend} detail={salesView ? 'owned deals' : 'all pipeline deals'} icon={BriefcaseBusiness} tone="neutral" />
            <TrendKpiCard label="Conversion Rate" value={`${analytics.conversionRate}%`} trend={analytics.conversionTrend} detail="closed / total deals" icon={Percent} tone="positive" />
            <TrendKpiCard label="Average Deal Value" value={formatCurrency(analytics.averageDealValue)} trend={analytics.averageDealTrend} detail="revenue per deal" icon={TrendingUp} tone="neutral" />
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
            <RevenueTrendChart data={analytics.revenueTrend} />
            <PipelineBarChart data={analytics.stageData} title="Sales Pipeline" description="NEW → CONTACTED → QUALIFIED → CLOSED." />
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <PipelineBarChart data={analytics.stageData} title="Deals by Stage" description="Compare deal volume across each stage." />
            <TaskCompletionChart completed={analytics.completedTasks} pending={analytics.pendingTasks} />
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <TopCustomersTable customers={analytics.topCustomers} />
            <ActivityTimeline activities={analytics.activityTimeline} />
          </div>
        </>
      )}
    </>
  );
}
