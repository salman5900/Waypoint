import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';

export default function Navbar({ activeTab, setActiveTab, isScrolled = false }) {
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

  return (
    <header 
      className="w-full relative z-40 pointer-events-auto"
      style={{
        background: 'transparent',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        border: 'none',
        boxShadow: 'none',
      }}
    >
      <div 
        className="w-full max-w-[1280px] mx-auto flex items-center justify-between"
        style={{ padding: '24px 32px' }}
      >
        {/* LEFT: Zero-Shift, Taller Glass Pill for WAYPOINT Logo */}
        <div 
          onClick={() => setActiveTab('overview')}
          className="select-none inline-flex items-center cursor-pointer group hover:scale-[1.02] active:scale-[0.98]"
          style={{
            padding: '12px 22px',
            borderRadius: '9999px',
            border: '1px solid',
            borderColor: isScrolled ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
            backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.72)' : 'transparent',
            backdropFilter: isScrolled ? 'blur(18px) saturate(160%)' : 'none',
            WebkitBackdropFilter: isScrolled ? 'blur(18px) saturate(160%)' : 'none',
            boxShadow: isScrolled ? '0 8px 24px rgba(15, 23, 42, 0.06)' : 'none',
            transition: 'background-color 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease, transform 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <span className="text-slate-900 group-hover:text-blue-600 font-extrabold tracking-[0.2em] text-lg sm:text-xl leading-none transition-colors duration-200">
            WAYPOINT
          </span>
        </div>

        {/* RIGHT: Standalone floating rounded glassmorphic navigation pill with fluid gliding indicator */}
        <nav 
          ref={navRef}
          className="relative flex items-center gap-1 p-1.5"
          style={{
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.62)',
            backdropFilter: 'blur(18px) saturate(160%)',
            WebkitBackdropFilter: 'blur(18px) saturate(160%)',
            border: '1px solid rgba(255, 255, 255, 0.75)',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
            whiteSpace: 'nowrap',
          }}
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
                className={`relative z-10 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm cursor-pointer select-none active:scale-[0.97] ${
                  isActive
                    ? 'font-semibold'
                    : 'font-medium hover:text-slate-900 hover:bg-white/40'
                }`}
                style={{
                  color: isActive ? '#2563eb' : '#475569',
                  backgroundColor: 'transparent',
                  border: '1px solid transparent',
                  transition: 'color 0.25s ease, background-color 0.2s ease, transform 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
