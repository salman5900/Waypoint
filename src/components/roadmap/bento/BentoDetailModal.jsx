import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export default function BentoDetailModal({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children
}) {
  const auth = useAuth();
  const registerModalOpen = auth?.registerModalOpen;
  const registerModalClose = auth?.registerModalClose;

  useEffect(() => {
    if (!isOpen) return;

    if (registerModalOpen) registerModalOpen();
    document.body.classList.add('waypoint-modal-open');

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (registerModalClose) registerModalClose();
      document.body.classList.remove('waypoint-modal-open');
    };
  }, [isOpen, onClose, registerModalOpen, registerModalClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md transition-opacity animate-fadeIn select-none"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl max-h-[88vh] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[32px] border border-white/90 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col animate-modal-scale-in text-slate-800 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between gap-4 bg-white/70 dark:bg-slate-900/70">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {title}
              </h3>
              {badge && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto no-scrollbar flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
