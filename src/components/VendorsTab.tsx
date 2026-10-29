import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Sparkles,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  FileCheck,
  Search,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  X,
  Trash2,
} from 'lucide-react';
import { Vendor, EventPlan, Contributor } from '../types';

interface VendorsTabProps {
  event: EventPlan;
  onUpdateVendors: (vendors: Vendor[]) => void;
  onOpenAIConcierge: (prompt?: string) => void;
  activeContributor: Contributor;
}

const STAGES: { key: Vendor['status']; label: string }[] = [
  { key: 'researching', label: '01. Researching' },
  { key: 'contacted', label: '02. Initial Inquiry' },
  { key: 'quoted', label: '03. Quote Received' },
  { key: 'contract_signed', label: '04. Contract Signed' },
  { key: 'confirmed', label: '05. Confirmed & Ready' },
];

export const VendorsTab: React.FC<VendorsTabProps> = ({
  event,
  onUpdateVendors,
  onOpenAIConcierge,
  activeContributor,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingVendor, setIsAddingVendor] = useState(false);
  const [expandedVendorId, setExpandedVendorId] = useState<string | null>(null);

  // New Vendor form
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Venue');
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newFee, setNewFee] = useState('');
  const [newDepositDue, setNewDepositDue] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const filteredVendors = event.vendors.filter((v) => {
    const matchesCat = !selectedCategory || v.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.contactName && v.contactName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleAdvanceStatus = (vendor: Vendor) => {
    const order: Vendor['status'][] = [
      'researching',
      'contacted',
      'quoted',
      'contract_signed',
      'confirmed',
    ];
    const currentIndex = order.indexOf(vendor.status);
    const nextIndex = (currentIndex + 1) % order.length;
    const nextStatus = order[nextIndex];

    const updated = event.vendors.map((v) =>
      v.id === vendor.id ? { ...v, status: nextStatus } : v
    );
    onUpdateVendors(updated);
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const newVendor: Vendor = {
      id: `v-${Date.now()}`,
      name: newName,
      category: newCategory,
      contactName: newContactName || undefined,
      contactEmail: newContactEmail || undefined,
      fee: parseFloat(newFee) || 0,
      depositDue: newDepositDue || undefined,
      notes: newNotes,
      status: 'researching',
      questions: [
        'What is your cancellation and weather postponement policy?',
        'Do you provide full insurance and setup staffing?',
      ],
    };

    onUpdateVendors([...event.vendors, newVendor]);

    // Reset
    setNewName('');
    setNewContactName('');
    setNewContactEmail('');
    setNewFee('');
    setNewDepositDue('');
    setNewNotes('');
    setIsAddingVendor(false);
  };

  const handleDeleteVendor = (id: string) => {
    onUpdateVendors(event.vendors.filter((v) => v.id !== id));
  };

  const handleGenerateQuestions = (vendor: Vendor) => {
    onOpenAIConcierge(
      `Generate 5 incisive, sophisticated questions to ask our ${vendor.category} vendor ("${vendor.name}") for "${event.title}". Include considerations for quiet luxury, load-in timing, contract fine print, and artisanal quality.`
    );
  };

  const categories = Array.from(new Set(event.vendors.map((v) => v.category)));

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8DFD0] pb-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#9A8257] font-heading">
            Artisanal Network
          </div>
          <h1 className="text-3xl font-heading text-[#1F1C18]">Vendor & Master Craftsmen Registry</h1>
          <p className="text-xs font-editorial text-[#786E60] mt-1">
            Carefully vetted purveyors, florists, photographers, and culinary ateliers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() =>
              onOpenAIConcierge(
                `Suggest 3 indispensable vendor categories or specialty artisans we might be missing for our "${event.eventType}" celebration with an old-money aesthetic.`
              )
            }
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#25221F] hover:bg-[#38332E] text-[#FAF8F5] text-xs font-editorial transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D1B685]" />
            <span>AI Vendor Curation</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddingVendor(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#9A8257] hover:bg-[#887146] text-white text-xs font-editorial transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Vendor</span>
          </button>
        </div>
      </div>

      {/* Pipeline Status Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {STAGES.map((stage) => {
          const count = event.vendors.filter((v) => v.status === stage.key).length;
          return (
            <div
              key={stage.key}
              className="paper-card p-3.5 border border-[#E6DFD2] flex flex-col justify-between"
            >
              <div className="text-[10px] font-editorial uppercase tracking-wider text-[#7E7465]">
                {stage.label}
              </div>
              <div className="text-xl font-heading text-[#201D1A] mt-1">
                {count} <span className="text-xs font-editorial text-[#8C8071]">artisans</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="paper-card p-4 border border-[#E6DFD2] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`px-2.5 py-1 text-xs font-editorial transition-colors ${
              selectedCategory === null
                ? 'bg-[#25221F] text-[#FAF8F5]'
                : 'bg-[#F5EFE4] text-[#5A5043] hover:bg-[#ECE4D5]'
            }`}
          >
            All Categories ({event.vendors.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={`px-2.5 py-1 text-xs font-editorial transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#9A8257] text-white'
                  : 'bg-[#F5EFE4] text-[#5A5043] hover:bg-[#ECE4D5]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-[#8E8274] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vendor or contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#FAF7F2] border border-[#DDD3C2] text-xs font-sans text-[#2A2621] placeholder:text-[#9A8E80] focus:outline-hidden focus:border-[#9A8257]"
          />
        </div>
      </div>

      {/* Add Vendor Form Drawer */}
      {isAddingVendor && (
        <form
          onSubmit={handleAddVendor}
          className="paper-card-elevated p-6 border-2 border-[#9A8257] bg-[#FCFAF8] space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-[#EFE8DD] pb-3">
            <h3 className="font-heading text-lg text-[#201D1A]">
              Register New Master Craftsman
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingVendor(false)}
              className="text-[#887D6F] hover:text-[#201D1A]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-editorial text-[#5F5447] mb-1">
                Artisan or Business Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Beaumont Letterpress Studio"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
              />
            </div>

            <div>
              <label className="block text-xs font-editorial text-[#5F5447] mb-1">
                Category
              </label>
              <input
                type="text"
                placeholder="e.g. Calligrapher, Florist, Sommelier"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
              />
            </div>

            <div>
              <label className="block text-xs font-editorial text-[#5F5447] mb-1">
                Contract Fee ({event.currency})
              </label>
              <input
                type="number"
                placeholder="0"
                value={newFee}
                onChange={(e) => setNewFee(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
              />
            </div>

            <div>
              <label className="block text-xs font-editorial text-[#5F5447] mb-1">
                Lead Contact Name
              </label>
              <input
                type="text"
                placeholder="e.g. Master Penelope Thorne"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
              />
            </div>

            <div>
              <label className="block text-xs font-editorial text-[#5F5447] mb-1">
                Contact Email
              </label>
              <input
                type="email"
                placeholder="artisan@atelier.com"
                value={newContactEmail}
                onChange={(e) => setNewContactEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
              />
            </div>

            <div>
              <label className="block text-xs font-editorial text-[#5F5447] mb-1">
                Deposit Schedule Terms
              </label>
              <input
                type="text"
                placeholder="e.g. 50% upon contract signing"
                value={newDepositDue}
                onChange={(e) => setNewDepositDue(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-editorial text-[#5F5447] mb-1">
                Scope & Specifications
              </label>
              <input
                type="text"
                placeholder="e.g. Sourcing 18th-century brass candelabras and local garden roses..."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EFE8DD]">
            <button
              type="button"
              onClick={() => setIsAddingVendor(false)}
              className="px-4 py-2 border border-[#DDD3C2] text-xs font-editorial text-[#5A5043] hover:bg-[#F5EFE5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#9A8257] hover:bg-[#867045] text-white text-xs font-editorial transition-colors"
            >
              Save to Registry
            </button>
          </div>
        </form>
      )}

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredVendors.map((vendor) => {
          const isExpanded = expandedVendorId === vendor.id;
          return (
            <div
              key={vendor.id}
              className="paper-card p-6 border border-[#E6DFD2] hover:border-[#C4B49C] transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-editorial uppercase tracking-wider text-[#9A8257] bg-[#F7F2E7] px-2 py-0.5 border border-[#E8DEC9]">
                      {vendor.category}
                    </span>
                    <h3 className="font-editorial text-lg font-bold text-[#221F1B] mt-1">
                      {vendor.name}
                    </h3>
                  </div>

                  {/* Status Button */}
                  <button
                    type="button"
                    onClick={() => handleAdvanceStatus(vendor)}
                    title="Click to advance pipeline stage"
                    className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-editorial bg-[#F9F6F0] hover:bg-[#F2ECE0] border border-[#DDD3C2] text-[#3E3830] transition-colors"
                  >
                    <span className="capitalize">{vendor.status.replace('_', ' ')}</span>
                    <ChevronRight className="w-3 h-3 text-[#9A8257]" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-editorial text-[#6E6354]">
                  <div>
                    <span className="text-[#968A7C]">Fee: </span>
                    <span className="font-semibold text-[#201D1A]">
                      {event.currency}{vendor.fee.toLocaleString()}
                    </span>
                  </div>
                  {vendor.depositDue && (
                    <div>
                      <span className="text-[#968A7C]">Terms: </span>
                      <span className="text-[#322E28]">{vendor.depositDue}</span>
                    </div>
                  )}
                </div>

                {/* Contact information */}
                {(vendor.contactName || vendor.contactEmail || vendor.contactPhone) && (
                  <div className="p-2.5 bg-[#FAF7F2] border border-[#EAE2D4] text-xs font-sans text-[#5A5043] space-y-1">
                    {vendor.contactName && (
                      <div className="font-editorial font-medium text-[#2C2822]">
                        {vendor.contactName}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-3 text-[11px] text-[#7A7061]">
                      {vendor.contactEmail && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-[#9A8257]" />
                          {vendor.contactEmail}
                        </span>
                      )}
                      {vendor.contactPhone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#9A8257]" />
                          {vendor.contactPhone}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <p className="text-xs text-[#6F6456] font-sans leading-relaxed">
                  {vendor.notes}
                </p>

                {/* Key Questions Checklist */}
                {vendor.questions && vendor.questions.length > 0 && (
                  <div className="pt-2 border-t border-[#EFEAE0]">
                    <div className="text-[10px] font-heading uppercase tracking-wider text-[#8A7F70] mb-1.5 flex items-center justify-between">
                      <span>Inquiry Checklist</span>
                      <button
                        type="button"
                        onClick={() => handleGenerateQuestions(vendor)}
                        className="text-[10px] text-[#9A8257] hover:underline flex items-center gap-1 lowercase font-editorial"
                      >
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>expand questions</span>
                      </button>
                    </div>

                    <ul className="space-y-1">
                      {vendor.questions.map((q, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-[#5E5448] flex items-start gap-1.5 font-editorial"
                        >
                          <span className="text-[#9A8257]">•</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-3 border-t border-[#EFE8DD] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleGenerateQuestions(vendor)}
                  className="flex items-center gap-1 text-xs font-editorial text-[#9A8257] hover:text-[#7A643E] transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Draft Meeting Inquiry</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteVendor(vendor.id)}
                  className="text-xs text-[#AAA092] hover:text-rose-800 transition-colors"
                  title="Remove vendor"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
