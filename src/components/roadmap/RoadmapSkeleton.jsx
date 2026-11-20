import React from 'react';

export default function RoadmapSkeleton({
  layout = 'bento',
  destination = 'Destination',
  origin = 'Origin',
  phaseText = 'Curating bespoke travel roadmap...'
}) {
  return (
    <div className="w-full h-full flex flex-col justify-start select-none relative animate-fadeIn">
      {layout === 'bento' ? (
        /* ========================================================= */
        /* 1. BENTO COCKPIT LAYOUT-MATCHED SKELETON (3 COLS × 3 ROWS)*/
        /* Clean, YouTube/Linear-Grade Minimalist Shimmer Surface     */
        /* ========================================================= */
        <div className="w-full max-w-[1400px] mx-auto h-full lg:h-[calc(100vh-120px)] lg:max-h-[820px] flex flex-col justify-start overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.05fr_1.65fr_1.3fr] lg:grid-rows-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.15fr)] gap-3.5 h-full w-full">
            
            {/* Tile 1: Ticket Deck Skeleton (Col 1, Rows 1-2) */}
            <div className="bento-tile col-span-1 lg:col-start-1 lg:col-span-1 lg:row-start-1 lg:row-span-2 p-5 rounded-[28px] flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-white via-white to-sky-50/75 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-sky-950/35 border border-slate-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(15,23,42,0.04)] dark:shadow-[0_12px_32px_rgb(0,0,0,0.35)] h-full backdrop-blur-2xl">
              <div>
                <div className="flex items-center justify-between pb-2">
                  <div className="w-28 h-4 rounded-full bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
                  <div className="w-14 h-4 rounded-full bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
                </div>
                <div className="w-36 h-3 rounded-full bg-slate-200/60 dark:bg-slate-800/60 animate-pulse mt-1.5" />
              </div>

              {/* Minimal Boarding Pass Contour Shimmer */}
              <div className="my-auto py-3 w-full flex items-center justify-center min-h-[190px] relative">
                {/* Back Stay Card Shimmer */}
                <div className="absolute inset-x-2 top-2 h-36 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5 rotate-[3deg] -translate-y-1.5" />
                
                {/* Front Active Pass Shimmer */}
                <div className="relative w-full rounded-2xl bg-white/95 dark:bg-slate-800/90 border border-slate-200/90 dark:border-white/10 p-4 space-y-3.5 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="w-28 h-3.5 rounded-full bg-slate-200/75 dark:bg-slate-700 animate-pulse" />
                    <div className="w-14 h-3.5 rounded-full bg-slate-200/75 dark:bg-slate-700 animate-pulse" />
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <div className="w-14 h-7 rounded-lg bg-slate-200/75 dark:bg-slate-700 animate-pulse" />
                    <div className="w-8 h-1 rounded bg-slate-200/75 dark:bg-slate-700 animate-pulse" />
                    <div className="w-14 h-7 rounded-lg bg-slate-200/75 dark:bg-slate-700 animate-pulse" />
                  </div>
                  <div className="border-t border-dashed border-slate-200 dark:border-slate-700 pt-2.5 flex items-center justify-between">
                    <div className="w-20 h-3 rounded-full bg-slate-200/75 dark:bg-slate-700 animate-pulse" />
                    <div className="w-24 h-3 rounded-full bg-slate-200/75 dark:bg-slate-700 animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                <div className="w-36 h-3 rounded-full bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
                <div className="w-12 h-3 rounded-full bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
              </div>
            </div>

            {/* Tile 2: Center Anchor Hero Skeleton (Col 2, Rows 1-2) */}
            {/* Focal Point: Live AI Progress Status Pill Cleanly Centered */}
            <div className="bento-tile col-span-1 md:col-span-2 lg:col-start-2 lg:col-span-1 lg:row-start-1 lg:row-span-2 rounded-[32px] overflow-hidden relative p-6 sm:p-7 flex flex-col justify-between bg-slate-900/95 dark:bg-slate-950/95 border border-slate-800/80 dark:border-white/10 shadow-2xl h-full">
              {/* Soft Ambient Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 via-transparent to-sky-600/10 pointer-events-none" />

              {/* Top Shimmer Header */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-32 h-6 rounded-full bg-white/15 animate-pulse" />
                  <div className="hidden sm:block w-36 h-6 rounded-full bg-white/10 animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-7 rounded-full bg-white/15 animate-pulse" />
                  <div className="w-16 h-7 rounded-full bg-blue-500/40 animate-pulse" />
                </div>
              </div>

              {/* CENTER STAGE: Clean Live AI Progress Status Pill */}
              <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center px-4 py-6 space-y-4">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-2xl border border-white/20 dark:border-white/15 shadow-2xl shadow-blue-500/20 text-xs sm:text-sm font-semibold text-white">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
                  </span>
                  <span className="tracking-tight text-white font-medium">{phaseText}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/30">
                    {origin} → {destination}
                  </span>
                </div>

                <div className="w-3/5 h-8 sm:h-9 rounded-2xl bg-white/20 animate-pulse" />
                <div className="w-2/5 h-4 rounded-lg bg-white/10 animate-pulse" />
              </div>

              {/* Bottom Shimmer Day Pills */}
              <div className="relative z-10 flex items-center gap-2 pt-2 border-t border-white/10">
                {[1, 2, 3, 4].map((d) => (
                  <div key={d} className="w-16 h-7 rounded-full bg-white/15 animate-pulse" />
                ))}
              </div>
            </div>

            {/* Tile 3: Day Schedule 3D Stack Skeleton (Col 3, Rows 1-2) */}
            <div className="bento-tile col-span-1 lg:col-start-3 lg:col-span-1 lg:row-start-1 lg:row-span-2 p-5 rounded-[28px] flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-white via-white to-sky-50/75 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-sky-950/35 border border-slate-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(15,23,42,0.04)] dark:shadow-[0_12px_32px_rgb(0,0,0,0.35)] h-full backdrop-blur-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
                <div className="w-32 h-4 rounded-full bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
                <div className="w-16 h-6 rounded-full bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
              </div>

              {/* 3D Tilted Photo + Slices Skeleton (~72% / ~28%) */}
              <div className="my-2 flex-1 flex items-stretch gap-2.5 min-h-0 relative">
                {/* Front Hero Card (~72%) */}
                <div className="w-[72%] h-full rounded-[22px] bg-white/85 dark:bg-slate-800/85 border border-slate-200/80 dark:border-white/10 p-3.5 flex flex-col justify-between shadow-md">
                  <div className="space-y-2">
                    <div className="w-20 h-3 rounded-full bg-slate-200/75 dark:bg-slate-700 animate-pulse" />
                    <div className="w-full h-5 rounded-lg bg-slate-200/75 dark:bg-slate-700 animate-pulse" />
                  </div>
                  <div className="h-28 rounded-xl bg-slate-200/75 dark:bg-slate-700/80 animate-pulse my-auto" />
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-white/10">
                    <div className="w-20 h-4 rounded-full bg-slate-200/75 dark:bg-slate-700 animate-pulse" />
                    <div className="w-14 h-4 rounded-full bg-slate-200/75 dark:bg-slate-700 animate-pulse" />
                  </div>
                </div>

                {/* Fanned Slices (~28%) */}
                <div className="w-[28%] h-full flex flex-col gap-2">
                  <div className="flex-1 rounded-[18px] bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
                  <div className="flex-1 rounded-[18px] bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                <div className="w-32 h-3 rounded-full bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
                <div className="w-12 h-3 rounded-full bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
              </div>
            </div>

            {/* Tile 4: Budget Simulator Skeleton (Col 1, Row 3) */}
            <div className="bento-tile col-span-1 lg:col-start-1 lg:col-span-1 lg:row-start-3 lg:row-span-1 p-5 rounded-[28px] flex flex-col justify-between bg-gradient-to-br from-white via-white to-sky-50/75 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-sky-950/35 border border-slate-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(15,23,42,0.04)] dark:shadow-[0_12px_32px_rgb(0,0,0,0.35)] h-full backdrop-blur-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-4 border-slate-200/75 dark:border-slate-700 animate-pulse shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="w-28 h-5 rounded-lg bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
                  <div className="w-20 h-3 rounded-full bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 dark:border-white/10">
                <div className="h-8 rounded-xl bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
                <div className="h-8 rounded-xl bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
                <div className="h-8 rounded-xl bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
                <div className="h-8 rounded-xl bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
              </div>
            </div>

            {/* Tile 5: Dining Spotlight Skeleton (Col 2, Row 3) */}
            <div className="bento-tile col-span-1 lg:col-start-2 lg:col-span-1 lg:row-start-3 lg:row-span-1 p-5 rounded-[28px] flex flex-col justify-between bg-gradient-to-br from-white via-white to-sky-50/75 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-sky-950/35 border border-slate-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(15,23,42,0.04)] dark:shadow-[0_12px_32px_rgb(0,0,0,0.35)] h-full backdrop-blur-2xl">
              <div className="flex items-center justify-between">
                <div className="w-32 h-4 rounded-full bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
                <div className="w-14 h-4 rounded-full bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
              </div>

              <div className="my-1 flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-slate-200/75 dark:bg-slate-800/75 animate-pulse shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="w-36 h-4 rounded-lg bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
                  <div className="w-24 h-3 rounded-full bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
                  <div className="w-44 h-3 rounded-full bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                <div className="w-36 h-3 rounded-full bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
                <div className="w-12 h-3 rounded-full bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
              </div>
            </div>

            {/* Tile 6: Booking To-Do Skeleton (Col 3, Row 3) */}
            <div className="bento-tile col-span-1 lg:col-start-3 lg:col-span-1 lg:row-start-3 lg:row-span-1 p-5 rounded-[28px] flex flex-col justify-between bg-gradient-to-br from-white via-white to-sky-50/75 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-sky-950/35 border border-slate-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(15,23,42,0.04)] dark:shadow-[0_12px_32px_rgb(0,0,0,0.35)] h-full backdrop-blur-2xl">
              <div className="flex items-center justify-between">
                <div className="w-28 h-4 rounded-full bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
                <div className="w-12 h-4 rounded-full bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
              </div>

              <div className="my-1 space-y-2">
                <div className="w-full h-2 rounded-full bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
                <div className="h-8 rounded-xl bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                <div className="w-36 h-3 rounded-full bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
                <div className="w-12 h-3 rounded-full bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* ========================================================= */
        /* 2. EDITORIAL ROADMAP LAYOUT-MATCHED SKELETON               */
        /* Clean Status Pill Centered at Top                         */
        /* ========================================================= */
        <div className="w-full max-w-[1280px] mx-auto space-y-8 animate-fadeIn pt-2">
          {/* Status Pill Centered Cleanly at Top */}
          <div className="w-full flex justify-center mb-6">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-900/5 dark:shadow-black/30 text-xs sm:text-sm font-semibold text-slate-800 dark:text-white">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
              </span>
              <span className="tracking-tight">{phaseText}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                {origin} → {destination}
              </span>
            </div>
          </div>

          {/* Split Hero Banner Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="w-32 h-6 rounded-full bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
              <div className="w-4/5 h-10 rounded-2xl bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
              <div className="w-full h-4 rounded-lg bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
              <div className="w-3/4 h-4 rounded-lg bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
              <div className="flex items-center gap-3 pt-2">
                <div className="w-24 h-7 rounded-full bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
                <div className="w-32 h-7 rounded-full bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
                <div className="w-24 h-7 rounded-full bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-36 h-11 rounded-full bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
                <div className="w-36 h-11 rounded-full bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
              </div>
            </div>

            <div className="lg:col-span-5 h-[340px] rounded-[32px] bg-slate-200/75 dark:bg-slate-800/75 animate-pulse border border-slate-200/80 dark:border-white/10 shadow-lg" />
          </div>

          {/* Budget Simulator Card Skeleton */}
          <div className="p-8 rounded-[28px] space-y-4 bg-white/75 dark:bg-slate-900/75 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-48 h-6 rounded-xl bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
              <div className="w-28 h-6 rounded-full bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
            </div>
            <div className="w-full h-3 rounded-full bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 rounded-2xl bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
              ))}
            </div>
          </div>

          {/* 3D Flip Passes Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-[24px] h-60 bg-white/75 dark:bg-slate-900/75 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-sm bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
            <div className="p-6 rounded-[24px] h-60 bg-white/75 dark:bg-slate-900/75 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-sm bg-slate-200/75 dark:bg-slate-800/75 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}
