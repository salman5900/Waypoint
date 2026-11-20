import React, { useRef, useEffect } from 'react';
import { Button } from 'antd';
import { 
  ArrowRightOutlined, 
  CompassOutlined, 
  DollarOutlined, 
  SendOutlined, 
  CheckCircleOutlined,
  CalendarOutlined,
  TeamOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

export default function OverviewView({ onPlanTrip, onUseTemplate, setActiveTab }) {
  const { isAuthenticated, openSavedTrips } = useAuth();
  const collageRef = useRef(null);
  const rafId = useRef(null);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  const templates = [
    {
      id: 'kyoto',
      title: 'Kyoto Cultural Escape',
      destination: 'Kyoto, Japan',
      days: 4,
      members: 2,
      budget: 1800,
      currency: 'USD',
      travelStyle: 'Culture & Heritage',
      description: 'Historic zen gardens, traditional tea houses, and tranquil bamboo trails.',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=700&q=80',
      badge: 'Bestseller',
      notes: 'Focus on traditional tea houses and morning temple walks',
    },
    {
      id: 'swiss',
      title: 'Swiss Alps Rail Loop',
      destination: 'Interlaken, Switzerland',
      days: 7,
      members: 2,
      budget: 3200,
      currency: 'USD',
      travelStyle: 'Adventure & Outdoors',
      description: 'Panoramic mountain rail passes, alpine hiking loops, and scenic lakes.',
      image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=700&q=80',
      badge: 'Scenic Route',
      notes: 'Glacier Express and scenic cable cars',
    },
    {
      id: 'kerala',
      title: 'Kerala Coastal Retreat',
      destination: 'Munnar, Kerala, India',
      days: 5,
      members: 4,
      budget: 1400,
      currency: 'USD',
      travelStyle: 'Relaxed & Scenic',
      description: 'Serene palm-fringed backwaters, spice plantations, and lush hills.',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=700&q=80',
      badge: 'Wellness',
      notes: 'Houseboat stay and tea plantation trail',
    },
  ];

  // Cursor-reactive subtle parallax tilt on the hero collage (GPU-accelerated, 60fps)
  const handleMouseMove = (e) => {
    if (!collageRef.current) return;
    const rect = collageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const normX = (e.clientX - centerX) / (rect.width / 2);
    const normY = (e.clientY - centerY) / (rect.height / 2);
    targetPos.current = {
      x: Math.max(-1, Math.min(1, normX)),
      y: Math.max(-1, Math.min(1, normY)),
    };
  };

  const handleMouseLeave = () => {
    targetPos.current = { x: 0, y: 0 };
  };

  useEffect(() => {
    let active = true;

    const animate = () => {
      if (!active) return;
      const lerp = 0.08;
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * lerp;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * lerp;

      if (collageRef.current) {
        const transX = (currentPos.current.x * 12).toFixed(2);
        const transY = (currentPos.current.y * 10).toFixed(2);
        const rotX = (-currentPos.current.y * 3.5).toFixed(2);
        const rotY = (currentPos.current.x * 3.5).toFixed(2);
        collageRef.current.style.transform = `translate3d(${transX}px, ${transY}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      active = false;
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center select-none">
      
      {/* ========================================================= */}
      {/* 1. SPLIT HERO SECTION (Above the Fold)                    */}
      {/* ========================================================= */}
      <section className="w-full max-w-[1280px] min-h-[calc(100vh-80px)] mx-auto px-6 sm:px-8 flex items-center justify-center py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center w-full">
          
          {/* Left Column: Bold, Human Headline & Dual CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div>
              <h1 className="text-4xl sm:text-6xl lg:text-[4.25rem] font-black text-slate-900 dark:text-slate-50 tracking-[-0.035em] leading-[1.05]">
                Welcome to Waypoint
              </h1>
              <p className="text-xl sm:text-2xl text-slate-700 dark:text-slate-200 font-semibold mt-3.5 leading-snug">
                Your trip planning, all in one place.
              </p>
            </div>

            {/* Concise 2-line Description */}
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-normal leading-relaxed max-w-lg">
              Waypoint organizes day-by-day itineraries, flight options, budgets, and local stops in one seamless workspace designed for effortless exploration.
            </p>

            {/* Dual CTAs with Tactile Elevation & Press States */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Button
                type="primary"
                size="large"
                shape="round"
                onClick={onPlanTrip}
                icon={<ArrowRightOutlined />}
                iconPosition="end"
                className="hero-btn-primary cursor-pointer flex items-center justify-center font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #0284c7 100%)',
                  border: 'none',
                  height: '48px',
                  paddingInline: '28px',
                  fontSize: '15px',
                  fontWeight: 600,
                  boxShadow: '0 10px 25px -4px rgba(37, 99, 235, 0.35)',
                }}
              >
                Plan Trip
              </Button>

              <Button
                size="large"
                shape="round"
                onClick={() => {
                  const el = document.getElementById('features');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hero-btn-secondary cursor-pointer flex items-center justify-center font-semibold h-12 px-6 text-sm bg-white/75 dark:bg-slate-900/80 backdrop-blur-md border border-blue-200/90 dark:border-white/15 text-slate-700 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm dark:shadow-black/30 transition-all"
              >
                Explore Features
              </Button>

              {isAuthenticated && (
                <Button
                  size="large"
                  shape="round"
                  onClick={openSavedTrips}
                  className="hero-btn-secondary cursor-pointer flex items-center justify-center font-semibold h-12 px-5 text-sm bg-blue-50/80 dark:bg-blue-950/50 backdrop-blur-md border border-blue-200/90 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 shadow-sm transition-all"
                >
                  <CompassOutlined />
                  <span>Saved Trips</span>
                </Button>
              )}
            </div>

            {/* User-Focused Travel Highlights */}
            <div className="pt-5 flex flex-wrap items-center gap-6 border-t border-slate-200/60 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400 font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircleOutlined className="text-blue-600 dark:text-blue-400" />
                <span>AI-Crafted Itineraries</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleOutlined className="text-blue-600 dark:text-blue-400" />
                <span>Live Flight & Stay Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleOutlined className="text-blue-600 dark:text-blue-400" />
                <span>Multi-Currency Budgeting</span>
              </div>
            </div>
          </div>

          {/* Right Column: Cursor-Reactive Parallax Travel Collage (Zero Bobbing Lag) */}
          <div 
            className="lg:col-span-6 relative flex items-center justify-center py-6"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: '1000px' }}
          >
            <div 
              ref={collageRef}
              className="relative w-full max-w-[500px] h-[440px] sm:h-[480px]"
              style={{
                transformStyle: 'preserve-3d',
                willChange: 'transform',
                transition: 'none',
              }}
            >
              
              {/* Photo 1 (Main Portrait Card - Kyoto, Card 1) */}
              <div 
                className="collage-card-enter-1 absolute left-0 top-6 w-[260px] sm:w-[290px] h-[340px] sm:h-[380px] z-20"
              >
                <div className="float-bob-wrapper-1 w-full h-full">
                  <div className="collage-interactive-card w-full h-full rounded-[24px] overflow-hidden border border-white/90 relative group">
                    <img 
                      src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=700&q=80" 
                      alt="Kyoto Pagoda" 
                      decoding="async"
                      className="collage-inner-img w-full h-full object-cover"
                    />
                    {/* Crisp Lightweight Telemetry Badge */}
                    <div 
                      className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-white/95 dark:bg-slate-900/90 border border-white/90 dark:border-white/15 shadow-sm dark:shadow-black/40 backdrop-blur-md"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                        <EnvironmentOutlined className="text-blue-600 dark:text-blue-400" />
                        <span>Kyoto, Japan</span>
                      </div>
                      <p className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 mt-0.5 m-0">
                        5 Days • Flights + Stay Synced
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo 2 (Top Right Landscape - Swiss Alps, Card 2) */}
              <div 
                className="collage-card-enter-2 absolute right-0 top-0 w-[230px] sm:w-[250px] h-[190px] sm:h-[210px] z-10"
              >
                <div className="float-bob-wrapper-2 w-full h-full">
                  <div className="collage-interactive-card w-full h-full rounded-[22px] overflow-hidden border border-white/90 dark:border-white/15 relative group">
                    <img 
                      src="https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=700&q=80" 
                      alt="Swiss Alps Mountain Lake" 
                      decoding="async"
                      className="collage-inner-img w-full h-full object-cover"
                    />
                    <div 
                      className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-800 dark:text-slate-100 bg-white/95 dark:bg-slate-900/90 border border-white/90 dark:border-white/15 shadow-sm dark:shadow-black/40 backdrop-blur-md"
                    >
                      🏔️ Swiss Alps Rail • 7 Days
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo 3 (Bottom Right Landscape - Amalfi Coast, Card 3) */}
              <div 
                className="collage-card-enter-3 absolute right-2 bottom-4 w-[220px] sm:w-[240px] h-[180px] sm:h-[195px] z-30"
              >
                <div className="float-bob-wrapper-3 w-full h-full">
                  <div className="collage-interactive-card w-full h-full rounded-[22px] overflow-hidden border border-white/90 dark:border-white/15 relative group">
                    <img 
                      src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=700&q=80" 
                      alt="Amalfi Coast Sea Cliff" 
                      decoding="async"
                      className="collage-inner-img w-full h-full object-cover"
                    />
                    <div 
                      className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-800 dark:text-slate-100 bg-white/95 dark:bg-slate-900/90 border border-white/90 dark:border-white/15 shadow-sm dark:shadow-black/40 backdrop-blur-md"
                    >
                      🌊 Amalfi Coast • Relaxed Vibe
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. SECTION 1 — EVERYTHING YOUR TRIP NEEDS (Bento Grid)     */}
      {/* ========================================================= */}
      <section id="features" className="w-full max-w-[1280px] mx-auto px-6 sm:px-8 py-20 sm:py-28">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
            Everything your trip needs, unified.
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Eliminate scattered notes, open browser tabs, and disconnected booking links.
          </p>
        </div>

        {/* 3-Column Bento Cards with Tactile Elevation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 1: AI Itinerary Engine */}
          <div 
            className="p-8 rounded-[24px] border border-blue-100/85 dark:border-white/10 bg-white/70 dark:bg-slate-900/75 backdrop-blur-xl shadow-lg shadow-slate-900/5 dark:shadow-black/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/10 active:scale-[0.99] group cursor-default"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/15 border border-blue-200/70 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform duration-300">
              <CompassOutlined />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              AI Itinerary Engine
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
              Instant day-by-day schedules tailored specifically to your group size, travel style, and desired daily pace.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/70 border border-slate-200/60 dark:border-white/10 text-xs space-y-1.5 font-medium text-slate-700 dark:text-slate-300">
              <div className="flex justify-between items-center text-[11px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                <span>Sample Route Map</span>
                <span>Day 1 of 4</span>
              </div>
              <p className="text-slate-800 dark:text-slate-200 font-semibold m-0 truncate">
                Arashiyama Bamboo Grove → Kinkaku-ji
              </p>
            </div>
          </div>

          {/* Card 2: Smart Flight & Route Sync */}
          <div 
            className="p-8 rounded-[24px] border border-blue-100/85 dark:border-white/10 bg-white/70 dark:bg-slate-900/75 backdrop-blur-xl shadow-lg shadow-slate-900/5 dark:shadow-black/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-sky-500/10 active:scale-[0.99] group cursor-default"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-500/15 border border-sky-200/70 dark:border-sky-500/30 text-sky-600 dark:text-sky-400 flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform duration-300">
              <SendOutlined />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              Smart Flight & Route Sync
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
              Compare transit paths, train timetables, and scenic connections effortlessly without navigating between third-party apps.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/70 border border-slate-200/60 dark:border-white/10 text-xs space-y-1.5 font-medium text-slate-700 dark:text-slate-300">
              <div className="flex justify-between items-center text-[11px] text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider">
                <span>Transit Telemetry</span>
                <span>Optimal Rail</span>
              </div>
              <p className="text-slate-800 dark:text-slate-200 font-semibold m-0 truncate">
                Shinkansen Bullet Train • 2h 15m • High Speed
              </p>
            </div>
          </div>

          {/* Card 3: Live Budget & Currency Control */}
          <div 
            className="p-8 rounded-[24px] border border-blue-100/85 dark:border-white/10 bg-white/70 dark:bg-slate-900/75 backdrop-blur-xl shadow-lg shadow-slate-900/5 dark:shadow-black/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-500/10 active:scale-[0.99] group cursor-default"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200/70 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform duration-300">
              <DollarOutlined />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              Live Budget & Currency Control
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
              Multi-currency cost breakdowns with automatic real-time conversion across USD, INR, EUR, GBP, and JPY.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/70 border border-slate-200/60 dark:border-white/10 text-xs space-y-1.5 font-medium text-slate-700 dark:text-slate-300">
              <div className="flex justify-between items-center text-[11px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
                <span>Cost Forecast</span>
                <span>Under Target</span>
              </div>
              <p className="text-slate-800 dark:text-slate-200 font-semibold m-0 truncate">
                Est. $1,800 USD (¥270,000 JPY) • 84% Allocated
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. SECTION 2 — HOW WAYPOINT WORKS (3-Step Flow)           */}
      {/* ========================================================= */}
      <section className="w-full max-w-[1280px] mx-auto px-6 sm:px-8 py-16 sm:py-24">
        <div className="p-8 sm:p-14 rounded-[28px] border border-blue-100/80 dark:border-white/10 bg-gradient-to-br from-white/75 via-sky-50/40 to-blue-50/30 dark:from-slate-900/85 dark:via-slate-900/75 dark:to-slate-950/90 backdrop-blur-xl shadow-xl shadow-slate-900/5 dark:shadow-black/40">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              How Waypoint Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-blue-500/25">
                01
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                Set Destination & Vibe
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Choose your city or country, set the number of days, and specify your crew size and style.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold flex items-center justify-center text-sm shadow-md shadow-slate-900/20 dark:shadow-white/10">
                02
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                AI Builds Your Blueprint
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                The engine curates daily itineraries, timing windows, scenic rail segments, and authentic culinary stops.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-blue-500/20">
                03
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                Refine & Export
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Customize notes, fine-tune budgets, copy the clean JSON payload, or share with your travel companions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. SECTION 3 — CURATED STARTER TEMPLATES                  */}
      {/* ========================================================= */}
      <section className="w-full max-w-[1280px] mx-auto px-6 sm:px-8 py-16 sm:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              Curated starter templates
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Launch directly into battle-tested blueprints crafted for seasoned travelers.
            </p>
          </div>

          <Button
            shape="round"
            onClick={onPlanTrip}
            className="border-blue-200 dark:border-white/20 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold self-start sm:self-auto cursor-pointer hover:border-blue-400 dark:hover:border-white/35 active:scale-95 transition-all"
          >
            Custom Itinerary →
          </Button>
        </div>

        {/* 3 Visual Destination Cards with Tactile Hover */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {templates.map((tmpl) => (
            <div 
              key={tmpl.id}
              className="rounded-[24px] overflow-hidden border border-blue-100/85 dark:border-white/10 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl shadow-lg shadow-slate-900/5 dark:shadow-black/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/10 flex flex-col justify-between group"
            >
              {/* Image banner with inner zoom */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={tmpl.image} 
                  alt={tmpl.title}
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
                <span className="absolute top-3 right-3 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 border border-white/60 dark:border-white/15 backdrop-blur-md text-slate-800 dark:text-slate-100 shadow-xs">
                  {tmpl.badge}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tmpl.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>

                {/* Metrics Pill Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-white/10">
                  <div className="flex items-center gap-1">
                    <CalendarOutlined className="text-blue-500 dark:text-blue-400" />
                    <span>{tmpl.days} Days</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TeamOutlined className="text-blue-500 dark:text-blue-400" />
                    <span>{tmpl.members} Travelers</span>
                  </div>
                  <div className="col-span-2 text-blue-600 dark:text-blue-400 font-bold truncate">
                    ✨ {tmpl.travelStyle} • ${tmpl.budget}
                  </div>
                </div>

                {/* Action CTA Button */}
                <div className="pt-2">
                  <Button
                    type="primary"
                    block
                    shape="round"
                    onClick={() => onUseTemplate(tmpl)}
                    className="cursor-pointer font-semibold text-xs h-10 hover:opacity-95 active:scale-[0.98] transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #2563eb 0%, #0284c7 100%)',
                      border: 'none',
                    }}
                  >
                    Use Template →
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. MINIMAL SINGLE-ROW FOOTER                              */}
      {/* ========================================================= */}
      <footer className="w-full max-w-[1280px] mx-auto px-6 sm:px-8 py-10 mt-12 border-t border-slate-200/60 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
        <div className="flex items-center gap-2">
          <span className="font-extrabold tracking-widest text-slate-900 dark:text-slate-50 text-sm">WAYPOINT</span>
          <span>•</span>
          <span>AI-Powered Travel Studio</span>
        </div>

        {/* Quick Tab Links with Tactile Feedback */}
        <div className="flex items-center gap-5 text-slate-600 dark:text-slate-400 font-semibold">
          <button 
            type="button" 
            onClick={() => setActiveTab('overview')} 
            className="hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 transition-all cursor-pointer"
          >
            Overview
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('planner')} 
            className="hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 transition-all cursor-pointer"
          >
            Planner
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('roadmap')} 
            className="hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 transition-all cursor-pointer"
          >
            Roadmap
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('settings')} 
            className="hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 transition-all cursor-pointer"
          >
            Settings
          </button>
        </div>

        <div>
          © 2026 Waypoint. Crafted with React & Ant Design.
        </div>
      </footer>

    </div>
  );
}
