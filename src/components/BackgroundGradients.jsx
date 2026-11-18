import React from 'react';

export default function BackgroundGradients() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#f8fafc]">
      {/* Off-white to pure-white base canvas */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafc] via-[#ffffff] to-[#f8fafc]" />

      {/* Soft diffused sky-blue and cobalt radial glow accents behind top header & hero */}
      <div 
        className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full blur-[140px]"
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, rgba(56, 189, 248, 0.14) 50%, rgba(255, 255, 255, 0) 75%)',
        }}
      />

      <div 
        className="absolute top-[15%] right-[10%] w-[500px] h-[400px] rounded-full blur-[130px]"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.10) 0%, rgba(37, 99, 235, 0.06) 60%, transparent 80%)',
        }}
      />

      <div 
        className="absolute top-[20%] left-[8%] w-[450px] h-[350px] rounded-full blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, rgba(56, 189, 248, 0.06) 60%, transparent 80%)',
        }}
      />

      {/* Subtle micro grid texture */}
      <div 
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(rgba(15, 23, 42, 0.8) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
}
