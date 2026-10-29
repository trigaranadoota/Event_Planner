import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Palette,
  ReceiptText,
  Clock,
  Briefcase,
  Users2,
  ChevronDown,
  ChevronRight,
  Plus,
  Sparkles,
  X,
  Pin,
  PinOff,
} from 'lucide-react';
import { Contributor, EventPlan } from '../types';
import { TabKey } from './Navigation';

interface SidebarProps {
  currentEvent: EventPlan;
  allEvents: EventPlan[];
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onSelectEvent: (eventId: string) => void;
  onOpenNewEvent: () => void;
  onOpenCollaboratorsModal: () => void;
  onOpenAIConcierge: () => void;
  activeContributor: Contributor;
  onSelectContributor: (c: Contributor) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentEvent,
  allEvents,
  activeTab,
  onTabChange,
  onSelectEvent,
  onOpenNewEvent,
  onOpenCollaboratorsModal,
  onOpenAIConcierge,
  activeContributor,
  onSelectContributor,
  isOpenMobile,
  onCloseMobile,
  onOpenMobile,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const isVisible = isPinned || isHovered || isOpenMobile;

  // Global mouse tracker for ultra-smooth slide-over behavior
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isPinned || isOpenMobile) return;

      // When sidebar is open, slide closed once cursor moves away onto main content (> 300px)
      if (isHovered && e.clientX > 300) {
        setIsHovered(false);
      }
      // When sidebar is closed, slide open when cursor slides over the left edge (<= 18px)
      else if (!isHovered && e.clientX <= 18) {
        setIsHovered(true);
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [isHovered, isPinned, isOpenMobile]);

  const navItems = [
    {
      key: 'overview' as TabKey,
      label: 'Atelier Overview',
      subtitle: 'Dashboard & aesthetics',
      icon: Compass,
    },
    {
      key: 'budget' as TabKey,
      label: 'Financial Ledger',
      subtitle: `${currentEvent.budgetItems.length} line items`,
      icon: ReceiptText,
      badge: `${currentEvent.budgetItems.length}`,
    },
    {
      key: 'timeline' as TabKey,
      label: 'Chronological Timeline',
      subtitle: 'Milestones & day-of',
      icon: Clock,
      badge: `${currentEvent.timeline.filter((t) => !t.completed).length} pending`,
    },
    {
      key: 'vendors' as TabKey,
      label: 'Vendor Registry',
      subtitle: `${currentEvent.vendors.length} purveyors`,
      icon: Briefcase,
    },
    {
      key: 'ideas' as TabKey,
      label: 'Bespoke Ideas & Mood',
      subtitle: 'Color, menu, music & words',
      icon: Palette,
    },
  ];

  return (
    <>
      {/* 1. Left Edge Slide-Over Trigger Zone */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        className="fixed top-0 bottom-0 left-0 w-3.5 z-40 cursor-pointer group"
        title="Slide over to open Atelier Sidebar"
      >
        {/* Subtle hairline edge line */}
        <div className="w-1 h-full bg-[#E5DDD0] group-hover:bg-[#9A8257] transition-colors" />

        {/* Aesthetic slide tab indicator (visible when closed) */}
        {!isVisible && (
          <div className="absolute top-1/2 -translate-y-1/2 left-0 flex items-center justify-center py-3.5 px-1 bg-[#FCFAF7] border border-l-0 border-[#D8CEBE] rounded-r-md shadow-xs text-[#7B6E5E] group-hover:text-[#9A8257] group-hover:bg-white transition-all">
            <div className="flex flex-col items-center gap-1">
              <span className="font-heading text-[11px] text-[#9A8257] select-none">❦</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        )}
      </div>

      {/* 2. Mobile Backdrop (Only for mobile tapped state) */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* 3. Sliding Atelier Sidebar */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          if (!isPinned) setIsHovered(false);
        }}
        style={{
          transform: isVisible ? 'translateX(0)' : 'translateX(-100%)',
        }}
        className="fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#FAF8F5] border-r border-[#E6DFD2] flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-out"
      >
        {/* Top Header: Brand & Pin Toggle */}
        <div className="flex flex-col border-b border-[#EBE3D7]">
          <div className="p-4 pb-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-heading tracking-widest text-[#9A8257] text-sm uppercase font-semibold">
                Céleste & Co.
              </div>
              <div className="font-script text-base text-[#685D50]">
                Heritage Event Atelier
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Pin toggle for desktop */}
              <button
                type="button"
                onClick={() => setIsPinned(!isPinned)}
                title={isPinned ? 'Unpin sidebar (slides on hover)' : 'Pin sidebar open'}
                className={`p-1.5 transition-colors border hidden sm:block ${
                  isPinned
                    ? 'bg-[#F2ECE0] text-[#9A8257] border-[#DDD3C2]'
                    : 'text-[#8C8071] hover:text-[#201D1A] border-transparent'
                }`}
              >
                {isPinned ? <Pin className="w-3.5 h-3.5" /> : <PinOff className="w-3.5 h-3.5 opacity-60" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsHovered(false);
                  setIsPinned(false);
                  onCloseMobile();
                }}
                className="p-1.5 text-[#8C8071] hover:text-[#24211E]"
                aria-label="Close sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Atelier Event Selector */}
          <div className="px-4 pb-3.5 relative">
            <div className="text-[10px] uppercase tracking-wider text-[#8C8070] font-heading mb-1 px-1">
              Active Atelier
            </div>
            <button
              type="button"
              onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
              className="w-full text-left p-2.5 bg-white border border-[#DDD3C2] hover:border-[#BFAF98] transition-all flex items-center justify-between"
            >
              <div className="min-w-0 pr-2">
                <div className="font-editorial text-xs font-bold text-[#221F1B] truncate">
                  {currentEvent.title}
                </div>
                <div className="text-[10px] text-[#867B6E] font-sans truncate">
                  {currentEvent.eventType} · {currentEvent.location.split(',')[0]}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#9A8257] flex-shrink-0" />
            </button>

            {/* Dropdown Menu */}
            {isEventDropdownOpen && (
              <div className="absolute left-4 right-4 mt-1 bg-white border border-[#DFD5C4] shadow-xl p-2 z-50 animate-in fade-in">
                <div className="text-[10px] uppercase tracking-wider text-[#8A7D6C] px-2 py-1 font-heading border-b border-[#F0EAE0]">
                  Switch Saved Atelier
                </div>
                <div className="max-h-52 overflow-y-auto py-1">
                  {allEvents.map((evt) => (
                    <button
                      key={evt.id}
                      type="button"
                      onClick={() => {
                        onSelectEvent(evt.id);
                        setIsEventDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 transition-colors border-l-2 mb-1 ${
                        evt.id === currentEvent.id
                          ? 'border-[#9A8257] bg-[#F7F2E8]'
                          : 'border-transparent hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="font-editorial text-xs font-semibold text-[#292521] truncate">
                        {evt.title}
                      </div>
                      <div className="text-[10px] text-[#807669] font-sans">
                        {evt.currency}{evt.targetBudget.toLocaleString()} · {evt.guestCount} guests
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#EFE9DF]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEventDropdownOpen(false);
                      onOpenNewEvent();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#F4EEE4] hover:bg-[#ECE3D5] text-[#342F28] text-xs font-editorial font-medium transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#9A8257]" />
                    <span>Curate New Event</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Navigation Options */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-[#8C8070] font-heading px-3 mb-1.5">
            Atelier Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  onTabChange(item.key);
                  if (!isPinned) {
                    setIsHovered(false);
                    onCloseMobile();
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 transition-all text-left border ${
                  isActive
                    ? 'bg-white border-[#C2AC85] shadow-xs text-[#1F1C18]'
                    : 'bg-transparent border-transparent text-[#62574A] hover:bg-[#F2ECE1] hover:text-[#201D1A]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? 'text-[#9A8257]' : 'text-[#8E8272]'
                    }`}
                  />
                  <div className="truncate">
                    <div className="font-editorial text-xs font-semibold tracking-wide">
                      {item.label}
                    </div>
                    <div className="text-[10px] text-[#938779] font-sans truncate">
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 bg-[#EFE8DC] text-[#695D4E] font-editorial flex-shrink-0 ml-1">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Collaborators Button */}
          <button
            type="button"
            onClick={() => {
              onOpenCollaboratorsModal();
              if (!isPinned) {
                setIsHovered(false);
                onCloseMobile();
              }
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 transition-all text-left border bg-transparent border-transparent text-[#62574A] hover:bg-[#F2ECE1] hover:text-[#201D1A]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Users2 className="w-4 h-4 text-[#9A8257] flex-shrink-0" />
              <div className="truncate">
                <div className="font-editorial text-xs font-semibold tracking-wide">
                  Collaborators
                </div>
                <div className="text-[10px] text-[#938779] font-sans truncate">
                  View existing circle & invite
                </div>
              </div>
            </div>

            <span className="text-[10px] px-1.5 py-0.2 bg-[#EAE3D5] text-[#64584A] font-editorial flex-shrink-0 ml-1">
              {currentEvent.contributors.length}
            </span>
          </button>
        </div>

        {/* Bottom Section: AI Concierge & Simple Rounded Profile */}
        <div className="p-3 border-t border-[#EAE2D4] bg-[#F7F4EE] space-y-2">
          {/* Ask Atelier AI button */}
          <button
            type="button"
            onClick={() => {
              onOpenAIConcierge();
              if (!isPinned) {
                setIsHovered(false);
                onCloseMobile();
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#25221F] hover:bg-[#38332E] text-white text-xs font-editorial transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D1B685]" />
            <span>Atelier AI Concierge</span>
          </button>

          {/* Profile Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="w-full p-2 bg-white border border-[#DDD3C2] hover:border-[#BFAF98] transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#EAE2D3] border border-[#CDBFA9] flex items-center justify-center text-[#4B4236] font-editorial font-bold text-xs flex-shrink-0">
                  {activeContributor.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>

                <div className="min-w-0 text-left">
                  <div className="font-editorial text-xs font-semibold text-[#201D1A] truncate">
                    {activeContributor.name}
                  </div>
                  <div className="text-[10px] text-[#9A8257] capitalize font-editorial">
                    {activeContributor.role.replace('_', ' ')}
                  </div>
                </div>
              </div>

              <ChevronDown className="w-3 h-3 text-[#8A7E6F]" />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-[#DDD3C2] shadow-xl p-1.5 z-50 animate-in fade-in">
                <div className="px-2 py-1 text-[10px] font-heading uppercase tracking-wider text-[#8A7E6E] border-b border-[#F0EAE0]">
                  Switch Active Persona
                </div>
                {currentEvent.contributors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onSelectContributor(c);
                      setIsProfileDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 flex items-center justify-between text-xs transition-colors ${
                      activeContributor.id === c.id
                        ? 'bg-[#F7F2E8] font-medium text-[#221F1B]'
                        : 'hover:bg-[#FCFAF7] text-[#554D43]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#EAE2D3] flex items-center justify-center text-[10px] text-[#4B4236] font-editorial font-bold">
                        {c.name[0]}
                      </div>
                      <span className="truncate">{c.name}</span>
                    </div>
                    <span className="text-[10px] text-[#9A8257] capitalize">
                      {c.role.replace('_', ' ')}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
