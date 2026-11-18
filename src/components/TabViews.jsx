import React from 'react';

export default function TabViews({ activeTab }) {
  const titles = {
    analytics: 'Analytics.',
    settings: 'Settings.',
    planner: 'Trip Planner.',
  };

  const title = titles[activeTab] || 'Waypoint.';

  return (
    <section className="w-full max-w-[1280px] mx-auto min-h-[75vh] flex items-center justify-center px-8 py-24 sm:py-36">
      <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-slate-900 text-center select-none leading-tight">
        {title}
      </h1>
    </section>
  );
}
