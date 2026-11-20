import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { User, Compass, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab, isScrolled = false }) {
  const { user, isAuthenticated, openAuthModal, openSavedTrips, logout, isAnyModalOpen } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'planner', label: 'Planner' },
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'settings', label: 'Settings' },
  ];

  const navRef = useRef(null);
  const tabRefs = useRef({});
  const isFirstRender = useRef(true);

  const [indicator, setIndicator] = useState({
    left: 0,
    top: 6,
    width: 0,
    height: 36,
    ready: false,
  });

  const updateIndicator = () => {
    const activeEl = tabRefs.current[activeTab];
    if (!activeEl) return;
    setIndicator({
      left: activeEl.offsetLeft,
      top: activeEl.offsetTop,
      width: activeEl.offsetWidth,
      height: activeEl.offsetHeight,
      ready: true,
    });
  };

  useLayoutEffect(() => {
    updateIndicator();

    if (isFirstRender.current) {
      const raf = requestAnimationFrame(() => {
        isFirstRender.current = false;
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [activeTab]);

  useEffect(() => {
    const handleResize = () => updateIndicator();
    window.addEventListener('resize', handleResize);

    let ro;
    if (typeof ResizeObserver !== 'undefined' && navRef.current) {
      ro = new ResizeObserver(() => {
        updateIndicator();
      });
      ro.observe(navRef.current);
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(updateIndicator);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (ro) ro.disconnect();
    };
  }, [activeTab]);

  // Click outside to close user dropdown menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header 
      className={`w-full relative z-40 transition-opacity duration-300 ${
        isAnyModalOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
      style={{
        background: 'transparent',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        border: 'none',
        boxShadow: 'none',
      }}
    >
      <div 
        className="w-full max-w-[1280px] mx-auto flex items-center justify-between gap-4"
        style={{ padding: '24px 32px' }}
      >
        {/* LEFT: Zero-Shift, Taller Glass Pill for WAYPOINT Logo */}
        <div 
          onClick={() => setActiveTab('overview')}
          className={`select-none inline-flex items-center cursor-pointer group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 rounded-full px-5 py-3 ${
            isScrolled 
              ? 'bg-white/75 dark:bg-slate-900/80 border border-white/80 dark:border-white/10 backdrop-blur-xl shadow-md shadow-slate-900/5 dark:shadow-black/30' 
              : 'border border-transparent bg-transparent'
          }`}
        >
          <span className="text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 font-extrabold tracking-[0.2em] text-lg sm:text-xl leading-none transition-colors duration-200">
            WAYPOINT
          </span>
        </div>

        {/* RIGHT GROUP: Standalone floating navigation pill + User Auth Pill */}
        <div className="flex items-center gap-2.5">
          {/* Navigation Pill with fluid gliding indicator (Matched h-11) */}
          <nav 
            ref={navRef}
            className="relative h-11 box-border flex items-center gap-1 px-1.5 rounded-full bg-white/65 dark:bg-slate-900/75 backdrop-blur-xl border border-white/75 dark:border-white/10 shadow-lg shadow-slate-900/5 dark:shadow-black/40 transition-colors duration-300 whitespace-nowrap"
          >
            {/* Shared Gliding Active Indicator Pill */}
            <div
              className="nav-gliding-pill"
              style={{
                top: `${indicator.top}px`,
                left: 0,
                width: `${indicator.width}px`,
                height: `${indicator.height}px`,
                transform: `translate3d(${indicator.left}px, 0, 0)`,
                opacity: indicator.ready ? 1 : 0,
                transition: isFirstRender.current
                  ? 'opacity 0.15s ease'
                  : 'transform 0.38s cubic-bezier(0.22, 1, 0.36, 1), width 0.38s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    if (el) tabRefs.current[item.id] = el;
                  }}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative z-10 h-8 flex items-center px-3.5 sm:px-4 rounded-full text-xs sm:text-sm cursor-pointer select-none active:scale-[0.97] transition-all duration-200 ${
                    isActive
                      ? 'font-bold text-blue-600 dark:text-blue-400'
                      : 'font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User Auth Trigger: Matched h-11 Height and Identical Frosted Glass Styling */}
          {!isAuthenticated ? (
            <button
              type="button"
              onClick={() => openAuthModal('otp')}
              className="relative h-11 box-border flex items-center gap-2 px-4 rounded-full text-xs font-bold bg-white/65 dark:bg-slate-900/75 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 backdrop-blur-xl border border-white/75 dark:border-white/10 shadow-lg shadow-slate-900/5 dark:shadow-black/40 transition-all cursor-pointer select-none active:scale-95 shrink-0"
            >
              <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Sign In</span>
            </button>
          ) : (
            <div className="relative shrink-0 h-11 flex items-center" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="relative h-11 box-border flex items-center gap-2 px-3.5 rounded-full text-xs font-bold bg-white/65 dark:bg-slate-900/75 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 backdrop-blur-xl border border-white/75 dark:border-white/10 shadow-lg shadow-slate-900/5 dark:shadow-black/40 transition-all cursor-pointer select-none active:scale-95 shrink-0"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black uppercase">
                  {user?.username?.[0] || 'U'}
                </div>
                <span className="hidden sm:inline-block truncate max-w-[100px]">@{user?.username}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Frosted Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-2xl z-50 animate-fadeIn text-left">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Signed in as</span>
                    <span className="text-xs font-black text-slate-900 dark:text-white truncate block">@{user?.username}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block font-mono">{user?.email}</span>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        openSavedTrips();
                      }}
                      className="w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Saved Trips</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
