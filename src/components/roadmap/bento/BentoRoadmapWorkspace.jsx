import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  Hotel, 
  Utensils, 
  Clock, 
  MapPin, 
  ExternalLink, 
  Sparkles, 
  ShoppingBag, 
  Train, 
  Camera, 
  Check, 
  ArrowRight, 
  ChevronRight,
  Mail, 
  CheckSquare, 
  CheckCircle2, 
  Layers, 
  Maximize2, 
  RotateCw, 
  Loader2,
  X
} from 'lucide-react';
import { message } from 'antd';
import BentoDetailModal from './BentoDetailModal';
import { emailRoadmap } from '../../../services/tripApi';
import { 
  resolveDestinationHeroSlides, 
  resolveActivityPhoto, 
  resolveRestaurantPhoto,
  resolveDestinationFallbackPhoto,
  resolveActivityFallback,
  resolveRestaurantFallback
} from '../../../utils/travelPhotos';

export default function BentoRoadmapWorkspace({
  itinerary,
  selectedFlightIndex = 0,
  onSelectFlight,
  selectedHotelIndex = 0,
  onSelectHotel,
  onPlanTrip,
  checklist = [],
  onToggleChecklistItem,
  currency = 'USD',
  onOpenEmailModal,
  tripId
}) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [activeModal, setActiveModal] = useState(null); // 'budget' | 'dining' | 'tickets' | 'checklist' | 'schedule' | null
  const [activeActivityIndex, setActiveActivityIndex] = useState(0);
  const [flippedModalCards, setFlippedModalCards] = useState({});
  
  // Dynamic destination-matched hero slides (5 slides, Unsplash curated or API heroImages)
  const heroSlides = resolveDestinationHeroSlides(itinerary, itinerary?.destination);

  // Slideshow & Perspective States
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPlaceCardFlipped, setIsPlaceCardFlipped] = useState(false);

  // Automatic ambient photo crossfade every 2.5s (2500ms)
  useEffect(() => {
    if (!heroSlides?.length) return;
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [heroSlides?.length]);
  
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
      const res = await emailRoadmap(tripId || 'sample', email);
      setIsSending(false);
      message.success(res.message);
      setShowEmailInput(false);
      setEmail('');
    } catch {
      setIsSending(false);
      message.error('Failed to send email.');
    }
  };

  const toggleModalCardFlip = (key) => {
    setFlippedModalCards((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto h-full lg:h-[calc(100vh-120px)] lg:max-h-[820px] flex flex-col justify-start select-none overflow-hidden">
      
      {/* ========================================================= */}
      {/* 3-COLUMN × 3-ROW ASYMMETRICAL BENTO GRID WORKSPACE        */}
      {/* Rebalanced: Col 1 (1.05fr) / Col 2 (1.65fr) / Col 3 (1.3fr) */}
      {/* Locked 100% to single desktop viewport with ZERO scroll   */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.05fr_1.65fr_1.3fr] lg:grid-rows-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.15fr)] gap-3.5 h-full w-full">
        
        {/* ------------------------------------------------------- */}
        {/* TILE 1: TOP-LEFT TALL TILE (Stacked Tickets Deck)        */}
        {/* Grid: Col 1, Rows 1-2 (1 Col × 2 Rows Tall)             */}
        {/* Subtle luminous depth gradient & tactile notches          */}
        {/* ------------------------------------------------------- */}
        <div 
          onClick={() => setActiveModal('tickets')}
          className="bento-tile col-span-1 lg:col-start-1 lg:col-span-1 lg:row-start-1 lg:row-span-2 p-4 sm:p-5 rounded-[28px] flex flex-col justify-between group cursor-pointer relative overflow-hidden bg-gradient-to-br from-white via-white to-sky-50/75 dark:bg-gradient-to-br dark:from-slate-900/90 dark:via-slate-900/80 dark:to-sky-950/35 border-slate-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(15,23,42,0.04)] dark:shadow-[0_12px_32px_rgb(0,0,0,0.35)] h-full"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(56,189,248,0.14),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_top_left,_rgba(56,189,248,0.08),transparent_65%)] pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow-xs">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
                  Ticket Deck
                </span>
              </div>
              <Maximize2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 m-0">
              Stacked physical passes for flight & hotel routing.
            </p>
          </div>

          {/* Physical Stacked & Tilted Boarding Passes Preview */}
          <div className="relative z-10 my-auto py-3 w-full flex items-center justify-center min-h-[210px]">
            {/* Card 3 (Hotel Peek - Tilted Right) */}
            <div className="absolute inset-x-2 top-2 h-36 rounded-2xl bg-gradient-to-br from-sky-50/90 via-blue-50/70 to-white dark:from-slate-800/90 dark:via-slate-800/80 dark:to-sky-950/50 border border-sky-200/70 dark:border-sky-500/30 shadow-sm transform rotate-[3.5deg] -translate-y-2 group-hover:rotate-[5.5deg] group-hover:-translate-y-3 transition-transform duration-300 flex flex-col justify-between p-3.5">
              <div className="flex items-center justify-between text-[10px] text-sky-700 dark:text-sky-300 font-bold">
                <div className="flex items-center gap-1 truncate max-w-[140px]">
                  <Hotel className="w-3 h-3 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span className="truncate">{selectedHotel?.name || 'TRUNK Hotel'}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-900/60 text-sky-900 dark:text-sky-200 text-[9px] font-black">{selectedHotel?.rating || '4.9 ★'}</span>
              </div>
              <div className="flex items-baseline justify-between pt-2 border-t border-dashed border-sky-200/80 dark:border-sky-500/30">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Selected Stay</span>
                <span className="text-xs font-black text-sky-900 dark:text-sky-200 font-mono">
                  {formatCurrency(selectedHotel?.pricePerNight)} <span className="text-[9px] font-normal text-slate-400">/nt</span>
                </span>
              </div>
            </div>

            {/* Card 2 (Flight 2 Peek - Tilted Left) */}
            <div className="absolute inset-x-1.5 top-5 h-36 rounded-2xl bg-gradient-to-br from-slate-50 via-sky-50/50 to-white dark:from-slate-800/70 dark:via-slate-800/60 dark:to-slate-900 border border-slate-200 dark:border-white/5 shadow-sm transform -rotate-[3deg] -translate-y-1 group-hover:-rotate-[5deg] group-hover:-translate-y-2 transition-transform duration-300 p-3" />

            {/* Card 1 (Top Active Boarding Pass - Upright with Semicircular Ticket Notches) */}
            <div className="relative w-full rounded-2xl bg-white dark:bg-slate-800/95 border border-blue-300/90 dark:border-blue-500/40 ring-1 ring-blue-500/20 dark:ring-blue-500/30 shadow-[0_12px_28px_-8px_rgba(37,99,235,0.16)] dark:shadow-[0_12px_28px_-8px_rgba(59,130,246,0.25)] p-3.5 flex flex-col justify-between z-10 group-hover:shadow-[0_16px_32px_-8px_rgba(37,99,235,0.22)] transition-shadow">
              
              {/* Top Pass Row: Airline & Code */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Plane className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wide">
                    {selectedFlight?.airline || 'ALL NIPPON AIRWAYS'}
                  </span>
                </div>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                  {selectedFlight?.stops || 'Nonstop'}
                </span>
              </div>

              {/* Airport Route Codes & Plane */}
              <div className="flex items-center justify-between font-mono py-2">
                <div className="text-left">
                  <span className="text-xl font-black text-slate-900 dark:text-white block leading-none">
                    {selectedFlight?.route?.split('→')?.[0]?.trim() || 'SFO'}
                  </span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-400 font-sans">Origin</span>
                </div>

                <div className="flex-1 flex flex-col items-center px-2">
                  <div className="w-full flex items-center justify-center relative">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                    <Plane className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 rotate-90 absolute bg-white dark:bg-slate-800 px-0.5" />
                  </div>
                  <span className="text-[9px] text-slate-400 dark:text-slate-400 font-sans mt-1">{selectedFlight?.duration || '10h 45m'}</span>
                </div>

                <div className="text-right">
                  <span className="text-xl font-black text-slate-900 dark:text-white block leading-none">
                    {selectedFlight?.route?.split('→')?.[1]?.trim() || 'HND'}
                  </span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-400 font-sans">Tokyo</span>
                </div>
              </div>

              {/* Perforated Seam with Authentic Semicircular Ticket Notches */}
              <div className="relative my-1">
                <div className="border-t border-dashed border-slate-200/90 dark:border-slate-700 w-full" />
                {/* Left semicircular notch */}
                <div className="absolute -left-[20px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-sky-50/90 dark:bg-[#0f172a] border border-blue-200/70 dark:border-blue-500/40 shadow-inner z-20" />
                {/* Right semicircular notch */}
                <div className="absolute -right-[20px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-sky-50/90 dark:bg-[#0f172a] border border-blue-200/70 dark:border-blue-500/40 shadow-inner z-20" />
              </div>

              {/* Bottom Pass Row: Price & Active Badge */}
              <div className="flex items-center justify-between pt-1 text-[11px]">
                <div>
                  <span className="text-[9px] text-slate-400 block leading-none">Selected Fare</span>
                  <span className="font-black text-slate-900 dark:text-white font-mono text-xs">
                    {formatCurrency(flightPrice)}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                  <span>Active Pass</span>
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-2 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-[11px] font-bold text-blue-600 dark:text-blue-400">
            <span>Tap to Fan & Flip Tickets</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* ------------------------------------------------------- */}
        {/* TILE 2: CENTER ANCHOR TILE (The Hero Focal Point)        */}
        {/* Grid: Col 2, Rows 1-2 (1 Col Wide at 1.65fr)              */}
        {/* Automatic Ambient Photo Crossfade & Ken Burns Drift       */}
        {/* ------------------------------------------------------- */}
        <div className="bento-tile col-span-1 md:col-span-2 lg:col-start-2 lg:col-span-1 lg:row-start-1 lg:row-span-2 rounded-[32px] overflow-hidden relative group h-full bg-slate-950 border-0 p-0 shadow-xl flex flex-col justify-between p-5 sm:p-6">
          {/* Background Slideshow: Crossfading Slides with Ken Burns Drift */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {heroSlides.map((slide, idx) => {
              const isActive = idx === slideIndex;
              return (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                  }`}
                >
                  <img
                    src={slide.url}
                    alt={slide.title}
                    onError={(e) => {
                      e.currentTarget.src = resolveDestinationFallbackPhoto(itinerary?.destination || itinerary?.tripTitle);
                    }}
                    decoding="async"
                    className="w-full h-full object-cover filter brightness-[0.72] contrast-[1.05]"
                  />
                </div>
              );
            })}

            {/* High-Contrast Vignette / Dark Gradient Scrim */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.40) 0%, rgba(15, 23, 42, 0.35) 45%, rgba(15, 23, 42, 0.92) 100%)',
              }}
            />
          </div>

          {/* Top Bar: Eyebrow + Live Slide Pill + Email / Edit Action Buttons */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/90 dark:bg-slate-900/85 backdrop-blur-md text-slate-900 dark:text-white shadow-sm border border-white/20 dark:border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{daysCount} Days • Day {selectedDay} Spotlight</span>
              </div>
              <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/40 backdrop-blur-md text-slate-200 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="truncate max-w-[160px]">{heroSlides[slideIndex]?.title}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenEmailModal ? onOpenEmailModal() : setShowEmailInput(!showEmailInput)}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/85 dark:bg-slate-800/85 backdrop-blur-md text-slate-900 dark:text-white hover:bg-white dark:hover:bg-slate-800 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs border border-white/20 dark:border-white/10"
              >
                <Mail className="w-3 h-3 text-blue-600 dark:text-blue-400" />
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
              className="relative z-20 my-2 flex items-center gap-1.5 bg-white/95 dark:bg-slate-800/95 p-1.5 rounded-full border border-blue-200 dark:border-blue-700/60 shadow-lg backdrop-blur-xl animate-fadeIn max-w-sm"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoFocus
                className="flex-1 px-3 py-1 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none bg-transparent"
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
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-1"
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

            {/* Quick Day Filter Pill Strip Inside Hero with Instant Crossfade */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {itinerary?.days?.map((d) => (
                <button
                  key={d.day}
                  type="button"
                  onClick={() => {
                    setSelectedDay(d.day);
                    setSlideIndex((d.day - 1) % heroSlides.length);
                    setActiveActivityIndex(0);
                    setIsPlaceCardFlipped(false);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                    selectedDay === d.day
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white/75 dark:bg-slate-800/75 backdrop-blur-md text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700'
                  }`}
                >
                  Day {d.day}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------- */}
        {/* TILE 3: RIGHT TALL COLUMN (Day Schedule & Places to Visit) */}
        {/* Grid: Col 3, Rows 1-2 (1 Col Wide at 1.30fr)             */}
        {/* Extra-frosted liquid glassmorphism & 3D tilted photo deck */}
        {/* ------------------------------------------------------- */}
        <div 
          onClick={() => setActiveModal('schedule')}
          className="bento-tile col-span-1 lg:col-start-3 lg:col-span-1 lg:row-start-1 lg:row-span-2 p-4 sm:p-5 rounded-[28px] flex flex-col justify-between relative overflow-hidden group h-full backdrop-blur-2xl ring-1 ring-inset ring-white/60 dark:ring-white/15 bg-gradient-to-br from-white/75 via-sky-50/45 to-indigo-50/40 dark:from-slate-900/65 dark:via-slate-900/50 dark:to-sky-950/35 border-slate-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(15,23,42,0.04)] dark:shadow-[0_12px_32px_rgb(0,0,0,0.35)] cursor-pointer"
        >
          {/* Luminous Specular Radial Glows for Liquid Glass Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(56,189,248,0.15),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top_right,_rgba(56,189,248,0.08),transparent_70%)] pointer-events-none" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-400/10 dark:bg-sky-400/15 rounded-full blur-2xl pointer-events-none" />

          {/* Top Bar: Clean Header + "See all" Modal Pill */}
          <div className="relative z-10 flex items-center justify-between pb-2 border-b border-slate-100/80 dark:border-white/10 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 shrink-0">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white truncate block">
                  Day {selectedDay} Schedule
                </span>
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block truncate">
                  • {dayActivities.length} Stops
                </span>
              </div>
            </div>

            {/* Reference Header: Sleek "See all ↗" Pill Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveModal('schedule');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 backdrop-blur-md transition-all cursor-pointer border border-slate-200/60 dark:border-white/10 shrink-0 active:scale-95"
              title="Open full day schedule deck"
            >
              <span>See all</span>
              <ExternalLink className="w-3 h-3 text-slate-400 dark:text-slate-400" />
            </button>
          </div>

          {/* 3D Physical Card Stage: Tilted Hero Card (~72%) + Fanned Vertical Slices (~28%) */}
          <div className="relative z-10 my-1.5 flex-1 relative flex items-stretch gap-2.5 min-h-0 [perspective:1000px] overflow-visible">
            
            {/* Front Hero Photo Card (Slightly Tilted Left-Center, ~72% width) with 3D Flip */}
            <div 
              className="w-[72%] h-full relative [perspective:1000px]"
            >
              <div 
                className="relative w-full h-full transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isPlaceCardFlipped 
                    ? 'rotateY(190deg) rotateZ(-1.5deg)' 
                    : 'rotateY(10deg) rotateZ(-1.5deg)',
                }}
              >
                
                {/* ---------------- FRONT FACE: Tilted Photo Card ---------------- */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPlaceCardFlipped(true);
                  }}
                  className="absolute inset-0 backface-hidden rounded-[22px] overflow-hidden shadow-xl shadow-slate-900/25 dark:shadow-black/60 border border-slate-200/80 dark:border-white/15 flex flex-col justify-between p-3.5 bg-slate-900 group/hero cursor-pointer"
                >
                  <img
                    src={resolveActivityPhoto(currentActivity, itinerary?.destination)}
                    alt={currentActivity?.title}
                    onError={(e) => {
                      e.currentTarget.src = resolveActivityFallback(currentActivity, itinerary?.destination);
                    }}
                    className="absolute inset-0 w-full h-full object-cover filter brightness-[0.78] group-hover/hero:scale-105 transition-transform duration-700"
                  />
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.2) 35%, rgba(15, 23, 42, 0.92) 100%)',
                    }}
                  />

                  {/* Top Row: Title & Time (Left) + Circular Frosted Action Button (Right) */}
                  <div className="relative z-10 flex items-start justify-between gap-2">
                    <div className="min-w-0 pr-1">
                      <span className="text-[11px] font-bold font-mono text-blue-300 drop-shadow-xs flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{currentActivity?.time || '10:30 AM'}</span>
                      </span>
                      <h4 className="text-sm sm:text-base font-black text-white tracking-tight leading-snug drop-shadow-sm line-clamp-2 mt-0.5">
                        {currentActivity?.title}
                      </h4>
                    </div>

                    {/* Circular Frosted Action Button (↗) */}
                    <a
                      href={currentActivity?.mapOrBookingUrl || 'https://maps.google.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-7 h-7 rounded-full bg-white/20 dark:bg-black/30 hover:bg-white/40 dark:hover:bg-white/20 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer border border-white/25 shadow-xs shrink-0"
                      title="Open Google Maps / Booking"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Bottom Row: Compact Frosted Pill Badges (Stop 01/03, Free / $18, Flip ↻) */}
                  <div className="relative z-10 flex items-center justify-between gap-1 pt-2 border-t border-white/20">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-md shadow-xs">
                        Stop 0{activeActivityIndex + 1}/0{dayActivities.length}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black font-mono bg-emerald-500/90 text-white backdrop-blur-md shadow-xs">
                        {currentActivity?.estimatedCost > 0 ? formatCurrency(currentActivity?.estimatedCost) : 'Free'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPlaceCardFlipped(true);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 hover:bg-white text-slate-900 dark:bg-slate-800/90 dark:hover:bg-slate-800 dark:text-white backdrop-blur-md shadow-xs active:scale-95 transition-all cursor-pointer"
                      title="Flip card for details"
                    >
                      <RotateCw className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" />
                      <span>Flip ↻</span>
                    </button>
                  </div>
                </div>

                {/* ---------------- BACK FACE: Full Description & Insider Advice ---------------- */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPlaceCardFlipped(false);
                  }}
                  className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] rounded-[22px] bg-slate-900/98 dark:bg-[#0b1220]/98 text-white p-3.5 flex flex-col justify-between border border-blue-500/30 shadow-2xl overflow-hidden z-10 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">
                        Stop 0{activeActivityIndex + 1} Insights
                      </span>
                      <span className="text-[10px] font-bold font-mono text-slate-400">• {currentActivity?.time}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPlaceCardFlipped(false);
                      }}
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 active:scale-95 transition-all cursor-pointer border border-white/10"
                      title="Flip back to photo"
                    >
                      <RotateCw className="w-2.5 h-2.5 text-blue-400" />
                      <span>Photo ↺</span>
                    </button>
                  </div>

                  <div className="my-auto py-1">
                    <p className="text-xs text-slate-200 leading-relaxed line-clamp-3 m-0 font-normal">
                      {currentActivity?.description}
                    </p>

                    <div className="p-2 rounded-xl bg-blue-950/70 border border-blue-500/30 flex items-start gap-1.5 mt-2">
                      <Sparkles className="w-3 h-3 text-blue-400 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-blue-200 leading-tight m-0">
                        <strong className="text-blue-300">Curator Tip:</strong> Arrive early for soft lighting; Suica / IC accepted.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-white/10">
                    <span className="text-[10px] text-slate-400 font-mono font-bold">
                      {currentActivity?.estimatedCost > 0 ? formatCurrency(currentActivity?.estimatedCost) : 'Free Entry'}
                    </span>

                    <a
                      href={currentActivity?.mapOrBookingUrl || 'https://maps.google.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm active:scale-95 transition-all"
                    >
                      <span>Open Google Maps ↗</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Fanned Perspective Slices (~28% width) */}
            <div className="w-[28%] h-full relative [perspective:900px] flex items-center justify-center overflow-visible">
              {dayActivities.length > 1 ? (
                (() => {
                  const upcomingList = [];
                  for (let offset = 1; offset < Math.min(dayActivities.length, 3); offset++) {
                    const idx = (activeActivityIndex + offset) % dayActivities.length;
                    upcomingList.push({ act: dayActivities[idx], index: idx, offset });
                  }

                  return upcomingList.map((item, i) => {
                    // Steeply angled vertical slice:
                    const rotY = -38;
                    const transX = i * 16;
                    const transY = (i * 8) - 4;
                    const scale = 0.94 - (i * 0.08);
                    const z = 10 - i;

                    return (
                      <div
                        key={item.index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveActivityIndex(item.index);
                          setIsPlaceCardFlipped(false);
                        }}
                        style={{
                          transform: `perspective(900px) rotateY(${rotY}deg) translate3d(${transX}px, ${transY}px, 0) scale(${scale})`,
                          zIndex: z,
                        }}
                        className="absolute inset-0 rounded-[20px] overflow-hidden border border-white/20 dark:border-white/10 shadow-xl cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-100 hover:rotate-y-[-24deg] group/fan bg-slate-900"
                        title={`Click to switch to Stop 0${item.index + 1}: ${item.act.title}`}
                      >
                        <img
                          src={resolveActivityPhoto(item.act, itinerary?.destination)}
                          alt={item.act.title}
                          onError={(e) => {
                            e.currentTarget.src = resolveActivityFallback(item.act, itinerary?.destination);
                          }}
                          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.70] group-hover/fan:brightness-[0.88] transition-all duration-500"
                        />
                        {/* Subtle edge lighting scrim */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-white/10 pointer-events-none" />

                        <div className="relative z-10 p-2 h-full flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-md shadow-xs">
                              0{item.index + 1}
                            </span>
                            <span className="text-[9px] font-mono font-bold text-blue-300 drop-shadow-xs">
                              {item.act.time}
                            </span>
                          </div>

                          <div>
                            <p className="text-[10px] font-bold text-white truncate m-0 drop-shadow-xs">
                              {item.act.title}
                            </p>
                            <div className="flex items-center justify-between pt-1 mt-1 border-t border-white/20 text-[9px] font-bold text-blue-400">
                              <span>Switch</span>
                              <ArrowRight className="w-2.5 h-2.5 group-hover/fan:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()
              ) : (
                <div className="w-full h-full rounded-[20px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10 flex flex-col items-center justify-center p-2 text-center">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-1" />
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Solo Stop</span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ------------------------------------------------------- */}
        {/* TILE 4: BOTTOM-LEFT TILE (Live Budget Cockpit)           */}
        {/* Grid: Col 1, Row 3 (1 Col Wide at 1.05fr)                */}
        {/* Subtle luminous gradient & live itemized category chips   */}
        {/* ------------------------------------------------------- */}
        <div 
          onClick={() => setActiveModal('budget')}
          className="bento-tile col-span-1 lg:col-start-1 lg:col-span-1 lg:row-start-3 lg:row-span-1 p-4 sm:p-5 rounded-[28px] flex flex-col justify-between group cursor-pointer relative overflow-hidden bg-gradient-to-br from-white via-white to-sky-50/75 dark:bg-gradient-to-br dark:from-slate-900/90 dark:via-slate-900/80 dark:to-sky-950/35 border-slate-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(15,23,42,0.04)] dark:shadow-[0_12px_32px_rgb(0,0,0,0.35)] h-full"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(56,189,248,0.12),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_top_left,_rgba(56,189,248,0.06),transparent_65%)] pointer-events-none" />

          {/* Top Row: Mini Donut, Live Total & Indicator */}
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {/* Mini SVG Donut Ring */}
              <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="12" fill="transparent" />
                  <circle cx="50" cy="50" r="38" stroke="#2563EB" strokeWidth="12" strokeDasharray={`${(pFlights / 100) * 238.76} 238.76`} fill="transparent" />
                  <circle cx="50" cy="50" r="38" stroke="#0284C7" strokeWidth="12" strokeDasharray={`${(pHotels / 100) * 238.76} 238.76`} strokeDashoffset={-((pFlights / 100) * 238.76)} fill="transparent" />
                  <circle cx="50" cy="50" r="38" stroke="#059669" strokeWidth="12" strokeDasharray={`${(pFood / 100) * 238.76} 238.76`} strokeDashoffset={-(((pFlights + pHotels) / 100) * 238.76)} fill="transparent" />
                  <circle cx="50" cy="50" r="38" stroke="#D97706" strokeWidth="12" strokeDasharray={`${(pTransit / 100) * 238.76} 238.76`} strokeDashoffset={-(((pFlights + pHotels + pFood) / 100) * 238.76)} fill="transparent" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">TOTAL</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight leading-none">
                    {formatCurrency(totalCalculated)}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live synchronized" />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 m-0">
                  {formatCurrency(totalCalculated / daysCount)} / day
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Bottom Row: 4 Category Quick Chips in Crisp 2x2 Grid */}
          <div className="relative z-10 grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100/80 dark:border-white/10">
            <div className="px-2 py-1.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/50 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-blue-700 dark:text-blue-300 font-bold block uppercase tracking-wider">Flights</span>
                <span className="text-xs font-black text-slate-900 dark:text-white font-mono">{formatCurrency(flightPrice)}</span>
              </div>
              <span className="text-[9px] font-bold text-blue-600 dark:text-blue-300 font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded">
                {Math.round(pFlights)}%
              </span>
            </div>

            <div className="px-2 py-1.5 rounded-xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200/60 dark:border-sky-800/50 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-sky-700 dark:text-sky-300 font-bold block uppercase tracking-wider">Stays</span>
                <span className="text-xs font-black text-slate-900 dark:text-white font-mono">{formatCurrency(hotelTotalPrice)}</span>
              </div>
              <span className="text-[9px] font-bold text-sky-600 dark:text-sky-300 font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded">
                {Math.round(pHotels)}%
              </span>
            </div>

            <div className="px-2 py-1.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-emerald-700 dark:text-emerald-300 font-bold block uppercase tracking-wider">Dining</span>
                <span className="text-xs font-black text-slate-900 dark:text-white font-mono">{formatCurrency(foodAndDining)}</span>
              </div>
              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-300 font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded">
                {Math.round(pFood)}%
              </span>
            </div>

            <div className="px-2 py-1.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/50 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-amber-700 dark:text-amber-300 font-bold block uppercase tracking-wider">Activities</span>
                <span className="text-xs font-black text-slate-900 dark:text-white font-mono">{formatCurrency(activitiesAndTransit)}</span>
              </div>
              <span className="text-[9px] font-bold text-amber-600 dark:text-amber-300 font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded">
                {Math.round(pTransit)}%
              </span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------- */}
        {/* TILE 5: BOTTOM-MIDDLE TILE (Curated Dining Spotlight)    */}
        {/* Grid: Col 2, Row 3 (1 Col Wide at 1.65fr)                */}
        {/* Subtle luminous gradient & spacious dining showcase      */}
        {/* ------------------------------------------------------- */}
        <div 
          onClick={() => setActiveModal('dining')}
          className="bento-tile col-span-1 lg:col-start-2 lg:col-span-1 lg:row-start-3 lg:row-span-1 p-4 sm:p-5 rounded-[28px] flex flex-col justify-between group cursor-pointer relative overflow-hidden bg-gradient-to-br from-white via-white to-sky-50/75 dark:bg-gradient-to-br dark:from-slate-900/90 dark:via-slate-900/80 dark:to-sky-950/35 border-slate-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(15,23,42,0.04)] dark:shadow-[0_12px_32px_rgb(0,0,0,0.35)] h-full"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(16,185,129,0.12),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_top_left,_rgba(16,185,129,0.06),transparent_65%)] pointer-events-none" />

          {/* Top Row: Icon, Title & Maximize */}
          <div className="relative z-10 flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                <Utensils className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
                Dining Spotlight
              </span>
            </div>
            <Maximize2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
          </div>

          {/* Middle Body: Spacious Split with Restaurant Photo Thumbnail in 1.65fr Column */}
          <div className="relative z-10 my-1.5 flex items-center gap-3.5">
            {/* Restaurant Food Photo Thumbnail */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-200/80 dark:border-white/10 shadow-sm bg-slate-900">
              <img
                src={resolveRestaurantPhoto(topRestaurant)}
                alt={topRestaurant?.name || 'Restaurant spotlight'}
                onError={(e) => {
                  e.currentTarget.src = resolveRestaurantFallback(topRestaurant);
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-black text-slate-900 dark:text-white text-sm sm:text-base truncate">
                  {topRestaurant?.name || 'Afuri Harajuku'}
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 shrink-0">
                  {topRestaurant?.priceRange || '$$'}
                </span>
              </div>

              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 m-0 truncate">
                {topRestaurant?.cuisine || 'Craft Yuzu Shio Ramen'}
              </p>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed m-0 pt-0.5">
                {topRestaurant?.signatureDish || 'Signature Yuzu Shio Broth with Charred Chashu'}
              </p>
            </div>

            <div className="hidden sm:flex flex-col items-end shrink-0 pl-3 border-l border-slate-100 dark:border-white/10">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Curator Choice</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">Walk-in Welcome</span>
            </div>
          </div>

          {/* Footer Link */}
          <div className="relative z-10 pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
            <span>Explore All {itinerary?.days?.reduce((acc, d) => acc + (d.restaurantPicks?.length || 0), 0) || 8} Dining Spots</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* ------------------------------------------------------- */}
        {/* TILE 6: BOTTOM-RIGHT TILE (Booking Checklist To-Do)      */}
        {/* Grid: Col 3, Row 3 (1 Col Wide at 1.30fr)                */}
        {/* Subtle luminous gradient & checklist progress            */}
        {/* ------------------------------------------------------- */}
        <div 
          onClick={() => setActiveModal('checklist')}
          className="bento-tile col-span-1 lg:col-start-3 lg:col-span-1 lg:row-start-3 lg:row-span-1 p-4 sm:p-5 rounded-[28px] flex flex-col justify-between group cursor-pointer relative overflow-hidden bg-gradient-to-br from-white via-white to-sky-50/75 dark:bg-gradient-to-br dark:from-slate-900/90 dark:via-slate-900/80 dark:to-sky-950/35 border-slate-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(15,23,42,0.04)] dark:shadow-[0_12px_32px_rgb(0,0,0,0.35)] h-full"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(56,189,248,0.12),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_top_left,_rgba(56,189,248,0.06),transparent_65%)] pointer-events-none" />

          {/* Top Row: Icon, Title & Counter */}
          <div className="relative z-10 flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
                <CheckSquare className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
                Booking To-Do
              </span>
            </div>
            <span className="text-xs font-black font-mono text-blue-600 dark:text-blue-400">
              {completedChecklistCount}/{checklist.length}
            </span>
          </div>

          {/* Progress Bar & Immediate Task */}
          <div className="relative z-10 my-1.5 space-y-1.5">
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200/60 dark:border-white/10">
              <div 
                style={{ width: `${Math.round((completedChecklistCount / checklist.length) * 100)}%` }}
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/60 dark:border-white/10">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Next Immediate Task:
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-white truncate m-0 mt-0.5">
                {nextUncheckedTask}
              </p>
            </div>
          </div>

          {/* Footer Link */}
          <div className="relative z-10 pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-[11px] font-bold text-blue-600 dark:text-blue-400">
            <span>Open Interactive Checklist</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Plane className="w-4 h-4 text-blue-600 dark:text-blue-400" />
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
                      <div className={`flip-card-front p-5 rounded-2xl border flex flex-col justify-between ${isSelected ? 'bg-blue-50/40 dark:bg-blue-950/40 border-blue-400 dark:border-blue-500 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10'}`}>
                        <div className="flex items-center justify-between">
                          <span className="font-black text-slate-900 dark:text-white text-sm">{flight.airline}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectFlight(idx);
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-bold ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}
                          >
                            {isSelected ? '✓ Selected' : 'Select'}
                          </button>
                        </div>
                        <div className="flex items-center justify-between font-mono">
                          <span className="text-2xl font-black text-slate-900 dark:text-white">{flight.route?.split('→')?.[0]?.trim()}</span>
                          <Plane className="w-4 h-4 text-blue-600 dark:text-blue-400 rotate-90" />
                          <span className="text-2xl font-black text-slate-900 dark:text-white">{flight.route?.split('→')?.[1]?.trim()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-dashed border-slate-200 dark:border-slate-700">
                          <span className="font-black text-slate-900 dark:text-white text-base">{formatCurrency(flight.estimatedPrice)}</span>
                          <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1 font-semibold"><RotateCw className="w-3 h-3" /> Flip Tip</span>
                        </div>
                      </div>

                      <div className="flip-card-back p-5 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white flex flex-col justify-between border border-blue-900 dark:border-blue-800">
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
                            className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1"
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
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/10">
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Hotel className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Handpicked Accommodations</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {itinerary?.hotelRecommendations?.map((hotel, idx) => {
                const isSelected = selectedHotelIndex === idx;
                return (
                  <div key={idx} className={`p-5 rounded-2xl border flex flex-col justify-between ${isSelected ? 'bg-sky-50/40 dark:bg-sky-950/40 border-sky-400 dark:border-sky-500 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="font-black text-slate-900 dark:text-white text-base">{hotel.name}</h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{hotel.neighborhood}</span>
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
                        {hotel.rating}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-white/5 leading-relaxed">
                      {hotel.whyItFits}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/10 mt-3">
                      <div>
                        <span className="text-base font-black text-slate-900 dark:text-white">{formatCurrency(hotel.pricePerNight)}</span>
                        <span className="text-xs text-slate-400"> / night</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectHotel(idx)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold ${isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}
                        >
                          {isSelected ? '✓ Selected' : 'Select'}
                        </button>
                        <a
                          href={hotel.bookingSearchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1.5 rounded-full bg-slate-900 dark:bg-blue-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-slate-800 dark:hover:bg-blue-500 transition-colors"
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
          <div className="p-6 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/50 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-widest">Grand Estimated Spend</span>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-1">{formatCurrency(totalCalculated)}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Average Per Day</span>
              <p className="text-xl font-black text-slate-800 dark:text-slate-200 font-mono mt-1">{formatCurrency(totalCalculated / daysCount)} / day</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 space-y-1">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Airfare Allocation</span>
              <h4 className="text-xl font-black text-slate-900 dark:text-white font-mono">{formatCurrency(flightPrice)}</h4>
              <p className="text-xs text-slate-400">Selected: {selectedFlight?.airline} ({selectedFlight?.route})</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 space-y-1">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Accommodation Allocation</span>
              <h4 className="text-xl font-black text-slate-900 dark:text-white font-mono">{formatCurrency(hotelTotalPrice)}</h4>
              <p className="text-xs text-slate-400">Selected: {selectedHotel?.name} ({nightsCount} nights)</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 space-y-1">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Culinary & Dining</span>
              <h4 className="text-xl font-black text-slate-900 dark:text-white font-mono">{formatCurrency(foodAndDining)}</h4>
              <p className="text-xs text-slate-400">Covers breakfast cafes, lunch bowls, and signature dinners</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 space-y-1">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Transit & Activity Entries</span>
              <h4 className="text-xl font-black text-slate-900 dark:text-white font-mono">{formatCurrency(activitiesAndTransit)}</h4>
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
              <h4 className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full inline-block border border-emerald-200/80 dark:border-emerald-800/60">
                Day {d.day} • {d.theme}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {d.restaurantPicks?.map((r, rIdx) => {
                  const photoUrl = resolveRestaurantPhoto(r);
                  const mapLink = r.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name} ${itinerary?.destination || ''}`)}`;
                  return (
                    <div 
                      key={rIdx} 
                      className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-3.5 group"
                    >
                      {/* Photo Thumbnail */}
                      <div className="relative w-full sm:w-28 sm:h-28 h-36 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-white/10 bg-slate-900">
                        <img 
                          src={photoUrl} 
                          alt={r.name}
                          onError={(e) => {
                            e.currentTarget.src = resolveRestaurantFallback(r);
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-black/60 backdrop-blur-md text-white border border-white/20">
                          {r.priceRange || '$$'}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between space-y-1.5">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="font-black text-slate-900 dark:text-white text-sm sm:text-base leading-snug truncate">
                              {r.name}
                            </h5>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 shrink-0">
                              {r.cuisine}
                            </span>
                          </div>

                          <div className="mt-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-white/5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">Must Try</span>
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 m-0 mt-0.5">
                              {r.signatureDish}
                            </p>
                          </div>
                        </div>

                        {/* Location / Action */}
                        <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                            Curated Pick
                          </span>
                          <a
                            href={mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                          >
                            <MapPin className="w-3 h-3" />
                            <span>Google Maps Location ↗</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <span className="text-xs font-bold text-blue-800 dark:text-blue-300">Trip Readiness Score</span>
                <p className="text-lg font-black text-slate-900 dark:text-white font-mono m-0">
                  {Math.round((completedChecklistCount / checklist.length) * 100)}% Verified
                </p>
              </div>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
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
                    ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50 text-slate-500 dark:text-slate-400 line-through'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs'
                }`}
              >
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                  item.checked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
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
            const photoUrl = resolveActivityPhoto(act, itinerary?.destination);
            return (
              <div 
                key={idx} 
                className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 group"
              >
                {/* Landmark Photo Thumbnail */}
                <div className="relative w-full sm:w-32 sm:h-32 h-40 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-white/10 bg-slate-900">
                  <img
                    src={photoUrl}
                    alt={act.title}
                    onError={(e) => {
                      e.currentTarget.src = resolveActivityFallback(currentActivity, itinerary?.destination);
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-black/60 backdrop-blur-md text-white border border-white/20">
                    Stop 0{idx + 1}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-100 dark:border-blue-800/60">
                          {act.time}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${meta.bg}`}>
                          {meta.icon}
                          <span>{meta.label}</span>
                        </span>
                      </div>
                      <span className="text-xs font-black text-slate-800 dark:text-white font-mono">
                        {act.estimatedCost > 0 ? formatCurrency(act.estimatedCost) : 'Free'}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-slate-900 dark:text-white tracking-tight">{act.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed m-0">{act.description}</p>
                  </div>

                  {act.mapOrBookingUrl && (
                    <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex justify-end">
                      <a
                        href={act.mapOrBookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
                      >
                        <span>Open Map & Booking Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </BentoDetailModal>

    </div>
  );
}
