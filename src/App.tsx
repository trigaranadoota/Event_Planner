import React, { useState, useEffect } from 'react';
import { INITIAL_EVENTS } from './data/sampleEvents';
import { EventPlan, Contributor, BudgetItem, TimelineItem, Vendor } from './types';
import { collabService, CollaborationMessage } from './services/collaborationService';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TabKey } from './components/Navigation';
import { OverviewTab } from './components/OverviewTab';
import { BudgetTab } from './components/BudgetTab';
import { TimelineTab } from './components/TimelineTab';
import { VendorsTab } from './components/VendorsTab';
import { IdeasTab } from './components/IdeasTab';
import { ContributorsTab } from './components/ContributorsTab';
import { AIConciergeModal } from './components/AIConciergeModal';
import { NewEventModal } from './components/NewEventModal';
import { InviteCollaboratorModal } from './components/InviteCollaboratorModal';
import { CollaboratorsListModal } from './components/CollaboratorsListModal';

const STORAGE_KEY = 'celeste_atelier_events_v4';
const ACTIVE_EVENT_KEY = 'celeste_active_event_id';

export default function App() {
  const [events, setEvents] = useState<EventPlan[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Could not read from localStorage', e);
      }
    }
    return INITIAL_EVENTS;
  });

  const [activeEventId, setActiveEventId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem(ACTIVE_EVENT_KEY);
      if (savedId && INITIAL_EVENTS.some((e) => e.id === savedId)) return savedId;
    }
    return INITIAL_EVENTS[0].id;
  });

  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  // Currently active user persona (Eleanor Vance by default)
  const [activeContributor, setActiveContributor] = useState<Contributor>(() => {
    return (
      INITIAL_EVENTS[0].contributors[0] || {
        id: 'c1',
        name: 'Eleanor Vance',
        email: 'eleanor.vance@atelier.com',
        role: 'host',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        isOnline: true,
        assignedTasksCount: 4,
      }
    );
  });

  // Mobile sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modal visibility
  const [isAIConciergeOpen, setIsAIConciergeOpen] = useState(false);
  const [aiConciergeInitialPrompt, setAIConciergeInitialPrompt] = useState<string | undefined>();
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCollaboratorsModalOpen, setIsCollaboratorsModalOpen] = useState(false);

  // Real-time toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active event object
  const currentEvent = events.find((e) => e.id === activeEventId) || events[0];

  // Save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
      localStorage.setItem(ACTIVE_EVENT_KEY, activeEventId);
    }
  }, [events, activeEventId]);

  // Subscribe to real-time BroadcastChannel updates
  useEffect(() => {
    const unsubscribe = collabService.subscribe((msg: CollaborationMessage) => {
      setToastMessage(`${msg.contributorName}: ${msg.summary}`);

      if (msg.updatedPlan) {
        setEvents((prev) =>
          prev.map((evt) => (evt.id === msg.updatedPlan!.id ? msg.updatedPlan! : evt))
        );
      }

      setTimeout(() => {
        setToastMessage(null);
      }, 4000);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Update current event helper & broadcast
  const updateCurrentEvent = (updated: EventPlan, actionSummary?: string) => {
    setEvents((prev) =>
      prev.map((evt) => (evt.id === updated.id ? updated : evt))
    );

    collabService.broadcast({
      type: 'EVENT_UPDATE',
      eventId: updated.id,
      contributorName: activeContributor.name,
      summary: actionSummary || 'Updated event configuration',
      timestamp: new Date().toLocaleTimeString(),
      updatedPlan: updated,
    });
  };

  const handleUpdateBudget = (budgetItems: BudgetItem[]) => {
    const updated = {
      ...currentEvent,
      budgetItems,
      activityLog: [
        {
          id: `act-${Date.now()}`,
          user: activeContributor.name,
          action: 'Adjusted financial ledger entries',
          timestamp: 'Just now',
          type: 'budget' as const,
        },
        ...currentEvent.activityLog,
      ],
    };
    updateCurrentEvent(updated, 'Adjusted financial ledger line items');
  };

  const handleUpdateTimeline = (timeline: TimelineItem[]) => {
    const updated = {
      ...currentEvent,
      timeline,
      activityLog: [
        {
          id: `act-${Date.now()}`,
          user: activeContributor.name,
          action: 'Updated chronological timeline milestones',
          timestamp: 'Just now',
          type: 'timeline' as const,
        },
        ...currentEvent.activityLog,
      ],
    };
    updateCurrentEvent(updated, 'Updated chronological timeline');
  };

  const handleUpdateVendors = (vendors: Vendor[]) => {
    const updated = {
      ...currentEvent,
      vendors,
      activityLog: [
        {
          id: `act-${Date.now()}`,
          user: activeContributor.name,
          action: 'Updated vendor craftsman pipeline',
          timestamp: 'Just now',
          type: 'vendor' as const,
        },
        ...currentEvent.activityLog,
      ],
    };
    updateCurrentEvent(updated, 'Updated vendor registry');
  };

  const handleClaimTask = (taskId: string) => {
    const updatedTasks = currentEvent.contributorTasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            status: 'claimed' as const,
            assignedToName: activeContributor.name,
          }
        : t
    );
    const updated = {
      ...currentEvent,
      contributorTasks: updatedTasks,
      activityLog: [
        {
          id: `act-${Date.now()}`,
          user: activeContributor.name,
          action: `Claimed contribution slot`,
          timestamp: 'Just now',
          type: 'task' as const,
        },
        ...currentEvent.activityLog,
      ],
    };
    updateCurrentEvent(updated, `Claimed a task slot`);
  };

  const handleCreateEvent = (newEvent: EventPlan) => {
    setEvents((prev) => [newEvent, ...prev]);
    setActiveEventId(newEvent.id);
    setActiveTab('overview');
    collabService.broadcast({
      type: 'EVENT_UPDATE',
      eventId: newEvent.id,
      contributorName: activeContributor.name,
      summary: `Created new event "${newEvent.title}" with GenAI`,
      timestamp: new Date().toLocaleTimeString(),
      updatedPlan: newEvent,
    });
  };

  const handleOpenAIConcierge = (prompt?: string) => {
    setAIConciergeInitialPrompt(prompt);
    setIsAIConciergeOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#24211E] flex flex-col md:flex-row font-sans selection:bg-[#E8DFC9] selection:text-[#1F1C18]">
      {/* Sidebar with all navigation options, active event switcher, and collaborator trigger */}
      <Sidebar
        currentEvent={currentEvent}
        allEvents={events}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onSelectEvent={(id) => setActiveEventId(id)}
        onOpenNewEvent={() => setIsNewEventModalOpen(true)}
        onOpenCollaboratorsModal={() => setIsCollaboratorsModalOpen(true)}
        onOpenAIConcierge={() => handleOpenAIConcierge()}
        activeContributor={activeContributor}
        onSelectContributor={(c) => setActiveContributor(c)}
        isOpenMobile={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
        onOpenMobile={() => setIsSidebarOpen(true)}
      />

      {/* Main Content Area (Full width with smooth overlay for slide-out sidebar) */}
      <div className="flex-1 flex flex-col min-h-screen w-full">
        {/* Streamlined Header */}
        <Header
          currentEvent={currentEvent}
          activeContributor={activeContributor}
          onSelectContributor={(c) => setActiveContributor(c)}
          onOpenAIConcierge={() => handleOpenAIConcierge()}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

        {/* Tab View Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 pt-8">
          {activeTab === 'overview' && (
            <OverviewTab
              event={currentEvent}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenAIConcierge={handleOpenAIConcierge}
              activeContributor={activeContributor}
              onClaimTask={handleClaimTask}
            />
          )}

          {activeTab === 'ideas' && (
            <IdeasTab
              event={currentEvent}
              onUpdateEvent={(updated) => updateCurrentEvent(updated, 'Updated personalized ideas and mood')}
              onOpenAIConcierge={handleOpenAIConcierge}
              activeContributor={activeContributor}
            />
          )}

          {activeTab === 'budget' && (
            <BudgetTab
              event={currentEvent}
              onUpdateBudget={handleUpdateBudget}
              onOpenAIConcierge={handleOpenAIConcierge}
              activeContributor={activeContributor}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelineTab
              event={currentEvent}
              onUpdateTimeline={handleUpdateTimeline}
              onOpenAIConcierge={handleOpenAIConcierge}
              activeContributor={activeContributor}
            />
          )}

          {activeTab === 'vendors' && (
            <VendorsTab
              event={currentEvent}
              onUpdateVendors={handleUpdateVendors}
              onOpenAIConcierge={handleOpenAIConcierge}
              activeContributor={activeContributor}
            />
          )}

          {activeTab === 'contributors' && (
            <ContributorsTab
              event={currentEvent}
              onUpdateEvent={(updated) => updateCurrentEvent(updated, 'Updated contributor salon and discussion')}
              onOpenInvite={() => setIsInviteModalOpen(true)}
              activeContributor={activeContributor}
              onOpenAIConcierge={handleOpenAIConcierge}
            />
          )}
        </main>

        {/* Footer flourish */}
        <footer className="border-t border-[#E8DFD0] py-6 px-4 sm:px-8 text-center text-xs font-editorial text-[#8A7E6E] bg-[#FAF8F5]">
          <div className="max-w-xl mx-auto space-y-1">
            <div className="font-heading tracking-widest text-[#9A8257] uppercase text-[11px]">
              Céleste & Co. · Heritage Event Atelier
            </div>
            <div className="font-script text-lg text-[#665B4E]">
              Quiet luxury, bespoke orchestrations & timeless gatherings
            </div>
            <div className="text-[10px] text-[#A69B8C] font-sans pt-1">
              Powered by Gemini 3.8 Flash
            </div>
          </div>
        </footer>
      </div>

      {/* Collaborators List Modal (Triggered by Collab button in Sidebar) */}
      <CollaboratorsListModal
        isOpen={isCollaboratorsModalOpen}
        onClose={() => setIsCollaboratorsModalOpen(false)}
        event={currentEvent}
        onOpenInvite={() => setIsInviteModalOpen(true)}
        activeContributor={activeContributor}
        onSelectContributor={(c) => setActiveContributor(c)}
      />

      {/* AI Concierge Modal */}
      <AIConciergeModal
        isOpen={isAIConciergeOpen}
        onClose={() => {
          setIsAIConciergeOpen(false);
          setAIConciergeInitialPrompt(undefined);
        }}
        event={currentEvent}
        activeContributor={activeContributor}
        initialPrompt={aiConciergeInitialPrompt}
      />

      {/* New Event Modal */}
      <NewEventModal
        isOpen={isNewEventModalOpen}
        onClose={() => setIsNewEventModalOpen(false)}
        onCreateEvent={handleCreateEvent}
        activeContributor={activeContributor}
      />

      {/* Invite Collaborator Modal */}
      <InviteCollaboratorModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        event={currentEvent}
      />

      {/* Real-time Collaboration Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#25221F] text-[#FAF8F5] border border-[#9A8257] shadow-xl text-xs font-editorial animate-in slide-in-from-bottom-3">
          <span className="w-2 h-2 rounded-full bg-[#D1B685] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
