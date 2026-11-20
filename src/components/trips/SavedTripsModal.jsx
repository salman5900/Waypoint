import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowRight, 
  X, 
  Loader2, 
  RefreshCw, 
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getSavedTrips, getTripDetail } from '../../services/tripApi';
import { message } from 'antd';

export default function SavedTripsModal({ onSelectTrip, onPlanNewTrip }) {
  const { isSavedTripsOpen, closeSavedTrips, user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTripId, setLoadingTripId] = useState(null);
  const [error, setError] = useState(null);

  const fetchTrips = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSavedTrips();
      setTrips(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch saved trips.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSavedTripsOpen) {
      fetchTrips();
    }
  }, [isSavedTripsOpen]);

  if (!isSavedTripsOpen) return null;

  const handleSelectTrip = async (tripId) => {
    setLoadingTripId(tripId);
    try {
      const fullDetail = await getTripDetail(tripId);
      if (onSelectTrip) {
        onSelectTrip(fullDetail);
      }
      closeSavedTrips();
      message.success(`Loaded roadmap for ${fullDetail.destination || fullDetail.tripTitle}!`);
    } catch (err) {
      message.error(err.message || 'Failed to load trip details.');
    } finally {
      setLoadingTripId(null);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 dark:bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={closeSavedTrips}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[85vh] rounded-[32px] overflow-hidden p-6 sm:p-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-white/10 shadow-[0_24px_64px_-12px_rgba(15,23,42,0.25)] dark:shadow-[0_24px_64px_-12px_rgba(0,0,0,0.7)] text-slate-900 dark:text-white flex flex-col relative animate-scaleUp"
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200/60 dark:border-blue-800/60">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Saved Itineraries
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">
                  {trips.length} {trips.length === 1 ? 'Trip' : 'Trips'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
                Logged in as <strong className="text-slate-700 dark:text-slate-300">@{user?.username}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchTrips}
              disabled={isLoading}
              className="p-2 rounded-full text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title="Refresh saved trips"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={closeSavedTrips}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-3 min-h-[240px]">
          {isLoading && trips.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-2 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-xs font-semibold">Retrieving your saved trips...</span>
            </div>
          ) : error ? (
            <div className="p-6 text-center space-y-3">
              <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">{error}</p>
              <button
                type="button"
                onClick={fetchTrips}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : trips.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-base text-slate-800 dark:text-slate-200">
                  No Saved Trips Yet
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                  Generate a bespoke travel roadmap in the Planner tab, and it will automatically persist here.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  closeSavedTrips();
                  if (onPlanNewTrip) onPlanNewTrip();
                }}
                className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 cursor-pointer flex items-center gap-1.5"
              >
                <span>Plan a New Trip</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            trips.map((trip) => {
              const isSelectedLoading = loadingTripId === trip.id;
              return (
                <div
                  key={trip.id}
                  onClick={() => handleSelectTrip(trip.id)}
                  className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 hover:bg-blue-50/60 dark:hover:bg-slate-800/90 border border-slate-200/70 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/40 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 dark:text-white text-sm sm:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {trip.tripTitle || `${trip.destination} Expedition`}
                      </span>
                      {trip.createdAt && (
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          • {formatDate(trip.createdAt)}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                        <MapPin className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        <span>{trip.origin} → {trip.destination}</span>
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{trip.days} Days</span>
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{trip.members || 2}</span>
                      </span>
                      {trip.budget && (
                        <>
                          <span>•</span>
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                            {trip.currency || '$'}{Number(trip.budget).toLocaleString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end sm:justify-center shrink-0">
                    <button
                      type="button"
                      disabled={isSelectedLoading}
                      className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-slate-700 group-hover:bg-blue-600 group-hover:text-white text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 group-hover:border-transparent transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      {isSelectedLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <span>Load Roadmap</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <span>Synced with PostgreSQL database</span>
          <button
            type="button"
            onClick={() => {
              closeSavedTrips();
              if (onPlanNewTrip) onPlanNewTrip();
            }}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>+ Create Another Itinerary</span>
          </button>
        </div>

      </div>
    </div>
  );
}
