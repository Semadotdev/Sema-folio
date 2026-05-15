"use client";

import { useState } from "react";

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateStars() {
  return Array.from({ length: 14 }, (_, i) => {
    const s = i * 31 + 7;
    return {
      id: i,
      top: `${(seededRandom(s) * 90 + 5).toFixed(4)}%`,
      left: `${(seededRandom(s + 1) * 90 + 5).toFixed(4)}%`,
      size: parseFloat((seededRandom(s + 2) * 3 + 1).toFixed(4)),
      delay: parseFloat((seededRandom(s + 3) * 3).toFixed(4)),
      duration: parseFloat((seededRandom(s + 4) * 2 + 1.5).toFixed(4)),
    };
  });
}

function LunaTheme() {
  const [stars] = useState(generateStars);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes moonFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-4px) scale(1.05); }
        }
        @keyframes moonGlow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.3); }
        }
        @keyframes shootingStar {
          0% { transform: translateX(0) translateY(0) rotate(-35deg); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translateX(120px) translateY(80px) rotate(-35deg); opacity: 0; }
        }
      `}</style>

      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}

      <div
        className="absolute w-8 h-8 rounded-full bg-amber-200/30 blur-md"
        style={{
          bottom: "25%",
          right: "20%",
          animation: "moonGlow 3s ease-in-out infinite",
        }}
      />
      <svg
        className="absolute"
        style={{
          bottom: "22%",
          right: "18%",
          width: 24,
          height: 24,
          animation: "moonFloat 4s ease-in-out infinite",
        }}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          fill="#fbbf24"
          opacity="0.8"
        />
      </svg>

      <div
        className="absolute w-px h-px bg-gradient-to-r from-white/80 to-transparent"
        style={{
          top: "15%",
          right: "30%",
          animation: "shootingStar 4s ease-in-out 2s infinite",
          width: 60,
        }}
      />
    </div>
  );
}

function generateBars() {
  return Array.from({ length: 20 }, (_, i) => {
    const s = i * 53 + 11;
    return {
      id: i,
      width: parseFloat((seededRandom(s) * 6 + 2).toFixed(4)),
      height: `${(seededRandom(s + 1) * 40 + 20).toFixed(4)}%`,
      bottom: `${(seededRandom(s + 2) * 30 + 5).toFixed(4)}%`,
      delay: parseFloat((seededRandom(s + 3) * 0.5).toFixed(4)),
    };
  });
}

function BaktagTheme() {
  const [bars] = useState(generateBars);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes slideBar {
          0% { transform: translateX(-60px); opacity: 0; }
          100% { transform: translateX(0); opacity: 0.3; }
        }
        @keyframes scanLine {
          0% { top: 0; }
          100% { top: 100%; }
        }
        @keyframes checkPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 0.5; }
        }
        @keyframes boxFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.15; }
          50% { transform: translateY(-6px) rotate(2deg); opacity: 0.3; }
        }
        @keyframes shimmerSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-end gap-0.5 h-3/5">
        {bars.map((bar) => (
          <div
            key={bar.id}
            className="bg-blue-400/20 rounded-full"
            style={{
              width: bar.width,
              height: bar.height,
              animation: `slideBar 0.6s ease-out ${bar.delay}s forwards`,
              opacity: 0,
            }}
          />
        ))}
      </div>

      <div
        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400/40 to-transparent"
        style={{
          animation: "scanLine 2.5s ease-in-out infinite",
        }}
      />

      <div
        className="absolute bottom-6 left-6 text-green-400/40"
        style={{
          animation: "checkPop 0.8s ease-out 0.3s forwards",
          opacity: 0,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <div
        className="absolute top-6 right-6 border-2 border-blue-400/15 rounded-lg"
        style={{
          width: 28,
          height: 28,
          animation: "boxFloat 4s ease-in-out infinite",
        }}
      />
    </div>
  );
}

function generateCoins() {
  return Array.from({ length: 12 }, (_, i) => {
    const s = i * 37 + 13;
    return {
      id: i,
      left: `${(seededRandom(s) * 90 + 5).toFixed(4)}%`,
      size: parseFloat((seededRandom(s + 1) * 6 + 4).toFixed(4)),
      delay: parseFloat((seededRandom(s + 2) * 4).toFixed(4)),
      duration: parseFloat((seededRandom(s + 3) * 3 + 3).toFixed(4)),
      drift: parseFloat((seededRandom(s + 4) * 40 - 20).toFixed(4)),
      gold: seededRandom(s + 5) > 0.5,
    };
  });
}

function generateTags() {
  return Array.from({ length: 4 }, (_, i) => {
    const s = i * 29 + 7;
    return {
      id: i,
      left: `${(seededRandom(s) * 80 + 10).toFixed(4)}%`,
      top: `${(seededRandom(s + 1) * 60 + 20).toFixed(4)}%`,
      delay: parseFloat((seededRandom(s + 2) * 5).toFixed(4)),
      rotation: parseFloat((seededRandom(s + 3) * 20 - 10).toFixed(4)),
    };
  });
}

function QuantindaTheme() {
  const [coins] = useState(generateCoins);
  const [tags] = useState(generateTags);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes bagFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.15; }
          50% { transform: translateY(-8px) rotate(3deg); opacity: 0.35; }
        }
        @keyframes coinFloat {
          0% { transform: translateY(100%) translateX(0) scale(0.5); opacity: 0; }
          20% { opacity: 0.5; }
          80% { opacity: 0.5; }
          100% { transform: translateY(-60px) translateX(var(--drift)) scale(1); opacity: 0; }
        }
        @keyframes scanLine {
          0% { top: 0; opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes tagSwing {
          0%, 100% { transform: rotate(var(--rot)) translateY(0); opacity: 0.15; }
          50% { transform: rotate(var(--rot)) translateY(-4px); opacity: 0.3; }
        }
        @keyframes shelfGlow {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.15; }
        }
        @keyframes registerBlip {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
      `}</style>

      <div
        className="absolute left-4 top-1/3 text-emerald-400"
        style={{
          animation: "bagFloat 4s ease-in-out infinite",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      </div>
      <div
        className="absolute right-6 top-1/4 text-blue-400"
        style={{
          animation: "bagFloat 4.5s ease-in-out 1.5s infinite",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      </div>

      <div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"
        style={{
          animation: "scanLine 3s ease-in-out infinite",
        }}
      />

      {coins.map((coin) => (
        <div
          key={coin.id}
          className="absolute rounded-full"
          style={{
            left: coin.left,
            bottom: "10%",
            width: coin.size,
            height: coin.size,
            background: coin.gold
              ? "radial-gradient(circle, #fbbf24, #d97706)"
              : "radial-gradient(circle, #9ca3af, #6b7280)",
            animation: `coinFloat ${coin.duration}s ease-out ${coin.delay}s infinite`,
            "--drift": `${coin.drift}px`,
          } as React.CSSProperties}
        />
      ))}

      {tags.map((tag) => (
        <div
          key={tag.id}
          className="absolute flex items-center gap-1 rounded border border-emerald-400/20 bg-emerald-400/5 px-2 py-0.5"
          style={{
            left: tag.left,
            top: tag.top,
            animation: `tagSwing 3.5s ease-in-out ${tag.delay}s infinite`,
            "--rot": `${tag.rotation}deg`,
          } as React.CSSProperties}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400/40">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
          <span className="text-[6px] text-emerald-400/30 font-mono">&#8369;{Math.floor(seededRandom(tag.id * 13 + 5) * 100 + 1)}</span>
        </div>
      ))}

      <div
        className="absolute bottom-0 left-0 right-0 h-3"
        style={{
          background: "linear-gradient(to top, rgba(16,185,129,0.08), transparent)",
          animation: "shelfGlow 3s ease-in-out infinite",
        }}
      />

      <div
        className="absolute bottom-1 left-1/2 -translate-x-1/2 text-emerald-400/20"
        style={{
          animation: "registerBlip 2s ease-in-out infinite",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M8 8h8M8 12h6M8 16h4" />
        </svg>
      </div>
    </div>
  );
}

function ShimmerTheme() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes shimmerSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        style={{
          animation: "shimmerSweep 2.5s ease-in-out infinite",
        }}
      />
    </div>
  );
}

export default function ProjectHoverEffect({ title }: { title: string }) {
  if (title.toLowerCase().includes("luna") || title.toLowerCase().includes("ai")) {
    return <LunaTheme />;
  }
  if (title.toLowerCase().includes("franklin") || title.toLowerCase().includes("baktag")) {
    return <BaktagTheme />;
  }
  if (title.toLowerCase().includes("quantinda")) {
    return <QuantindaTheme />;
  }
  return <ShimmerTheme />;
}
