import React from 'react';
import {
  Compass,
  Palette,
  ReceiptText,
  Clock,
  Briefcase,
  Users2,
} from 'lucide-react';

export type TabKey = 'overview' | 'ideas' | 'budget' | 'timeline' | 'vendors' | 'contributors';

interface NavigationProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  budgetCount?: number;
  timelinePendingCount?: number;
  openTasksCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  budgetCount,
  timelinePendingCount,
  openTasksCount,
}) => {
  const tabs = [
    {
      key: 'overview' as TabKey,
      label: 'Atelier Overview',
      subtitle: 'Dashboard & Aesthetics',
      icon: Compass,
    },
    {
      key: 'ideas' as TabKey,
      label: 'Bespoke Ideas & Mood',
      subtitle: 'Color, Menu, Music & Wording',
      icon: Palette,
    },
    {
      key: 'budget' as TabKey,
      label: 'Financial Ledger',
      subtitle: 'Allocations & Estimates',
      icon: ReceiptText,
      badge: budgetCount ? `${budgetCount} items` : undefined,
    },
    {
      key: 'timeline' as TabKey,
      label: 'Chronological Timeline',
      subtitle: 'Milestones & Day-Of Run',
      icon: Clock,
      badge: timelinePendingCount ? `${timelinePendingCount} pending` : undefined,
    },
    {
      key: 'vendors' as TabKey,
      label: 'Vendor Registry',
      subtitle: 'Pipelines & Contacts',
      icon: Briefcase,
    },
    {
      key: 'contributors' as TabKey,
      label: 'Contributor Salon',
      subtitle: 'Real-time Tasks & Roster',
      icon: Users2,
      badge: openTasksCount ? `${openTasksCount} open` : undefined,
    },
  ];

  return (
    <nav className="border-b border-[#E8DFD0] bg-[#FAF8F5] px-4 sm:px-8 overflow-x-auto no-scrollbar">
      <div className="flex space-x-1 sm:space-x-3 min-w-max py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`flex items-center gap-2.5 px-3 sm:px-4 py-2 border transition-all duration-200 text-left ${
                isActive
                  ? 'border-[#C2AC85] bg-[#FFFFFF] shadow-xs text-[#1E1C19]'
                  : 'border-transparent text-[#6F6456] hover:text-[#26221D] hover:bg-[#F4EEE4]'
              }`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 ${
                  isActive ? 'text-[#9A8257]' : 'text-[#8E8272]'
                }`}
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-editorial text-sm font-semibold tracking-wide">
                    {tab.label}
                  </span>
                  {tab.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-none bg-[#EFE8DC] text-[#695D4E] font-editorial">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#938778] font-sans">
                  {tab.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
