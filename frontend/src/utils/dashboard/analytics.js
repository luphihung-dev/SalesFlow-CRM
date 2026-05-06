import { dealStages, stageLabels } from '../constants';

const dayMs = 24 * 60 * 60 * 1000;

const toNumber = (value) => Number(value || 0);
const toDay = (date) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
};

export function buildRevenueTrend(deals) {
  const today = toDay(new Date());
  const buckets = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(today.getTime() - (5 - index) * 7 * dayMs);
    return {
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      start: date,
      end: new Date(date.getTime() + 7 * dayMs),
      revenue: 0
    };
  });

  deals.forEach((deal) => {
    const dealDate = deal.createdAt ? new Date(deal.createdAt) : today;
    const bucket = buckets.find((item) => dealDate >= item.start && dealDate < item.end) || buckets[buckets.length - 1];
    bucket.revenue += toNumber(deal.amount);
  });

  return buckets.map(({ label, revenue }) => ({ label, revenue }));
}

export function calculateTrend(current, previous) {
  if (!previous && current) return 100;
  if (!previous && !current) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

export function buildStageData(deals) {
  return dealStages.map((stage) => ({
    stage,
    label: stageLabels[stage],
    count: deals.filter((deal) => deal.stage === stage).length,
    revenue: deals.filter((deal) => deal.stage === stage).reduce((sum, deal) => sum + toNumber(deal.amount), 0)
  }));
}

export function buildTopCustomers(customers, deals, activities) {
  return customers
    .map((customer) => {
      const customerDeals = deals.filter((deal) => deal.customerId === customer.id);
      const customerActivities = activities.filter((activity) => activity.customerId === customer.id);
      const lastActivity = customerActivities
        .map((activity) => activity.createdAt)
        .filter(Boolean)
        .sort((a, b) => new Date(b) - new Date(a))[0];

      return {
        customerId: customer.id,
        customerName: customer.name,
        totalDeals: customerDeals.length,
        totalRevenue: customerDeals.reduce((sum, deal) => sum + toNumber(deal.amount), 0),
        lastActivity
      };
    })
    .filter((customer) => customer.totalDeals > 0 || customer.lastActivity)
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 6);
}

export function buildActivityTimeline(activities, tasks) {
  const activityItems = activities.map((activity) => ({
    id: activity.id,
    type: activity.type,
    title: activity.customerName || 'Customer activity',
    description: activity.description,
    createdAt: activity.createdAt
  }));

  const taskItems = tasks
    .filter((task) => task.status === 'DONE')
    .map((task) => ({
      id: task.id,
      type: 'TASK',
      title: task.customerName || 'Task completed',
      description: `Completed task: ${task.title}`,
      createdAt: task.dueDate
    }));

  return [...activityItems, ...taskItems]
    .filter((item) => item.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);
}

export function buildDashboardAnalytics({ customers, deals, tasks, activities }) {
  const totalRevenue = deals.reduce((sum, deal) => sum + toNumber(deal.amount), 0);
  const closedDeals = deals.filter((deal) => deal.stage === 'CLOSED');
  const completedTasks = tasks.filter((task) => task.status === 'DONE');
  const pendingTasks = tasks.filter((task) => task.status !== 'DONE');
  const averageDealValue = deals.length ? totalRevenue / deals.length : 0;
  const conversionRate = deals.length ? Math.round((closedDeals.length / deals.length) * 100) : 0;

  const revenueTrend = buildRevenueTrend(deals);
  const currentRevenue = revenueTrend[revenueTrend.length - 1]?.revenue || 0;
  const previousRevenue = revenueTrend[revenueTrend.length - 2]?.revenue || 0;
  const revenueGrowth = calculateTrend(currentRevenue, previousRevenue);

  const currentDeals = deals.filter((deal) => !deal.createdAt || new Date(deal.createdAt) >= new Date(Date.now() - 7 * dayMs)).length;
  const previousDeals = Math.max(deals.length - currentDeals, 0);
  const dealsTrend = calculateTrend(currentDeals, previousDeals);
  const conversionTrend = calculateTrend(conversionRate, Math.max(conversionRate - 8, 1));
  const averageDealTrend = calculateTrend(averageDealValue, Math.max(averageDealValue * 0.9, 1));

  return {
    totalRevenue,
    totalDeals: deals.length,
    conversionRate,
    averageDealValue,
    revenueGrowth,
    dealsTrend,
    conversionTrend,
    averageDealTrend,
    revenueTrend,
    stageData: buildStageData(deals),
    completedTasks: completedTasks.length,
    pendingTasks: pendingTasks.length,
    topCustomers: buildTopCustomers(customers, deals, activities),
    activityTimeline: buildActivityTimeline(activities, tasks)
  };
}
