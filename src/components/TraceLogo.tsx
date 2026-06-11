import React from 'react';

interface TraceLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function TraceLogo({ className = '', iconOnly = false, size = 'md' }: TraceLogoProps) {
  const dimensions = {
    sm: { icon: 'w-6 h-6', text: 'text-lg', subtext: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-2xl', subtext: 'text-[11px]' },
    lg: { icon: 'w-14 h-14', text: 'text-4xl', subtext: 'text-xs' }
  }[size];

  return (
    <div className={`flex items-center gap-2 select-none ${className}`} id="trace-dynamic-brand-root">
      {/* Precision Vector Leaf matching user upload */}
      <div className={`${dimensions.icon} relative flex-shrink-0 animate-fade-in`} id="trace-brand-icon">
        <svg 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_8px_rgba(45,106,79,0.25)]"
        >
          <defs>
            <linearGradient id="traceLeafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              {/* Perfectly matching progress-oriented forest/emerald to mint gradient */}
              <stop offset="0%" stopColor="#1B4332" />
              <stop offset="50%" stopColor="#2D6A4F" />
              <stop offset="100%" stopColor="#52B788" />
            </linearGradient>
            
            {/* Mask to carve out the beautiful transparent leaf center vein cleanly */}
            <mask id="leafVeinMask">
              <rect x="0" y="0" width="32" height="32" fill="white" />
              <path 
                d="M 8.5 23.5 L 24.5 7.5" 
                stroke="black" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
              />
            </mask>
          </defs>

          {/* Solid Stem */}
          <path 
            d="M 3.5 28.5 L 9.5 22.5" 
            stroke="url(#traceLeafGrad)" 
            strokeWidth="3.2" 
            strokeLinecap="round" 
          />

          {/* Leaf Body - Symmetrical, full-bodied leaf shape */}
          <path 
            d="M 8.5 23.5 
               C 5.0 15.0, 11.5 6.5, 25.5 6.5 
               C 25.5 6.5, 25.5 15.0, 17.0 23.5 
               C 13.5 27.0, 8.5 23.5, 8.5 23.5 Z" 
            fill="url(#traceLeafGrad)" 
            mask="url(#leafVeinMask)"
          />
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex flex-col select-none" id="trace-brand-words">
          {/* Custom cyan-to-green gradient matching letters of screenshot logo */}
          <h1 className={`font-display font-black tracking-tight leading-none ${dimensions.text}`}>
            <span className="bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#52B788] bg-clip-text text-transparent">
              TRACE
            </span>
          </h1>
          {size !== 'sm' && (
            <span className={`font-mono uppercase tracking-widest text-[#40916C] block pl-0.5 font-bold ${dimensions.subtext}`}>
              Tracking & Real-time Awareness of Carbon Emissions
            </span>
          )}
        </div>
      )}
    </div>
  );
}
