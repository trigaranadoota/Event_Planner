import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  MapPin,
  Users,
  Coins,
  CheckCircle2,
  Clock,
  ArrowRight,
  Copy,
  Check,
  Flame,
  MessageSquare,
} from 'lucide-react';
import { EventPlan, Contributor } from '../types';
import { TabKey } from './Navigation';

interface OverviewTabProps {
  event: EventPlan;
  onNavigateTab: (tab: TabKey) => void;
  onOpenAIConcierge: (initialPrompt?: string) => void;
  activeContributor: Contributor;
  onClaimTask: (taskId: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  event,
  onNavigateTab,
  onOpenAIConcierge,
  activeContributor,
  onClaimTask,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // Calculate stats
  const totalAllocated = event.budgetItems.reduce((acc, item) => acc + item.allocated, 0);
  const totalActual = event.budgetItems.reduce((acc, item) => acc + item.actual, 0);
  const totalPaid = event.budgetItems
    .filter((b) => b.status === 'paid')
    .reduce((acc, item) => acc + item.actual, 0);

  const completedTimelineCount = event.timeline.filter((t) => t.completed).length;
  const totalTimelineCount = event.timeline.length;
  const timelineProgress = totalTimelineCount > 0 ? Math.round((completedTimelineCount / totalTimelineCount) * 100) : 0;

  // Days until event
  const today = new Date();
  const eventDate = new Date(event.date);
  const diffTime = eventDate.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const nextMilestones = event.timeline
    .filter((t) => !t.completed)
    .slice(0, 3);

  const dayOfHighlights = event.timeline
    .filter((t) => t.phase === 'day_of')
    .slice(0, 4);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Atmosphere Card */}
      <div className="paper-card-elevated p-8 sm:p-12 relative overflow-hidden bg-gradient-to-b from-[#FFFFFF] to-[#FCFAF7] border border-[#E4DDD0]">
        {/* Subtle decorative watermark ornament */}
        <div className="absolute right-4 top-2 text-[#9A8257]/10 font-heading text-8xl select-none pointer-events-none">
          ❦
        </div>

        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-editorial uppercase tracking-widest text-[#9A8257] bg-[#F7F2E7] px-2.5 py-0.5 border border-[#E9DFCE]">
              {event.eventType} Atelier
            </span>
            <span className="text-[#CCC1B0]">•</span>
            <span className="font-sans text-[#786E60] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#9A8257]" />
              {event.location}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1F1C18] font-heading tracking-tight leading-tight">
            {event.title}
          </h1>

          <p className="font-script text-2xl sm:text-3xl text-[#5E5345] leading-relaxed">
            "{event.tagline}"
          </p>

          <p className="font-editorial text-sm sm:text-base text-[#6E6456] leading-relaxed max-w-2xl">
            {event.vibe}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-editorial">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F1] border border-[#E5DDD0]">
              <Calendar className="w-3.5 h-3.5 text-[#9A8257]" />
              <span className="text-[#322E28]">
                {eventDate.toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F1] border border-[#E5DDD0]">
              <Users className="w-3.5 h-3.5 text-[#9A8257]" />
              <span className="text-[#322E28]">{event.guestCount} Curated Guests</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F1] border border-[#E5DDD0]">
              <Coins className="w-3.5 h-3.5 text-[#9A8257]" />
              <span className="text-[#322E28]">
                {event.currency}{event.targetBudget.toLocaleString()} Planned Reserve
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Metric Atelier Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Countdown */}
        <div className="paper-card p-5 border border-[#E6DFD2] space-y-2">
          <div className="flex items-center justify-between text-xs font-editorial text-[#7F7567]">
            <span>Countdown</span>
            <Clock className="w-4 h-4 text-[#9A8257]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading text-[#201D1A]">{daysRemaining}</span>
            <span className="text-xs font-editorial text-[#7A7062]">Days Remaining</span>
          </div>
          <div className="text-[11px] text-[#8C8173] font-sans">
            Until gathering at {event.location.split(',')[0]}
          </div>
        </div>

        {/* Metric 2: Financial Ledger Spent */}
        <div className="paper-card p-5 border border-[#E6DFD2] space-y-2">
          <div className="flex items-center justify-between text-xs font-editorial text-[#7F7567]">
            <span>Ledger Allocation</span>
            <Coins className="w-4 h-4 text-[#9A8257]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-heading text-[#201D1A]">
              {event.currency}{totalActual.toLocaleString()}
            </span>
            <span className="text-xs font-editorial text-[#7A7062]">
              / {event.currency}{event.targetBudget.toLocaleString()}
            </span>
          </div>
          {/* Subtle Progress Bar */}
          <div className="w-full bg-[#EFE9DE] h-1.5 overflow-hidden">
            <div
              className="bg-[#9A8257] h-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.round((totalActual / event.targetBudget) * 100))}%`,
              }}
            />
          </div>
          <div className="text-[10px] text-[#8A7F70] flex justify-between font-editorial">
            <span>{Math.round((totalActual / event.targetBudget) * 100)}% committed</span>
            <span>{event.currency}{(event.targetBudget - totalActual).toLocaleString()} surplus</span>
          </div>
        </div>

        {/* Metric 3: Timeline Progress */}
        <div className="paper-card p-5 border border-[#E6DFD2] space-y-2">
          <div className="flex items-center justify-between text-xs font-editorial text-[#7F7567]">
            <span>Roadmap Milestones</span>
            <CheckCircle2 className="w-4 h-4 text-[#6A7B66]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading text-[#201D1A]">{timelineProgress}%</span>
            <span className="text-xs font-editorial text-[#7A7062]">
              ({completedTimelineCount}/{totalTimelineCount} items)
            </span>
          </div>
          <div className="w-full bg-[#EFE9DE] h-1.5 overflow-hidden">
            <div
              className="bg-[#6A7B66] h-full transition-all duration-500"
              style={{ width: `${timelineProgress}%` }}
            />
          </div>
          <div className="text-[10px] text-[#8A7F70] font-sans">
            {totalTimelineCount - completedTimelineCount} pending milestones
          </div>
        </div>

        {/* Metric 4: Collaborative Salon */}
        <div className="paper-card p-5 border border-[#E6DFD2] space-y-2">
          <div className="flex items-center justify-between text-xs font-editorial text-[#7F7567]">
            <span>Collaborator Salon</span>
            <Users className="w-4 h-4 text-[#9A8257]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading text-[#201D1A]">
              {event.contributors.length}
            </span>
            <span className="text-xs font-editorial text-[#7A7062]">Active Planners</span>
          </div>
          <div className="text-[11px] text-[#8C8173] font-editorial flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>
              {event.contributors.filter((c) => c.isOnline).length} contributors currently present
            </span>
          </div>
        </div>
      </div>

      {/* Palette Swatches Bar */}
      <div className="paper-card p-6 border border-[#E6DFD2] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg text-[#201D1A]">Bespoke Color Palette</h2>
            <p className="text-xs font-editorial text-[#7A7062]">
              Harmonized neutral tones reflecting timeless old-money aesthetics
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('ideas')}
            className="text-xs font-editorial text-[#9A8257] hover:underline flex items-center gap-1"
          >
            <span>Explore Mood Atelier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {event.palette.map((swatch) => (
            <button
              key={swatch.name}
              type="button"
              onClick={() => copyToClipboard(swatch.hex)}
              className="group p-3 border border-[#EBE3D7] bg-[#FCFAF7] hover:border-[#BFAF95] transition-all text-left flex flex-col justify-between h-28 relative"
            >
              <div className="flex items-center justify-between">
                <span
                  className="w-7 h-7 rounded-full border border-black/10 shadow-xs"
                  style={{ backgroundColor: swatch.hex }}
                />
                <span className="text-[10px] text-[#918679] group-hover:text-[#27231E]">
                  {copiedHex === swatch.hex ? (
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                  ) : (
                    <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </span>
              </div>
              <div>
                <div className="font-editorial text-xs font-semibold text-[#292520] truncate">
                  {swatch.name}
                </div>
                <div className="text-[10px] text-[#867B6E] font-sans flex items-center justify-between">
                  <span>{swatch.hex}</span>
                  <span className="text-[9px] uppercase tracking-wider text-[#9E8659]">
                    {swatch.role.split(' ')[0]}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Upcoming Schedule & Live Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Upcoming Milestones & Run-of-Show */}
        <div className="paper-card p-6 border border-[#E6DFD2] space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#EFE8DD] pb-3">
              <div>
                <h2 className="font-heading text-lg text-[#221F1B]">Upcoming Milestones</h2>
                <span className="text-xs font-editorial text-[#7E7466]">
                  Immediate focus areas from your planning timeline
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('timeline')}
                className="text-xs font-editorial text-[#9A8257] hover:underline flex items-center gap-1"
              >
                <span>Full Timeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {nextMilestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="p-3.5 bg-[#FAF7F2] border border-[#E8E1D4] flex items-start gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-[#9A8257] mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-editorial font-bold text-[#2A2621]">
                        {milestone.title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-[#EFE8DC] text-[#695F51] font-editorial">
                        {milestone.timeframe}
                      </span>
                    </div>
                    <p className="text-xs text-[#6F6557] font-sans mt-0.5 leading-relaxed">
                      {milestone.description}
                    </p>
                    {milestone.assignedTo && (
                      <div className="text-[10px] text-[#9A8257] mt-1 font-script text-sm">
                        Orchestrated by {milestone.assignedTo}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Day-Of Highlights Preview */}
            <div className="pt-2">
              <div className="text-xs font-heading uppercase tracking-wider text-[#8A7F70] mb-2">
                Day-Of Run-of-Show Snapshot
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {dayOfHighlights.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-white border border-[#EFEAE0] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-mono text-[11px] text-[#9A8257]">{item.time}</div>
                      <div className="font-editorial text-[#292520] truncate font-medium">
                        {item.title}
                      </div>
                    </div>
                    <span className="text-[10px] text-[#867B6F] font-sans">
                      {item.assignedTo}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#EFE8DD]">
            <button
              type="button"
              onClick={() => onOpenAIConcierge('Review our day-of timeline and check for potential guest transit bottlenecks.')}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#F6F1E7] hover:bg-[#EDE5D6] text-[#3A332B] text-xs font-editorial border border-[#DFD5C4] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#9A8257]" />
              <span>Review Day-of Flow with Atelier AI</span>
            </button>
          </div>
        </div>

        {/* Right Column: Real-Time Contributor Activity & Collaborative Tasks */}
        <div className="paper-card p-6 border border-[#E6DFD2] space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#EFE8DD] pb-3">
              <div>
                <h2 className="font-heading text-lg text-[#221F1B]">Collaborative Salon Stream</h2>
                <span className="text-xs font-editorial text-[#7E7466]">
                  Real-time updates from co-planners and guests
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('contributors')}
                className="text-xs font-editorial text-[#9A8257] hover:underline flex items-center gap-1"
              >
                <span>View Salon</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Live Activity Feed */}
            <div className="space-y-2.5">
              {event.activityLog.slice(0, 4).map((act) => (
                <div
                  key={act.id}
                  className="p-3 bg-[#FCFAF8] border border-[#EFE9E0] flex items-start justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-editorial font-semibold text-[#292521]">
                      {act.user}
                    </span>
                    <p className="text-[#645A4D] font-sans text-[11px]">{act.action}</p>
                  </div>
                  <span className="text-[10px] text-[#93887B] flex-shrink-0 font-editorial">
                    {act.timestamp}
                  </span>
                </div>
              ))}
            </div>

            {/* Open Contributor Contribution Slots */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-heading uppercase tracking-wider text-[#8A7F70]">
                  Open Contributor Sign-ups
                </span>
                <span className="text-[10px] text-[#9A8257] font-editorial">
                  Guest & team claims
                </span>
              </div>

              <div className="space-y-2">
                {event.contributorTasks.slice(0, 3).map((task) => {
                  const isClaimed = task.status === 'claimed' || task.status === 'completed';
                  return (
                    <div
                      key={task.id}
                      className="p-2.5 bg-white border border-[#EAE2D4] flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-editorial font-medium text-[#292520] truncate">
                          {task.title}
                        </div>
                        <div className="text-[10px] text-[#867C6F] font-sans">
                          {task.category} · {task.dueDate ? `Due ${task.dueDate}` : 'Anytime'}
                        </div>
                      </div>

                      {isClaimed ? (
                        <span className="text-[10px] text-[#6A7B66] font-editorial bg-[#F1F5F0] px-2 py-0.5 border border-[#DEE7DD]">
                          Claimed by {task.assignedToName?.split(' ')[0]}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onClaimTask(task.id)}
                          className="px-2.5 py-1 bg-[#F4EEE4] hover:bg-[#EAE1D2] text-[#342F28] font-editorial text-[11px] border border-[#DCD1BF] transition-colors"
                        >
                          Claim Task
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#EFE8DD]">
            <button
              type="button"
              onClick={() => onNavigateTab('contributors')}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#FCFAF7] hover:bg-[#F5EFE4] text-[#3A332B] text-xs font-editorial border border-[#DFD5C4] transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#9A8257]" />
              <span>Open Salon Discussion Thread</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
