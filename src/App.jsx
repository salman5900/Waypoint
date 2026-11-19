import React, { useState, useEffect, useRef } from 'react';
import { ConfigProvider } from 'antd';
import Navbar from './components/Navbar';
import BackgroundGradients from './components/BackgroundGradients';
import OverviewView from './components/OverviewView';
import TripPlannerView from './components/TripPlannerView';
import RoadmapView from './components/RoadmapView';
import SettingsView from './components/SettingsView';
import TabViews from './components/TabViews';
import { SAMPLE_TOKYO_TRIP } from './data/sampleTokyoTrip';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [templateData, setTemplateData] = useState(null);
  const [tripData, setTripData] = useState(null);
  const [isLoadingTrip, setIsLoadingTrip] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef(null);

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
    { id: 'flight', text: 'Book Flight (ANA • All Nippon Airways)', checked: false },
    { id: 'hotel', text: 'Reserve Stay (Trunk Hotel Yoyogi Park)', checked: false },
    { id: 'maps', text: 'Download Offline Maps & Metro Guides', checked: true },
    { id: 'esim', text: 'Order e-SIM or Mobile Pocket Wi-Fi', checked: false },
    { id: 'passes', text: 'Reserve Tokyo Skytree / TeamLab Entry Pass', checked: false },
  ];

  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem(checklistStorageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultChecklist;
  });

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
    setActiveTab('planner');
  };

  const handlePlanTrip = () => {
    setTemplateData(null);
    setActiveTab('planner');
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
        token: {
          colorPrimary: '#2563eb',
          borderRadius: 14,
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          colorBgBase: '#ffffff',
          colorTextBase: '#0f172a',
        },
      }}
    >
      {/* 
        Scroll & Viewport Rules:
        - Overview, Roadmap & Settings tabs: Smooth vertical scrolling without visible scrollbar (no-scrollbar)
        - Planner tab: Strictly height: 100vh; overflow: hidden (zero scrolling, single viewport)
      */}
      <div 
        ref={scrollContainerRef}
        className={`h-screen w-screen max-h-screen text-slate-800 font-sans antialiased selection:bg-blue-600 selection:text-white flex flex-col relative ${
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
        <main className={`relative z-10 w-full ${isScrollable ? 'flex-1' : 'flex-1 flex items-center justify-center overflow-hidden px-4'}`}>
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
              onViewRoadmap={(payload) => {
                setActiveTab('roadmap');
              }}
            />
          )}

          {activeTab === 'roadmap' && (
            <RoadmapView 
              tripData={tripData}
              onPlanTrip={handlePlanTrip}
              isLoading={isLoadingTrip}
              roadmapLayout={roadmapLayout}
              setRoadmapLayout={handleLayoutChange}
              currency={currency}
              checklist={checklist}
              onToggleChecklistItem={handleToggleChecklistItem}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView 
              roadmapLayout={roadmapLayout}
              setRoadmapLayout={handleLayoutChange}
              currency={currency}
              setCurrency={setCurrency}
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
      </div>
    </ConfigProvider>
  );
}
