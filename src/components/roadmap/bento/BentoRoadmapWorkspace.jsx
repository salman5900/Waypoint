import React, { useState } from 'react';
import { 
  Compass, 
  Plane, 
  Hotel, 
  Utensils, 
  Clock, 
  MapPin, 
  ExternalLink, 
  Calendar, 
  Sparkles, 
  ShoppingBag, 
  Train, 
  Camera, 
  Check, 
  ArrowRight, 
  ChevronRight,
  ChevronLeft,
  Mail, 
  CheckSquare, 
  CheckCircle2, 
  Layers, 
  Maximize2, 
  RotateCw, 
  Send, 
  Loader2,
  X,
  Plus
} from 'lucide-react';
import { message } from 'antd';
import BentoDetailModal from './BentoDetailModal';
import { emailRoadmap } from '../../../services/tripApi';

export default function BentoRoadmapWorkspace({
  itinerary,
  selectedFlightIndex = 0,
  onSelectFlight,
  selectedHotelIndex = 0,
  onSelectHotel,
  onPlanTrip,
  checklist = [],
  onToggleChecklistItem,
  currency = 'USD'
}) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [activeModal, setActiveModal] = useState(null); // 'budget' | 'dining' | 'tickets' | 'checklist' | 'schedule' | null
  const [activeActivityIndex, setActiveActivityIndex] = useState(0);
  const [flippedModalCards, setFlippedModalCards] = useState({});
  const [newChecklistText, setNewChecklistText] = useState('');
  
  // Email states
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

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

  const daysCount = itinerary?.days?.length || 4;
  const nightsCount = Math.max(1, daysCount - 1);
  const selectedFlight = itinerary?.flightOptions?.[selectedFlightIndex];
  const selectedHotel = itinerary?.hotelRecommendations?.[selectedHotelIndex];

  // Recalculate dynamic budget
  const flightPrice = selectedFlight?.estimatedPrice ?? itinerary?.budgetBreakdown?.flights ?? 1150;
  const hotelTotalPrice = selectedHotel 
    ? selectedHotel.pricePerNight * nightsCount 
    : (itinerary?.budgetBreakdown?.accommodation ?? 1020);
  const foodAndDining = itinerary?.budgetBreakdown?.foodAndDining ?? 620;
  const activitiesAndTransit = itinerary?.budgetBreakdown?.activitiesAndLocalTransit ?? 400;
  const totalCalculated = flightPrice + hotelTotalPrice + foodAndDining + activitiesAndTransit;

  // Proportions
  const pFlights = Math.max(5, (flightPrice / totalCalculated) * 100);
  const pHotels = Math.max(5, (hotelTotalPrice / totalCalculated) * 100);
  const pFood = Math.max(5, (foodAndDining / totalCalculated) * 100);
  const pTransit = Math.max(5, 100 - (pFlights + pHotels + pFood));

  // Category mapping
  const getCategoryMeta = (cat) => {
    switch (cat) {
      case 'sightseeing':
        return { label: 'Sightseeing', icon: <Camera className="w-3.5 h-3.5 text-sky-600" />, bg: 'bg-sky-50 text-sky-700 border-sky-200/80' };
      case 'transit':
        return { label: 'Transit', icon: <Train className="w-3.5 h-3.5 text-slate-600" />, bg: 'bg-slate-100 text-slate-700 border-slate-200' };
      case 'shopping':
        return { label: 'Shopping', icon: <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />, bg: 'bg-amber-50 text-amber-700 border-amber-200/80' };
      case 'experience':
      default:
        return { label: 'Experience', icon: <Sparkles className="w-3.5 h-3.5 text-indigo-600" />, bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80' };
    }
  };

  // Active day details
  const activeDayPlan = itinerary?.days?.find((d) => d.day === selectedDay) || itinerary?.days?.[0];
  const dayActivities = activeDayPlan?.activities || [];
  const currentActivity = dayActivities[activeActivityIndex] || dayActivities[0];
  const nextActivity = dayActivities[(activeActivityIndex + 1) % (dayActivities.length || 1)];

  // Checklist counts
  const completedChecklistCount = checklist.filter((c) => c.checked).length;
  const nextUncheckedTask = checklist.find((c) => !c.checked)?.text || 'All booking items secured!';

  // Top restaurant for active day
  const topRestaurant = activeDayPlan?.restaurantPicks?.[0];

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      message.warning('Please enter a valid email address.');
      return;
    }

    setIsSending(true);
    try {
      const res = await emailRoadmap('tokyo-bento-roadmap', email);
      setIsSending(false);
      message.success(res.message);
      setShowEmailInput(false);
      setEmail('');
    } catch (err) {
      setIsSending(false);
      message.error('Failed to send email.');
    }
  };

  const toggleModalCardFlip = (key) => {
    setFlippedModalCards((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto h-full lg:h-[calc(100vh-92px)] lg:max-h-[860px] flex flex-col justify-center select-none overflow-hidden">
      
      {/* ========================================================= */}
      {/* 4-COLUMN × 3-ROW ASYMMETRICAL BENTO GRID WORKSPACE        */}
      {/* Locked 100% to single desktop viewport with ZERO scroll   */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.15fr)] gap-3.5 h-full w-full">
        
        {/* ------------------------------------------------------- */}
        {/* TILE 4: MIDDLE-LEFT TALL TILE (Stacked Tickets Deck)     */}
        {/* Grid: Col 1, Rows 1-2 (1 Col × 2 Rows Tall)             */}
        {/* Elevated with subtle ambient sky-indigo gradient & notches */}
        {/* ------------------------------------------------------- */}
        <div 
          onClick={() => setActiveModal('tickets')}
          className="bento-tile col-span-1 lg:col-start-1 lg:col-span-1 lg:row-start-1 lg:row-span-2 p-4 sm:p-5 rounded-[28px] flex flex-col justify-between group cursor-pointer relative overflow-hidden bg-gradient-to-br from-white via-sky-50/60 to-indigo-50/50 h-full"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.14),transparent_65%)] pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow-xs">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Ticket Deck
                </span>
              </div>
              <Maximize2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <p className="text-[11px] text-slate-500 m-0">
              Stacked physical passes for flight & hotel routing.
            </p>
          </div>

          {/* Physical Stacked & Tilted Boarding Passes Preview */}
          <div className="relative z-10 my-auto py-3 w-full flex items-center justify-center min-h-[210px]">
            {/* Card 3 (Hotel Peek - Tilted Right) */}
            <div className="absolute inset-x-2 top-2 h-36 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-sky-50/80 to-white border border-indigo-200/70 shadow-sm transform rotate-[3.5deg] -translate-y-2 group-hover:rotate-[5.5deg] group-hover:-translate-y-3 transition-transform duration-300 flex flex-col justify-between p-3.5">
              <div className="flex items-center justify-between text-[10px] text-indigo-700 font-bold">
                <div className="flex items-center gap-1 truncate max-w-[140px]">
                  <Hotel className="w-3 h-3 text-indigo-600 shrink-0" />
                  <span className="truncate">{selectedHotel?.name || 'TRUNK Hotel'}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-[9px] font-black">{selectedHotel?.rating || '4.9 ★'}</span>
              </div>
              <div className="flex items-baseline justify-between pt-2 border-t border-dashed border-indigo-200/80">
                <span className="text-[10px] text-slate-500 font-medium">Selected Stay</span>
                <span className="text-xs font-black text-indigo-900 font-mono">
                  {formatCurrency(selectedHotel?.pricePerNight)} <span className="text-[9px] font-normal text-slate-400">/nt</span>
                </span>
              </div>
            </div>

            {/* Card 2 (Flight 2 Peek - Tilted Left) */}
            <div className="absolute inset-x-1.5 top-5 h-36 rounded-2xl bg-gradient-to-br from-slate-50 via-sky-50/50 to-white border border-slate-200 shadow-sm transform -rotate-[3deg] -translate-y-1 group-hover:-rotate-[5deg] group-hover:-translate-y-2 transition-transform duration-300 p-3" />

            {/* Card 1 (Top Active Boarding Pass - Upright with Semicircular Ticket Notches) */}
            <div className="relative w-full rounded-2xl bg-white border border-blue-300/90 ring-1 ring-blue-500/20 shadow-[0_12px_28px_-8px_rgba(37,99,235,0.16)] p-3.5 flex flex-col justify-between z-10 group-hover:shadow-[0_16px_32px_-8px_rgba(37,99,235,0.22)] transition-shadow">
              
              {/* Top Pass Row: Airline & Code */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Plane className="w-3 h-3 text-blue-600" />
                  <span className="text-[11px] font-black text-slate-900 uppercase tracking-wide">
                    {selectedFlight?.airline || 'ALL NIPPON AIRWAYS'}
                  </span>
                </div>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                  {selectedFlight?.stops || 'Nonstop'}
                </span>
              </div>

              {/* Airport Route Codes & Plane */}
              <div className="flex items-center justify-between font-mono py-2">
                <div className="text-left">
                  <span className="text-xl font-black text-slate-900 block leading-none">
                    {selectedFlight?.route?.split('→')?.[0]?.trim() || 'SFO'}
                  </span>
                  <span className="text-[9px] text-slate-400 font-sans">Origin</span>
                </div>

                <div className="flex-1 flex flex-col items-center px-2">
                  <div className="w-full flex items-center justify-center relative">
                    <div className="w-full border-t border-slate-200" />
                    <Plane className="w-3.5 h-3.5 text-blue-600 rotate-90 absolute bg-white px-0.5" />
                  </div>
                  <span className="text-[9px] text-slate-400 font-sans mt-1">{selectedFlight?.duration || '10h 45m'}</span>
                </div>

                <div className="text-right">
                  <span className="text-xl font-black text-slate-900 block leading-none">
                    {selectedFlight?.route?.split('→')?.[1]?.trim() || 'HND'}
                  </span>
                  <span className="text-[9px] text-slate-400 font-sans">Tokyo</span>
                </div>
              </div>

              {/* Perforated Seam with Authentic Semicircular Ticket Notches */}
              <div className="relative my-1">
                <div className="border-t border-dashed border-slate-200/90 w-full" />
                {/* Left semicircular notch */}
                <div className="absolute -left-[20px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-sky-50/90 border border-blue-200/70 shadow-inner z-20" />
                {/* Right semicircular notch */}
                <div className="absolute -right-[20px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-sky-50/90 border border-blue-200/70 shadow-inner z-20" />
              </div>

              {/* Bottom Pass Row: Price & Active Badge */}
              <div className="flex items-center justify-between pt-1 text-[11px]">
                <div>
                  <span className="text-[9px] text-slate-400 block leading-none">Selected Fare</span>
                  <span className="font-black text-slate-900 font-mono text-xs">
                    {formatCurrency(flightPrice)}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  <span>Active Pass</span>
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-blue-600">
            <span>Tap to Fan & Flip Tickets</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* ------------------------------------------------------- */}
        {/* TILE 1: CENTER ANCHOR TILE (The Hero Focal Point)        */}
        {/* Grid: Cols 2-3, Rows 1-2 (2 Cols Wide × 2 Rows Tall)     */}
        {/* ------------------------------------------------------- */}
        <div className="bento-tile col-span-1 md:col-span-2 lg:col-start-2 lg:col-span-2 lg:row-start-1 lg:row-span-2 rounded-[32px] overflow-hidden relative group h-full flex flex-col justify-between p-5 sm:p-6 bg-slate-900">
          
          {/* Full-Bleed Destination Photography */}
          <img
            src={itinerary?.heroImage || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85'}
            alt="Destination Focus"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.82] group-hover:scale-105 transition-transform duration-1000"
          />

          {/* Vignette Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.35) 0%, rgba(15, 23, 42, 0.45) 40%, rgba(15, 23, 42, 0.88) 100%)',
            }}
          />

          {/* Top Bar: Eyebrow + Action Buttons */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/90 backdrop-blur-md text-slate-900 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{daysCount} Days • Tokyo Centerpiece</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowEmailInput(!showEmailInput)}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/85 backdrop-blur-md text-slate-900 hover:bg-white active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Mail className="w-3 h-3 text-blue-600" />
                <span>Email</span>
              </button>

              <button
                type="button"
                onClick={onPlanTrip}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/30"
              >
                <span>Edit</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Inline Email Input Trigger when toggled */}
          {showEmailInput && (
            <form 
              onSubmit={handleSendEmail}
              className="relative z-20 my-2 flex items-center gap-1.5 bg-white/95 p-1.5 rounded-full border border-blue-200 shadow-lg backdrop-blur-xl animate-fadeIn max-w-sm"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoFocus
                className="flex-1 px-3 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                disabled={isSending}
                className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold transition-all disabled:opacity-50"
              >
                {isSending ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Send'}
              </button>
              <button
                type="button"
                onClick={() => setShowEmailInput(false)}
                className="p-1 text-slate-400 hover:text-slate-600 mr-1"
              >
                <X className="w-3 h-3" />
              </button>
            </form>
          )}

          {/* Bottom Content: Title & Day Filter Pill Strip */}
          <div className="relative z-10 space-y-2 sm:space-y-3">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-sm">
                {itinerary?.tripTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 max-w-lg mt-1 font-normal drop-shadow-xs">
                {itinerary?.summary}
              </p>
            </div>

            {/* Quick Day Filter Pill Strip Inside Hero */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {itinerary?.days?.map((d) => (
                <button
                  key={d.day}
                  type="button"
                  onClick={() => {
                    setSelectedDay(d.day);
                    setActiveActivityIndex(0);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                    selectedDay === d.day
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white/75 backdrop-blur-md text-slate-800 hover:bg-white'
                  }`}
                >
                  Day {d.day}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* ------------------------------------------------------- */}
        {/* TILE 3: TOP-RIGHT TILE (Curated Dining Spotlight)        */}
        {/* Grid: Col 4, Row 1 (1 Col × 1 Row)                      */}
        {/* ------------------------------------------------------- */}
        <div 
          onClick={() => setActiveModal('dining')}
          className="bento-tile col-span-1 lg:col-start-4 lg:col-span-1 lg:row-start-1 lg:row-span-1 p-4 sm:p-5 rounded-[28px] flex flex-col justify-between group cursor-pointer relative overflow-hidden h-full"
        >
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                <Utensils className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                Dining Spotlight
              </span>
            </div>
            <Maximize2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>

          <div className="my-1.5 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-slate-900 text-sm truncate">
                {topRestaurant?.name || 'Afuri Harajuku'}
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                {topRestaurant?.priceRange || '$$'}
              </span>
            </div>

            <p className="text-xs font-bold text-emerald-600 m-0 truncate">
              {topRestaurant?.cuisine || 'Craft Yuzu Shio Ramen'}
            </p>

            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed m-0 pt-0.5">
              {topRestaurant?.signatureDish || 'Signature Yuzu Shio Broth with Charred Chashu'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-700">
            <span>Explore All {itinerary?.days?.reduce((acc, d) => acc + (d.restaurantPicks?.length || 0), 0) || 8} Dining Spots</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* ------------------------------------------------------- */}
        {/* TILE 5: MIDDLE-RIGHT TILE (Booking Checklist To-Do)      */}
        {/* Grid: Col 4, Row 2 (1 Col × 1 Row)                      */}
        {/* ------------------------------------------------------- */}
        <div 
          onClick={() => setActiveModal('checklist')}
          className="bento-tile col-span-1 lg:col-start-4 lg:col-span-1 lg:row-start-2 lg:row-span-1 p-4 sm:p-5 rounded-[28px] flex flex-col justify-between group cursor-pointer relative overflow-hidden h-full"
        >
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200/60">
                <CheckSquare className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                Booking To-Do
              </span>
            </div>
            <span className="text-xs font-black font-mono text-blue-600">
              {completedChecklistCount}/{checklist.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="my-1.5 space-y-1.5">
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200/60">
              <div 
                style={{ width: `${Math.round((completedChecklistCount / checklist.length) * 100)}%` }}
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Next Immediate Task:
              </span>
              <p className="text-xs font-bold text-slate-800 truncate m-0 mt-0.5">
                {nextUncheckedTask}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-blue-600">
            <span>Open Interactive Checklist</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* ------------------------------------------------------- */}
        {/* TILE 2: BOTTOM-LEFT WIDE TILE (Live Budget Cockpit)      */}
        {/* Grid: Cols 1-2, Row 3 (2 Cols Wide × 1 Row Tall)        */}
        {/* Compact single-viewport fit without bottom clipping      */}
        {/* ------------------------------------------------------- */}
        <div 
          onClick={() => setActiveModal('budget')}
          className="bento-tile col-span-1 md:col-span-2 lg:col-start-1 lg:col-span-2 lg:row-start-3 lg:row-span-1 p-4 sm:p-5 rounded-[28px] flex flex-col justify-between group cursor-pointer h-full"
        >
          {/* Top Row: Mini Donut, Live Total & Indicator */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Mini SVG Donut Ring */}
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" className="stroke-slate-100" strokeWidth="12" fill="transparent" />
                  <circle cx="50" cy="50" r="38" stroke="#2563EB" strokeWidth="12" strokeDasharray={`${(pFlights / 100) * 238.76} 238.76`} fill="transparent" />
                  <circle cx="50" cy="50" r="38" stroke="#0284C7" strokeWidth="12" strokeDasharray={`${(pHotels / 100) * 238.76} 238.76`} strokeDashoffset={-((pFlights / 100) * 238.76)} fill="transparent" />
                  <circle cx="50" cy="50" r="38" stroke="#059669" strokeWidth="12" strokeDasharray={`${(pFood / 100) * 238.76} 238.76`} strokeDashoffset={-(((pFlights + pHotels) / 100) * 238.76)} fill="transparent" />
                  <circle cx="50" cy="50" r="38" stroke="#D97706" strokeWidth="12" strokeDasharray={`${(pTransit / 100) * 238.76} 238.76`} strokeDashoffset={-(((pFlights + pHotels + pFood) / 100) * 238.76)} fill="transparent" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">TOTAL</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight leading-none">
                    {formatCurrency(totalCalculated)}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live synchronized" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 m-0">
                  Live calculated spend • {formatCurrency(totalCalculated / daysCount)} / day
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
              <span>Itemized Breakdown</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Bottom Row: 4 Category Quick Chips in Crisp Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100/80">
            <div className="px-2.5 py-1.5 rounded-xl bg-blue-50/70 border border-blue-200/60 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-blue-700 font-bold block uppercase tracking-wider">Flights</span>
                <span className="text-xs font-black text-slate-900 font-mono">{formatCurrency(flightPrice)}</span>
              </div>
              <span className="text-[9px] font-bold text-blue-600 font-mono bg-white px-1.5 py-0.5 rounded">
                {Math.round(pFlights)}%
              </span>
            </div>

            <div className="px-2.5 py-1.5 rounded-xl bg-sky-50/70 border border-sky-200/60 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-sky-700 font-bold block uppercase tracking-wider">Stays</span>
                <span className="text-xs font-black text-slate-900 font-mono">{formatCurrency(hotelTotalPrice)}</span>
              </div>
              <span className="text-[9px] font-bold text-sky-600 font-mono bg-white px-1.5 py-0.5 rounded">
                {Math.round(pHotels)}%
              </span>
            </div>

            <div className="px-2.5 py-1.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-emerald-700 font-bold block uppercase tracking-wider">Dining</span>
                <span className="text-xs font-black text-slate-900 font-mono">{formatCurrency(foodAndDining)}</span>
              </div>
              <span className="text-[9px] font-bold text-emerald-600 font-mono bg-white px-1.5 py-0.5 rounded">
                {Math.round(pFood)}%
              </span>
            </div>

            <div className="px-2.5 py-1.5 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-amber-700 font-bold block uppercase tracking-wider">Activities</span>
                <span className="text-xs font-black text-slate-900 font-mono">{formatCurrency(activitiesAndTransit)}</span>
              </div>
              <span className="text-[9px] font-bold text-amber-600 font-mono bg-white px-1.5 py-0.5 rounded">
                {Math.round(pTransit)}%
              </span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------- */}
        {/* TILE 6: BOTTOM-RIGHT WIDE TILE (Places & Schedule Carousel) */}
        {/* Grid: Cols 3-4, Row 3 (2 Cols Wide × 1 Row Tall)        */}
        {/* Refined with 78% Active Place Card + 22% Tilted Peeking */}
        {/* ------------------------------------------------------- */}
        <div className="bento-tile col-span-1 md:col-span-2 lg:col-start-3 lg:col-span-2 lg:row-start-3 lg:row-span-1 p-4 sm:p-5 rounded-[28px] flex flex-col justify-between relative overflow-hidden group h-full">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100/80">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-200/60">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                Day {selectedDay} Schedule
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                • {dayActivities.length} Stops
              </span>
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveActivityIndex((prev) => (prev > 0 ? prev - 1 : dayActivities.length - 1))}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 active:scale-95 transition-all cursor-pointer"
                title="Previous Stop"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveActivityIndex((prev) => (prev + 1) % dayActivities.length)}
                className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer shadow-xs shadow-blue-600/30"
                title="Next Stop"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('schedule')}
                className="ml-1 text-[11px] font-bold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer"
                title="View Full Day Timeline"
              >
                <span>Deck</span>
                <Maximize2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Interactive Peeking Card Container */}
          <div className="my-1.5 flex items-stretch gap-3 relative overflow-hidden flex-1 min-h-0">
            
            {/* Active Place Card (Left 78%) */}
            <div className={`w-[78%] p-3.5 sm:p-4 rounded-2xl flex flex-col justify-between shadow-xs transition-all relative overflow-hidden ${
              currentActivity?.category === 'sightseeing'
                ? 'bg-gradient-to-br from-emerald-50/80 via-white to-slate-50/40 border border-emerald-200/80'
                : currentActivity?.category === 'food'
                ? 'bg-gradient-to-br from-amber-50/80 via-white to-slate-50/40 border border-amber-200/80'
                : currentActivity?.category === 'experience'
                ? 'bg-gradient-to-br from-blue-50/80 via-white to-slate-50/40 border border-blue-200/80'
                : 'bg-gradient-to-br from-slate-50/80 via-white to-slate-50/40 border border-slate-200/80'
            }`}>
              {/* Badges Row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-white/90 border border-slate-200/80 text-slate-700 shadow-xs">
                    STOP 0{activeActivityIndex + 1} / 0{dayActivities.length}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-blue-50/90 text-blue-700 border border-blue-200/60 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{currentActivity?.time || '10:30 AM'}</span>
                  </span>
                </div>

                <span className="px-2 py-0.5 rounded-md text-[10px] font-black font-mono bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  {currentActivity?.estimatedCost > 0 ? formatCurrency(currentActivity?.estimatedCost) : 'Free'}
                </span>
              </div>

              {/* Title & 1-line Highlight */}
              <div className="py-1">
                <h4 className="text-sm font-black text-slate-900 tracking-tight leading-snug truncate m-0">
                  {currentActivity?.title}
                </h4>
                <p className="text-[11px] text-slate-500 truncate leading-relaxed m-0 mt-0.5">
                  {currentActivity?.description}
                </p>
              </div>

              {/* Action Row */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 truncate max-w-[130px]">
                  <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                  <span className="truncate">{currentActivity?.location || 'Tokyo Destination'}</span>
                </span>

                {currentActivity?.mapOrBookingUrl ? (
                  <a
                    href={currentActivity.mapOrBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-blue-600 hover:text-blue-800 border border-blue-200/80 shadow-xs cursor-pointer transition-colors"
                  >
                    <span>Map & Tickets</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveModal('schedule')}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-700 hover:text-blue-600 border border-slate-200 shadow-xs cursor-pointer transition-colors"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Tilted Peeking Next Card (Right 22%) */}
            {nextActivity && (
              <div 
                onClick={() => setActiveActivityIndex((prev) => (prev + 1) % dayActivities.length)}
                className="w-[22%] p-2.5 rounded-2xl bg-gradient-to-b from-slate-50 to-sky-50/70 border border-slate-200/90 shadow-md transform rotate-[4deg] translate-y-1 hover:rotate-1 hover:translate-y-0 transition-transform duration-200 cursor-pointer flex flex-col justify-between"
                title="Click to advance to next stop"
              >
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">
                    NEXT • 0{((activeActivityIndex + 1) % dayActivities.length) + 1}
                  </span>
                  <span className="text-[10px] font-bold font-mono text-blue-600 block">
                    {nextActivity.time}
                  </span>
                </div>

                <div className="py-1">
                  <p className="text-xs font-black text-slate-800 truncate m-0 leading-tight">
                    {nextActivity.title}
                  </p>
                </div>

                <div className="text-[9px] font-bold text-blue-600 flex items-center justify-between pt-1 border-t border-slate-200/60">
                  <span>Slide</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* MODAL / EXPANDED OVERLAYS (Reusable BentoDetailModal)     */}
      {/* ========================================================= */}

      {/* 1. TICKETS INSPECTOR MODAL */}
      <BentoDetailModal
        isOpen={activeModal === 'tickets'}
        onClose={() => setActiveModal(null)}
        title="Physical Boarding Passes & Stay Reservations"
        subtitle="Select your preferred flight and hotel to update live trip budgeting."
        badge="Interactive Deck"
      >
        <div className="space-y-8">
          {/* Flights Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Plane className="w-4 h-4 text-blue-600" />
              <span>Available Flight Routes</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {itinerary?.flightOptions?.map((flight, idx) => {
                const isSelected = selectedFlightIndex === idx;
                const isFlipped = !!flippedModalCards[`flight-${idx}`];
                return (
                  <div 
                    key={idx}
                    className="flip-card-container w-full h-[220px] cursor-pointer"
                    onClick={() => toggleModalCardFlip(`flight-${idx}`)}
                  >
                    <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
                      <div className={`flip-card-front p-5 rounded-2xl border flex flex-col justify-between ${isSelected ? 'bg-blue-50/40 border-blue-400 shadow-sm' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center justify-between">
                          <span className="font-black text-slate-900 text-sm">{flight.airline}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectFlight(idx);
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-bold ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                          >
                            {isSelected ? '✓ Selected' : 'Select'}
                          </button>
                        </div>
                        <div className="flex items-center justify-between font-mono">
                          <span className="text-2xl font-black text-slate-900">{flight.route?.split('→')?.[0]?.trim()}</span>
                          <Plane className="w-4 h-4 text-blue-600 rotate-90" />
                          <span className="text-2xl font-black text-slate-900">{flight.route?.split('→')?.[1]?.trim()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-dashed border-slate-200">
                          <span className="font-black text-slate-900 text-base">{formatCurrency(flight.estimatedPrice)}</span>
                          <span className="text-blue-600 flex items-center gap-1 font-semibold"><RotateCw className="w-3 h-3" /> Flip Tip</span>
                        </div>
                      </div>

                      <div className="flip-card-back p-5 rounded-2xl bg-slate-900 text-white flex flex-col justify-between border border-blue-900">
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">Insider Route Advice</span>
                          <p className="text-xs text-slate-200 leading-relaxed m-0">{flight.tip}</p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                          <span className="text-xs text-slate-400">{flight.stops} • {flight.duration}</span>
                          <a
                            href={flight.bookingSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-3.5 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center gap-1"
                          >
                            <span>Book Flight</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hotels Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Hotel className="w-4 h-4 text-sky-600" />
              <span>Handpicked Accommodations</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {itinerary?.hotelRecommendations?.map((hotel, idx) => {
                const isSelected = selectedHotelIndex === idx;
                return (
                  <div key={idx} className={`p-5 rounded-2xl border flex flex-col justify-between ${isSelected ? 'bg-sky-50/40 border-sky-400 shadow-sm' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="font-black text-slate-900 text-base">{hotel.name}</h5>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{hotel.neighborhood}</span>
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                        {hotel.rating}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                      {hotel.whyItFits}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-3">
                      <div>
                        <span className="text-base font-black text-slate-900">{formatCurrency(hotel.pricePerNight)}</span>
                        <span className="text-xs text-slate-400"> / night</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectHotel(idx)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold ${isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                        >
                          {isSelected ? '✓ Selected' : 'Select'}
                        </button>
                        <a
                          href={hotel.bookingSearchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center gap-1"
                        >
                          <span>Reserve</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </BentoDetailModal>

      {/* 2. BUDGET MODAL */}
      <BentoDetailModal
        isOpen={activeModal === 'budget'}
        onClose={() => setActiveModal(null)}
        title="Itemized Budget & Spend Cockpit"
        subtitle="Comprehensive financial breakdown modeled on seasonal averages and real selections."
        badge="Financial Plan"
      >
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">Grand Estimated Spend</span>
              <h3 className="text-3xl font-black text-slate-900 font-mono mt-1">{formatCurrency(totalCalculated)}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-500">Average Per Day</span>
              <p className="text-xl font-black text-slate-800 font-mono mt-1">{formatCurrency(totalCalculated / daysCount)} / day</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-500">Airfare Allocation</span>
              <h4 className="text-xl font-black text-slate-900 font-mono">{formatCurrency(flightPrice)}</h4>
              <p className="text-xs text-slate-400">Selected: {selectedFlight?.airline} ({selectedFlight?.route})</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-500">Accommodation Allocation</span>
              <h4 className="text-xl font-black text-slate-900 font-mono">{formatCurrency(hotelTotalPrice)}</h4>
              <p className="text-xs text-slate-400">Selected: {selectedHotel?.name} ({nightsCount} nights)</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-500">Culinary & Dining</span>
              <h4 className="text-xl font-black text-slate-900 font-mono">{formatCurrency(foodAndDining)}</h4>
              <p className="text-xs text-slate-400">Covers breakfast cafes, lunch bowls, and signature dinners</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-500">Transit & Activity Entries</span>
              <h4 className="text-xl font-black text-slate-900 font-mono">{formatCurrency(activitiesAndTransit)}</h4>
              <p className="text-xs text-slate-400">IC Metro pass cards, temple gates, and museum tickets</p>
            </div>
          </div>
        </div>
      </BentoDetailModal>

      {/* 3. DINING DECK MODAL */}
      <BentoDetailModal
        isOpen={activeModal === 'dining'}
        onClose={() => setActiveModal(null)}
        title="Curated Dining Deck & Culinary Gems"
        subtitle="Handpicked ramen ateliers, omakase sushi bars, and historic cafes across all trip days."
        badge="Culinary Guide"
      >
        <div className="space-y-6">
          {itinerary?.days?.map((d) => (
            <div key={d.day} className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-block border border-emerald-200/80">
                Day {d.day} • {d.theme}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {d.restaurantPicks?.map((r, rIdx) => (
                  <div key={rIdx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900 text-sm">{r.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">{r.priceRange}</span>
                    </div>
                    <p className="text-xs font-bold text-emerald-600 m-0">{r.cuisine}</p>
                    <p className="text-xs text-slate-600 m-0"><strong className="text-slate-700">Must Try:</strong> {r.signatureDish}</p>
                    {r.mapUrl && (
                      <div className="pt-2 border-t border-slate-100 flex justify-end">
                        <a
                          href={r.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>Google Maps Location</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </BentoDetailModal>

      {/* 4. CHECKLIST MODAL */}
      <BentoDetailModal
        isOpen={activeModal === 'checklist'}
        onClose={() => setActiveModal(null)}
        title="Interactive Booking & Pre-Trip Checklist"
        subtitle="Track every flight, hotel, and pass verification before departure. Persisted in localStorage."
        badge={`${completedChecklistCount}/${checklist.length} Completed`}
      >
        <div className="space-y-6">
          {/* Progress Banner */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <div>
                <span className="text-xs font-bold text-blue-800">Trip Readiness Score</span>
                <p className="text-lg font-black text-slate-900 font-mono m-0">
                  {Math.round((completedChecklistCount / checklist.length) * 100)}% Verified
                </p>
              </div>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {checklist.length - completedChecklistCount} remaining items
            </span>
          </div>

          {/* Checklist Items */}
          <div className="space-y-2.5">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => onToggleChecklistItem(item.id)}
                className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                  item.checked
                    ? 'bg-blue-50/50 border-blue-200 text-slate-500 line-through'
                    : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                  item.checked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span className="text-sm font-semibold flex-1">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </BentoDetailModal>

      {/* 5. FULL DAY SCHEDULE MODAL */}
      <BentoDetailModal
        isOpen={activeModal === 'schedule'}
        onClose={() => setActiveModal(null)}
        title={`Day ${selectedDay} Schedule: ${activeDayPlan?.theme}`}
        subtitle={`Full chronological itinerary with all ${dayActivities.length} scheduled stops and booking links.`}
        badge={`Day ${selectedDay}`}
      >
        <div className="space-y-4">
          {dayActivities.map((act, idx) => {
            const meta = getCategoryMeta(act.category);
            return (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black font-mono text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                      {act.time}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${meta.bg}`}>
                      {meta.icon}
                      <span>{meta.label}</span>
                    </span>
                  </div>
                  <span className="text-xs font-black text-slate-800 font-mono">
                    {act.estimatedCost > 0 ? formatCurrency(act.estimatedCost) : 'Free'}
                  </span>
                </div>

                <h4 className="text-base font-black text-slate-900 tracking-tight">{act.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed m-0">{act.description}</p>

                {act.mapOrBookingUrl && (
                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <a
                      href={act.mapOrBookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <span>Open Map & Booking Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </BentoDetailModal>

    </div>
  );
}
