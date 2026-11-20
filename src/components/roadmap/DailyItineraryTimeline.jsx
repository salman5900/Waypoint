import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  ExternalLink, 
  Utensils, 
  Sparkles, 
  ShoppingBag, 
  Train, 
  Camera, 
  ChevronDown, 
  ChevronUp, 
  CheckSquare, 
  CheckCircle2, 
  Check, 
  Compass
} from 'lucide-react';
import { 
  resolveRestaurantPhoto, 
  resolveRestaurantFallback,
  resolveActivityPhoto,
  resolveActivityFallback
} from '../../utils/travelPhotos';

export default function DailyItineraryTimeline({
  days = [],
  currency = 'USD',
  selectedFlight,
  selectedHotel,
  checklist: propChecklist,
  onToggleChecklistItem: propToggleChecklistItem
}) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [expandedItems, setExpandedItems] = useState({ '1-0': true, '1-1': true });
  
  // Checklist state stored in localStorage if not supplied by parent
  const checklistStorageKey = 'waypoint_manual_booking_checklist_v1';
  const defaultChecklist = [
    { id: 'flight', text: `Book Flight (${selectedFlight?.airline || 'Selected Route'})`, checked: false },
    { id: 'hotel', text: `Reserve Stay (${selectedHotel?.name || 'Selected Property'})`, checked: false },
    { id: 'maps', text: 'Download Offline Maps & Metro Guides', checked: true },
    { id: 'esim', text: 'Order e-SIM or Mobile Pocket Wi-Fi', checked: false },
    { id: 'passes', text: `Reserve ${itinerary?.destination?.split(',')?.[0]?.trim() || 'Destination'} Sightseeing & Entry Passes`, checked: false },
  ];

  const [internalChecklist, setInternalChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem(checklistStorageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return defaultChecklist;
  });

  // Keep flight/hotel names and destination fresh in checklist if not checked
  useEffect(() => {
    if (propChecklist) return;
    const destName = itinerary?.destination?.split(',')?.[0]?.trim();
    setInternalChecklist((prev) => 
      prev.map((item) => {
        if (item.id === 'flight' && !item.checked && selectedFlight) {
          return { ...item, text: `Book Flight (${selectedFlight.airline} • ${selectedFlight.route})` };
        }
        if (item.id === 'hotel' && !item.checked && selectedHotel) {
          return { ...item, text: `Reserve Stay (${selectedHotel.name})` };
        }
        if (item.id === 'passes' && !item.checked && destName) {
          return { ...item, text: `Reserve ${destName} Sightseeing & Entry Passes` };
        }
        return item;
      })
    );
  }, [selectedFlight, selectedHotel, propChecklist, itinerary?.destination]);

  // Persist checklist
  const internalToggleChecklistItem = (id) => {
    setInternalChecklist((prev) => {
      const updated = prev.map((item) => 
        item.id === id ? { ...item, checked: !item.checked } : item
      );
      try {
        localStorage.setItem(checklistStorageKey, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const checklist = propChecklist || internalChecklist;
  const toggleChecklistItem = propToggleChecklistItem || internalToggleChecklistItem;

  const toggleExpand = (key) => {
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

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
    return `${sym}${Number(val).toLocaleString()}`;
  };

  // Category mapping
  const getCategoryMeta = (cat) => {
    switch (cat) {
      case 'sightseeing':
        return {
          label: 'Sightseeing',
          icon: <Camera className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />,
          bg: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200/80 dark:border-sky-800/60',
        };
      case 'transit':
        return {
          label: 'Transit',
          icon: <Train className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />,
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10',
        };
      case 'shopping':
        return {
          label: 'Shopping',
          icon: <ShoppingBag className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
          bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60',
        };
      case 'experience':
      default:
        return {
          label: 'Experience',
          icon: <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />,
          bg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800/60',
        };
    }
  };

  // Active days to display
  const activeDayPlan = days.find((d) => d.day === selectedDay) || days[0];
  const displayedDays = selectedDay === 'all' ? days : (activeDayPlan ? [activeDayPlan] : []);

  // Checklist completion stats
  const completedCount = checklist.filter((c) => c.checked).length;
  const checklistPercent = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="w-full space-y-6">
      
      {/* ========================================================= */}
      {/* STICKY DAY SELECTOR PILL BAR                              */}
      {/* ========================================================= */}
      <div className="sticky top-[80px] z-30 py-3 -mx-4 px-4 sm:mx-0 sm:px-0 backdrop-blur-xl bg-white/75 dark:bg-slate-900/80 border-y sm:border sm:rounded-full border-slate-200/80 dark:border-white/10 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 pl-2 sm:pl-4">
          <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-black text-slate-900 dark:text-slate-50 tracking-tight">
            Schedule View:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pr-2 sm:pr-4">
          <button
            type="button"
            onClick={() => setSelectedDay('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
              selectedDay === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/80 dark:hover:bg-slate-800'
            }`}
          >
            All Days
          </button>

          {days.map((d) => (
            <button
              key={d.day}
              type="button"
              onClick={() => setSelectedDay(d.day)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
                selectedDay === d.day
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/80 dark:hover:bg-slate-800'
              }`}
            >
              Day {d.day}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2-COLUMN ASYMMETRIC SPLIT LAYOUT (65% Left / 35% Right)   */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --------------------------------------------------------- */}
        {/* LEFT COLUMN (65% / 8 Cols): Interactive Timeline          */}
        {/* --------------------------------------------------------- */}
        <div className="lg:col-span-8 space-y-8">
          {displayedDays.map((dayPlan) => (
            <div 
              key={dayPlan.day}
              className="roadmap-glass-card p-6 sm:p-8 rounded-[32px] space-y-6"
            >
              {/* Editorial Chapter Header (Clean Horizontal Layout) */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-slate-200/60 dark:border-white/10 pb-4">
                <div className="space-y-1">
                  <span className="font-black text-xs text-blue-600 dark:text-blue-400 uppercase tracking-widest block font-mono">
                    CHAPTER {String(dayPlan.day).padStart(2, '0')}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight leading-snug">
                    {dayPlan.theme}
                  </h3>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 shrink-0 self-start sm:self-auto">
                  {dayPlan.activities?.length || 0} Stops
                </span>
              </div>

              {/* Activity Cards (Zero Vertical Line Rail - Dedicated Time & Stop Column) */}
              <div className="space-y-4">
                {dayPlan.activities?.map((act, actIdx) => {
                  const key = `${dayPlan.day}-${actIdx}`;
                  const isExpanded = !!expandedItems[key];
                  const meta = getCategoryMeta(act.category);

                  return (
                    <div
                      key={actIdx}
                      onClick={() => toggleExpand(key)}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-stretch sm:items-start gap-4 ${
                        isExpanded
                          ? 'bg-white dark:bg-slate-900 border-blue-200/90 dark:border-blue-500/30 shadow-sm'
                          : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-2xs'
                      }`}
                    >
                      {/* Dedicated Left Gutter: Watermark Index + Tabular Time */}
                      <div className="sm:w-28 shrink-0 flex sm:flex-col justify-between sm:justify-start items-center sm:items-start pr-0 sm:pr-4 sm:border-r border-slate-100 dark:border-white/10 pb-2 sm:pb-0 border-b sm:border-b-0 border-slate-100/80 dark:border-white/10">
                        <span className="text-2xl font-black text-slate-300 dark:text-slate-600 font-mono tracking-tighter leading-none select-none">
                          {String(actIdx + 1).padStart(2, '0')}
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono mt-1.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                          <span>{act.time}</span>
                        </span>
                      </div>

                      {/* Main Body */}
                      <div className="flex-1 space-y-2">
                        {/* Top Meta Row: Category + Cost + Chevron */}
                        <div className="flex items-center justify-between gap-2">
                          <div className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${meta.bg}`}>
                            {meta.icon}
                            <span>{meta.label}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-800 dark:text-slate-200 font-mono">
                              {act.estimatedCost > 0 ? formatCurrency(act.estimatedCost) : 'Free'}
                            </span>
                            <div className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </div>
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="text-base font-black text-slate-900 dark:text-slate-50 tracking-tight leading-snug">
                          {act.title}
                        </h4>

                        {/* Collapsible Details */}
                        {isExpanded && (
                          <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-3 animate-fadeIn">
                            <div className="flex flex-col sm:flex-row gap-3.5 items-start">
                              <div className="w-full sm:w-28 sm:h-24 h-36 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-white/10 bg-slate-900 relative">
                                <img
                                  src={resolveActivityPhoto(act, dayPlan.theme)}
                                  alt={act.title}
                                  onError={(e) => {
                                    e.currentTarget.src = resolveActivityFallback(act, dayPlan.theme);
                                  }}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed m-0 font-normal flex-1">
                                {act.description}
                              </p>
                            </div>

                            {act.mapOrBookingUrl && (
                              <div className="flex justify-end pt-1">
                                <a
                                  href={act.mapOrBookingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                >
                                  <span>View Map & Tickets</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* --------------------------------------------------------- */}
        {/* RIGHT COLUMN (35% / 4 Cols): Dining & Checklist           */}
        {/* --------------------------------------------------------- */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-[140px]">
          
          {/* 1. Curated Dining Card for Selected Day */}
          <div className="roadmap-glass-card p-6 rounded-[28px] space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200/60 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Utensils className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-50 tracking-tight">
                  Curated Dining
                </h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-500/30">
                Day {activeDayPlan?.day || 1}
              </span>
            </div>

            <div className="space-y-3">
              {activeDayPlan?.restaurantPicks?.map((rest, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white/85 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 shadow-xs hover:border-emerald-200 dark:hover:border-emerald-500/40 transition-all flex items-start gap-3.5 group"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-white/10 bg-slate-900 relative">
                    <img
                      src={resolveRestaurantPhoto(rest)}
                      alt={rest.name}
                      onError={(e) => {
                        e.currentTarget.src = resolveRestaurantFallback(rest);
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-1.5">
                      <h4 className="font-black text-slate-900 dark:text-slate-50 text-sm truncate">{rest.name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                        {rest.priceRange}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 m-0 truncate">
                      {rest.cuisine}
                    </p>

                    <div className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Must Try: </span>
                      <span>{rest.signatureDish}</span>
                    </div>

                    {rest.mapUrl && (
                      <div className="pt-1.5 border-t border-slate-100 dark:border-white/10 flex justify-end">
                        <a
                          href={rest.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>Google Maps</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Interactive Manual Booking Checklist */}
          <div className="roadmap-glass-card p-6 rounded-[28px] space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/15 border border-blue-200/60 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <CheckSquare className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-50 tracking-tight">
                  Booking Checklist
                </h3>
              </div>
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono">
                {checklistPercent}% Done
              </span>
            </div>

            {/* Live Progress Bar */}
            <div className="space-y-1">
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200/60 dark:border-white/10">
                <div 
                  style={{ width: `${checklistPercent}%` }}
                  className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                />
              </div>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 text-right m-0">
                {completedCount} of {checklist.length} logistics secured
              </p>
            </div>

            {/* Checklist Items */}
            <div className="space-y-2 pt-1">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold cursor-pointer transition-all ${
                    item.checked
                      ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200/70 dark:border-blue-500/30 text-slate-500 dark:text-slate-500 line-through'
                      : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                    item.checked
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                  }`}>
                    {item.checked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="flex-1 select-none">{item.text}</span>
                </div>
              ))}
            </div>

            {checklistPercent === 100 && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>All trip logistics secured! You're ready to fly.</span>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
