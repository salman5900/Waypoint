import React, { useState } from 'react';
import { 
  Plane, 
  Hotel, 
  MapPin, 
  ExternalLink, 
  RotateCw, 
  Check, 
  Clock, 
  Luggage, 
  ShieldCheck, 
  Sparkles,
  Compass
} from 'lucide-react';

export default function ManualBookingGrid({
  flightOptions = [],
  hotelRecommendations = [],
  selectedFlightIndex = 0,
  onSelectFlight,
  selectedHotelIndex = 0,
  onSelectHotel,
  currency = 'USD',
  daysCount = 4
}) {
  // Track independent flip state for flight and hotel cards
  const [flippedFlights, setFlippedFlights] = useState({});
  const [flippedHotels, setFlippedHotels] = useState({});

  const toggleFlightFlip = (idx) => {
    setFlippedFlights((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleHotelFlip = (idx) => {
    setFlippedHotels((prev) => ({ ...prev, [idx]: !prev[idx] }));
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

  const nightsCount = Math.max(1, daysCount - 1);

  return (
    <div className="w-full space-y-6 mb-10 sm:mb-12">
      
      {/* Section Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
          Tactile Logistics & Reservations
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Select preferred routes and stays to recalculate your live budget. Flip cards to view insider tips and direct booking portals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ======================================================= */}
        {/* 1. FLIGHT BOARDING-PASS 3D FLIP CARDS                   */}
        {/* ======================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/15 border border-blue-200/60 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Plane className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-50">
                Flight Boarding Passes
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400">
              Flip for insider booking tip
            </span>
          </div>

          <div className="space-y-5">
            {flightOptions.map((flight, idx) => {
              const isSelected = selectedFlightIndex === idx;
              const isFlipped = !!flippedFlights[idx];
              const [origin, dest] = flight.route ? flight.route.split('→').map(s => s.trim()) : ['SFO', 'HND'];

              return (
                <div 
                  key={idx}
                  className="flip-card-container w-full h-[260px] cursor-pointer"
                  onClick={() => toggleFlightFlip(idx)}
                >
                  <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
                    
                    {/* ---------------- FRONT FACE (Minimalist Boarding Pass) ---------------- */}
                    <div 
                      className={`flip-card-front p-6 flex flex-col justify-between border transition-all ${
                        isSelected 
                          ? 'bg-white dark:bg-slate-900 border-blue-400 dark:border-blue-500 shadow-md ring-2 ring-blue-500/10' 
                          : 'bg-white/90 dark:bg-slate-900/85 border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-xs'
                      }`}
                    >
                      {/* Top Bar */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                            {flight.airline}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-500/30">
                            {flight.stops}
                          </span>
                        </div>

                        {/* Select Flight Radio Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectFlight(idx);
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                          <span>{isSelected ? 'Selected' : 'Select Flight'}</span>
                        </button>
                      </div>

                      {/* Airport Route Display */}
                      <div className="flex items-center justify-between py-2">
                        <div className="text-left">
                          <span className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight font-mono">
                            {origin || 'SFO'}
                          </span>
                          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 m-0 uppercase tracking-wider">Departure</p>
                        </div>

                        <div className="flex flex-col items-center px-4 flex-1">
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                            <Clock className="w-3 h-3 text-slate-400 dark:text-slate-400" />
                            <span>{flight.duration}</span>
                          </span>
                          <div className="w-full flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-blue-600" />
                            <div className="flex-1 border-t-2 border-dashed border-slate-300 dark:border-slate-700" />
                            <Plane className="w-4 h-4 text-blue-600 rotate-90 shrink-0" />
                            <div className="flex-1 border-t-2 border-dashed border-slate-300 dark:border-slate-700" />
                            <div className="w-2 h-2 rounded-full bg-blue-600" />
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight font-mono">
                            {dest || 'HND'}
                          </span>
                          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 m-0 uppercase tracking-wider">Arrival</p>
                        </div>
                      </div>

                      {/* Perforated Divider & Bottom Bar */}
                      <div className="pt-3 border-t border-dashed border-slate-200 dark:border-white/10 flex items-center justify-between">
                        <div>
                          <span className="text-xl font-black text-slate-900 dark:text-slate-50">
                            {formatCurrency(flight.estimatedPrice)}
                          </span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-400 ml-1">round-trip</span>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                          <RotateCw className="w-3 h-3" />
                          <span>Flip for Tip & Booking</span>
                        </div>
                      </div>
                    </div>

                    {/* ---------------- BACK FACE (Insider Tip & Booking Portal) ---------------- */}
                    <div className="flip-card-back p-6 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 text-white border border-blue-900/60 shadow-lg">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Compass className="w-4 h-4 text-blue-400" />
                            <span className="text-xs font-black uppercase tracking-wider text-blue-300">
                              Insider Route Intelligence
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFlightFlip(idx);
                            }}
                            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCw className="w-3 h-3" />
                            <span>Flip back</span>
                          </button>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
                          <p className="text-xs text-slate-200 leading-relaxed m-0 font-medium">
                            {flight.tip || 'Book 6–8 weeks in advance for optimal seat selection on this nonstop service.'}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-[11px] text-slate-300 pt-1">
                          <div className="flex items-center gap-1">
                            <Luggage className="w-3.5 h-3.5 text-blue-400" />
                            <span>1 Carry-on + 2 Checked Bags Included</span>
                          </div>
                        </div>
                      </div>

                      {/* Direct CTA */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs text-slate-300 font-medium">
                          {flight.airline} • {flight.route}
                        </span>

                        <a
                          href={flight.bookingSearchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-4 py-2 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer"
                        >
                          <span>Book on Google Flights</span>
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

        {/* ======================================================= */}
        {/* 2. HOTEL PHOTO 3D FLIP CARDS                            */}
        {/* ======================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-500/15 border border-sky-200/60 dark:border-sky-500/30 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <Hotel className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-50">
                Handpicked Stays
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400">
              Flip for neighborhood walkability
            </span>
          </div>

          <div className="space-y-5">
            {hotelRecommendations.map((hotel, idx) => {
              const isSelected = selectedHotelIndex === idx;
              const isFlipped = !!flippedHotels[idx];
              const totalHotelStay = hotel.pricePerNight * nightsCount;
              const hotelImg = hotel.image || 
                (idx === 0 
                  ? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
                  : 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80');

              return (
                <div 
                  key={idx}
                  className="flip-card-container w-full h-[260px] cursor-pointer"
                  onClick={() => toggleHotelFlip(idx)}
                >
                  <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
                    
                    {/* ---------------- FRONT FACE (Property Photo Card) ---------------- */}
                    <div 
                      className={`flip-card-front flex flex-col justify-between border overflow-hidden transition-all ${
                        isSelected 
                          ? 'bg-white dark:bg-slate-900 border-sky-400 dark:border-sky-500 shadow-md ring-2 ring-sky-500/10' 
                          : 'bg-white/90 dark:bg-slate-900/85 border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-xs'
                      }`}
                    >
                      {/* Photo Thumbnail Header */}
                      <div className="relative h-28 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img 
                          src={hotelImg} 
                          alt={hotel.name}
                          decoding="async"
                          className="w-full h-full object-cover filter brightness-95 hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/95 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 border border-white/60 dark:border-white/15 shadow-xs flex items-center gap-1">
                          <span className="text-amber-500 font-black">★</span>
                          <span>{hotel.rating}</span>
                        </div>

                        {/* Select Stay Toggle Pill */}
                        <div className="absolute top-3 right-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectHotel(idx);
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                              isSelected
                                ? 'bg-sky-600 text-white'
                                : 'bg-white/95 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-750'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                            <span>{isSelected ? 'Selected' : 'Select Stay'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-4 flex flex-col justify-between flex-1">
                        <div>
                          <h4 className="text-base font-black text-slate-900 dark:text-slate-50 tracking-tight leading-tight">
                            {hotel.name}
                          </h4>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{hotel.neighborhood}</span>
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                          <div>
                            <span className="text-lg font-black text-slate-900 dark:text-slate-50">
                              {formatCurrency(hotel.pricePerNight)}
                            </span>
                            <span className="text-xs text-slate-400 dark:text-slate-400 ml-1">/ night</span>
                          </div>

                          <div className="flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300">
                            <RotateCw className="w-3 h-3" />
                            <span>Flip for Details</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ---------------- BACK FACE (Why It Fits & Booking CTA) ---------------- */}
                    <div className="flip-card-back p-6 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-850 to-sky-950 text-white border border-sky-900/60 shadow-lg">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-sky-400" />
                            <span className="text-xs font-black uppercase tracking-wider text-sky-300">
                              Why This Stay Fits
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleHotelFlip(idx);
                            }}
                            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCw className="w-3 h-3" />
                            <span>Flip back</span>
                          </button>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
                          <p className="text-xs text-slate-200 leading-relaxed m-0 font-medium">
                            {hotel.whyItFits}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                          <span>Neighborhood: <strong>{hotel.neighborhood}</strong></span>
                          <span>Total for {nightsCount} nights: <strong>{formatCurrency(totalHotelStay)}</strong></span>
                        </div>
                      </div>

                      {/* Direct CTA */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs text-slate-300 font-medium">
                          {hotel.name}
                        </span>

                        <a
                          href={hotel.bookingSearchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-4 py-2 rounded-full text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white transition-all flex items-center gap-1.5 shadow-md shadow-sky-600/30 cursor-pointer"
                        >
                          <span>Check Availability</span>
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

      </div>

    </div>
  );
}
