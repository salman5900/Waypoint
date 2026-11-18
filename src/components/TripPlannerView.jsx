import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, AutoComplete, Button, message } from 'antd';
import { 
  EnvironmentOutlined, 
  CalendarOutlined, 
  TeamOutlined, 
  CompassOutlined, 
  CheckCircleOutlined,
  ArrowRightOutlined,
  CopyOutlined,
  EditOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';

// Curated 45+ premier worldwide destinations for instant filtering
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

export default function TripPlannerView({ onBackToOverview, templateData }) {
  const [form] = Form.useForm();
  const [currency, setCurrency] = useState('USD');
  const [submittedPayload, setSubmittedPayload] = useState(null);
  const [copied, setCopied] = useState(false);

  // Live telemetry state for the borderless glass strip
  const [liveParams, setLiveParams] = useState({
    destination: templateData?.destination || 'Kyoto, Japan',
    days: templateData?.days || 4,
    members: templateData?.members || 2,
    budget: templateData?.budget || 1800,
    travelStyle: templateData?.travelStyle || 'Relaxed & Scenic',
    notes: templateData?.notes || '',
  });

  useEffect(() => {
    if (templateData) {
      const updated = {
        destination: templateData.destination || 'Kyoto, Japan',
        days: templateData.days || 4,
        members: templateData.members || 2,
        budget: templateData.budget || 1800,
        travelStyle: templateData.travelStyle || 'Relaxed & Scenic',
        notes: templateData.notes || '',
      };
      setLiveParams(updated);
      form.setFieldsValue(updated);
      if (templateData.currency) {
        setCurrency(templateData.currency);
      }
    }
  }, [templateData, form]);

  const handleValuesChange = (changed, all) => {
    setLiveParams((prev) => ({
      ...prev,
      ...all,
    }));
  };

  const handleGenerate = (values) => {
    // Construct clean structured Gemini API payload
    const payload = {
      destination: values.destination || liveParams.destination,
      days: Number(values.days || liveParams.days),
      members: Number(values.members || liveParams.members),
      budget: {
        amount: Number(values.budget || liveParams.budget || 0),
        currency: currency,
      },
      travelStyle: values.travelStyle || liveParams.travelStyle,
      notes: values.notes?.trim() || '',
      generatedAt: new Date().toISOString(),
    };

    console.log('[Gemini API Itinerary Payload]:', JSON.stringify(payload, null, 2));

    message.success({
      content: `Itinerary payload prepared for ${payload.destination}!`,
      icon: <CheckCircleOutlined style={{ color: '#2563eb' }} />,
    });

    setSubmittedPayload(payload);
  };

  const copyPayloadJSON = () => {
    if (submittedPayload) {
      navigator.clipboard.writeText(JSON.stringify(submittedPayload, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full h-full max-w-[1280px] mx-auto px-6 sm:px-8 flex items-center justify-center select-none">
      {!submittedPayload ? (
        /* Asymmetrical 2-Column Borderless Studio Layout */
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1.35fr] gap-10 lg:gap-14 items-center w-full">
          
          {/* LEFT COLUMN: Editorial Typography & Minimal Floating Telemetry Strip */}
          <div className="space-y-6">
            <div>
              {/* Display Headline */}
              <h2 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black text-slate-900 tracking-[-0.035em] leading-[1.06]">
                Where are we heading next?
              </h2>

              {/* 1-Line Subtitle */}
              <p className="text-sm sm:text-base text-slate-500 font-normal mt-2.5 max-w-md leading-relaxed">
                Bespoke day-by-day travel blueprint curated for your exact style and crew.
              </p>
            </div>

            {/* Sleek Borderless Translucent Glass Strip (Live Telemetry) */}
            <div 
              className="p-4 sm:p-5 rounded-2xl transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.52)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.75)',
                boxShadow: '0 8px 30px -4px rgba(15, 23, 42, 0.04)',
              }}
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/50 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <CompassOutlined className="text-blue-600 text-sm" />
                  <span>Telemetry Strip</span>
                </div>
                <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100/70 text-blue-700 uppercase">
                  Live
                </span>
              </div>

              {/* Parameters Breakdown */}
              <div className="grid grid-cols-2 gap-2.5 pt-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
                    Destination
                  </span>
                  <span className="font-bold text-slate-800 truncate block mt-0.5">
                    {liveParams.destination || 'Unset'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
                    Duration & Crew
                  </span>
                  <span className="font-semibold text-slate-800 block mt-0.5">
                    {liveParams.days || 1} Days • {liveParams.members || 1} {liveParams.members === 1 ? 'Guest' : 'Guests'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
                    Style
                  </span>
                  <span className="font-semibold text-blue-600 block mt-0.5 truncate">
                    {liveParams.travelStyle}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
                    Est. Budget
                  </span>
                  <span className="font-bold text-slate-800 block mt-0.5">
                    {CURRENCIES.find(c => c.value === currency)?.symbol}
                    {Number(liveParams.budget || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {liveParams.notes && (
                <div className="pt-2.5 mt-2.5 border-t border-slate-200/40 text-[11px] text-slate-500 italic truncate">
                  "{liveParams.notes}"
                </div>
              )}
            </div>

            {/* Minimal Back Button */}
            <div>
              <button
                type="button"
                onClick={onBackToOverview}
                className="text-xs font-semibold text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer"
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
                destination: templateData?.destination || 'Kyoto, Japan',
                days: templateData?.days || 4,
                members: templateData?.members || 2,
                budget: templateData?.budget || 1800,
                travelStyle: templateData?.travelStyle || 'Relaxed & Scenic',
                notes: templateData?.notes || '',
              }}
              requiredMark={false}
              className="space-y-3.5"
            >
              {/* Row 1: Destination (<AutoComplete>) */}
              <Form.Item
                label={<span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Destination</span>}
                name="destination"
                rules={[{ required: true, message: 'Please select or enter destination' }]}
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
                    prefix={<EnvironmentOutlined className="text-blue-600 mr-1.5" />}
                    placeholder="Search 40+ destinations or enter any location..."
                    className="h-11 font-medium"
                    style={{
                      background: 'rgba(241, 245, 249, 0.85)',
                      border: '1px solid transparent',
                      borderRadius: '14px',
                    }}
                  />
                </AutoComplete>
              </Form.Item>

              {/* Row 2: Days | Members | Budget + Currency (3 columns compact) */}
              <div className="grid grid-cols-3 gap-3">
                {/* Days */}
                <Form.Item
                  label={<span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Days</span>}
                  name="days"
                  rules={[{ required: true }]}
                  className="mb-0"
                >
                  <InputNumber
                    min={1}
                    max={60}
                    size="large"
                    prefix={<CalendarOutlined className="text-slate-400 mr-1 text-xs" />}
                    className="studio-input w-full h-11 flex items-center font-medium"
                    style={{
                      background: 'rgba(241, 245, 249, 0.85)',
                      border: '1px solid transparent',
                      borderRadius: '14px',
                    }}
                  />
                </Form.Item>

                {/* Members */}
                <Form.Item
                  label={<span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Travelers</span>}
                  name="members"
                  rules={[{ required: true }]}
                  className="mb-0"
                >
                  <InputNumber
                    min={1}
                    max={30}
                    size="large"
                    prefix={<TeamOutlined className="text-slate-400 mr-1 text-xs" />}
                    className="studio-input w-full h-11 flex items-center font-medium"
                    style={{
                      background: 'rgba(241, 245, 249, 0.85)',
                      border: '1px solid transparent',
                      borderRadius: '14px',
                    }}
                  />
                </Form.Item>

                {/* Budget + Currency Selector */}
                <Form.Item
                  label={<span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Est. Budget</span>}
                  name="budget"
                  className="mb-0"
                >
                  <div 
                    className="flex items-center h-11 px-2 rounded-[14px]"
                    style={{
                      background: 'rgba(241, 245, 249, 0.85)',
                      border: '1px solid transparent',
                    }}
                  >
                    <Select
                      value={currency}
                      onChange={setCurrency}
                      options={CURRENCIES}
                      variant="borderless"
                      className="w-20 font-bold text-blue-600 text-xs"
                      popupMatchSelectWidth={false}
                    />
                    <InputNumber
                      min={0}
                      step={100}
                      size="middle"
                      variant="borderless"
                      placeholder="1800"
                      className="w-full font-semibold text-slate-800"
                    />
                  </div>
                </Form.Item>
              </div>

              {/* Row 3: Travel Style (<Select>) + Notes (<Input>) */}
              <div className="grid grid-cols-2 gap-3">
                <Form.Item
                  label={<span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Travel Style</span>}
                  name="travelStyle"
                  className="mb-0"
                >
                  <Select
                    size="large"
                    options={TRAVEL_STYLES}
                    className="studio-input w-full h-11"
                    style={{
                      background: 'rgba(241, 245, 249, 0.85)',
                      borderRadius: '14px',
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Notes & Wishlist</span>}
                  name="notes"
                  className="mb-0"
                >
                  <Input
                    size="large"
                    placeholder="e.g. Scenic trains, cafes, vegetarian..."
                    className="studio-input h-11 font-normal text-xs"
                    style={{
                      background: 'rgba(241, 245, 249, 0.85)',
                      border: '1px solid transparent',
                      borderRadius: '14px',
                    }}
                  />
                </Form.Item>
              </div>

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
                  Generate Itinerary →
                </Button>
              </div>
            </Form>
          </div>

        </div>
      ) : (
        /* Sleek Borderless JSON Payload Confirmation View (Also Fits 100vh) */
        <div className="w-full max-w-[720px] mx-auto space-y-5 animate-in fade-in duration-300">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                <ThunderboltOutlined />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 m-0">
                  Itinerary Payload Dispatched
                </h3>
                <p className="text-xs text-slate-500 m-0">
                  Ready for Gemini 2.0 / 1.5 Pro backend generator
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="middle"
                icon={<CopyOutlined />}
                onClick={copyPayloadJSON}
                className="rounded-xl border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                {copied ? 'Copied JSON!' : 'Copy Payload'}
              </Button>
            </div>
          </div>

          {/* Clean JSON Card */}
          <div 
            className="p-4 rounded-2xl border"
            style={{
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(16px)',
              borderColor: 'rgba(219, 234, 254, 0.9)',
              boxShadow: '0 12px 36px -8px rgba(15, 23, 42, 0.06)',
            }}
          >
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 mb-2 border-b border-slate-200/50">
              <span>POST /api/v1/itinerary/generate</span>
              <span className="text-emerald-600 font-bold">200 OK • Ready</span>
            </div>
            <pre className="font-mono text-xs text-slate-800 bg-slate-900/5 p-3 rounded-xl overflow-x-auto leading-relaxed max-h-[220px]">
              {JSON.stringify(submittedPayload, null, 2)}
            </pre>
          </div>

          {/* Quick Summary Pill Bar */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-slate-700">
            <span><strong>Target:</strong> {submittedPayload.destination}</span>
            <span><strong>Duration:</strong> {submittedPayload.days} Days</span>
            <span><strong>Style:</strong> {submittedPayload.travelStyle}</span>
            <span><strong>Budget:</strong> {submittedPayload.budget.currency} {submittedPayload.budget.amount.toLocaleString()}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <Button
              size="large"
              icon={<EditOutlined />}
              onClick={() => setSubmittedPayload(null)}
              className="rounded-xl border-slate-200 text-slate-700 font-semibold cursor-pointer text-xs h-11 px-5"
            >
              Modify Parameters
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={onBackToOverview}
              className="rounded-xl font-semibold cursor-pointer text-xs h-11 px-6"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #0284c7 100%)',
                border: 'none',
              }}
            >
              Done / Return Home
            </Button>
          </div>

        </div>
      )}
    </div>
  );
}
