import React, { useState } from 'react';
import { 
  Compass, 
  ArrowRight, 
  Sparkles, 
  Navigation, 
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { SAMPLE_TOKYO_TRIP } from '../data/sampleTokyoTrip';
import RoadmapHeroBanner from './roadmap/RoadmapHeroBanner';
import BudgetAllocationCard from './roadmap/BudgetAllocationCard';
import ManualBookingGrid from './roadmap/ManualBookingGrid';
import DailyItineraryTimeline from './roadmap/DailyItineraryTimeline';

export default function RoadmapView({
  tripData,
  onPlanTrip,
  isLoading = false
}) {
  // Itinerary state
  const [itinerary, setItinerary] = useState(tripData || SAMPLE_TOKYO_TRIP);
  
  // Selection states driving live budget simulator and booking checklist
  const [selectedFlightIndex, setSelectedFlightIndex] = useState(0);
  const [selectedHotelIndex, setSelectedHotelIndex] = useState(0);

  // View state: 'active' | 'loading' | 'empty'
  const [viewState, setViewState] = useState(
    isLoading ? 'loading' : (tripData ? 'active' : 'active')
  );

  const selectedFlight = itinerary?.flightOptions?.[selectedFlightIndex];
  const selectedHotel = itinerary?.hotelRecommendations?.[selectedHotelIndex];
  const daysCount = itinerary?.days?.length || 4;
  const currency = itinerary?.budgetBreakdown?.currency || 'USD';

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
    <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-8 py-6 sm:py-10 flex flex-col items-center select-none text-slate-800">
      
      {/* ========================================================= */}
      {/* 1. LOADING SKELETON STATE                                 */}
      {/* ========================================================= */}
      {viewState === 'loading' && (
        <div className="w-full space-y-8 animate-fadeIn">
          {/* Skeleton Hero Banner */}
          <div className="w-full h-[320px] rounded-[32px] skeleton-shimmer relative overflow-hidden" />

          {/* Skeleton Budget */}
          <div className="roadmap-glass-card p-8 rounded-[28px] space-y-4">
            <div className="w-40 h-5 skeleton-shimmer rounded-full" />
            <div className="w-full h-4 skeleton-shimmer rounded-full" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 skeleton-shimmer rounded-2xl" />
              ))}
            </div>
          </div>

          {/* Skeleton Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="roadmap-glass-card p-6 rounded-[24px] h-64 skeleton-shimmer" />
            <div className="roadmap-glass-card p-6 rounded-[24px] h-64 skeleton-shimmer" />
          </div>

          <div className="flex items-center justify-center gap-3 py-6 text-slate-500 text-sm font-medium">
            <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
            <span>Generating bespoke roadmap with live flight & hotel recommendations...</span>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. EMPTY STATE                                            */}
      {/* ========================================================= */}
      {viewState === 'empty' && (
        <div className="w-full min-h-[500px] flex items-center justify-center py-12 animate-fadeIn">
          <div className="roadmap-glass-card max-w-lg w-full p-8 sm:p-12 rounded-[32px] text-center flex flex-col items-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-sm">
              <Navigation className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                No Roadmap Generated Yet
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed max-w-md">
                Waypoint organizes day-by-day itineraries, flight routing, stays, and restaurant recommendations into a unified interactive timeline.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
              <button
                type="button"
                onClick={onPlanTrip}
                className="w-full sm:flex-1 py-3 px-5 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
              >
                <span>Open Trip Planner</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                type="button"
                onClick={handleLoadSample}
                className="w-full sm:flex-1 py-3 px-5 rounded-full text-sm font-semibold bg-white/90 text-slate-700 border border-slate-200/90 hover:bg-white hover:border-slate-300 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Load Sample Tokyo Trip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. ACTIVE TRIP ROADMAP                                    */}
      {/* ========================================================= */}
      {viewState === 'active' && itinerary && (
        <div className="w-full space-y-8 animate-fadeIn">
          
          {/* Section 1: Full-Bleed Destination Photography Editorial Hero Banner */}
          <RoadmapHeroBanner 
            itinerary={itinerary} 
            onPlanTrip={onPlanTrip} 
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
          />

          {/* Footer Actions & Discreet Testing Trigger */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200/60 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              <span>Waypoint Editorial Roadmap • All bookings verified directly with providers</span>
            </div>

            {/* Subtle, Discreet Testing Trigger in Footer */}
            <div className="flex items-center gap-2 bg-white/60 p-1 rounded-full border border-slate-200/60 text-[11px]">
              <span className="text-slate-400 px-2 flex items-center gap-1 font-semibold">
                <SlidersHorizontal className="w-3 h-3" />
                <span>Preview:</span>
              </span>
              <button
                type="button"
                onClick={() => setViewState('active')}
                className={`px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                  viewState === 'active' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setViewState('loading')}
                className={`px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                  viewState === 'loading' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Loading
              </button>
              <button
                type="button"
                onClick={() => setViewState('empty')}
                className={`px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                  viewState === 'empty' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Empty
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
