import React, { useState } from 'react';
import {
  Plus,
  Coins,
  Download,
  Filter,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Search,
  Trash2,
  Edit2,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { BudgetItem, EventPlan, Contributor } from '../types';
import { BudgetChart } from './BudgetChart';

interface BudgetTabProps {
  event: EventPlan;
  onUpdateBudget: (items: BudgetItem[]) => void;
  onOpenAIConcierge: (prompt?: string) => void;
  activeContributor: Contributor;
}

const CATEGORIES = [
  'Venue & Facilities',
  'Catering & Fine Wines',
  'Floral & Botanical Design',
  'Photography & Film',
  'Music & Entertainment',
  'Attire & Styling',
  'Stationery & Calligraphy',
  'Contingency Reserve',
  'Other',
];

export const BudgetTab: React.FC<BudgetTabProps> = ({
  event,
  onUpdateBudget,
  onOpenAIConcierge,
  activeContributor,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Venue & Facilities');
  const [newItemAllocated, setNewItemAllocated] = useState('');
  const [newItemActual, setNewItemActual] = useState('');
  const [newItemNotes, setNewItemNotes] = useState('');
  const [newItemStatus, setNewItemStatus] = useState<'unpaid' | 'deposit_paid' | 'paid'>('unpaid');

  // Calculations
  const totalAllocated = event.budgetItems.reduce((sum, item) => sum + item.allocated, 0);
  const totalActual = event.budgetItems.reduce((sum, item) => sum + item.actual, 0);
  const totalPaid = event.budgetItems
    .filter((b) => b.status === 'paid')
    .reduce((sum, item) => sum + item.actual, 0);
  const variance = event.targetBudget - totalActual;

  const filteredItems = event.budgetItems.filter((item) => {
    const matchesCat = !selectedCategory || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.assignedTo && item.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;

    const allocatedNum = parseFloat(newItemAllocated) || 0;
    const actualNum = parseFloat(newItemActual) || allocatedNum;

    const newItem: BudgetItem = {
      id: `b-${Date.now()}`,
      name: newItemName,
      category: newItemCategory,
      allocated: allocatedNum,
      actual: actualNum,
      status: newItemStatus,
      assignedTo: activeContributor.name,
      notes: newItemNotes,
    };

    onUpdateBudget([...event.budgetItems, newItem]);

    // Reset form
    setNewItemName('');
    setNewItemAllocated('');
    setNewItemActual('');
    setNewItemNotes('');
    setIsAddingItem(false);
  };

  const handleDeleteItem = (id: string) => {
    onUpdateBudget(event.budgetItems.filter((b) => b.id !== id));
  };

  const handleToggleStatus = (item: BudgetItem) => {
    let nextStatus: 'unpaid' | 'deposit_paid' | 'paid' = 'unpaid';
    if (item.status === 'unpaid') nextStatus = 'deposit_paid';
    else if (item.status === 'deposit_paid') nextStatus = 'paid';
    else nextStatus = 'unpaid';

    const updated = event.budgetItems.map((b) =>
      b.id === item.id ? { ...b, status: nextStatus } : b
    );
    onUpdateBudget(updated);
  };

  const handleExportCSV = () => {
    const headers = ['Category', 'Item Name', 'Allocated', 'Actual', 'Status', 'Assigned To', 'Notes'];
    const rows = event.budgetItems.map((b) => [
      `"${b.category}"`,
      `"${b.name}"`,
      b.allocated,
      b.actual,
      `"${b.status}"`,
      `"${b.assignedTo || ''}"`,
      `"${b.notes || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}_Financial_Ledger.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner & Executive Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8DFD0] pb-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#9A8257] font-heading">
            Atelier Financial Ledger
          </div>
          <h1 className="text-3xl font-heading text-[#1F1C18]">Curated Budget & Allocations</h1>
          <p className="text-xs font-editorial text-[#786E60] mt-1">
            Carefully balanced expenditures honoring quiet luxury and artisanal craftsmanship.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#DDD4C4] text-[#363028] text-xs font-editorial transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#9A8257]" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() =>
              onOpenAIConcierge(
                `Analyze our current budget for "${event.title}" ($${totalActual} committed of $${event.targetBudget}). Suggest 3 refined opportunities to optimize expenditure while enhancing the old-money aesthetic.`
              )
            }
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#25221F] hover:bg-[#38332E] text-[#FAF8F5] text-xs font-editorial transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D1B685]" />
            <span>AI Budget Advisor</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddingItem(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#9A8257] hover:bg-[#887146] text-white text-xs font-editorial transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Ledger Line</span>
          </button>
        </div>
      </div>

      {/* 4 Ledger Executive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="paper-card p-5 border border-[#E6DFD2]">
          <div className="text-xs font-editorial text-[#7F7567]">Target Master Budget</div>
          <div className="text-2xl font-heading text-[#201D1A] mt-1">
            {event.currency}{event.targetBudget.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#8A7F70] mt-1 font-sans">
            Approved client threshold
          </div>
        </div>

        <div className="paper-card p-5 border border-[#E6DFD2]">
          <div className="text-xs font-editorial text-[#7F7567]">Total Allocated</div>
          <div className="text-2xl font-heading text-[#201D1A] mt-1">
            {event.currency}{totalAllocated.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#8A7F70] mt-1 font-sans">
            {Math.round((totalAllocated / event.targetBudget) * 100)}% of ceiling planned
          </div>
        </div>

        <div className="paper-card p-5 border border-[#E6DFD2]">
          <div className="text-xs font-editorial text-[#7F7567]">Actual Committed</div>
          <div className="text-2xl font-heading text-[#201D1A] mt-1">
            {event.currency}{totalActual.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#6A7B66] mt-1 font-sans">
            {event.currency}{totalPaid.toLocaleString()} settled in full
          </div>
        </div>

        <div className="paper-card p-5 border border-[#E6DFD2]">
          <div className="text-xs font-editorial text-[#7F7567]">Remaining Surplus</div>
          <div
            className={`text-2xl font-heading mt-1 ${
              variance >= 0 ? 'text-[#201D1A]' : 'text-rose-800'
            }`}
          >
            {event.currency}{variance.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#8A7F70] mt-1 font-sans">
            {variance >= 0 ? 'Unallocated cushion' : 'Over planned limit'}
          </div>
        </div>
      </div>

      {/* Interactive Donut Allocation Visualizer */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-heading uppercase tracking-wider text-[#8A7F70]">
            Category Allocation Geometry
          </span>
          {selectedCategory && (
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="text-xs text-[#9A8257] hover:underline font-editorial"
            >
              Clear Category Filter ({selectedCategory})
            </button>
          )}
        </div>
        <BudgetChart
          items={event.budgetItems}
          totalBudget={event.targetBudget}
          currency={event.currency}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="paper-card p-4 border border-[#E6DFD2] flex flex-wrap items-center justify-between gap-4">
        {/* Category Pills */}
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
            All Categories ({event.budgetItems.length})
          </button>
          {CATEGORIES.filter((cat) =>
            event.budgetItems.some((item) => item.category === cat)
          ).map((cat) => (
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

        {/* Search Input */}
        <div className="relative min-w-[200px] flex-1 sm:flex-initial">
          <Search className="w-3.5 h-3.5 text-[#8E8274] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search line items or assignees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#FAF7F2] border border-[#DDD3C2] text-xs font-sans text-[#2A2621] placeholder:text-[#9A8E80] focus:outline-hidden focus:border-[#9A8257]"
          />
        </div>
      </div>

      {/* Add Item Drawer / Modal */}
      {isAddingItem && (
        <form
          onSubmit={handleAddItem}
          className="paper-card-elevated p-6 border-2 border-[#9A8257] bg-[#FCFAF8] space-y-4 animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between border-b border-[#EFE8DD] pb-3">
            <h3 className="font-heading text-lg text-[#201D1A]">
              Add Item to Financial Ledger
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
                Item Description
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Vintage Champagne Magnum Reserve"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
              />
            </div>

            <div>
              <label className="block text-xs font-editorial text-[#5F5447] mb-1">
                Category
              </label>
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-editorial text-[#5F5447] mb-1">
                Allocated Amount ({event.currency})
              </label>
              <input
                type="number"
                placeholder="0"
                value={newItemAllocated}
                onChange={(e) => setNewItemAllocated(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
              />
            </div>

            <div>
              <label className="block text-xs font-editorial text-[#5F5447] mb-1">
                Actual / Contract Amount ({event.currency})
              </label>
              <input
                type="number"
                placeholder="Leave blank to match allocated"
                value={newItemActual}
                onChange={(e) => setNewItemActual(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
              />
            </div>

            <div>
              <label className="block text-xs font-editorial text-[#5F5447] mb-1">
                Initial Settlement Status
              </label>
              <select
                value={newItemStatus}
                onChange={(e) => setNewItemStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
              >
                <option value="unpaid">Unpaid / Estimate</option>
                <option value="deposit_paid">Deposit Paid</option>
                <option value="paid">Paid in Full</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-editorial text-[#5F5447] mb-1">
                Artisanal Notes / Spec
              </label>
              <input
                type="text"
                placeholder="e.g. Sourced from local independent cellar"
                value={newItemNotes}
                onChange={(e) => setNewItemNotes(e.target.value)}
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
              Record into Ledger
            </button>
          </div>
        </form>
      )}

      {/* Ledger Table */}
      <div className="paper-card border border-[#E6DFD2] overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#E8DFD0] bg-[#FAF7F2] font-editorial text-[#73695B]">
              <th className="py-3 px-4 font-semibold">Category & Description</th>
              <th className="py-3 px-4 font-semibold text-right">Allocated</th>
              <th className="py-3 px-4 font-semibold text-right">Actual Cost</th>
              <th className="py-3 px-4 font-semibold text-center">Settlement Status</th>
              <th className="py-3 px-4 font-semibold">Orchestrated By</th>
              <th className="py-3 px-4 font-semibold">Notes</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFEAE0]">
            {filteredItems.map((item) => {
              const diff = item.actual - item.allocated;
              return (
                <tr
                  key={item.id}
                  className="hover:bg-[#FCFAF8] transition-colors group"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-editorial text-sm font-semibold text-[#221F1B]">
                      {item.name}
                    </div>
                    <div className="text-[10px] text-[#8E8375] font-sans">
                      {item.category}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right font-medium text-[#463F36]">
                    {event.currency}{item.allocated.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className="font-semibold text-[#1F1C18]">
                      {event.currency}{item.actual.toLocaleString()}
                    </span>
                    {diff !== 0 && (
                      <span
                        className={`block text-[10px] ${
                          diff > 0 ? 'text-amber-800' : 'text-emerald-800'
                        }`}
                      >
                        {diff > 0 ? `+${event.currency}${diff}` : `-${event.currency}${Math.abs(diff)}`}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item)}
                      title="Click to cycle status: Unpaid -> Deposit Paid -> Paid"
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-editorial cursor-pointer transition-colors border ${
                        item.status === 'paid'
                          ? 'bg-[#EBF3EB] text-[#2F6131] border-[#C8DEC7]'
                          : item.status === 'deposit_paid'
                          ? 'bg-[#F9F5EC] text-[#9A7D37] border-[#E8DCBF]'
                          : 'bg-[#F6F4F0] text-[#7E7467] border-[#E2DBD0]'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.status === 'paid'
                            ? 'bg-emerald-600'
                            : item.status === 'deposit_paid'
                            ? 'bg-amber-600'
                            : 'bg-stone-400'
                        }`}
                      />
                      <span className="capitalize">{item.status.replace('_', ' ')}</span>
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-[#5A5044] font-editorial">
                    {item.assignedTo || 'Unassigned'}
                  </td>

                  <td className="py-3.5 px-4 text-[#7A7062] font-sans max-w-xs truncate">
                    {item.notes || '—'}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1 text-[#AB9F90] hover:text-rose-800 transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove line item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredItems.length === 0 && (
          <div className="p-8 text-center text-xs font-editorial text-[#857B6D]">
            No ledger line items found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
};
