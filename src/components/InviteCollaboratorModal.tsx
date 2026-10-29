import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  X,
  QrCode,
  Shield,
  UserCheck,
  Send,
} from 'lucide-react';
import { EventPlan, ContributorRole } from '../types';

interface InviteCollaboratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventPlan;
}

export const InviteCollaboratorModal: React.FC<InviteCollaboratorModalProps> = ({
  isOpen,
  onClose,
  event,
}) => {
  const [selectedRole, setSelectedRole] = useState<ContributorRole>('contributor');
  const [copied, setCopied] = useState(false);
  const [invitedEmail, setInvitedEmail] = useState('');
  const [sentNotice, setSentNotice] = useState(false);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://celeste.atelier';
  const shareUrl = `${origin}?event=${event.id}&role=${selectedRole}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitedEmail) return;
    setSentNotice(true);
    setTimeout(() => {
      setSentNotice(false);
      setInvitedEmail('');
    }, 2500);
  };

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
            <Share2 className="w-5 h-5 text-[#9A8257]" />
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[#9A8257] font-heading">
                Multi-User Collaboration
              </div>
              <h2 className="font-heading text-lg text-[#1F1C18]">Invite Contributor to Salon</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close invite modal"
            className="text-[#887C6E] hover:text-[#201D1A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Role selector */}
          <div className="space-y-2">
            <label className="block text-xs font-editorial text-[#5F5447]">
              Select Contributor Privilege Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('co_planner')}
                className={`p-2.5 text-left border text-xs transition-all ${
                  selectedRole === 'co_planner'
                    ? 'bg-[#25221F] text-white border-[#25221F]'
                    : 'bg-white text-[#4A4237] border-[#DDD3C2] hover:bg-[#F7F2E8]'
                }`}
              >
                <div className="font-editorial font-bold">Co-Planner</div>
                <div className="text-[10px] opacity-80 font-sans mt-0.5">
                  Full budget & timeline editing
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('contributor')}
                className={`p-2.5 text-left border text-xs transition-all ${
                  selectedRole === 'contributor'
                    ? 'bg-[#25221F] text-white border-[#25221F]'
                    : 'bg-white text-[#4A4237] border-[#DDD3C2] hover:bg-[#F7F2E8]'
                }`}
              >
                <div className="font-editorial font-bold">Contributor</div>
                <div className="text-[10px] opacity-80 font-sans mt-0.5">
                  Claim task slots & notes
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('guest')}
                className={`p-2.5 text-left border text-xs transition-all ${
                  selectedRole === 'guest'
                    ? 'bg-[#25221F] text-white border-[#25221F]'
                    : 'bg-white text-[#4A4237] border-[#DDD3C2] hover:bg-[#F7F2E8]'
                }`}
              >
                <div className="font-editorial font-bold">Guest RSVP</div>
                <div className="text-[10px] opacity-80 font-sans mt-0.5">
                  RSVP, moodboard & potluck
                </div>
              </button>
            </div>
          </div>

          {/* Copyable Share Link */}
          <div className="space-y-1.5">
            <label className="block text-xs font-editorial text-[#5F5447]">
              Direct Atelier Access Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 bg-white border border-[#DDD3C2] text-xs font-mono text-[#5A5043] select-all focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-2 bg-[#9A8257] hover:bg-[#867045] text-white text-xs font-editorial flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[10px] text-[#867B6E] font-editorial">
              Collaborators accessing this link will sync instantly across active browser sessions via real-time BroadcastChannel.
            </p>
          </div>

          {/* Direct Email Dispatch simulation */}
          <form onSubmit={handleSendInvite} className="pt-4 border-t border-[#EFE8DD] space-y-2">
            <label className="block text-xs font-editorial text-[#5F5447]">
              Dispatch Formal Monogrammed Invitation
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="colleague@domain.com"
                value={invitedEmail}
                onChange={(e) => setInvitedEmail(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#25221F] hover:bg-[#38332E] text-white text-xs font-editorial flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-[#D1B685]" />
                <span>Dispatch</span>
              </button>
            </div>
            {sentNotice && (
              <div className="text-xs text-emerald-800 font-editorial flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Monogrammed invitation dispatched to {invitedEmail}</span>
              </div>
            )}
          </form>

          {/* Active Collaborators count */}
          <div className="pt-2 text-xs font-editorial text-[#7A7061] flex items-center justify-between">
            <span>{event.contributors.length} collaborators currently enrolled</span>
            <span className="text-[#9A8257] font-script text-base">Céleste & Co. Atelier</span>
          </div>
        </div>
      </div>
    </div>
  );
};
