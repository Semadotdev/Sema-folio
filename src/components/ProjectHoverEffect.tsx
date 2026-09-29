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

function generateSkyline() {
  return Array.from({ length: 11 }, (_, i) => {
    const s = i * 41 + 3;
    return {
      id: i,
      width: 15 + Math.round(seededRandom(s) * 12),
      height: 18 + Math.round(seededRandom(s + 1) * 44),
      delay: parseFloat((seededRandom(s + 2) * 1.4).toFixed(4)),
      windows: Array.from({ length: 4 }, (_, w) => {
        const ws = i * 97 + w * 13;
        return {
          lit: seededRandom(ws) > 0.45,
          delay: parseFloat((seededRandom(ws + 1) * 4).toFixed(4)),
          top: `${20 + Math.round(seededRandom(ws + 2) * 52)}%`,
          left: `${22 + Math.round(seededRandom(ws + 3) * 44)}%`,
        };
      }),
    };
  });
}

function AndorTheme() {
  const [skyline] = useState(generateSkyline);

  return (
    <div className="andor-root absolute inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes andorGridPan {
          0% { transform: translate(0, 0); }
          100% { transform: translate(48px, 48px); }
        }
        @keyframes andorLotPulse {
          0% { transform: scale(1); opacity: 0.4; }
          70% { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes andorScan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 0.2; }
          90% { opacity: 0.2; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes andorWindow {
          0%, 100% { opacity: 0.06; }
          50% { opacity: 0.22; }
        }
        @keyframes andorRise {
          0% { transform: translateY(16px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .andor-root, .andor-root * { animation: none !important; }
        }
      `}</style>

      <div
        className="absolute"
        style={{
          inset: -48,
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          animation: "andorGridPan 9s linear infinite",
        }}
      />

      <div
        className="absolute border border-amber-300/25"
        style={{ right: "6%", top: "14%", width: 20, height: 20 }}
      >
        <div
          className="absolute inset-0 border border-amber-300/30"
          style={{ animation: "andorLotPulse 2.8s ease-out infinite" }}
        />
        <span className="absolute left-1/2 top-1/2 w-[3px] h-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/55" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex items-end gap-px h-1/3">
        {skyline.map((b) => (
          <div
            key={b.id}
            className="relative bg-transparent border-x border-t border-cyan-400/12"
            style={{
              width: b.width,
              height: `${b.height}%`,
              animation: `andorRise 0.7s ease-out ${b.delay}s backwards`,
            }}
          >
            {b.windows
              .filter((w) => w.lit)
              .map((w, i) => (
                <span
                  key={i}
                  className="absolute w-[2px] h-[2px] bg-cyan-200/45"
                  style={{
                    top: w.top,
                    left: w.left,
                    animation: `andorWindow 3s ease-in-out ${w.delay}s infinite`,
                  }}
                />
              ))}
          </div>
        ))}
      </div>

      <div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent"
        style={{ animation: "andorScan 3.5s ease-in-out infinite" }}
      />
    </div>
  );
}

const VERSE_PANEL_LAYOUT = [
  { left: "56%", top: "10%", width: "28%", height: "22%" },
  { left: "58%", top: "62%", width: "26%", height: "20%" },
  { left: "4%", top: "70%", width: "24%", height: "18%" },
];

function generatePanels() {
  return VERSE_PANEL_LAYOUT.map((layout, i) => {
    const s = i * 47 + 19;
    return {
      ...layout,
      id: i,
      drift: parseFloat((seededRandom(s) * 6 - 3).toFixed(4)),
      delay: parseFloat((seededRandom(s + 2) * 3).toFixed(4)),
      duration: parseFloat((seededRandom(s + 3) * 2 + 5).toFixed(4)),
      active: i === 0,
    };
  });
}

function UniVerseTheme() {
  const [panels] = useState(generatePanels);

  return (
    <div className="verse-root absolute inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes versePanelDrift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(var(--drift), -4px); }
        }
        @keyframes verseChapterGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(167,139,250,0); border-color: rgba(167,139,250,0.28); }
          50% { box-shadow: 0 0 12px 0 rgba(167,139,250,0.12); border-color: rgba(244,114,182,0.40); }
        }
        @keyframes verseChapterFill {
          0% { width: 5%; }
          60% { width: 78%; }
          100% { width: 5%; }
        }
        @keyframes verseDotRun {
          0% { left: 5%; }
          60% { left: 78%; }
          100% { left: 5%; }
        }
        @keyframes verseToneShift {
          0% { background-size: 8px 8px; }
          100% { background-size: 13px 13px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .verse-root, .verse-root * { animation: none !important; }
        }
      `}</style>

      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(rgba(167,139,250,0.9) 1px, transparent 1px)",
          backgroundSize: "8px 8px",
          animation: "verseToneShift 8s ease-in-out infinite alternate",
        }}
      />

      {panels.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-[3px] bg-transparent"
          style={{
            left: p.left,
            top: p.top,
            width: p.width,
            height: p.height,
            border: "1px solid rgba(167,139,250,0.12)",
            "--drift": `${p.drift}px`,
            animation: p.active
              ? `verseChapterGlow 2.6s ease-in-out infinite, versePanelDrift ${p.duration}s ease-in-out ${p.delay}s infinite`
              : `versePanelDrift ${p.duration}s ease-in-out ${p.delay}s infinite`,
          } as React.CSSProperties}
        />
      ))}

      <div className="absolute bottom-0 left-0 right-0 h-px bg-violet-400/15">
        <div
          className="absolute h-px bg-gradient-to-r from-violet-400/35 to-rose-400/35"
          style={{ width: "5%", animation: "verseChapterFill 7s ease-in-out infinite" }}
        />
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-rose-300/80"
          style={{ animation: "verseDotRun 7s ease-in-out infinite" }}
        />
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

export default function ProjectHoverEffect({ slug }: { slug: string }) {
  switch (slug) {
    case "luna-ai":
      return <LunaTheme />;
    case "baktag":
      return <BaktagTheme />;
    case "quantinda":
      return <QuantindaTheme />;
    case "em-andor":
      return <AndorTheme />;
    case "uni-verse":
      return <UniVerseTheme />;
    default:
      return <ShimmerTheme />;
  }
}
