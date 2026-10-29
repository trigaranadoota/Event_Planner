import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Calendar,
  MapPin,
  Coins,
  Users,
  Loader2,
  Wand2,
} from 'lucide-react';
import { EventPlan, EventType, Contributor } from '../types';
import { requestAIPerplan } from '../services/geminiService';

interface NewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (newEvent: EventPlan) => void;
  activeContributor: Contributor;
}

export const NewEventModal: React.FC<NewEventModalProps> = ({
  isOpen,
  onClose,
  onCreateEvent,
  activeContributor,
}) => {
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-10-15');
  const [location, setLocation] = useState('Lake Como Villa & Gardens, Italy');
  const [guestCount, setGuestCount] = useState('85');
  const [budget, setBudget] = useState('52000');
  const [currency, setCurrency] = useState('$');
  const [vibe, setVibe] = useState(
    'Old-money Italian lakeside elegance, candlelit cypress terraces, raw silk linens, acoustic strings'
  );
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleApplyPreset = (type: EventType) => {
    setEventType(type);
    if (type === 'wedding') {
      setTitle('Villa Balbiano Lakeside Nuptials');
      setBudget('65000');
      setGuestCount('90');
      setLocation('Lake Como, Northern Italy');
      setVibe('Old-money Italian lakeside elegance, candlelit cypress terraces, raw silk linens, acoustic strings');
    } else if (type === 'birthday') {
      setTitle("Lord Sterling's 50th Golden Jubilee");
      setBudget('28000');
      setGuestCount('60');
      setLocation('The Orangery at Kensington, London');
      setVibe('Victorian black tie, rare single malts, amber chandeliers, jazz big band, vintage Havana lounge');
    } else {
      setTitle('The Cambridge Heritage Salon & Charity Gala');
      setBudget('42000');
      setGuestCount('180');
      setLocation('Old Senate House, Cambridge');
      setVibe('Academic heritage, candlelit long tables, classical chamber orchestra, silent manuscript auction');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const generatedPlan = await requestAIPerplan({
        eventType,
        title: title || `${eventType === 'wedding' ? 'Bespoke Wedding' : eventType === 'birthday' ? 'Heritage Jubilee' : 'Community Gala'}`,
        guestCount: parseInt(guestCount) || 80,
        budget: parseFloat(budget) || 45000,
        vibe,
        location: location || 'Private Estate',
      });

      const planData = generatedPlan || {};
      const newEventId = `event-${Date.now()}`;

      const newEvent: EventPlan = {
        id: newEventId,
        eventType,
        title: title || 'Bespoke Celebration',
        tagline: planData.tagline || 'A timeless gathering marked by quiet elegance and enduring memories.',
        vibe: planData.themeDescription || vibe,
        location: location || 'Estate Grounds',
        date: date || '2026-11-20',
        guestCount: parseInt(guestCount) || 80,
        targetBudget: parseFloat(budget) || 45000,
        currency,
        palette: planData.palette || [
          { name: 'Warm Alabaster', hex: '#FAF7F2', role: 'Foundation Canvas' },
          { name: 'Vintage Ecru', hex: '#EBE3D5', role: 'Linen & Drapery' },
          { name: 'Burnished Brass', hex: '#A89260', role: 'Candlesticks' },
          { name: 'Cypress Slate', hex: '#5E6B5D', role: 'Botanical' },
          { name: 'Charcoal Ink', hex: '#242220', role: 'Calligraphy' },
        ],
        budgetItems: (planData.budgetBreakdown || []).map((b: any, idx: number) => ({
          id: `b-${newEventId}-${idx}`,
          category: b.category,
          name: `${b.category} Core Allocation`,
          allocated: b.allocated || Math.round((parseFloat(budget) || 45000) * 0.15),
          actual: b.allocated || Math.round((parseFloat(budget) || 45000) * 0.15),
          status: 'unpaid',
          assignedTo: activeContributor.name,
          notes: b.description,
        })),
        timeline: [
          ...(planData.timelineMilestones || []).map((m: any, idx: number) => ({
            id: `tm-${newEventId}-${idx}`,
            timeframe: m.timeframe,
            title: m.title,
            description: m.description,
            phase: 'milestone' as const,
            completed: false,
            assignedTo: activeContributor.name,
          })),
          ...(planData.dayOfSchedule || []).map((s: any, idx: number) => ({
            id: `ts-${newEventId}-${idx}`,
            timeframe: 'Day Of',
            time: s.time,
            title: s.title,
            description: s.notes,
            phase: 'day_of' as const,
            completed: false,
            assignedTo: s.assignedTo || activeContributor.name,
          })),
        ],
        vendors: (planData.vendorChecklist || []).map((v: any, idx: number) => ({
          id: `v-${newEventId}-${idx}`,
          category: v.category,
          name: v.name,
          fee: v.estimatedCost || 5000,
          status: 'researching' as const,
          questions: v.keyQuestions || ['Inquire on availability and insurance'],
          notes: 'Identified by Atelier GenAI',
        })),
        personalizedIdeas: {
          signatureDrinks: planData.personalizedIdeas?.signatureDrinks || [
            {
              name: 'The Heritage Spritz',
              ingredients: 'Limoncello, vintage prosecco, garden mint, splash of sparkling soda',
              story: 'Light, effervescent welcome drink served in ribbed crystal flutes.',
            },
          ],
          invitationWording:
            planData.personalizedIdeas?.invitationWording ||
            `Request the honour of your company at the celebration of ${title}. An evening of candlelit conversation, fine vintages, and shared joy.`,
          acousticPlaylist: planData.personalizedIdeas?.acousticPlaylist || [
            'Ludovico Einaudi - Nuvole Bianche',
            'Bill Evans - Peace Piece',
            'Stan Getz - Wave',
          ],
          guestFavors:
            planData.personalizedIdeas?.guestFavors ||
            'Hand-poured beeswax tapers with personalized letterpress matchboxes.',
        },
        contributors: [
          activeContributor,
          {
            id: 'c-copartner',
            name: 'Julian Croft',
            email: 'julian.croft@atelier.com',
            role: 'co_planner',
            avatar:
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
            isOnline: true,
            assignedTasksCount: 2,
          },
        ],
        contributorTasks: [
          {
            id: `ct-${newEventId}-1`,
            title: 'Confirm Table Linen Swatches & Flatware',
            category: 'Tablescape',
            status: 'open',
          },
          {
            id: `ct-${newEventId}-2`,
            title: 'Arrange Vintage Welcome Transportation',
            category: 'Logistics',
            status: 'open',
          },
        ],
        activityLog: [
          {
            id: `act-${newEventId}-1`,
            user: activeContributor.name,
            action: `Curated new event plan with GenAI`,
            timestamp: 'Just now',
            type: 'general',
          },
        ],
        discussionNotes: [
          {
            id: `note-${newEventId}-1`,
            author: activeContributor.name,
            avatar: activeContributor.avatar,
            role: activeContributor.role,
            content: `Initial blueprint generated. Ready for our team to customize the ledger and timeline!`,
            timestamp: 'Just now',
          },
        ],
      };

      onCreateEvent(newEvent);
      onClose();
    } catch (err) {
      console.error('Error creating event:', err);
    } finally {
      setIsGenerating(false);
    }
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in overflow-y-auto"
    >
      <div className="paper-card-elevated w-full max-w-2xl my-8 border border-[#D5CABB] bg-[#FAF8F5] shadow-2xl relative">
        {/* Header */}
        <div className="p-5 border-b border-[#EAE2D4] bg-white flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#9A8257] font-heading">
              GenAI Atelier Architecture
            </div>
            <h2 className="font-heading text-xl text-[#1F1C18]">Curate New Heritage Event</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close event modal"
            className="text-[#887C6E] hover:text-[#201D1A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset fast buttons */}
        <div className="p-4 bg-[#FCFAF7] border-b border-[#EFE9DF] flex items-center justify-between gap-2 overflow-x-auto">
          <span className="text-[11px] font-editorial text-[#857B6D] flex-shrink-0">
            Inspire with Atelier Presets:
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleApplyPreset('wedding')}
              className="text-xs font-editorial px-2.5 py-1 bg-white hover:bg-[#F5EFE5] border border-[#DDD3C2] text-[#4F463A]"
            >
              Lakeside Nuptials
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('birthday')}
              className="text-xs font-editorial px-2.5 py-1 bg-white hover:bg-[#F5EFE5] border border-[#DDD3C2] text-[#4F463A]"
            >
              50th Golden Jubilee
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('community')}
              className="text-xs font-editorial px-2.5 py-1 bg-white hover:bg-[#F5EFE5] border border-[#DDD3C2] text-[#4F463A]"
            >
              Heritage Gala
            </button>
          </div>
        </div>

        <form onSubmit={handleCreate} className="p-6 space-y-5">
          {/* Event Type selector */}
          <div>
            <label className="block text-xs font-editorial text-[#5F5447] mb-1.5">
              Celebration Classification
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['wedding', 'birthday', 'community'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setEventType(type)}
                  className={`py-2 px-3 text-xs font-editorial capitalize border text-center transition-all ${
                    eventType === type
                      ? 'bg-[#25221F] text-white border-[#25221F]'
                      : 'bg-white text-[#554C3F] border-[#DDD3C2] hover:bg-[#F7F2E8]'
                  }`}
                >
                  {type === 'community' ? 'Community Event' : type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-editorial text-[#5F5447] mb-1">
                Event Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Eleanor & Arthur's Nuptials"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
              />
            </div>

            <div>
              <label className="block text-xs font-editorial text-[#5F5447] mb-1">
                Gathering Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
              />
            </div>

            <div>
              <label className="block text-xs font-editorial text-[#5F5447] mb-1">
                Location or Estate Setting
              </label>
              <input
                type="text"
                placeholder="e.g. Highgrove Valley Manor, Gloucestershire"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
              />
            </div>

            <div>
              <label className="block text-xs font-editorial text-[#5F5447] mb-1">
                Curated Guest Count
              </label>
              <input
                type="number"
                placeholder="80"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
              />
            </div>

            <div>
              <label className="block text-xs font-editorial text-[#5F5447] mb-1">
                Planned Reserve Budget
              </label>
              <div className="flex gap-2">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="px-2 py-2 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden"
                >
                  <option value="$">$ (USD)</option>
                  <option value="£">£ (GBP)</option>
                  <option value="€">€ (EUR)</option>
                </select>
                <input
                  type="number"
                  placeholder="45000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-editorial text-[#5F5447] mb-1">
                Aesthetic Concept & Sensory Vibe
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Old-money Cotswolds heritage, neutral tones, candlelit garden salon, acoustic strings..."
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EAE2D4]">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2 border border-[#DDD3C2] text-xs font-editorial text-[#5A5043] hover:bg-[#F5EFE5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-6 py-2.5 bg-[#9A8257] hover:bg-[#867045] text-white text-xs font-editorial flex items-center gap-2 transition-all shadow-xs disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Curating Complete Atelier with GenAI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Complete Event Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
