import React, { useState, useEffect } from 'react';

const DEFAULT_STATUSES = [
  "Scouting multi-leg flights & stays...",
  "Mapping landmarks & dining gems...",
  "Structuring day-by-day routing & budget...",
  "Polishing bespoke travel recommendations...",
];

export default function RoadmapSkeleton({
  destination = 'Destination',
  origin = 'Origin',
  days = 4,
  phaseText = '',
  // Accepted for backwards-compatibility; skeletons are removed for both layouts
  layout = 'bento',
}) {
  const [internalStatusIndex, setInternalStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setInternalStatusIndex((prev) => (prev + 1) % DEFAULT_STATUSES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const currentStatus = phaseText || DEFAULT_STATUSES[internalStatusIndex];

  return (
    <div className="w-full flex items-center justify-center p-4 select-none animate-fadeIn">
      <style>{`
        @keyframes robotFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(2.5deg); }
        }
        @keyframes eyeBlink {
          0%, 88%, 100% { transform: scaleY(1); }
          94% { transform: scaleY(0.1); }
        }
      `}</style>

      {/* Sleek Centered Frosted-Glass Thinking Robot Card */}
      <div className="relative max-w-md w-full mx-auto rounded-3xl p-8 sm:p-9 backdrop-blur-2xl bg-white/85 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 shadow-xl dark:shadow-2xl dark:shadow-black/60 text-center flex flex-col items-center transition-colors duration-300">
        
        {/* Soft Ambient Radial Halo behind Card */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-sky-400/15 via-blue-500/10 to-indigo-500/15 blur-2xl -z-10 pointer-events-none" />

        {/* ========================================================= */}
        {/* CUTE THINKING ROBOT ILLUSTRATION + SPINNING BUFFER RING    */}
        {/* ========================================================= */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-6">
          {/* Subtle Ambient Glow behind Spinner */}
          <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-sky-400/20 via-blue-500/15 to-indigo-500/20 blur-xl pointer-events-none" />

          {/* Subtle Static Outer Guide Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-slate-200/60 dark:border-slate-800/80" />

          {/* Smooth Rotating Buffer Spinner Ring */}
          <svg
            className="absolute inset-0 w-full h-full animate-spin pointer-events-none"
            viewBox="0 0 100 100"
            style={{ animationDuration: '1.6s' }}
          >
            <defs>
              <linearGradient id="robotSpinnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
                <stop offset="60%" stopColor="#2563eb" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="47"
              fill="none"
              stroke="url(#robotSpinnerGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="95 200"
            />
          </svg>

          {/* Inline SVG Cute Thinking Robot */}
          <div className="relative z-10 w-28 h-28 flex items-center justify-center">
            <svg
              viewBox="0 0 120 120"
              className="w-full h-full overflow-visible"
            >
              <defs>
                <linearGradient id="visorGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#090d16" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>
                <linearGradient id="visorReflect" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
                <filter id="eyeGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Animated Floating Thinking Dots (• • •) beside head */}
              <g className="thinking-dots pointer-events-none">
                <circle cx="92" cy="28" r="2.5" fill="#38bdf8" opacity="0.9">
                  <animate attributeName="cy" values="28; 24; 28" dur="1.4s" repeatCount="indefinite" begin="0s" />
                  <animate attributeName="opacity" values="0.3; 1; 0.3" dur="1.4s" repeatCount="indefinite" begin="0s" />
                </circle>
                <circle cx="102" cy="20" r="3.5" fill="#38bdf8" opacity="0.9">
                  <animate attributeName="cy" values="20; 16; 20" dur="1.4s" repeatCount="indefinite" begin="0.25s" />
                  <animate attributeName="opacity" values="0.3; 1; 0.3" dur="1.4s" repeatCount="indefinite" begin="0.25s" />
                </circle>
                <circle cx="114" cy="13" r="4.5" fill="#38bdf8" opacity="0.9">
                  <animate attributeName="cy" values="13; 9; 13" dur="1.4s" repeatCount="indefinite" begin="0.5s" />
                  <animate attributeName="opacity" values="0.3; 1; 0.3" dur="1.4s" repeatCount="indefinite" begin="0.5s" />
                </circle>
              </g>

              {/* Floating & Head-Tilt Robot Figure */}
              <g style={{ animation: 'robotFloat 3.2s ease-in-out infinite', transformOrigin: '60px 65px' }}>
                {/* Antenna */}
                <line x1="60" y1="36" x2="60" y2="23" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
                {/* Pulsing antenna tip with glow beacon */}
                <circle cx="60" cy="21" r="5" fill="#38bdf8" filter="url(#eyeGlow)">
                  <animate attributeName="r" values="4; 6; 4" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.75; 1; 0.75" dur="1.8s" repeatCount="indefinite" />
                </circle>
                <circle cx="60" cy="21" r="8" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.4">
                  <animate attributeName="r" values="5; 10; 5" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6; 0; 0.6" dur="1.8s" repeatCount="indefinite" />
                </circle>

                {/* Ears */}
                <rect x="28" y="52" width="6" height="13" rx="3" fill="#64748b" />
                <rect x="86" y="52" width="6" height="13" rx="3" fill="#64748b" />

                {/* Head Chassis */}
                <rect
                  x="33"
                  y="36"
                  width="54"
                  height="44"
                  rx="15"
                  className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-700"
                  strokeWidth="1.5"
                />

                {/* Expressive Rounded Visor Screen */}
                <rect
                  x="39"
                  y="43"
                  width="42"
                  height="27"
                  rx="9"
                  fill="url(#visorGlassGrad)"
                  stroke="#1e293b"
                  strokeWidth="1"
                />
                {/* Visor Specular Reflection */}
                <path
                  d="M 40 47 Q 60 44 80 47 L 80 52 Q 60 49 40 52 Z"
                  fill="url(#visorReflect)"
                />

                {/* Glowing Sky-Blue Eyes (with blink animation) */}
                <g filter="url(#eyeGlow)">
                  <rect
                    x="47"
                    y="50"
                    width="8"
                    height="12"
                    rx="4"
                    fill="#38bdf8"
                    style={{ animation: 'eyeBlink 3.8s ease-in-out infinite', transformOrigin: '51px 56px' }}
                  />
                  {/* Eye light catch highlight */}
                  <circle cx="49.5" cy="53" r="1.2" fill="#ffffff" />

                  <rect
                    x="65"
                    y="50"
                    width="8"
                    height="12"
                    rx="4"
                    fill="#38bdf8"
                    style={{ animation: 'eyeBlink 3.8s ease-in-out infinite', transformOrigin: '69px 56px' }}
                  />
                  {/* Eye light catch highlight */}
                  <circle cx="67.5" cy="53" r="1.2" fill="#ffffff" />
                </g>

                {/* Cute Rosy Cheek Blushes */}
                <ellipse cx="45" cy="73.5" rx="3.5" ry="1.5" fill="#f43f5e" opacity="0.3" />
                <ellipse cx="75" cy="73.5" rx="3.5" ry="1.5" fill="#f43f5e" opacity="0.3" />

                {/* Neck */}
                <rect x="54" y="80" width="12" height="4" rx="2" fill="#64748b" />

                {/* Compact Chassis (Body) */}
                <rect
                  x="41"
                  y="84"
                  width="38"
                  height="20"
                  rx="8"
                  className="fill-slate-200 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-700"
                  strokeWidth="1.5"
                />
                {/* Core Power Light */}
                <circle cx="60" cy="94" r="3.5" fill="#38bdf8" filter="url(#eyeGlow)">
                  <animate attributeName="opacity" values="0.6; 1; 0.6" dur="2s" repeatCount="indefinite" />
                </circle>
              </g>
            </svg>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CLEAN ROUTE & STATUS COPY                                 */}
        {/* ========================================================= */}
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
          Curating Your Journey...
        </h3>

        {/* Route Subtitle */}
        <div className="mt-2.5 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/70 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>{origin || 'Origin'}</span>
          <span className="text-blue-500 font-bold">→</span>
          <span>{destination || 'Destination'}</span>
          <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500" />
          <span>{days} {days === 1 ? 'Day' : 'Days'}</span>
        </div>

        {/* Single Rotating Status Line */}
        <div className="mt-4.5 h-6 flex items-center justify-center overflow-hidden">
          <p 
            key={currentStatus} 
            className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 animate-fadeIn truncate max-w-xs transition-opacity duration-300"
          >
            {currentStatus}
          </p>
        </div>

      </div>
    </div>
  );
}

// Named export for flexibility
export { RoadmapSkeleton as RoadmapLoadingCard };
