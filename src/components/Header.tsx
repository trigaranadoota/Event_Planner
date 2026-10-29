import React, { useState } from 'react';
import {
  Menu,
  Sparkles,
  Calendar,
  Users,
  MapPin,
  ChevronDown,
  User,
} from 'lucide-react';
import { Contributor, EventPlan } from '../types';

interface HeaderProps {
  currentEvent: EventPlan;
  activeContributor: Contributor;
  onSelectContributor: (contributor: Contributor) => void;
  onOpenAIConcierge: () => void;
  onOpenSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentEvent,
  activeContributor,
  onSelectContributor,
  onOpenAIConcierge,
  onOpenSidebar,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="border-b border-[#E7DFD1] bg-[#FAF8F5]/90 backdrop-blur-md sticky top-0 z-30">
      <div className="px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile Sidebar Toggle & Event Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="Open atelier navigation"
            title="Open or slide over left edge to reveal sidebar"
            className="p-2 rounded-none border border-[#DDD3C2] bg-white hover:bg-[#F4EEE4] text-[#423C34] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Menu className="w-4 h-4 text-[#7A6F60]" />
            <span className="text-xs font-editorial text-[#5F5446] hidden sm:inline">Menu</span>
          </button>

          <div>
            <div className="font-heading text-lg font-normal text-[#1E1C1A] leading-tight">
              {currentEvent.title}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#7A7061] font-editorial">
              <span className="capitalize font-medium text-[#9A8257]">
                {currentEvent.eventType} Atelier
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-sans text-[11px]">
                <Calendar className="w-3 h-3 text-[#9A8257]" />
                {new Date(currentEvent.date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-sans text-[11px]">
                <Users className="w-3 h-3 text-[#9A8257]" />
                {currentEvent.guestCount} Guests
              </span>
            </div>
          </div>
        </div>

        {/* Right: Atelier AI & Simple Rounded Profile Icon */}
        <div className="flex items-center gap-3">
          {/* Atelier AI Quick Spark Button */}
          <button
            type="button"
            onClick={onOpenAIConcierge}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25221F] hover:bg-[#38332F] text-[#FAF8F5] text-xs font-editorial transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D1B685]" />
            <span className="hidden sm:inline">Atelier AI</span>
          </button>

          {/* Simple Rounded Profile Icon */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-9 h-9 rounded-full bg-[#EAE2D3] border border-[#CDBFA9] hover:border-[#9A8257] transition-all flex items-center justify-center text-[#423A2F] font-editorial font-bold text-xs shadow-xs focus:outline-hidden"
              title={`${activeContributor.name} (${activeContributor.role})`}
            >
              {activeContributor.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-[#DFD5C4] shadow-xl p-2 z-50 animate-in fade-in">
                <div className="p-2 border-b border-[#EFEAE0]">
                  <div className="font-editorial text-sm font-bold text-[#201D1A]">
                    {activeContributor.name}
                  </div>
                  <div className="text-[11px] text-[#8C8071] truncate font-sans">
                    {activeContributor.email}
                  </div>
                  <div className="text-[10px] text-[#9A8257] uppercase font-editorial mt-0.5">
                    Role: {activeContributor.role.replace('_', ' ')}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-[10px] uppercase tracking-wider text-[#8A7D6C] px-2 py-1 font-heading">
                    Switch Active Persona
                  </div>
                  {currentEvent.contributors.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        onSelectContributor(c);
                        setIsProfileOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 flex items-center justify-between text-xs transition-colors ${
                        activeContributor.id === c.id
                          ? 'bg-[#F7F2E8] font-medium text-[#221F1B]'
                          : 'hover:bg-[#FAF7F2] text-[#554D43]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#EAE2D3] flex items-center justify-center text-[10px] text-[#4B4236] font-bold font-editorial">
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
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
