import React, { useState } from 'react';
import { 
  LayoutGrid, 
  FileText, 
  Check, 
  RotateCcw, 
  Trash2, 
  Sparkles, 
  Sliders, 
  Globe2, 
  Zap, 
  Layers, 
  ShieldCheck,
  ArrowRight,
  Sun,
  Moon
} from 'lucide-react';
import { message } from 'antd';

export default function SettingsView({
  roadmapLayout = 'editorial',
  setRoadmapLayout,
  currency = 'USD',
  setCurrency,
  theme = 'light',
  setTheme,
  onResetChecklist,
  onReloadSampleTrip,
  onClearTrip,
  onSwitchTab
}) {
  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('waypoint_enable_animations');
      return saved !== null ? JSON.parse(saved) : true;
    } catch (e) {
      return true;
    }
  });

  const [modalEffectsEnabled, setModalEffectsEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('waypoint_modal_effects');
      return saved !== null ? JSON.parse(saved) : true;
    } catch (e) {
      return true;
    }
  });

  const handleToggleLayout = () => {
    const nextLayout = roadmapLayout === 'bento' ? 'editorial' : 'bento';
    setRoadmapLayout(nextLayout);
    try {
      localStorage.setItem('waypoint_roadmap_layout', nextLayout);
    } catch (e) {}
    message.success({
      content: `Roadmap layout switched to ${nextLayout === 'bento' ? 'Bento Grid Cockpit' : 'Classic Editorial View'}`,
      duration: 2.5
    });
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    if (setTheme) {
      setTheme(nextTheme);
    }
    try {
      localStorage.setItem('waypoint_theme', nextTheme);
    } catch (e) {}
    message.success({
      content: `Theme switched to ${nextTheme === 'dark' ? 'Dark Obsidian Studio' : 'Light Ice Studio'}`,
      duration: 2.5
    });
  };

  const handleSelectLayout = (layout) => {
    if (layout === roadmapLayout) return;
    setRoadmapLayout(layout);
    try {
      localStorage.setItem('waypoint_roadmap_layout', layout);
    } catch (e) {}
    message.success({
      content: `Roadmap layout switched to ${layout === 'bento' ? 'Bento Grid Cockpit' : 'Classic Editorial View'}`,
      duration: 2.5
    });
  };

  const handleSelectCurrency = (curr) => {
    setCurrency(curr);
    try {
      localStorage.setItem('waypoint_currency', curr);
    } catch (e) {}
    message.success(`Currency updated to ${curr}`);
  };

  const handleToggleAnimations = () => {
    const next = !animationsEnabled;
    setAnimationsEnabled(next);
    try {
      localStorage.setItem('waypoint_enable_animations', JSON.stringify(next));
    } catch (e) {}
    message.info(`Animations ${next ? 'enabled' : 'reduced'}`);
  };

  const handleToggleModalEffects = () => {
    const next = !modalEffectsEnabled;
    setModalEffectsEnabled(next);
    try {
      localStorage.setItem('waypoint_modal_effects', JSON.stringify(next));
    } catch (e) {}
    message.info(`Visual effects ${next ? 'enabled' : 'standardized'}`);
  };

  const handleResetChecklistAction = () => {
    if (onResetChecklist) {
      onResetChecklist();
    } else {
      try {
        localStorage.removeItem('waypoint_manual_booking_checklist_v1');
      } catch (e) {}
    }
    message.success('Travel booking checklist reset to default state');
  };

  const handleReloadSampleAction = () => {
    if (onReloadSampleTrip) {
      onReloadSampleTrip();
    }
    message.success('Tokyo 4-day editorial itinerary reloaded');
    if (onSwitchTab) {
      setTimeout(() => onSwitchTab('roadmap'), 300);
    }
  };

  const handleClearTripAction = () => {
    if (onClearTrip) {
      onClearTrip();
    }
    message.info('Itinerary cache cleared');
  };

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar', region: 'North America / Global' },
    { code: 'EUR', symbol: '€', name: 'Euro', region: 'European Union' },
    { code: 'GBP', symbol: '£', name: 'British Pound', region: 'United Kingdom' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', region: 'Japan' },
  ];

  return (
    <div className="w-full max-w-[1180px] mx-auto px-6 sm:px-8 py-8 sm:py-12 space-y-8 select-none text-slate-800 dark:text-slate-100 animate-fadeIn transition-colors duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1.5">
            <Sliders className="w-3.5 h-3.5" />
            <span>Workspace Preferences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Settings & Layout Control
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Configure your Waypoint trip workspace design, global color theme, regional currency formatting, and session storage.
          </p>
        </div>

        {onSwitchTab && (
          <button
            type="button"
            onClick={() => onSwitchTab('roadmap')}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 hover:border-blue-400 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 shadow-xs cursor-pointer transition-all"
          >
            <span>Open Roadmap Tab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* CARD 1: Appearance & Layout (Design 1 vs Design 2 + Dark Mode) */}
      <section className="p-6 sm:p-8 rounded-[28px] bg-white/80 dark:bg-slate-900/75 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-[0_4px_24px_rgba(15,23,42,0.04)] dark:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] space-y-6 transition-colors duration-300">
        
        {/* Master Toggles: Bento Grid & Dark Mode Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Master Toggle 1: Bento Grid */}
          <div className="flex flex-col justify-between gap-3 p-5 rounded-2xl bg-gradient-to-r from-blue-50/70 via-slate-50 to-white dark:from-slate-800/60 dark:via-slate-800/40 dark:to-slate-800/20 border border-blue-100/80 dark:border-white/10">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Planner Bento Grid
                    </h3>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      roadmapLayout === 'bento' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {roadmapLayout === 'bento' ? 'Active' : 'Off'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    Switch Roadmap from classic scroll to asymmetrical cockpit.
                  </p>
                </div>
              </div>

              {/* Tactile Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={roadmapLayout === 'bento'}
                onClick={handleToggleLayout}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  roadmapLayout === 'bento' ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    roadmapLayout === 'bento' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Master Toggle 2: Global Dark Mode */}
          <div className="flex flex-col justify-between gap-3 p-5 rounded-2xl bg-gradient-to-r from-slate-50 via-indigo-50/40 to-white dark:from-indigo-950/40 dark:via-slate-800/40 dark:to-slate-800/20 border border-slate-200/80 dark:border-white/10">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/20">
                  {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Dark Obsidian Studio
                    </h3>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      theme === 'dark' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {theme === 'dark' ? 'Obsidian' : 'Ice White'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    Deep midnight canvas with smoked-glass depth.
                  </p>
                </div>
              </div>

              {/* Tactile Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={theme === 'dark'}
                onClick={handleToggleTheme}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

        </div>

        {/* Visual Layout Selection Cards */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wide uppercase">
            Select Preferred Roadmap Layout
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Design 1: Classic Editorial View */}
            <div
              onClick={() => handleSelectLayout('editorial')}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 relative flex flex-col justify-between space-y-4 ${
                roadmapLayout === 'editorial'
                  ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-600 shadow-md shadow-blue-600/10'
                  : 'bg-white/70 dark:bg-slate-800/40 border-slate-200/90 dark:border-white/10 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      roadmapLayout === 'editorial' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                        Classic Editorial View
                      </h4>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Design 1</span>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    roadmapLayout === 'editorial'
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 dark:border-slate-600 bg-transparent'
                  }`}>
                    {roadmapLayout === 'editorial' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                {/* Mini Visual Wireframe for Editorial */}
                <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 space-y-2">
                  <div className="w-full h-8 rounded-lg bg-blue-200/60 dark:bg-blue-900/40 flex items-center px-2.5">
                    <div className="w-16 h-2 rounded bg-blue-600/70 dark:bg-blue-400/80" />
                  </div>
                  <div className="w-full h-5 rounded-md bg-white dark:bg-slate-700 border border-slate-200/80 dark:border-white/10 flex items-center px-2 gap-1.5">
                    <div className="w-8 h-1.5 rounded-full bg-blue-600/60" />
                    <div className="w-12 h-1.5 rounded-full bg-amber-500/60" />
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="h-9 rounded-md bg-white dark:bg-slate-700 border border-slate-200/80 dark:border-white/10 col-span-2" />
                    <div className="h-9 rounded-md bg-white dark:bg-slate-700 border border-slate-200/80 dark:border-white/10 col-span-1" />
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Long-form narrative flow with full-bleed magazine hero, live budget allocation simulator, tactile 3D flip boarding passes, and 65/35 split timeline.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200/60 dark:border-white/10">
                {['Split-Cover Hero', 'Live Simulator', '3D Flip Passes', 'Split Timeline'].map((tag) => (
                  <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Design 2: Bento Grid Cockpit */}
            <div
              onClick={() => handleSelectLayout('bento')}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 relative flex flex-col justify-between space-y-4 ${
                roadmapLayout === 'bento'
                  ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-600 shadow-md shadow-blue-600/10'
                  : 'bg-white/70 dark:bg-slate-800/40 border-slate-200/90 dark:border-white/10 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      roadmapLayout === 'bento' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}>
                      <LayoutGrid className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                        Bento Grid Cockpit
                      </h4>
                      <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">Design 2 (Single-Viewport)</span>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    roadmapLayout === 'bento'
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 dark:border-slate-600 bg-transparent'
                  }`}>
                    {roadmapLayout === 'bento' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                {/* Mini Visual Wireframe for Bento */}
                <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 grid grid-cols-4 grid-rows-3 gap-1.5 h-[98px]">
                  <div className="row-span-2 col-span-1 rounded-md bg-white dark:bg-slate-700 border border-slate-200/80 dark:border-white/10 flex items-center justify-center">
                    <div className="w-4 h-6 rounded bg-blue-100/80 dark:bg-blue-900/60 transform -rotate-3" />
                  </div>
                  <div className="row-span-2 col-span-2 rounded-md bg-blue-600/80 flex items-center justify-center text-white text-[9px] font-bold">
                    HERO
                  </div>
                  <div className="row-span-1 col-span-1 rounded-md bg-white dark:bg-slate-700 border border-slate-200/80 dark:border-white/10" />
                  <div className="row-span-1 col-span-1 rounded-md bg-white dark:bg-slate-700 border border-slate-200/80 dark:border-white/10" />
                  <div className="row-span-1 col-span-2 rounded-md bg-white dark:bg-slate-700 border border-slate-200/80 dark:border-white/10" />
                  <div className="row-span-1 col-span-2 rounded-md bg-white dark:bg-slate-700 border border-slate-200/80 dark:border-white/10" />
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Asymmetric 4×3 spatial cockpit with day-synced hero photo flip, interactive SVG donut budget ring, stacked tilted passes, and 3D fanned schedule deck.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200/60 dark:border-white/10">
                {['Single-Viewport', '3D Hero Flip', '3D Fanned Stack', 'Modal Trays'].map((tag) => (
                  <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-100/70 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CARD 2: Regional & Currency Configuration */}
      <section className="p-6 sm:p-8 rounded-[28px] bg-white/80 dark:bg-slate-900/75 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-[0_4px_24px_rgba(15,23,42,0.04)] dark:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] space-y-4 transition-colors duration-300">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/70 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Globe2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Display Currency
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select the currency used to calculate live totals, flight pricing, accommodation rates, and dining estimates.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {currencies.map((curr) => {
            const isSelected = currency === curr.code;
            return (
              <button
                key={curr.code}
                type="button"
                onClick={() => handleSelectCurrency(curr.code)}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-150 flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-600 ring-1 ring-blue-600/30 shadow-xs'
                    : 'bg-white dark:bg-slate-800/40 border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    {curr.symbol} <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{curr.code}</span>
                  </span>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{curr.name}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{curr.region}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* CARD 3: Motion & Tactile Physics */}
      <section className="p-6 sm:p-8 rounded-[28px] bg-white/80 dark:bg-slate-900/75 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-[0_4px_24px_rgba(15,23,42,0.04)] dark:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] space-y-5 transition-colors duration-300">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/70 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Visual Physics & 3D Optics
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure GPU 3D perspective cards, card flip rotations, and smoked backdrop-blur effects.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-white/10">
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                3D Perspective Flips & Spring Sweeps
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Enables hardware-accelerated 3D fanned card stacks and photo flip choreography.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={animationsEnabled}
              onClick={handleToggleAnimations}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                animationsEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  animationsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="py-3.5 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Smoked Frosted Glass & Vignettes
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Renders deep backdrop-filter blurs and high-contrast photo gradient scrims.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={modalEffectsEnabled}
              onClick={handleToggleModalEffects}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                modalEffectsEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  modalEffectsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* CARD 4: Data Management & Cache */}
      <section className="p-6 sm:p-8 rounded-[28px] bg-white/80 dark:bg-slate-900/75 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-[0_4px_24px_rgba(15,23,42,0.04)] dark:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] space-y-5 transition-colors duration-300">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/70 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Session Data & Itinerary Cache
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage local browser persistence for booking checklists and trip schedules.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Reset Checklist */}
          <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-slate-800/40 flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Reset Booking Checklist</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Clears manual checkmarks and restores all 5 travel logistics items.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetChecklistAction}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Reset Checklist</span>
            </button>
          </div>

          {/* Reload Sample Trip */}
          <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-slate-800/40 flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Reload Tokyo Sample</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Restores the verified 4-day Tokyo itinerary with dining and flights.
              </p>
            </div>
            <button
              type="button"
              onClick={handleReloadSampleAction}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 hover:bg-blue-100/70 dark:hover:bg-blue-900/40 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Reload Sample</span>
            </button>
          </div>

          {/* Clear Cache */}
          <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-slate-800/40 flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Clear Cache & Reset</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Purges active trip data and switches Roadmap to empty prompt state.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClearTripAction}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-red-50/70 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40 hover:bg-red-100 dark:hover:bg-red-900/60 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              <span>Clear Cache</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200/60 dark:border-white/10 text-xs text-slate-400 dark:text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Waypoint Travel Architecture • Client-Side Local Storage • Zero Remote Telemetry</span>
        </div>
        <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
          Theme: {theme} • Layout: {roadmapLayout}
        </div>
      </div>

    </div>
  );
}
