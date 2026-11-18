import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Check, 
  Copy, 
  Sliders, 
  Droplets, 
  Palette, 
  Plus, 
  Minus, 
  Send,
  Zap,
  Code
} from 'lucide-react';

export default function ShowcaseSection({ gradientTheme, setGradientTheme }) {
  const [glassBlur, setGlassBlur] = useState(20);
  const [glassOpacity, setGlassOpacity] = useState(55);
  const [counter, setCounter] = useState(42);
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const cssGenerated = `.custom-glass {
  background: rgba(255, 255, 255, ${glassOpacity / 100});
  backdrop-filter: blur(${glassBlur}px);
  -webkit-backdrop-filter: blur(${glassBlur}px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 20px 40px rgba(0, 50, 150, 0.15);
}`;

  const copyCSS = () => {
    navigator.clipboard.writeText(cssGenerated);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="features" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto space-y-12">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-surface text-xs font-bold text-slate-800 mb-3 shadow-sm">
          <Palette className="w-3.5 h-3.5 text-blue-600" />
          <span>Interactive Glass Studio</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-sm">
          Frosted White Glass on Blue Canvas
        </h2>
        <p className="mt-2 text-sm sm:text-base text-blue-100">
          Tune the backdrop blur, adjust the white glass opacity, and watch the blue gradient refract seamlessly.
        </p>
      </div>

      {/* Main Interactive Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Glass Tuner Controls */}
        <div className="lg:col-span-5 glass-surface-opaque p-6 sm:p-7 rounded-3xl shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Real-Time Glass Tuner</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              Interactive
            </span>
          </div>

          {/* Blur Intensity Slider */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Backdrop Blur Filter</span>
              <span className="text-blue-600">{glassBlur}px</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="40" 
              value={glassBlur}
              onChange={(e) => setGlassBlur(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0px (Crisp)</span>
              <span>20px (Default)</span>
              <span>40px (Ultra Frosted)</span>
            </div>
          </div>

          {/* White Opacity Slider */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
              <span>White Surface Opacity</span>
              <span className="text-blue-600">{glassOpacity}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="95" 
              value={glassOpacity}
              onChange={(e) => setGlassOpacity(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>10% (Transparent)</span>
              <span>55% (Balanced)</span>
              <span>95% (Opaque Glass)</span>
            </div>
          </div>

          {/* Blue Gradient Palette Switcher */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2.5">
              Blue Gradient Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'azure', label: 'Azure Sky', colors: 'from-blue-500 to-indigo-600' },
                { id: 'oceanic', label: 'Oceanic Cyan', colors: 'from-sky-400 to-teal-500' },
                { id: 'frost', label: 'Frost Sapphire', colors: 'from-blue-600 to-indigo-800' },
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setGradientTheme(theme.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    gradientTheme === theme.id 
                      ? 'border-blue-500 bg-white shadow-md' 
                      : 'border-slate-200/80 bg-white/50 hover:bg-white'
                  }`}
                >
                  <div className={`w-full h-3 rounded-md bg-gradient-to-r ${theme.colors} mb-1.5`} />
                  <span className="text-[11px] font-bold text-slate-800 block truncate">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Code Viewer */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <Code className="w-3.5 h-3.5 text-blue-600" />
                Live Generated CSS
              </span>
              <button
                onClick={copyCSS}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-2xl bg-slate-900 text-slate-100 text-[11px] font-mono leading-relaxed overflow-x-auto">
              {cssGenerated}
            </pre>
          </div>

        </div>

        {/* Right Column: Live Rendered Dynamic Glass Cards */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Dynamically Styled Glass Card */}
          <div 
            style={{
              backgroundColor: `rgba(255, 255, 255, ${glassOpacity / 100})`,
              backdropFilter: `blur(${glassBlur}px)`,
              WebkitBackdropFilter: `blur(${glassBlur}px)`,
              border: '1px solid rgba(255, 255, 255, 0.85)',
              boxShadow: '0 25px 60px -10px rgba(0, 50, 140, 0.22), 0 1px 2px 0 rgba(255, 255, 255, 0.9) inset'
            }}
            className="p-7 sm:p-8 rounded-3xl transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50/90 px-2.5 py-1 rounded-full border border-blue-200/60">
                  Dynamic Glass Surface
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">
                  Specimen Card #01
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md">
                  Observe how the background blue gradient softly diffuses through this card with your current blur and opacity settings.
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px] shadow-lg">
                <div className="w-full h-full bg-white/90 rounded-[15px] flex items-center justify-center text-blue-600">
                  <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '8s' }} />
                </div>
              </div>
            </div>

            {/* Interactive Widget Row */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Counter Widget */}
              <div className="p-4 rounded-2xl bg-white/60 border border-white shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block">Interactive Counter</span>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-2xl font-extrabold text-slate-800">{counter}</span>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => setCounter(c => c - 1)}
                      className="w-8 h-8 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs active:scale-95 transition-all"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setCounter(c => c + 1)}
                      className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-500/25 active:scale-95 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="p-4 rounded-2xl bg-white/60 border border-white shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block">Glass Refraction Index</span>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                  <span className="text-sm font-bold text-slate-800">1.52 (High Clarity)</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">Optimal white glass balance</span>
              </div>

            </div>

            {/* Glass Input Box */}
            <div className="mt-6 pt-6 border-t border-slate-200/60">
              <span className="text-xs font-bold text-slate-700 block mb-2">Glass Input & Action</span>
              <form 
                onSubmit={(e) => { e.preventDefault(); setIsSubscribed(true); }}
                className="flex flex-col sm:flex-row gap-2"
              >
                <input 
                  type="email" 
                  required
                  placeholder="Enter your email address..."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-white/80 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800 placeholder:text-slate-400 shadow-xs"
                />
                <button 
                  type="submit"
                  className="glass-btn-primary px-5 py-2.5 rounded-2xl text-sm font-bold text-white shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubscribed ? 'Subscribed!' : 'Subscribe'}</span>
                </button>
              </form>
              {isSubscribed && (
                <p className="text-xs text-emerald-700 font-semibold mt-2 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Thank you! Email added to glassmorphic newsletter.
                </p>
              )}
            </div>

          </div>

          {/* Secondary 3-Column Glass Mini-Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "Specular Rim", desc: "1px crisp white highlight inset", icon: Sparkles },
              { title: "Dynamic Depth", desc: "Soft blue ambient shadows", icon: Layers },
              { title: "Ultra Responsive", desc: "Adapts to desktop & mobile", icon: Zap },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="glass-card-interactive p-5 rounded-2xl">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{item.desc}</p>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </section>
  );
}
