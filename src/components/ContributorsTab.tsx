import React, { useState } from 'react';
import {
  Users2,
  UserPlus,
  CheckCircle2,
  Clock,
  MessageSquare,
  Send,
  Sparkles,
  ShieldCheck,
  Check,
  Plus,
  Tag,
  X,
} from 'lucide-react';
import { Contributor, ContributorTask, DiscussionNote, EventPlan } from '../types';

interface ContributorsTabProps {
  event: EventPlan;
  onUpdateEvent: (updated: EventPlan) => void;
  onOpenInvite: () => void;
  activeContributor: Contributor;
  onOpenAIConcierge: (prompt?: string) => void;
}

export const ContributorsTab: React.FC<ContributorsTabProps> = ({
  event,
  onUpdateEvent,
  onOpenInvite,
  activeContributor,
  onOpenAIConcierge,
}) => {
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Logistics');
  const [newTaskDue, setNewTaskDue] = useState('');

  // Post discussion note
  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    const newNote: DiscussionNote = {
      id: `note-${Date.now()}`,
      author: activeContributor.name,
      avatar: activeContributor.avatar,
      role: activeContributor.role.replace('_', ' '),
      content: newNoteContent.trim(),
      timestamp: 'Just now',
    };

    const newActivity = {
      id: `act-${Date.now()}`,
      user: activeContributor.name,
      action: `Posted a note in the Salon discussion`,
      timestamp: 'Just now',
      type: 'general' as const,
    };

    onUpdateEvent({
      ...event,
      discussionNotes: [newNote, ...event.discussionNotes],
      activityLog: [newActivity, ...event.activityLog],
    });

    setNewNoteContent('');
  };

  // Claim or toggle task
  const handleToggleTaskStatus = (task: ContributorTask) => {
    const updatedTasks = event.contributorTasks.map((t) => {
      if (t.id !== task.id) return t;

      if (t.status === 'open') {
        return {
          ...t,
          status: 'claimed' as const,
          assignedToName: activeContributor.name,
        };
      }
      if (t.status === 'claimed') {
        return {
          ...t,
          status: 'completed' as const,
        };
      }
      return {
        ...t,
        status: 'open' as const,
        assignedToName: undefined,
      };
    });

    const newActivity = {
      id: `act-${Date.now()}`,
      user: activeContributor.name,
      action:
        task.status === 'open'
          ? `Claimed task: "${task.title}"`
          : task.status === 'claimed'
          ? `Completed task: "${task.title}"`
          : `Re-opened task: "${task.title}"`,
      timestamp: 'Just now',
      type: 'task' as const,
    };

    onUpdateEvent({
      ...event,
      contributorTasks: updatedTasks,
      activityLog: [newActivity, ...event.activityLog],
    });
  };

  // Add new task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    const newTask: ContributorTask = {
      id: `ct-${Date.now()}`,
      title: newTaskTitle,
      category: newTaskCategory,
      dueDate: newTaskDue || undefined,
      status: 'open',
    };

    onUpdateEvent({
      ...event,
      contributorTasks: [...event.contributorTasks, newTask],
    });

    setNewTaskTitle('');
    setNewTaskDue('');
    setIsAddingTask(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8DFD0] pb-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#9A8257] font-heading">
            Real-Time Collaboration Salon
          </div>
          <h1 className="text-3xl font-heading text-[#1F1C18]">Guest Contributors & Co-Planners</h1>
          <p className="text-xs font-editorial text-[#786E60] mt-1">
            Empower trusted friends, family, and vendors to claim heirloom tasks and coordinate seamlessly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() =>
              onOpenAIConcierge(
                `Suggest 4 meaningful, low-stress contribution tasks we can invite close friends or family to claim for our "${event.eventType}" celebration.`
              )
            }
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#25221F] hover:bg-[#38332E] text-[#FAF8F5] text-xs font-editorial transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D1B685]" />
            <span>AI Task Ideas</span>
          </button>

          <button
            type="button"
            onClick={onOpenInvite}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#9A8257] hover:bg-[#887146] text-white text-xs font-editorial transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite Contributor</span>
          </button>
        </div>
      </div>

      {/* Collaborator Roster Cards */}
      <div className="paper-card p-6 border border-[#E6DFD2] space-y-4">
        <div className="flex items-center justify-between border-b border-[#EFE8DD] pb-3">
          <h2 className="font-heading text-xl text-[#201D1A]">Active Collaborators ({event.contributors.length})</h2>
          <span className="text-xs font-editorial text-[#8A7F70]">
            Currently editing together in real-time
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {event.contributors.map((c) => (
            <div
              key={c.id}
              className={`p-4 border transition-all flex items-center justify-between ${
                activeContributor.id === c.id
                  ? 'bg-[#F9F5EC] border-[#BFA882] shadow-xs'
                  : 'bg-white border-[#E8E1D4]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#D5CABE]"
                  />
                  {c.isOnline && (
                    <span
                      className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-600 border-2 border-white"
                      title="Present in Atelier"
                    />
                  )}
                </div>
                <div>
                  <div className="font-editorial text-sm font-semibold text-[#221F1B] flex items-center gap-1.5">
                    <span>{c.name}</span>
                    {activeContributor.id === c.id && (
                      <span className="text-[9px] px-1 bg-[#9A8257] text-white uppercase font-sans">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-[#7A7062] capitalize font-editorial">
                    {c.role.replace('_', ' ')} · {c.email}
                  </div>
                </div>
              </div>

              <span className="text-[10px] text-[#8C8173] font-editorial bg-[#F4EEE4] px-2 py-0.5 border border-[#DFD5C4]">
                {c.assignedTasksCount} tasks
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Task Board & Discussion Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Contributor Tasks & Sign-up Slots */}
        <div className="paper-card p-6 border border-[#E6DFD2] space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#EFE8DD] pb-3">
              <div>
                <h2 className="font-heading text-xl text-[#201D1A]">Contributor Contribution Board</h2>
                <p className="text-xs font-editorial text-[#7E7465]">
                  Click any slot to claim or mark completed
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingTask(true)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-editorial bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#DDD4C4] text-[#363028]"
              >
                <Plus className="w-3.5 h-3.5 text-[#9A8257]" />
                <span>New Slot</span>
              </button>
            </div>

            {/* Add Task Mini-Form */}
            {isAddingTask && (
              <form
                onSubmit={handleAddTask}
                className="p-4 bg-[#FAF7F2] border border-[#E4DCce] space-y-3 animate-in fade-in"
              >
                <div className="flex items-center justify-between">
                  <span className="font-editorial text-xs font-bold text-[#2A251F]">
                    Create Contributor Task Slot
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingTask(false)}
                    className="text-[#8B8072]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <input
                  type="text"
                  required
                  placeholder="Task title (e.g. Bring heirloom silver candlesticks)"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Category (e.g. Heirlooms, Cellar)"
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
                  />
                  <input
                    type="date"
                    value={newTaskDue}
                    onChange={(e) => setNewTaskDue(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingTask(false)}
                    className="px-3 py-1 text-xs font-editorial text-[#5E5446]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 bg-[#9A8257] text-white text-xs font-editorial"
                  >
                    Post Slot
                  </button>
                </div>
              </form>
            )}

            {/* Task list */}
            <div className="space-y-2.5">
              {event.contributorTasks.map((task) => {
                const isClaimed = task.status === 'claimed';
                const isCompleted = task.status === 'completed';

                return (
                  <div
                    key={task.id}
                    className={`p-3.5 border transition-all flex items-start justify-between gap-3 ${
                      isCompleted
                        ? 'bg-[#F4F7F3] border-[#D4E2D3] opacity-80'
                        : isClaimed
                        ? 'bg-[#FAF8F4] border-[#E8DEC9]'
                        : 'bg-white border-[#E8E1D4] hover:border-[#BFAF98]'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-editorial px-1.5 py-0.2 bg-[#EFE8DC] text-[#695D4F]">
                          {task.category}
                        </span>
                        {task.dueDate && (
                          <span className="text-[10px] text-[#867B6E] font-sans">
                            Due {task.dueDate}
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-sm font-editorial font-bold ${
                          isCompleted ? 'line-through text-[#6F675B]' : 'text-[#201D1A]'
                        }`}
                      >
                        {task.title}
                      </h3>

                      {task.notes && (
                        <p className="text-xs text-[#7A7061] font-sans">{task.notes}</p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleTaskStatus(task)}
                      className={`px-3 py-1.5 text-xs font-editorial flex-shrink-0 transition-colors border ${
                        isCompleted
                          ? 'bg-[#EBF3EB] text-[#2F6131] border-[#C8DEC7]'
                          : isClaimed
                          ? 'bg-[#FAF5EC] text-[#9A7D37] border-[#E5D7B7]'
                          : 'bg-[#9A8257] text-white hover:bg-[#867045] border-transparent'
                      }`}
                    >
                      {isCompleted ? (
                        <span className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Completed
                        </span>
                      ) : isClaimed ? (
                        <span>Claimed by {task.assignedToName?.split(' ')[0]}</span>
                      ) : (
                        <span>Claim Task</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Contributor Discussion & Shared Notes */}
        <div className="paper-card p-6 border border-[#E6DFD2] space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-[#EFE8DD] pb-3">
              <h2 className="font-heading text-xl text-[#201D1A]">Salon Discussion Thread</h2>
              <p className="text-xs font-editorial text-[#7E7465]">
                Shared musings, confirmations, and announcements
              </p>
            </div>

            {/* Discussion Feed */}
            <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
              {event.discussionNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-3.5 bg-white border border-[#EBE3D6] space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={note.avatar}
                        alt={note.author}
                        className="w-6 h-6 rounded-full object-cover border border-[#DDD3C2]"
                      />
                      <span className="font-editorial text-xs font-bold text-[#201D1A]">
                        {note.author}
                      </span>
                      <span className="text-[10px] text-[#9A8257] capitalize font-editorial">
                        ({note.role})
                      </span>
                    </div>
                    <span className="text-[10px] text-[#9E9283] font-editorial">
                      {note.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-[#5D5346] font-sans leading-relaxed">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* New message input */}
          <form onSubmit={handlePostNote} className="pt-3 border-t border-[#EFE8DD] flex gap-2">
            <input
              type="text"
              required
              placeholder={`Contribute a thought as ${activeContributor.name}...`}
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="flex-1 px-3 py-2 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#25221F] hover:bg-[#38332E] text-white text-xs font-editorial flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-[#D1B685]" />
              <span>Share</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
