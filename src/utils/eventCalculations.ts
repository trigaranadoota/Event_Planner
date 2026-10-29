import { BudgetItem, TimelineItem } from '../types';

export function calculateBudgetSummary(items: BudgetItem[], targetBudget: number) {
  const totalAllocated = items.reduce((sum, item) => sum + item.allocated, 0);
  const totalActual = items.reduce((sum, item) => sum + item.actual, 0);
  const totalPaid = items
    .filter((b) => b.status === 'paid')
    .reduce((sum, item) => sum + item.actual, 0);
  const variance = targetBudget - totalActual;
  const committedPercentage = targetBudget > 0 ? Math.round((totalActual / targetBudget) * 100) : 0;

  return {
    totalAllocated,
    totalActual,
    totalPaid,
    variance,
    committedPercentage,
  };
}

export function calculateDaysRemaining(targetDateStr: string, fromDate: Date = new Date()): number {
  const targetDate = new Date(targetDateStr);
  const diffTime = targetDate.getTime() - fromDate.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

export function calculateTimelineProgress(timeline: TimelineItem[]) {
  if (timeline.length === 0) return { completed: 0, total: 0, percentage: 0 };
  const completed = timeline.filter((t) => t.completed).length;
  const total = timeline.length;
  const percentage = Math.round((completed / total) * 100);
  return { completed, total, percentage };
}
