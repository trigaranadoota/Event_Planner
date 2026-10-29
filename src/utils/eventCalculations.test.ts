import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBudgetSummary, calculateDaysRemaining, calculateTimelineProgress } from './eventCalculations';
import { BudgetItem, TimelineItem } from '../types';

test('calculateBudgetSummary correctly computes totals, actuals, paid, and variance', () => {
  const items: BudgetItem[] = [
    { id: '1', category: 'Venue', name: 'Manor Hire', allocated: 10000, actual: 10000, status: 'paid' },
    { id: '2', category: 'Catering', name: 'Dinner', allocated: 8000, actual: 8500, status: 'deposit_paid' },
    { id: '3', category: 'Florals', name: 'Urns', allocated: 3000, actual: 2500, status: 'unpaid' },
  ];
  const targetBudget = 25000;

  const summary = calculateBudgetSummary(items, targetBudget);

  assert.equal(summary.totalAllocated, 21000);
  assert.equal(summary.totalActual, 21000);
  assert.equal(summary.totalPaid, 10000);
  assert.equal(summary.variance, 4000);
  assert.equal(summary.committedPercentage, 84);
});

test('calculateDaysRemaining computes correct difference in days', () => {
  const baseDate = new Date('2026-09-01T12:00:00Z');
  const targetDate = '2026-09-11T12:00:00Z';
  const days = calculateDaysRemaining(targetDate, baseDate);
  assert.equal(days, 10);
});

test('calculateTimelineProgress correctly computes completed milestones percentage', () => {
  const timeline: TimelineItem[] = [
    { id: 't1', timeframe: '6m', title: 'A', description: '', phase: 'milestone', completed: true },
    { id: 't2', timeframe: '3m', title: 'B', description: '', phase: 'milestone', completed: false },
    { id: 't3', timeframe: '1m', title: 'C', description: '', phase: 'milestone', completed: true },
    { id: 't4', timeframe: '1w', title: 'D', description: '', phase: 'milestone', completed: false },
  ];

  const progress = calculateTimelineProgress(timeline);
  assert.equal(progress.completed, 2);
  assert.equal(progress.total, 4);
  assert.equal(progress.percentage, 50);
});
