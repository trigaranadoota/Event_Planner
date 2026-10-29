import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  Sparkles,
  MapPin,
  User,
  Filter,
  Check,
  X,
  Trash2,
} from 'lucide-react';
import { TimelineItem, EventPlan, Contributor } from '../types';

interface TimelineTabProps {
  event: EventPlan;
  onUpdateTimeline: (items: TimelineItem[]) => void;
  onOpenAIConcierge: (prompt?: string) => void;
  activeContributor: Contributor;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({
  event,
  onUpdateTimeline,
  onOpenAIConcierge,
  activeContributor,
}) => {
  const [phaseFilter, setPhaseFilter] = useState<'all' | 'milestone' | 'day_of'>('all');
  const [isAddingItem, setIsAddingItem] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newTimeframe, setNewTimeframe] = useState('3 Months Out');
  const [newTime, setNewTime] = useState('');
  const [newPhase, setNewPhase] = useState<'milestone' | 'day_of'>('milestone');
  const [newDesc, setNewDesc] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const filteredTimeline = event.timeline.filter((item) => {
    if (phaseFilter === 'milestone') return item.phase === 'milestone';
    if (phaseFilter === 'day_of') return item.phase === 'day_of';
    return true;
  });

  const toggleComplete = (id: string) => {
    const updated = event.timeline.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onUpdateTimeline(updated);
  };

  const handleDelete = (id: string) => {
    onUpdateTimeline(event.timeline.filter((item) => item.id !== id));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newItem: TimelineItem = {
      id: `t-${Date.now()}`,
      title: newTitle,
      timeframe: newPhase === 'day_of' ? 'Day Of' : newTimeframe,
      time: newPhase === 'day_of' ? (newTime || '12:00 PM') : undefined,
      phase: newPhase,
      description: newDesc,
      location: newLocation || undefined,
      completed: false,
      assignedTo: activeContributor.name,
    };

    onUpdateTimeline([...event.timeline, newItem]);

    // Reset
    setNewTitle('');
    setNewTime('');
    setNewDesc('');
    setNewLocation('');
    setIsAddingItem(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8DFD0] pb-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#9A8257] font-heading">
            Chronological Orchestration
          </div>
          <h1 className="text-3xl font-heading text-[#1F1C18]">Timelines & Run-of-Show</h1>
          <p className="text-xs font-editorial text-[#786E60] mt-1">
            Pacing every moment with grace—from multi-month roadmaps to minute-by-minute day-of schedules.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() =>
              onOpenAIConcierge(
                `Review the Day-Of schedule for "${event.title}". Suggest seamless pacing for cocktail hour, seated dinner, and toasts to avoid guest fatigue and preserve old-money intimacy.`
              )
            }
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#25221F] hover:bg-[#38332E] text-[#FAF8F5] text-xs font-editorial transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D1B685]" />
            <span>AI Schedule Advisor</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddingItem(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#9A8257] hover:bg-[#887146] text-white text-xs font-editorial transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event Step</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EBE3D7] pb-3">
        <button
          type="button"
          onClick={() => setPhaseFilter('all')}
          className={`px-3 py-1.5 text-xs font-editorial transition-colors ${
            phaseFilter === 'all'
              ? 'bg-[#26231F] text-[#FAF8F5]'
              : 'bg-[#F6F1E7] text-[#554C3F] hover:bg-[#EFE7D8]'
          }`}
        >
          Complete Orchestration ({event.timeline.length})
        </button>
        <button
          type="button"
          onClick={() => setPhaseFilter('milestone')}
          className={`px-3 py-1.5 text-xs font-editorial transition-colors ${
            phaseFilter === 'milestone'
              ? 'bg-[#9A8257] text-white'
              : 'bg-[#F6F1E7] text-[#554C3F] hover:bg-[#EFE7D8]'
          }`}
        >
          Milestones Roadmap ({event.timeline.filter((t) => t.phase === 'milestone').length})
        </button>
        <button
          type="button"
          onClick={() => setPhaseFilter('day_of')}
          className={`px-3 py-1.5 text-xs font-editorial transition-colors ${
            phaseFilter === 'day_of'
              ? 'bg-[#9A8257] text-white'
              : 'bg-[#F6F1E7] text-[#554C3F] hover:bg-[#EFE7D8]'
          }`}
        >
          Day-Of Run-of-Show ({event.timeline.filter((t) => t.phase === 'day_of').length})
        </button>
      </div>

      {/* Add Item Drawer */}
      {isAddingItem && (
        <form
          onSubmit={handleAddItem}
          className="paper-card-elevated p-6 border-2 border-[#9A8257] bg-[#FCFAF8] space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-[#EFE8DD] pb-3">
            <h3 className="font-heading text-lg text-[#201D1A]">
              Add Step to Chronological Flow
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingItem(false)}
              className="text-[#887D6F] hover:text-[#201D1A]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-editorial text-[#5F5447] mb-1">
                Event Step Phase
              </label>
              <select
                value={newPhase}
                onChange={(e) => setNewPhase(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
              >
                <option value="milestone">Planning Milestone (Months / Weeks Out)</option>
                <option value="day_of">Day-Of Schedule (Specific Time)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-editorial text-[#5F5447] mb-1">
                {newPhase === 'day_of' ? 'Exact Time (e.g. 04:30 PM)' : 'Timeframe (e.g. 3 Months Out)'}
              </label>
              {newPhase === 'day_of' ? (
                <input
                  type="text"
                  placeholder="04:30 PM"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
                />
              ) : (
                <input
                  type="text"
                  placeholder="e.g. 6 Months Out"
                  value={newTimeframe}
                  onChange={(e) => setNewTimeframe(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-editorial text-[#5F5447] mb-1">
                Step Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Acoustic Chamber Strings Prelude"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-editorial text-[#5F5447] mb-1">
                Detailed Run-of-Show Notes
              </label>
              <input
                type="text"
                placeholder="What occurs, cues, and coordination guidance..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
              />
            </div>

            <div>
              <label className="block text-xs font-editorial text-[#5F5447] mb-1">
                Location / Setting
              </label>
              <input
                type="text"
                placeholder="e.g. Lower Terrace Gardens"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EFE8DD]">
            <button
              type="button"
              onClick={() => setIsAddingItem(false)}
              className="px-4 py-2 border border-[#DDD3C2] text-xs font-editorial text-[#5A5043] hover:bg-[#F5EFE5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#9A8257] hover:bg-[#867045] text-white text-xs font-editorial transition-colors"
            >
              Append to Schedule
            </button>
          </div>
        </form>
      )}

      {/* Visual Timeline Flow */}
      <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-3 before:bottom-3 before:w-px before:bg-[#DDD3C2]">
        {filteredTimeline.map((item) => {
          const isDone = item.completed;
          return (
            <div
              key={item.id}
              className="relative group transition-all"
            >
              {/* Checkpoint Node */}
              <button
                type="button"
                onClick={() => toggleComplete(item.id)}
                title={isDone ? 'Mark as pending' : 'Mark as completed'}
                className={`absolute -left-6 sm:-left-10 mt-1 w-6 h-6 rounded-full border flex items-center justify-center transition-all bg-[#FAF8F5] cursor-pointer ${
                  isDone
                    ? 'border-[#6A7B66] text-[#6A7B66] bg-[#F2F6F1]'
                    : 'border-[#BFAF98] text-transparent hover:border-[#9A8257] hover:text-[#9A8257]'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
              </button>

              {/* Card Container */}
              <div
                className={`paper-card p-5 border transition-all ${
                  isDone
                    ? 'bg-[#FAF9F6] border-[#E8E2D6] opacity-75'
                    : 'bg-white border-[#DFD6C7] hover:border-[#BFAF98]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 border ${
                          item.phase === 'day_of'
                            ? 'bg-[#F7F2E8] text-[#9A8257] border-[#E8DEC9] font-semibold'
                            : 'bg-[#EFE8DC] text-[#695D4F] border-[#DFD4C2]'
                        }`}
                      >
                        {item.phase === 'day_of' ? item.time || 'Day-Of' : item.timeframe}
                      </span>

                      {item.location && (
                        <span className="flex items-center gap-1 text-[11px] text-[#786E61] font-sans">
                          <MapPin className="w-3 h-3 text-[#9A8257]" />
                          {item.location}
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-base font-editorial font-bold ${
                        isDone ? 'line-through text-[#7A7165]' : 'text-[#24211D]'
                      }`}
                    >
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    {item.assignedTo && (
                      <span className="text-xs font-script text-[#9A8257] text-base">
                        Orchestrated by {item.assignedTo}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="text-[#B9AD9E] hover:text-rose-800 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove event step"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#6F6456] font-sans mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}

        {filteredTimeline.length === 0 && (
          <div className="p-8 text-center text-xs font-editorial text-[#857B6D] paper-card">
            No timeline steps found in this view. Click "Add Event Step" to create one.
          </div>
        )}
      </div>
    </div>
  );
};
