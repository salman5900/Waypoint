import React, { useState } from 'react';
import { 
  Plane, 
  Hotel, 
  Utensils, 
  Sparkles, 
  TrendingUp,
  Info
} from 'lucide-react';

export default function BudgetAllocationCard({
  budgetBreakdown,
  selectedFlight,
  selectedHotel,
  daysCount = 4
}) {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const currency = budgetBreakdown?.currency || 'USD';
  
  // Format currency
  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '$0';
    const symbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      INR: '₹',
      CAD: 'CA$',
      AUD: 'AU$',
    };
    const sym = symbols[currency] || `${currency} `;
    return `${sym}${Number(Math.round(val)).toLocaleString()}`;
  };

  // Recalculate dynamic budget in real time based on active flight and hotel selections
  const nightsCount = Math.max(1, daysCount - 1);
  const flightPrice = selectedFlight?.estimatedPrice ?? budgetBreakdown?.flights ?? 1150;
  const hotelTotalPrice = selectedHotel 
    ? selectedHotel.pricePerNight * nightsCount 
    : (budgetBreakdown?.accommodation ?? 1020);

  const foodAndDining = budgetBreakdown?.foodAndDining ?? 620;
  const activitiesAndTransit = budgetBreakdown?.activitiesAndLocalTransit ?? 400;

  const totalCalculated = flightPrice + hotelTotalPrice + foodAndDining + activitiesAndTransit;

  // Proportions
  const pFlights = Math.max(5, (flightPrice / totalCalculated) * 100);
  const pHotels = Math.max(5, (hotelTotalPrice / totalCalculated) * 100);
  const pFood = Math.max(5, (foodAndDining / totalCalculated) * 100);
  const pTransit = Math.max(5, 100 - (pFlights + pHotels + pFood));

  // SVG Donut Math
  const radius = 64;
  const circumference = 2 * Math.PI * radius; // ~402.12
  
  const lenFlights = (pFlights / 100) * circumference;
  const lenHotels = (pHotels / 100) * circumference;
  const lenFood = (pFood / 100) * circumference;
  const lenTransit = (pTransit / 100) * circumference;

  const offsetFlights = 0;
  const offsetHotels = lenFlights;
  const offsetFood = lenFlights + lenHotels;
  const offsetTransit = lenFlights + lenHotels + lenFood;

  const categories = [
    {
      id: 'flights',
      label: 'Flights',
      sublabel: selectedFlight?.airline || 'Airfare',
      amount: flightPrice,
      percent: Math.round(pFlights),
      color: '#2563EB',
      dotBg: 'bg-blue-600',
      iconBg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60',
      icon: <Plane className="w-3.5 h-3.5" />,
    },
    {
      id: 'hotels',
      label: 'Accommodations',
      sublabel: `${selectedHotel?.name || 'Hotel'} (${nightsCount}n)`,
      amount: hotelTotalPrice,
      percent: Math.round(pHotels),
      color: '#0284C7',
      dotBg: 'bg-sky-500',
      iconBg: 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/60',
      icon: <Hotel className="w-3.5 h-3.5" />,
    },
    {
      id: 'dining',
      label: 'Food & Dining',
      sublabel: 'Daily Meals & Cafes',
      amount: foodAndDining,
      percent: Math.round(pFood),
      color: '#059669',
      dotBg: 'bg-emerald-500',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60',
      icon: <Utensils className="w-3.5 h-3.5" />,
    },
    {
      id: 'transit',
      label: 'Activities & Transit',
      sublabel: 'Passes & Local Rail',
      amount: activitiesAndTransit,
      percent: Math.round(pTransit),
      color: '#D97706',
      dotBg: 'bg-amber-500',
      iconBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60',
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="w-full mb-10 sm:mb-12">
      {/* 2-Column Bento Budget Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* ======================================================= */}
        {/* LEFT CARD: Interactive SVG Donut Ring                   */}
        {/* ======================================================= */}
        <div className="lg:col-span-4 roadmap-glass-card p-6 sm:p-7 rounded-[32px] flex flex-col items-center justify-center text-center relative shadow-xs">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg 
              className="w-full h-full -rotate-90 transform" 
              viewBox="0 0 160 160"
            >
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="16"
                fill="transparent"
              />

              {/* Segment 1: Flights */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#2563EB"
                strokeWidth={hoveredCategory === 'flights' ? "20" : "16"}
                strokeDasharray={`${lenFlights} ${circumference}`}
                strokeDashoffset={-offsetFlights}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredCategory('flights')}
                onMouseLeave={() => setHoveredCategory(null)}
              />

              {/* Segment 2: Stays */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#0284C7"
                strokeWidth={hoveredCategory === 'hotels' ? "20" : "16"}
                strokeDasharray={`${lenHotels} ${circumference}`}
                strokeDashoffset={-offsetHotels}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredCategory('hotels')}
                onMouseLeave={() => setHoveredCategory(null)}
              />

              {/* Segment 3: Dining */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#059669"
                strokeWidth={hoveredCategory === 'dining' ? "20" : "16"}
                strokeDasharray={`${lenFood} ${circumference}`}
                strokeDashoffset={-offsetFood}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredCategory('dining')}
                onMouseLeave={() => setHoveredCategory(null)}
              />

              {/* Segment 4: Transit */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#D97706"
                strokeWidth={hoveredCategory === 'transit' ? "20" : "16"}
                strokeDasharray={`${lenTransit} ${circumference}`}
                strokeDashoffset={-offsetTransit}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredCategory('transit')}
                onMouseLeave={() => setHoveredCategory(null)}
              />
            </svg>

            {/* Centered Total Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight font-mono transition-all duration-300">
                {formatCurrency(totalCalculated)}
              </span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                EST. TOTAL
              </span>
            </div>
          </div>

          <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 mt-3 m-0">
            Hover ring segments or tiles to inspect shares
          </p>
        </div>

        {/* ======================================================= */}
        {/* RIGHT CARD: 2×2 Category Bento Grid + Status Pill       */}
        {/* ======================================================= */}
        <div className="lg:col-span-8 roadmap-glass-card p-6 sm:p-7 rounded-[32px] flex flex-col justify-between space-y-4 shadow-xs">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200/60 dark:border-white/10">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-50 tracking-tight">
                Live Budget Cockpit
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
                Synchronized with flight routes and accommodations selected below.
              </p>
            </div>

            {/* Live Sync Status Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-500/30 shadow-2xs self-start sm:self-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Sync • Recalculates on Selection</span>
            </div>
          </div>

          {/* 2×2 Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {categories.map((cat) => {
              const isHovered = hoveredCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  onMouseEnter={() => setHoveredCategory(cat.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`p-4 rounded-2xl bg-white/85 dark:bg-slate-900/80 border border-slate-200/70 dark:border-white/10 shadow-2xs transition-all duration-200 cursor-pointer ${
                    isHovered 
                      ? 'shadow-md scale-[1.01] bg-white dark:bg-slate-800 ring-1 ring-blue-500/20 border-blue-200 dark:border-blue-400/30' 
                      : 'hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${cat.iconBg} flex items-center justify-center`}>
                        {cat.icon}
                      </div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {cat.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${cat.dotBg}`} />
                      <span 
                        style={{ color: cat.color }} 
                        className="text-xs font-black font-mono"
                      >
                        {cat.percent}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-baseline justify-between">
                    <span className="text-lg font-black text-slate-900 dark:text-slate-50 tracking-tight font-mono">
                      {formatCurrency(cat.amount)}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 truncate max-w-[140px]">
                      {cat.sublabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
