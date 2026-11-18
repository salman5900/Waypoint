import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Compass, 
  Terminal, 
  Hexagon, 
  Layers, 
  Copy, 
  Check, 
  Info,
  Upload,
  ArrowRight
} from 'lucide-react';

export default function LogoModal({ isOpen, onClose, logoInfo, setLogoInfo }) {
  const [copied, setCopied] = useState(false);
  const [activeIcon, setActiveIcon] = useState('sparkles');

  if (!isOpen) return null;

  const sampleIcons = [
    { id: 'sparkles', label: 'Sparkles', icon: Sparkles },
    { id: 'compass', label: 'Compass', icon: Compass },
    { id: 'hexagon', label: 'Hexagon', icon: Hexagon },
    { id: 'terminal', label: 'Terminal', icon: Terminal },
    { id: 'layers', label: 'Layers', icon: Layers },
  ];

  const codeSnippet = `// In src/components/Navbar.jsx:
// Replace the placeholder with your SVG or <img> tag:
<img 
  src="/logo.svg" 
  alt="Your Brand Logo" 
  className="w-9 h-9 object-contain" 
/>
<span className="font-bold text-slate-900">${logoInfo.title}</span>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" 
      />

      {/* Glassmorphic Modal Window */}
      <div className="relative w-full max-w-lg glass-surface-opaque rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/90 transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Logo Slot (Placeholder)</h3>
              <p className="text-xs text-slate-500">Configure or preview your custom brand mark</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100/70 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Glass Banner */}
        <div className="mt-5 p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/60 flex items-start gap-3 text-xs text-blue-800">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p>
            As requested, this left-side logo slot is configured as a stylish <strong>placeholder</strong>. You can customize the placeholder text here or paste your brand's real logo anytime!
          </p>
        </div>

        {/* Live Preview Box */}
        <div className="mt-5 p-4 rounded-2xl bg-white/70 border border-white shadow-inner">
          <label className="text-xs font-semibold text-slate-500 block mb-2">Live Navbar Preview</label>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px] shadow-sm flex items-center justify-center text-white">
              <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center text-blue-600">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{logoInfo.title || "BRAND LOGO"}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  Placeholder
                </span>
              </div>
              <span className="text-xs text-slate-400">{logoInfo.tagline || "Your brand identity"}</span>
            </div>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Brand Title Text
            </label>
            <input 
              type="text" 
              value={logoInfo.title}
              onChange={(e) => setLogoInfo({ ...logoInfo, title: e.target.value })}
              placeholder="e.g. Waypoint, Acme Corp, Horizon..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tagline / Subtitle
            </label>
            <input 
              type="text" 
              value={logoInfo.tagline}
              onChange={(e) => setLogoInfo({ ...logoInfo, tagline: e.target.value })}
              placeholder="e.g. Next-Gen Cloud Platform"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800"
            />
          </div>
        </div>

        {/* Code Snippet for developers */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-600">Replacement Code Example</span>
            <button
              onClick={handleCopy}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="p-3 rounded-xl bg-slate-900 text-slate-200 text-[11px] font-mono overflow-x-auto leading-relaxed">
            {codeSnippet}
          </pre>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="glass-btn px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="glass-btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md shadow-blue-500/20"
          >
            Apply Changes
          </button>
        </div>

      </div>
    </div>
  );
}
