import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  ArrowRight, 
  Sparkles, 
  Navigation, 
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SAMPLE_TOKYO_TRIP } from '../data/sampleTokyoTrip';
import RoadmapHeroBanner from './roadmap/RoadmapHeroBanner';
import BudgetAllocationCard from './roadmap/BudgetAllocationCard';
import ManualBookingGrid from './roadmap/ManualBookingGrid';
import DailyItineraryTimeline from './roadmap/DailyItineraryTimeline';
import BentoRoadmapWorkspace from './roadmap/bento/BentoRoadmapWorkspace';
import EmailRoadmapModal from './roadmap/EmailRoadmapModal';
import RoadmapSkeleton from './roadmap/RoadmapSkeleton';

export default function RoadmapView({
  tripData,
  onPlanTrip,
  isLoading = false,
  pendingTripParams = null,
  generationPhase = 'Curating bespoke travel roadmap...',
  roadmapLayout: propRoadmapLayout,
  setRoadmapLayout: propSetRoadmapLayout,
  currency = 'USD',
  checklist: externalChecklist,
  onToggleChecklistItem: externalToggleChecklistItem,
  theme = 'light'
}) {
  const { user, isAuthenticated, openAuthModal, openSavedTrips } = useAuth();

  // Itinerary state: Null by default (no fake default sample trip when logged out/no trip generated)
  const [itinerary, setItinerary] = useState(() => {
    if (tripData?.itinerary) return tripData.itinerary;
    if (tripData) return tripData;
    return null;
  });
  
  const tripId = tripData?.id || null;
  const destination = tripData?.destination || itinerary?.destination || pendingTripParams?.destination || 'Destination';
  const origin = tripData?.origin || itinerary?.origin || pendingTripParams?.origin || 'Origin';
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Selection states driving live budget simulator and booking checklist
  const [selectedFlightIndex, setSelectedFlightIndex] = useState(0);
  const [selectedHotelIndex, setSelectedHotelIndex] = useState(0);

  // Layout preference ('editorial' | 'bento')
  const [internalLayout, setInternalLayout] = useState(() => {
    try {
      const saved = localStorage.getItem('waypoint_roadmap_layout');
      return saved || 'editorial';
    } catch {
      return 'editorial';
    }
  });

  const currentLayout = propRoadmapLayout || internalLayout;

  // View state: 'active' | 'loading' | 'empty'
  const [viewState, setViewState] = useState(() => {
    if (isLoading) return 'loading';
    if (tripData) return 'active';
    return 'empty';
  });

  // Synchronize when incoming tripData or isLoading props change
  useEffect(() => {
    if (isLoading) {
      setViewState('loading');
      return;
    }
    if (tripData) {
      if (tripData.itinerary) {
        setItinerary(tripData.itinerary);
      } else {
        setItinerary(tripData);
      }
      setSelectedFlightIndex(0);
      setSelectedHotelIndex(0);
      setViewState('active');
    } else {
      setItinerary(null);
      setViewState('empty');
    }
  }, [isLoading, tripData]);

  const handleLayoutChange = (layout) => {
    if (propSetRoadmapLayout) {
      propSetRoadmapLayout(layout);
    } else {
      setInternalLayout(layout);
    }
    try {
      localStorage.setItem('waypoint_roadmap_layout', layout);
    } catch (e) {}
  };

  const selectedFlight = itinerary?.flightOptions?.[selectedFlightIndex];
  const selectedHotel = itinerary?.hotelRecommendations?.[selectedHotelIndex];
  const daysCount = pendingTripParams?.days || tripData?.days || itinerary?.days?.length || 4;

  // Shared booking checklist state
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
    } catch (e) {}
    return defaultChecklist;
  });

  // Keep flight/hotel names and destination fresh in checklist if not checked
  useEffect(() => {
    if (externalChecklist) return;
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
  }, [selectedFlight, selectedHotel, externalChecklist, itinerary?.destination]);

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

  const checklist = externalChecklist || internalChecklist;
  const handleToggleChecklist = externalToggleChecklistItem || internalToggleChecklistItem;

  const handleLoadSample = () => {
    setItinerary(SAMPLE_TOKYO_TRIP);
    setSelectedFlightIndex(0);
    setSelectedHotelIndex(0);
    setViewState('active');
  };

  const handleClearTrip = () => {
    setItinerary(null);
    setViewState('empty');
  };

  return (
    <div className={`w-full select-none text-slate-800 dark:text-slate-100 ${
      currentLayout === 'bento' && viewState === 'active'
        ? 'max-w-[1400px] mx-auto h-full lg:h-[calc(100vh-92px)] max-h-[860px] flex flex-col justify-center px-4 sm:px-6 py-0 overflow-hidden'
        : 'max-w-[1280px] mx-auto px-6 sm:px-8 py-6 sm:py-10 flex flex-col items-center'
    }`}>
      
      {/* ========================================================= */}
      {/* 1. UNIFIED CUTE THINKING ROBOT LOADING CARD               */}
      {/* ========================================================= */}
      {viewState === 'loading' && (
        <div className="w-full min-h-[500px] flex items-center justify-center py-10 sm:py-16 px-4 animate-fadeIn">
          <RoadmapSkeleton 
            layout={currentLayout} 
            destination={destination} 
            origin={origin} 
            days={daysCount}
            phaseText={generationPhase} 
          />
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. EMPTY WORKSPACE / SIGN-IN GATE CARD                    */}
      {/* ========================================================= */}
      {viewState === 'empty' && (
        <div className="w-full min-h-[520px] flex items-center justify-center py-12 px-4 animate-fadeIn max-w-[1280px]">
          <div className="max-w-xl w-full p-8 sm:p-12 rounded-[32px] text-center flex flex-col items-center space-y-6 bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-white/10 shadow-2xl shadow-slate-900/5 dark:shadow-black/50">
            {/* Subtle Glowing Compass Icon */}
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
              <Compass className="w-8 h-8" />
            </div>

            <div className="space-y-2.5">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {!isAuthenticated ? "Sign In to Unlock Your Roadmap" : "Your Roadmap Workspace is Ready"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                {!isAuthenticated 
                  ? "Sign in or create your free account to generate AI-curated itineraries, customize flight and stay booking passes, and manage your trips in the interactive cockpit."
                  : `Welcome back${user?.username ? `, @${user.username}` : ''}! Head over to the Planner to curate a bespoke day-by-day itinerary with flights and stays, or explore your saved trips.`
                }
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
              {!isAuthenticated ? (
                <>
                  <button
                    type="button"
                    onClick={() => openAuthModal('otp')}
                    className="w-full sm:flex-1 py-3 px-5 rounded-full text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30"
                  >
                    <span>Sign In / Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={onPlanTrip}
                    className="w-full sm:w-auto py-3 px-5 rounded-full text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200/80 dark:border-white/10"
                  >
                    <span>Go to Planner</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onPlanTrip}
                    className="w-full sm:flex-1 py-3 px-5 rounded-full text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30"
                  >
                    <span>Go to Planner</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={openSavedTrips}
                    className="w-full sm:flex-1 py-3 px-5 rounded-full text-xs sm:text-sm font-bold bg-white/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-white/10 hover:bg-white dark:hover:bg-slate-800 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Saved Trips</span>
                  </button>
                </>
              )}
            </div>

            {/* Subtle Interactive Demo Option */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-xs font-semibold text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Or preview interactive demo cockpit (Tokyo Sample)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. ACTIVE TRIP ROADMAP                                    */}
      {/* ========================================================= */}
      {viewState === 'active' && itinerary && (
        currentLayout === 'editorial' ? (
          /* =================================================== */
          /* DESIGN 1: CLASSIC EDITORIAL SCROLL VIEW             */
          /* =================================================== */
          <div className="w-full space-y-8 animate-fadeIn max-w-[1280px] mx-auto">
            {/* Section 1: Full-Bleed Destination Photography Editorial Hero Banner */}
            <RoadmapHeroBanner 
              itinerary={itinerary} 
              onPlanTrip={onPlanTrip} 
              onOpenEmailModal={() => setIsEmailModalOpen(true)}
              tripId={tripId}
            />

            {/* Section 2: Interactive Live Budget Simulator */}
            <BudgetAllocationCard 
              budgetBreakdown={itinerary.budgetBreakdown}
              selectedFlight={selectedFlight}
              selectedHotel={selectedHotel}
              daysCount={daysCount}
            />

            {/* Section 3: Tactile 3D Flip Boarding Passes & Stay Cards */}
            <ManualBookingGrid 
              flightOptions={itinerary.flightOptions}
              hotelRecommendations={itinerary.hotelRecommendations}
              selectedFlightIndex={selectedFlightIndex}
              onSelectFlight={setSelectedFlightIndex}
              selectedHotelIndex={selectedHotelIndex}
              onSelectHotel={setSelectedHotelIndex}
              currency={currency}
              daysCount={daysCount}
            />

            {/* Section 4: Asymmetric Split-View Itinerary (65% Timeline / 35% Dining & Checklist) */}
            <DailyItineraryTimeline 
              days={itinerary.days}
              currency={currency}
              selectedFlight={selectedFlight}
              selectedHotel={selectedHotel}
              checklist={checklist}
              onToggleChecklistItem={handleToggleChecklist}
            />

            {/* Footer Actions & Discreet Testing Trigger */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200/60 dark:border-white/10 text-xs text-slate-400 dark:text-slate-500 max-w-[1280px] mx-auto">
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>
                  Waypoint Editorial Roadmap • Direct Booking Verification
                </span>
              </div>

              {/* Subtle, Discreet Testing Trigger in Footer */}
              <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 p-1 rounded-full border border-slate-200/60 dark:border-white/10 text-[11px]">
                <span className="text-slate-400 dark:text-slate-500 px-2 flex items-center gap-1 font-semibold">
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Preview:</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (!itinerary) setItinerary(SAMPLE_TOKYO_TRIP);
                    setViewState('active');
                  }}
                  className={`px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                    viewState === 'active' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => setViewState('loading')}
                  className={`px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                    viewState === 'loading' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Loading
                </button>
                <button
                  type="button"
                  onClick={() => setViewState('empty')}
                  className={`px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                    viewState === 'empty' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Empty
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* =================================================== */
          /* DESIGN 2: BENTO GRID INTERACTIVE COCKPIT            */
          /* Locked 100% to single desktop viewport (No Scroll)  */
          /* =================================================== */
          <div className="w-full h-full lg:h-[calc(100vh-120px)] max-h-[820px] flex flex-col justify-start overflow-hidden animate-fadeIn max-w-[1400px] mx-auto">
            <BentoRoadmapWorkspace 
              itinerary={itinerary}
              selectedFlightIndex={selectedFlightIndex}
              onSelectFlight={setSelectedFlightIndex}
              selectedHotelIndex={selectedHotelIndex}
              onSelectHotel={setSelectedHotelIndex}
              onPlanTrip={onPlanTrip}
              checklist={checklist}
              onToggleChecklistItem={handleToggleChecklist}
              currency={currency}
              theme={theme}
              onOpenEmailModal={() => setIsEmailModalOpen(true)}
              tripId={tripId}
            />
          </div>
        )
      )}

      {/* Global Email Roadmap Modal */}
      <EmailRoadmapModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        tripId={tripId}
        tripTitle={itinerary?.tripTitle}
        destination={destination}
      />

    </div>
  );
}
