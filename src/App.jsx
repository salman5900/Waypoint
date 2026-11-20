import React, { useState, useEffect, useRef } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import BackgroundGradients from './components/BackgroundGradients';
import OverviewView from './components/OverviewView';
import TripPlannerView from './components/TripPlannerView';
import RoadmapView from './components/RoadmapView';
import SettingsView from './components/SettingsView';
import TabViews from './components/TabViews';
import AuthModal from './components/auth/AuthModal';
import SavedTripsModal from './components/trips/SavedTripsModal';
import { SAMPLE_TOKYO_TRIP } from './data/sampleTokyoTrip';
import { generateTrip } from './services/tripApi';

const GENERATION_PHASES = [
  "Scouting multi-leg flights & stays...",
  "Mapping landmarks & dining gems...",
  "Structuring chronological day-by-day itinerary...",
  "Polishing bespoke travel recommendations...",
];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [templateData, setTemplateData] = useState(null);
  const [tripData, setTripData] = useState(null);
  const [isLoadingTrip, setIsLoadingTrip] = useState(false);
  const [pendingTripParams, setPendingTripParams] = useState(null);
  const [generationPhaseIndex, setGenerationPhaseIndex] = useState(0);
  const [plannerError, setPlannerError] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef(null);

  // Global theme state ('light' | 'dark')
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('waypoint_theme') || 'light';
    } catch (e) {
      return 'light';
    }
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('waypoint_theme', theme);
    } catch (e) {}
  }, [theme]);

  // Layout preference persisted in localStorage ('editorial' | 'bento')
  const [roadmapLayout, setRoadmapLayout] = useState(() => {
    try {
      return localStorage.getItem('waypoint_roadmap_layout') || 'editorial';
    } catch (e) {
      return 'editorial';
    }
  });

  // Currency preference persisted in localStorage ('USD' | 'EUR' | 'GBP' | 'JPY')
  const [currency, setCurrency] = useState(() => {
    try {
      return localStorage.getItem('waypoint_currency') || 'USD';
    } catch (e) {
      return 'USD';
    }
  });

  // Shared booking checklist state persisted across Design 1, Design 2, and Settings
  const checklistStorageKey = 'waypoint_manual_booking_checklist_v1';
  const defaultChecklist = [
    { id: 'flight', text: 'Book Flight (Selected Route)', checked: false },
    { id: 'hotel', text: 'Reserve Stay (Selected Property)', checked: false },
    { id: 'maps', text: 'Download Offline Maps & Metro Guides', checked: true },
    { id: 'esim', text: 'Order e-SIM or Mobile Pocket Wi-Fi', checked: false },
    { id: 'passes', text: 'Reserve Sightseeing & Entry Passes', checked: false },
  ];

  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem(checklistStorageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultChecklist;
  });

  // Keep active trip flight, hotel, and destination in sync with checklist
  useEffect(() => {
    if (!tripData) return;
    const destName = tripData.destination?.split(',')?.[0]?.trim() || tripData.itinerary?.destination?.split(',')?.[0]?.trim() || '';
    const flightObj = tripData.itinerary?.flightOptions?.[0] || tripData.flightOptions?.[0];
    const hotelObj = tripData.itinerary?.hotelRecommendations?.[0] || tripData.hotelRecommendations?.[0];

    setChecklist((prev) =>
      prev.map((item) => {
        if (item.id === 'flight' && !item.checked && flightObj) {
          return { ...item, text: `Book Flight (${flightObj.airline} • ${flightObj.route})` };
        }
        if (item.id === 'hotel' && !item.checked && hotelObj) {
          return { ...item, text: `Reserve Stay (${hotelObj.name})` };
        }
        if (item.id === 'passes' && !item.checked && destName) {
          return { ...item, text: `Reserve ${destName} Sightseeing & Entry Passes` };
        }
        return item;
      })
    );
  }, [tripData]);

  const handleToggleChecklistItem = (id) => {
    setChecklist((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item));
      try {
        localStorage.setItem(checklistStorageKey, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleResetChecklist = () => {
    setChecklist(defaultChecklist);
    try {
      localStorage.setItem(checklistStorageKey, JSON.stringify(defaultChecklist));
    } catch (e) {}
  };

  const handleLayoutChange = (layout) => {
    setRoadmapLayout(layout);
    try {
      localStorage.setItem('waypoint_roadmap_layout', layout);
    } catch (e) {}
  };

  const handleUseTemplate = (tmpl) => {
    setTemplateData(tmpl);
    setPlannerError(null);
    setActiveTab('planner');
  };

  const handlePlanTrip = () => {
    setTemplateData(null);
    setPlannerError(null);
    setActiveTab('planner');
  };

  // Phase cycling animation during generation
  useEffect(() => {
    let interval;
    if (isLoadingTrip) {
      interval = setInterval(() => {
        setGenerationPhaseIndex((prev) => (prev + 1) % GENERATION_PHASES.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoadingTrip]);

  // Immediate switch to Roadmap on submit, with smooth return to Planner on error
  const handleStartTripGeneration = async (payload) => {
    setPlannerError(null);
    setPendingTripParams(payload);
    setIsLoadingTrip(true);
    setGenerationPhaseIndex(0);
    // Switch to Roadmap view immediately
    setActiveTab('roadmap');

    try {
      const res = await generateTrip(payload);
      setTripData(res);
      setIsLoadingTrip(false);
      setPendingTripParams(null);
    } catch (err) {
      setIsLoadingTrip(false);
      setPendingTripParams(null);
      const errMsg = err?.message || 'Failed to curate itinerary. Please verify your connection or try again.';
      setPlannerError(errMsg);
      // Smoothly return to Planner view on failure
      setActiveTab('planner');
    }
  };

  const handleSelectSavedTrip = (savedTripDetail) => {
    setTripData(savedTripDetail);
    setActiveTab('roadmap');
  };

  const isScrollable = activeTab === 'overview' || (activeTab === 'roadmap' && roadmapLayout === 'editorial') || activeTab === 'settings';

  // Listen passively to whichever container scrolls (container or window)
  useEffect(() => {
    if (!isScrollable) {
      setIsScrolled(false);
      return;
    }

    const checkScroll = (e) => {
      const top = e?.target?.scrollTop ?? scrollContainerRef.current?.scrollTop ?? window.scrollY ?? 0;
      setIsScrolled(top > 20);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll, { passive: true });
    }
    window.addEventListener('scroll', checkScroll, { passive: true });

    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('scroll', checkScroll);
    };
  }, [isScrollable]);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#2563eb',
          borderRadius: 14,
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          colorBgBase: theme === 'dark' ? '#090D16' : '#ffffff',
          colorTextBase: theme === 'dark' ? '#f8fafc' : '#0f172a',
        },
      }}
    >
      <AuthProvider>
        {/* 
          Scroll & Viewport Rules:
          - Overview, Roadmap & Settings tabs: Smooth vertical scrolling without visible scrollbar (no-scrollbar)
          - Planner tab: Strictly height: 100vh; overflow: hidden (zero scrolling, single viewport)
        */}
        <div 
          ref={scrollContainerRef}
          className={`h-screen w-screen max-h-screen text-slate-800 dark:text-white font-sans antialiased selection:bg-blue-600 selection:text-white flex flex-col relative transition-colors duration-300 ${
            isScrollable ? 'overflow-y-auto no-scrollbar' : 'overflow-hidden justify-between'
          }`}
        >
          {/* Exact off-white to pure-white canvas with soft sky-blue and cobalt radial glows */}
          <BackgroundGradients />

          {/* Sticky/Floating Top Header: Completely Transparent (No full-width blurred bar) */}
          <div 
            className={`w-full z-40 ${isScrollable ? 'sticky top-0' : 'shrink-0'}`}
            style={{
              background: 'transparent',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
              border: 'none',
              boxShadow: 'none',
            }}
          >
            <Navbar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              isScrolled={isScrolled}
            />
          </div>

          {/* Main Content Area */}
          <main className={`relative z-10 w-full ${isScrollable ? 'flex-1' : 'flex-1 flex flex-col items-center justify-start overflow-hidden px-4 sm:px-6 pt-4 pb-3'}`}>
            {activeTab === 'overview' && (
              <OverviewView 
                onPlanTrip={handlePlanTrip}
                onUseTemplate={handleUseTemplate}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'planner' && (
              <TripPlannerView 
                onBackToOverview={() => setActiveTab('overview')} 
                templateData={templateData}
                roadmapLayout={roadmapLayout}
                onStartGeneration={handleStartTripGeneration}
                plannerError={plannerError}
                onClearPlannerError={() => setPlannerError(null)}
                onViewRoadmap={(payload) => {
                  setTripData(payload);
                  setActiveTab('roadmap');
                }}
              />
            )}

            {activeTab === 'roadmap' && (
              <RoadmapView 
                tripData={tripData}
                onPlanTrip={handlePlanTrip}
                isLoading={isLoadingTrip}
                pendingTripParams={pendingTripParams}
                generationPhase={GENERATION_PHASES[generationPhaseIndex]}
                roadmapLayout={roadmapLayout}
                setRoadmapLayout={handleLayoutChange}
                currency={currency}
                checklist={checklist}
                onToggleChecklistItem={handleToggleChecklistItem}
                theme={theme}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView 
                roadmapLayout={roadmapLayout}
                setRoadmapLayout={handleLayoutChange}
                currency={currency}
                setCurrency={setCurrency}
                theme={theme}
                setTheme={setTheme}
                onResetChecklist={handleResetChecklist}
                onReloadSampleTrip={() => setTripData(SAMPLE_TOKYO_TRIP)}
                onClearTrip={() => setTripData(null)}
                onSwitchTab={setActiveTab}
              />
            )}

            {activeTab !== 'overview' && activeTab !== 'planner' && activeTab !== 'roadmap' && activeTab !== 'settings' && (
              <div className="h-full flex items-center justify-center">
                <TabViews activeTab={activeTab} />
              </div>
            )}
          </main>

          {/* Global Authentication Modal */}
          <AuthModal />

          {/* Global Saved Trips Modal */}
          <SavedTripsModal 
            onSelectTrip={handleSelectSavedTrip}
            onPlanNewTrip={handlePlanTrip}
          />
        </div>
      </AuthProvider>
    </ConfigProvider>
  );
}
