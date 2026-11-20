import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, AutoComplete, Button, message } from 'antd';
import { 
  EnvironmentOutlined, 
  CalendarOutlined, 
  TeamOutlined, 
  CompassOutlined, 
  ArrowRightOutlined, 
  LoadingOutlined,
  SendOutlined
} from '@ant-design/icons';
import { Sparkles, Compass, ShieldCheck, AlertCircle, X } from 'lucide-react';
import { generateTrip } from '../services/tripApi';
import { useAuth } from '../context/AuthContext';
import RoadmapSkeleton from './roadmap/RoadmapSkeleton';

// Curated 20+ Departure Hubs
const ORIGINS = [
  { value: "San Francisco (SFO)" },
  { value: "Kochi (COK)" },
  { value: "New York (JFK)" },
  { value: "London (LHR)" },
  { value: "Mumbai (BOM)" },
  { value: "Dubai (DXB)" },
  { value: "Singapore (SIN)" },
  { value: "Tokyo (HND)" },
  { value: "Delhi (DEL)" },
  { value: "Bengaluru (BLR)" },
  { value: "Sydney (SYD)" },
  { value: "Paris (CDG)" },
  { value: "Frankfurt (FRA)" },
  { value: "Toronto (YYZ)" },
  { value: "Los Angeles (LAX)" },
  { value: "Chicago (ORD)" },
];

// Curated 45+ premier worldwide destinations
const DESTINATIONS = [
  { value: "Tokyo, Japan" },
  { value: "Kyoto, Japan" },
  { value: "Osaka, Japan" },
  { value: "Paris, France" },
  { value: "Interlaken, Switzerland" },
  { value: "Zermatt, Switzerland" },
  { value: "Bali, Indonesia" },
  { value: "Munnar, Kerala, India" },
  { value: "Jaipur, Rajasthan, India" },
  { value: "Seoul, South Korea" },
  { value: "Rome, Italy" },
  { value: "Venice, Italy" },
  { value: "Florence, Italy" },
  { value: "Amalfi Coast, Italy" },
  { value: "Reykjavik, Iceland" },
  { value: "Dubai, UAE" },
  { value: "London, UK" },
  { value: "Edinburgh, Scotland" },
  { value: "New York, USA" },
  { value: "San Francisco, USA" },
  { value: "Barcelona, Spain" },
  { value: "Madrid, Spain" },
  { value: "Santorini, Greece" },
  { value: "Athens, Greece" },
  { value: "Sydney, Australia" },
  { value: "Melbourne, Australia" },
  { value: "Cape Town, South Africa" },
  { value: "Singapore" },
  { value: "Bangkok, Thailand" },
  { value: "Phuket, Thailand" },
  { value: "Amsterdam, Netherlands" },
  { value: "Cairo, Egypt" },
  { value: "Cusco, Peru" },
  { value: "Queenstown, New Zealand" },
  { value: "Vancouver, Canada" },
  { value: "Banff, Canada" },
  { value: "Prague, Czech Republic" },
  { value: "Lisbon, Portugal" },
  { value: "Vienna, Austria" },
  { value: "Dubrovnik, Croatia" },
  { value: "Hanoi, Vietnam" },
  { value: "Oaxaca, Mexico" },
  { value: "Rio de Janeiro, Brazil" },
  { value: "Marrakech, Morocco" },
  { value: "Tromsø, Norway" },
  { value: "Istanbul, Turkey" },
  { value: "Budapest, Hungary" }
];

const CURRENCIES = [
  { value: 'USD', symbol: '$', label: 'USD $' },
  { value: 'INR', symbol: '₹', label: 'INR ₹' },
  { value: 'EUR', symbol: '€', label: 'EUR €' },
  { value: 'GBP', symbol: '£', label: 'GBP £' },
  { value: 'JPY', symbol: '¥', label: 'JPY ¥' },
  { value: 'AED', symbol: 'AED', label: 'AED' },
];

const TRAVEL_STYLES = [
  { value: 'Relaxed & Scenic', label: '🏖️ Relaxed & Scenic' },
  { value: 'Adventure & Outdoors', label: '⛰️ Adventure & Outdoors' },
  { value: 'Culture & Heritage', label: '🏛️ Culture & Heritage' },
  { value: 'Food & Culinary', label: '🍜 Food & Culinary' },
  { value: 'Luxury & Wellness', label: '✨ Luxury & Wellness' },
  { value: 'Backpacking / Budget', label: '🎒 Backpacking / Budget' },
];

const GENERATION_PHASES = [
  "Connecting to Waypoint Gemini 2.0 AI Concierge...",
  "Scouting commercial airline routes & schedules...",
  "Selecting architectural boutique stays & neighborhood gems...",
  "Structuring chronological day-by-day itinerary & budget breakdown...",
];

export default function TripPlannerView({ 
  onBackToOverview, 
  templateData, 
  onViewRoadmap,
  onStartGeneration,
  plannerError,
  onClearPlannerError,
  roadmapLayout = 'bento'
}) {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [form] = Form.useForm();
  const [currency, setCurrency] = useState('USD');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhaseIndex, setGenerationPhaseIndex] = useState(0);

  // Live telemetry state for the borderless glass strip: Clean empty defaults (no pre-filled demo text)
  const [liveParams, setLiveParams] = useState({
    origin: templateData?.origin || '',
    destination: templateData?.destination || '',
    days: templateData?.days || null,
    members: templateData?.members || null,
    budget: templateData?.budget || null,
    travelStyle: templateData?.travelStyle || 'Relaxed & Scenic',
    extraNotes: templateData?.notes || '',
  });

  useEffect(() => {
    if (templateData) {
      const updated = {
        origin: templateData.origin || '',
        destination: templateData.destination || '',
        days: templateData.days || 4,
        members: templateData.members || 2,
        budget: templateData.budget || 1500,
        travelStyle: templateData.travelStyle || 'Relaxed & Scenic',
        extraNotes: templateData.notes || '',
      };
      setLiveParams(updated);
      form.setFieldsValue(updated);
      if (templateData.currency) {
        setCurrency(templateData.currency);
      }
    } else {
      const empty = {
        origin: '',
        destination: '',
        days: undefined,
        members: undefined,
        budget: undefined,
        travelStyle: 'Relaxed & Scenic',
        extraNotes: '',
      };
      setLiveParams(empty);
      form.resetFields();
    }
  }, [templateData, form]);

  // Phase cycling animation during generation (standalone fallback)
  useEffect(() => {
    let interval;
    if (isGenerating) {
      interval = setInterval(() => {
        setGenerationPhaseIndex((prev) => (prev + 1) % GENERATION_PHASES.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleValuesChange = (changed, all) => {
    if (plannerError && onClearPlannerError) {
      onClearPlannerError();
    }
    setLiveParams((prev) => ({
      ...prev,
      ...all,
    }));
  };

  const handleGenerate = async (values) => {
    // Unauthenticated gate: prompt sign-in before generating live roadmap
    if (!isAuthenticated) {
      message.info('Please sign in or create an account to generate your bespoke roadmap.');
      openAuthModal('otp');
      return;
    }

    const payload = {
      origin: values.origin || liveParams.origin,
      destination: values.destination || liveParams.destination,
      days: Number(values.days || liveParams.days || 4),
      members: Number(values.members || liveParams.members || 2),
      budget: values.budget !== undefined && values.budget !== null ? Number(values.budget) : Number(liveParams.budget || 1500),
      currency: currency,
      travelStyle: values.travelStyle || liveParams.travelStyle || 'Relaxed & Scenic',
      extraNotes: values.extraNotes?.trim() || liveParams.extraNotes || '',
    };

    if (!payload.origin?.trim() || !payload.destination?.trim()) {
      message.warning('Please enter both origin and destination.');
      return;
    }

    // Immediately hoist to App to switch to Roadmap tab with skeleton loading
    if (onStartGeneration) {
      onStartGeneration(payload);
      return;
    }

    // Standalone fallback
    setIsGenerating(true);
    setGenerationPhaseIndex(0);

    try {
      const res = await generateTrip(payload);
      setIsGenerating(false);
      message.success(`Bespoke roadmap generated for ${payload.destination}!`);
      if (onViewRoadmap) {
        onViewRoadmap(res);
      }
    } catch (err) {
      setIsGenerating(false);
      const errMsg = err?.message || 'Failed to generate itinerary. Please try again.';
      message.error({
        content: errMsg,
        duration: 5,
      });
    }
  };

  return (
    <div className="w-full h-full max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col items-center justify-center select-none py-2">
      {/* High-Craft In-Flow Error Alert (Cleanly below navbar, inside page flow, zero overlap) */}
      {plannerError && (
        <div 
          role="alert"
          className="w-full max-w-[1280px] mb-4 sm:mb-6 rounded-2xl p-4 sm:px-5 sm:py-3.5 bg-rose-50/95 dark:bg-rose-950/80 border border-rose-200/90 dark:border-rose-800/80 backdrop-blur-xl shadow-lg shadow-rose-900/5 dark:shadow-black/40 flex items-start sm:items-center justify-between gap-3 text-rose-900 dark:text-rose-100 transition-all duration-300 animate-fadeIn"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/60 border border-rose-200 dark:border-rose-700/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Roadmap Generation Failed
              </p>
              <p className="text-sm font-medium text-rose-800 dark:text-rose-200 mt-0.5">
                {plannerError}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClearPlannerError}
            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-200 hover:bg-rose-100/80 dark:hover:bg-rose-900/60 transition-colors"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {isGenerating ? (
        /* ========================================================= */
        /* TRUE LAYOUT-MATCHED SHIMMER SKELETON SCREEN (BENTO/EDIT) */
        /* ========================================================= */
        <div className="w-full h-full">
          <RoadmapSkeleton 
            layout={roadmapLayout}
            destination={liveParams.destination}
            origin={liveParams.origin}
            phaseText={GENERATION_PHASES[generationPhaseIndex]}
          />
        </div>
      ) : (
        /* ========================================================= */
        /* ASYMMETRICAL 2-COLUMN BORDERLESS STUDIO PLANNER FORM      */
        /* ========================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-10 lg:gap-14 items-center w-full max-w-[1280px]">
          
          {/* LEFT COLUMN: Editorial Headline & Minimal Live Telemetry Strip */}
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black text-slate-900 dark:text-slate-50 tracking-[-0.035em] leading-[1.06]">
                Where are we heading next?
              </h2>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-normal mt-2.5 max-w-md leading-relaxed">
                Bespoke day-by-day travel blueprint curated with flights, stays, dining, and activity routing.
              </p>
            </div>

            {/* Sleek Borderless Translucent Glass Strip (Live Telemetry) */}
            <div 
              className="p-4 sm:p-5 rounded-2xl transition-all duration-300 bg-white/55 dark:bg-slate-900/80 backdrop-blur-xl border border-white/75 dark:border-white/15 shadow-lg shadow-slate-900/5 dark:shadow-black/40"
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/50 dark:border-white/10 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
                  <CompassOutlined className="text-blue-600 dark:text-blue-400 text-sm" />
                  <span>Telemetry Strip</span>
                </div>
                <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100/70 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 uppercase">
                  Live
                </span>
              </div>

              {/* Parameters Breakdown */}
              <div className="grid grid-cols-2 gap-2.5 pt-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 block">
                    Route
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 truncate block mt-0.5" title={liveParams.origin || liveParams.destination ? `${liveParams.origin || 'Awaiting origin...'} → ${liveParams.destination || 'Awaiting destination...'}` : 'Awaiting origin & destination...'}>
                    {liveParams.origin || liveParams.destination ? (
                      `${liveParams.origin?.split('(')?.[0]?.trim() || 'Awaiting origin...'} → ${liveParams.destination?.split(',')?.[0]?.trim() || 'Awaiting destination...'}`
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 font-normal italic">Awaiting origin & destination...</span>
                    )}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 block">
                    Duration & Crew
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100 block mt-0.5">
                    {liveParams.days || liveParams.members ? (
                      `${liveParams.days ? `${liveParams.days} Days` : '— Days'} • ${liveParams.members ? `${liveParams.members} ${liveParams.members === 1 ? 'Guest' : 'Guests'}` : '— Guests'}`
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 font-normal italic">— Days • — Guests</span>
                    )}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 block">
                    Style
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400 block mt-0.5 truncate">
                    {liveParams.travelStyle || 'Relaxed & Scenic'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 block">
                    Est. Budget
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 block mt-0.5">
                    {liveParams.budget ? (
                      `${CURRENCIES.find(c => c.value === currency)?.symbol || '$'}${Number(liveParams.budget).toLocaleString()}`
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 font-normal italic">—</span>
                    )}
                  </span>
                </div>
              </div>

              {liveParams.extraNotes && (
                <div className="pt-2.5 mt-2.5 border-t border-slate-200/40 dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-400 italic truncate">
                  "{liveParams.extraNotes}"
                </div>
              )}
            </div>

            {/* Minimal Back Button */}
            <div>
              <button
                type="button"
                onClick={onBackToOverview}
                className="text-xs font-semibold text-slate-400 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>← Return to Overview</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Compact Borderless Studio Form */}
          <div className="w-full">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleGenerate}
              onValuesChange={handleValuesChange}
              initialValues={{
                origin: templateData?.origin || undefined,
                destination: templateData?.destination || undefined,
                days: templateData?.days || undefined,
                members: templateData?.members || undefined,
                budget: templateData?.budget || undefined,
                travelStyle: templateData?.travelStyle || 'Relaxed & Scenic',
                extraNotes: templateData?.notes || undefined,
              }}
              requiredMark={false}
              className="space-y-3.5"
            >
              {/* Row 1: Origin (Departing From) & Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Origin */}
                <Form.Item
                  label={<span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Departing From (Origin)</span>}
                  name="origin"
                  rules={[{ required: true, message: 'Please specify departure city/airport' }]}
                  className="mb-0"
                >
                  <AutoComplete
                    options={ORIGINS}
                    filterOption={(inputValue, option) =>
                      option?.value?.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                    className="studio-input w-full"
                  >
                    <Input
                      size="large"
                      prefix={<SendOutlined className="text-blue-600 dark:text-blue-400 mr-1.5 rotate-[-45deg]" />}
                      placeholder="e.g. Kochi (COK)"
                      className="studio-input h-11 font-medium bg-slate-100/85 dark:bg-slate-900/80 border border-slate-200/60 dark:border-white/15 rounded-[14px] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                    />
                  </AutoComplete>
                </Form.Item>

                {/* Destination */}
                <Form.Item
                  label={<span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Destination</span>}
                  name="destination"
                  rules={[{ required: true, message: 'Please select destination' }]}
                  className="mb-0"
                >
                  <AutoComplete
                    options={DESTINATIONS}
                    filterOption={(inputValue, option) =>
                      option?.value?.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                    className="studio-input w-full"
                  >
                    <Input
                      size="large"
                      prefix={<EnvironmentOutlined className="text-blue-600 dark:text-blue-400 mr-1.5" />}
                      placeholder="e.g. Tokyo, Japan"
                      className="studio-input h-11 font-medium bg-slate-100/85 dark:bg-slate-900/80 border border-slate-200/60 dark:border-white/15 rounded-[14px] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                    />
                  </AutoComplete>
                </Form.Item>
              </div>

              {/* Row 2: Days | Members | Budget + Currency (3 columns compact) */}
              <div className="grid grid-cols-3 gap-3">
                {/* Days */}
                <Form.Item
                  label={<span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Days</span>}
                  name="days"
                  className="mb-0"
                >
                  <InputNumber
                    min={1}
                    max={30}
                    size="large"
                    placeholder="4"
                    prefix={<CalendarOutlined className="text-slate-400 mr-1 text-xs" />}
                    className="studio-input w-full h-11 flex items-center font-medium bg-slate-100/85 dark:bg-slate-900/80 border border-slate-200/60 dark:border-white/15 rounded-[14px] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </Form.Item>

                {/* Members */}
                <Form.Item
                  label={<span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Travelers</span>}
                  name="members"
                  className="mb-0"
                >
                  <InputNumber
                    min={1}
                    max={20}
                    size="large"
                    placeholder="2"
                    prefix={<TeamOutlined className="text-slate-400 mr-1 text-xs" />}
                    className="studio-input w-full h-11 flex items-center font-medium bg-slate-100/85 dark:bg-slate-900/80 border border-slate-200/60 dark:border-white/15 rounded-[14px] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </Form.Item>

                {/* Budget + Currency Selector */}
                <Form.Item
                  label={<span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Est. Budget</span>}
                  name="budget"
                  className="mb-0"
                >
                  <div 
                    className="flex items-center h-11 px-2 rounded-[14px] bg-slate-100/85 dark:bg-slate-900/80 border border-slate-200/60 dark:border-white/15"
                  >
                    <Select
                      value={currency}
                      onChange={setCurrency}
                      options={CURRENCIES}
                      variant="borderless"
                      className="w-20 font-bold text-blue-600 dark:text-blue-400 text-xs"
                      popupMatchSelectWidth={false}
                    />
                    <InputNumber
                      min={0}
                      step={100}
                      size="middle"
                      variant="borderless"
                      placeholder="1500"
                      className="w-full font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                    />
                  </div>
                </Form.Item>
              </div>

              {/* Row 3: Travel Style (<Select>) + Notes (<Input>) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Form.Item
                  label={<span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Travel Style</span>}
                  name="travelStyle"
                  className="mb-0"
                >
                  <Select
                    size="large"
                    options={TRAVEL_STYLES}
                    className="studio-input w-full h-11 rounded-[14px]"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Notes & Wishlist</span>}
                  name="extraNotes"
                  className="mb-0"
                >
                  <Input
                    size="large"
                    placeholder="e.g. Scenic trains, ramen, shrine gardens..."
                    className="studio-input h-11 font-normal text-xs bg-slate-100/85 dark:bg-slate-900/80 border border-slate-200/60 dark:border-white/15 rounded-[14px] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </Form.Item>
              </div>

              {/* Unauthenticated Guest Sign-In Gate Callout */}
              {!isAuthenticated && (
                <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/75 backdrop-blur-xl border border-blue-200/80 dark:border-blue-500/30 shadow-xs flex items-center justify-between gap-3 text-xs animate-fadeIn">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-slate-900 dark:text-white block truncate">Planning as Guest</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">Sign in to generate & save your live roadmap</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAuthModal('otp')}
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Submit CTA Button */}
              <div className="pt-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  icon={<ArrowRightOutlined />}
                  iconPosition="end"
                  className="cursor-pointer hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #0284c7 100%)',
                    border: 'none',
                    height: '48px',
                    borderRadius: '14px',
                    fontSize: '15px',
                    boxShadow: '0 8px 24px -4px rgba(37, 99, 235, 0.35)',
                  }}
                >
                  Generate Bespoke Roadmap →
                </Button>
              </div>
            </Form>
          </div>

        </div>
      )}
    </div>
  );
}
