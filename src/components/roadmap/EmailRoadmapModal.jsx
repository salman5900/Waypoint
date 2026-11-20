import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  Check, 
  X, 
  Loader2, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { emailRoadmap } from '../../services/tripApi';
import { message } from 'antd';

export default function EmailRoadmapModal({
  isOpen,
  onClose,
  tripId,
  tripTitle = 'Curated Travel Roadmap',
  destination: _destination = 'Destination',
}) {
  const { user, isAuthenticated, registerModalOpen, registerModalClose } = useAuth();
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-fill user email if authenticated & register modal open state
  useEffect(() => {
    if (isOpen) {
      if (registerModalOpen) registerModalOpen();
      document.body.classList.add('waypoint-modal-open');
      setEmail(user?.email || '');
      setSentSuccess(false);
      setErrorMessage('');

      return () => {
        if (registerModalClose) registerModalClose();
        document.body.classList.remove('waypoint-modal-open');
      };
    }
  }, [isOpen, user, registerModalOpen, registerModalClose]);

  if (!isOpen) return null;

  const isDemoTrip = !tripId || String(tripId).startsWith('tokyo-') || tripId === 'sample';

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSending(true);
    setErrorMessage('');

    try {
      const res = await emailRoadmap(tripId, email.trim());
      setIsSending(false);
      setSentSuccess(true);
      message.success(res.message || `Roadmap dispatched to ${email}!`);
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err) {
      setIsSending(false);
      setErrorMessage(err.message || 'Failed to dispatch email. Please try again.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 dark:bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-[32px] overflow-hidden p-6 sm:p-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-white/10 shadow-[0_24px_64px_-12px_rgba(15,23,42,0.25)] dark:shadow-[0_24px_64px_-12px_rgba(0,0,0,0.7)] text-slate-900 dark:text-white relative animate-scaleUp"
      >
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1 mb-6 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
            <Mail className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span>EXPORT & SHARE</span>
          </div>
          <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Email Trip Roadmap
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Get the full day-by-day itinerary, flight routes, stay reservations, and Google Map pins delivered to your inbox.
          </p>
        </div>

        {/* Trip Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-white/10 mb-5 text-left">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Target Itinerary</span>
          <h4 className="text-sm font-black text-slate-900 dark:text-white truncate mt-0.5">
            {tripTitle}
          </h4>
          {isDemoTrip && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1 m-0">
              ⚡ Demo Itinerary: Dispatching sample Tokyo guide. For live flight search links, generate a custom trip in Planner.
            </p>
          )}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {sentSuccess ? (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h4 className="text-base font-black text-slate-900 dark:text-white">
              Roadmap Dispatched!
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              Check your inbox at <strong>{email}</strong> for your complete itinerary pack and offline booking links.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Recipient Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoFocus
                  className="w-full h-11 pl-10 pr-4 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                />
              </div>
              {isAuthenticated && user?.email && (
                <span className="text-[10px] text-slate-400 block pt-0.5">
                  Autofilled from your signed-in account (@{user.username})
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/30 active:scale-98 transition-all disabled:opacity-60"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Itinerary...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Itinerary to Email</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Includes HTML mobile format & calendar bookmarks</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
