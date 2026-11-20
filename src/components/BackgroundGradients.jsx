import React from 'react';

export default function BackgroundGradients() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#f8fafc] dark:bg-[#090D16] transition-colors duration-300">
      {/* Base Canvas */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafc] via-[#ffffff] to-[#f8fafc] dark:from-[#090D16] dark:via-[#0c121e] dark:to-[#090D16] transition-colors duration-300" />

      {/* Light Mode Glows */}
      <div 
        className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full blur-[140px] dark:opacity-0 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, rgba(56, 189, 248, 0.14) 50%, rgba(255, 255, 255, 0) 75%)',
        }}
      />
      <div 
        className="absolute top-[15%] right-[10%] w-[500px] h-[400px] rounded-full blur-[130px] dark:opacity-0 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.10) 0%, rgba(37, 99, 235, 0.06) 60%, transparent 80%)',
        }}
      />
      <div 
        className="absolute top-[20%] left-[8%] w-[450px] h-[350px] rounded-full blur-[120px] dark:opacity-0 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, rgba(56, 189, 248, 0.06) 60%, transparent 80%)',
        }}
      />

      {/* Dark Mode Luminous Midnight Glows */}
      <div 
        className="absolute -top-[12%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full blur-[150px] opacity-0 dark:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.22) 0%, rgba(99, 102, 241, 0.16) 45%, transparent 75%)',
        }}
      />
      <div 
        className="absolute top-[20%] right-[5%] w-[600px] h-[450px] rounded-full blur-[140px] opacity-0 dark:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.14) 0%, rgba(37, 99, 235, 0.10) 55%, transparent 80%)',
        }}
      />
      <div 
        className="absolute top-[25%] left-[5%] w-[550px] h-[400px] rounded-full blur-[130px] opacity-0 dark:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.16) 0%, rgba(37, 99, 235, 0.08) 60%, transparent 80%)',
        }}
      />

      {/* Micro Grid Texture */}
      <div 
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] transition-opacity duration-300"
        style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
}
