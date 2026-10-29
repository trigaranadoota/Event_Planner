import React from 'react';
import { Users, X, UserPlus, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';
import { Contributor, EventPlan } from '../types';

interface CollaboratorsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventPlan;
  onOpenInvite: () => void;
  activeContributor: Contributor;
  onSelectContributor: (c: Contributor) => void;
}

export const CollaboratorsListModal: React.FC<CollaboratorsListModalProps> = ({
  isOpen,
  onClose,
  event,
  onOpenInvite,
  activeContributor,
  onSelectContributor,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in"
    >
      <div className="paper-card-elevated w-full max-w-lg border border-[#D5CABB] bg-[#FAF8F5] shadow-2xl relative">
        {/* Header */}
        <div className="p-5 border-b border-[#EAE2D4] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#DDD3C2] flex items-center justify-center text-[#9A8257]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[#9A8257] font-heading">
                Collaborative Salon
              </div>
              <h2 className="font-heading text-lg text-[#1F1C18]">
                Existing Collaborators ({event.contributors.length})
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close collaborators list"
            className="text-[#887C6E] hover:text-[#201D1A] p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Collaborators List */}
        <div className="p-5 max-h-[420px] overflow-y-auto space-y-3">
          {event.contributors.map((c) => {
            const isSelf = activeContributor.id === c.id;
            return (
              <div
                key={c.id}
                className={`p-3.5 border transition-all flex items-center justify-between ${
                  isSelf
                    ? 'bg-[#FAF5EC] border-[#BFA882] shadow-xs'
                    : 'bg-white border-[#E8E1D4] hover:border-[#D5C8B6]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#D5CABE]"
                    />
                    {c.isOnline && (
                      <span
                        className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-600 border-2 border-white"
                        title="Active now"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-editorial text-sm font-semibold text-[#221F1B] flex items-center gap-1.5">
                      <span className="truncate">{c.name}</span>
                      {isSelf && (
                        <span className="text-[9px] px-1 bg-[#9A8257] text-white font-sans uppercase">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#7A7062] font-editorial flex items-center gap-2 truncate">
                      <span className="capitalize font-medium text-[#9A8257]">
                        {c.role.replace('_', ' ')}
                      </span>
                      <span>•</span>
                      <span className="truncate">{c.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[11px] text-[#8C8173] font-editorial bg-[#F4EEE4] px-2 py-0.5 border border-[#DFD5C4]">
                    {c.assignedTasksCount} tasks
                  </span>
                  {!isSelf && (
                    <button
                      type="button"
                      onClick={() => onSelectContributor(c)}
                      className="text-[10px] font-editorial px-2 py-1 bg-white hover:bg-[#F2ECE1] border border-[#DDD3C2] text-[#4F463A]"
                      title="Switch active perspective to this user"
                    >
                      Switch to
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#EAE2D4] bg-[#FAF8F5] flex items-center justify-between">
          <span className="text-xs font-editorial text-[#827769]">
            {event.contributors.filter((c) => c.isOnline).length} currently active in atelier
          </span>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenInvite();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#9A8257] hover:bg-[#867045] text-white text-xs font-editorial transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite New Contributor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
