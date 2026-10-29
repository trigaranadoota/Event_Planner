import React, { useState } from 'react';
import { BudgetItem } from '../types';

interface BudgetChartProps {
  items: BudgetItem[];
  totalBudget: number;
  currency: string;
  onSelectCategory?: (category: string | null) => void;
  selectedCategory?: string | null;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Venue & Facilities': '#8B7355',
  'Catering & Fine Wines': '#A38954',
  'Floral & Botanical Design': '#6A7B66',
  'Photography & Film': '#546A7B',
  'Music & Entertainment': '#7B6054',
  'Attire & Styling': '#9E8555',
  'Stationery & Calligraphy': '#B29E7D',
  'Contingency Reserve': '#78736A',
  'Other': '#A89F91',
};

export const BudgetChart: React.FC<BudgetChartProps> = ({
  items,
  totalBudget,
  currency,
  onSelectCategory,
  selectedCategory,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Group by category
  const categoryTotals: Record<string, { allocated: number; actual: number }> = {};
  items.forEach((item) => {
    const cat = item.category || 'Other';
    if (!categoryTotals[cat]) {
      categoryTotals[cat] = { allocated: 0, actual: 0 };
    }
    categoryTotals[cat].allocated += item.allocated;
    categoryTotals[cat].actual += item.actual;
  });

  const categories = Object.keys(categoryTotals);
  const totalAllocated = Object.values(categoryTotals).reduce((sum, c) => sum + c.allocated, 0);
  const totalActual = Object.values(categoryTotals).reduce((sum, c) => sum + c.actual, 0);

  // Calculate SVG donut slices
  let cumulativeAngle = 0;
  const radius = 75;
  const innerRadius = 52;
  const cx = 100;
  const cy = 100;

  const slices = categories.map((cat) => {
    const allocated = categoryTotals[cat].allocated;
    const fraction = totalAllocated > 0 ? allocated / totalAllocated : 1 / categories.length;
    const angle = fraction * 360;

    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle += angle;

    // Convert polar to Cartesian
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    const x3 = cx + innerRadius * Math.cos(endRad);
    const y3 = cy + innerRadius * Math.sin(endRad);
    const x4 = cx + innerRadius * Math.cos(startRad);
    const y4 = cy + innerRadius * Math.sin(startRad);

    const largeArc = angle > 180 ? 1 : 0;

    const pathData = `
      M ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
      Z
    `;

    return {
      category: cat,
      pathData,
      color: CATEGORY_COLORS[cat] || '#8B7355',
      fraction,
      allocated,
      actual: categoryTotals[cat].actual,
    };
  });

  const activeCategory = hoveredCategory || selectedCategory;
  const activeData = activeCategory ? categoryTotals[activeCategory] : null;

  return (
    <div className="paper-card p-6 rounded-none border border-[#E6DFD3] flex flex-col md:flex-row items-center gap-8">
      {/* Donut Chart SVG */}
      <div className="relative w-56 h-56 flex-shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-0 drop-shadow-sm">
          {slices.map((slice) => {
            const isHovered = hoveredCategory === slice.category;
            const isSelected = selectedCategory === slice.category;
            const isDimmed = activeCategory && activeCategory !== slice.category;

            return (
              <path
                key={slice.category}
                d={slice.pathData}
                fill={slice.color}
                className="cursor-pointer transition-all duration-300 ease-out"
                opacity={isDimmed ? 0.35 : 1}
                transform={isHovered || isSelected ? 'scale(1.03) translate(-3, -3)' : 'scale(1)'}
                transform-origin="100 100"
                stroke="#FAF8F5"
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredCategory(slice.category)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => {
                  if (onSelectCategory) {
                    onSelectCategory(selectedCategory === slice.category ? null : slice.category);
                  }
                }}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          <span className="text-[10px] uppercase tracking-widest text-[#7E7468] font-editorial">
            {activeCategory ? activeCategory.split(' ')[0] : 'Total Allocated'}
          </span>
          <span className="font-heading text-lg font-normal text-[#24211E]">
            {currency}
            {activeData
              ? activeData.allocated.toLocaleString()
              : totalAllocated.toLocaleString()}
          </span>
          <span className="text-[10px] text-[#8C8274] font-script">
            {activeCategory
              ? `${Math.round(((activeData?.allocated || 0) / (totalAllocated || 1)) * 100)}% of ledger`
              : `of ${currency}${totalBudget.toLocaleString()}`}
          </span>
        </div>
      </div>

      {/* Legend & Details */}
      <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
        {slices.map((slice) => {
          const isSelected = selectedCategory === slice.category;
          const isHovered = hoveredCategory === slice.category;
          return (
            <button
              key={slice.category}
              type="button"
              onClick={() => {
                if (onSelectCategory) {
                  onSelectCategory(selectedCategory === slice.category ? null : slice.category);
                }
              }}
              onMouseEnter={() => setHoveredCategory(slice.category)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`text-left p-2.5 transition-all duration-200 border text-xs flex items-center justify-between ${
                isSelected
                  ? 'bg-[#F4EEE4] border-[#BFA882] shadow-xs'
                  : isHovered
                  ? 'bg-[#FAF7F1] border-[#DFD5C6]'
                  : 'bg-transparent border-transparent hover:border-[#EAE2D5]'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="truncate text-[#38332C] font-editorial tracking-wide">
                  {slice.category}
                </span>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="font-medium text-[#201D1A]">
                  {currency}{slice.allocated.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#867B6E] ml-1">
                  ({Math.round(slice.fraction * 100)}%)
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
