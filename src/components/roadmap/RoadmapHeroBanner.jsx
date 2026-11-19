import React, { useState } from 'react';
import { 
  Calendar, 
  Plane, 
  Hotel, 
  Mail, 
  ArrowRight, 
  Check, 
  Sparkles,
  MapPin,
  Send,
  Loader2,
  X
} from 'lucide-react';
import { message } from 'antd';
import { emailRoadmap } from '../../services/tripApi';

export default function RoadmapHeroBanner({ itinerary, onPlanTrip }) {
  const [imgError, setImgError] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const fallbackGradient = 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0284c7 100%)';
  const heroImageUrl = itinerary?.heroImage || 
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85';

  const daysCount = itinerary?.days?.length || 4;
  const flightsCount = itinerary?.flightOptions?.length || 2;
  const hotelsCount = itinerary?.hotelRecommendations?.length || 2;

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      message.warning('Please enter a valid email address.');
      return;
    }

    setIsSending(true);
    try {
      const res = await emailRoadmap('tokyo-curated-roadmap', email);
      setIsSending(false);
      message.success({
        content: res.message,
        icon: <Check className="w-4 h-4 text-emerald-600 inline-block mr-1" />,
      });
      setShowEmailInput(false);
      setEmail('');
    } catch (err) {
      setIsSending(false);
      message.error('Failed to send email. Please try again.');
    }
  };

  return (
    <div className="w-full mb-10 sm:mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* ======================================================= */}
        {/* LEFT COLUMN (60% / 7 Cols): Content & Spacious Email     */}
        {/* ======================================================= */}
        <div className="lg:col-span-7 space-y-5 text-left">
          
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>01 • CURATED ITINERARY</span>
          </div>

          {/* Bold Dark-Slate Trip Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black text-slate-900 tracking-tight leading-[1.08]">
            {itinerary?.tripTitle || 'Curated Travel Roadmap'}
          </h1>

          {/* Clean Summary */}
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
            {itinerary?.summary}
          </p>

          {/* Compact Glass Metadata Pills */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/80 text-slate-700 border border-slate-200/80 shadow-xs backdrop-blur-md">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>{daysCount} Days</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/80 text-slate-700 border border-slate-200/80 shadow-xs backdrop-blur-md">
              <Plane className="w-3.5 h-3.5 text-slate-600" />
              <span>{flightsCount} Flight Routes</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/80 text-slate-700 border border-slate-200/80 shadow-xs backdrop-blur-md">
              <Hotel className="w-3.5 h-3.5 text-slate-600" />
              <span>{hotelsCount} Stays</span>
            </div>
          </div>

          {/* Spacious Action Bar */}
          <div className="pt-2">
            {!showEmailInput ? (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowEmailInput(true)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold bg-white/95 text-slate-800 border border-slate-200/90 hover:bg-white hover:text-blue-600 active:scale-98 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>Email Roadmap</span>
                </button>

                <button
                  type="button"
                  onClick={onPlanTrip}
                  className="px-5 py-2.5 rounded-full text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/20"
                >
                  <span>Edit in Planner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <form 
                onSubmit={handleSendEmail} 
                className="flex items-center gap-2 bg-white/90 p-1.5 rounded-full border border-blue-200/90 shadow-md backdrop-blur-xl max-w-lg transition-all animate-fadeIn"
              >
                <div className="pl-3 text-slate-400">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  autoFocus
                  className="flex-1 px-2 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                />
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Roadmap ✈</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmailInput(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer mr-1"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* ======================================================= */}
        {/* RIGHT COLUMN (40% / 5 Cols): Visual Showcase Photo Frame */}
        {/* ======================================================= */}
        <div className="lg:col-span-5 h-[340px] sm:h-[380px] lg:h-[400px] w-full rounded-[32px] overflow-hidden relative group shadow-md border border-slate-200/70 bg-slate-900">
          {!imgError ? (
            <img
              src={heroImageUrl}
              alt={itinerary?.tripTitle || 'Destination Showcase'}
              onError={() => setImgError(true)}
              decoding="async"
              className="w-full h-full object-cover object-center filter brightness-[0.92] group-hover:scale-[1.02] transition-transform duration-700"
            />
          ) : (
            <div 
              className="w-full h-full"
              style={{ background: fallbackGradient }}
            />
          )}

          {/* Subtle Scrim for pill contrast */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.05) 0%, rgba(15, 23, 42, 0.15) 60%, rgba(15, 23, 42, 0.75) 100%)',
            }}
          />

          {/* Floating Frosted-Glass Location Pill (Bottom Left) */}
          <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/85 backdrop-blur-md text-slate-900 border border-white/80 shadow-md">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>TOKYO • SHINJUKU & SHIBUYA</span>
          </div>
        </div>

      </div>
    </div>
  );
}
