import React from 'react';
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

export default function Hero({ onPlanTrip }) {
  return (
    <section className="w-full max-w-[1280px] mx-auto min-h-[72vh] flex flex-col items-center justify-center text-center px-8 py-20 sm:py-28 animate-in fade-in duration-300">
      {/* Main Heading */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-slate-900 select-none leading-[1.08] max-w-4xl">
        Welcome to Waypoint
      </h1>

      {/* Subtitle */}
      <p className="mt-5 text-base sm:text-xl md:text-2xl text-slate-500 font-normal max-w-xl leading-relaxed">
        Your trip planning, all in one place.
      </p>

      {/* Primary CTA Button */}
      <div className="mt-9">
        <Button
          type="primary"
          shape="round"
          size="large"
          onClick={onPlanTrip}
          icon={<ArrowRightOutlined />}
          iconPosition="end"
          className="cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #0284c7 100%)',
            border: 'none',
            boxShadow: '0 10px 25px -4px rgba(37, 99, 235, 0.35)',
            height: '50px',
            paddingInline: '32px',
            fontSize: '15px',
            fontWeight: 600,
          }}
        >
          Plan Trip
        </Button>
      </div>
    </section>
  );
}
