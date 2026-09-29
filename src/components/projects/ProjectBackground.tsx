"use client";

import { useState } from "react";

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function LunaBackground() {
  const [stars] = useState(() =>
    Array.from({ length: 40 }, (_, i) => {
      const s = i * 31 + 7;
      return {
        id: i,
        top: `${(seededRandom(s) * 90 + 5).toFixed(4)}%`,
        left: `${(seededRandom(s + 1) * 90 + 5).toFixed(4)}%`,
        size: parseFloat((seededRandom(s + 2) * 2 + 0.5).toFixed(4)),
        delay: parseFloat((seededRandom(s + 3) * 6).toFixed(4)),
        duration: parseFloat((seededRandom(s + 4) * 3 + 3).toFixed(4)),
      };
    })
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes bgTwinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.6; }
        }
        @keyframes bgMoonFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes bgShootingStar {
          0% { transform: translateX(0) translateY(0) rotate(-35deg); opacity: 0; }
          10% { opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translateX(200px) translateY(120px) rotate(-35deg); opacity: 0; }
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
            opacity: 0,
            animation: `bgTwinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
      <div
        className="absolute rounded-full bg-amber-200/10"
        style={{
          bottom: "15%",
          right: "10%",
          width: 120,
          height: 120,
          filter: "blur(40px)",
          animation: "bgMoonFloat 6s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-0.5 h-0.5 bg-white/40"
        style={{
          top: "12%",
          right: "25%",
          animation: "bgShootingStar 6s ease-in-out 4s infinite",
          width: 80,
          height: 1,
        }}
      />
    </div>
  );
}

function BaktagBackground() {
  const [bars] = useState(() =>
    Array.from({ length: 30 }, (_, i) => {
      const s = i * 53 + 11;
      return {
        id: i,
        width: parseFloat((seededRandom(s) * 4 + 1).toFixed(4)),
        height: `${(seededRandom(s + 1) * 30 + 10).toFixed(4)}%`,
        bottom: `${(seededRandom(s + 2) * 20 + 5).toFixed(4)}%`,
        delay: parseFloat((seededRandom(s + 3) * 2).toFixed(4)),
      };
    })
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes bgBarPulse {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.1; }
        }
        @keyframes bgScanLine {
          0% { top: 0; opacity: 0; }
          10% { opacity: 0.08; }
          90% { opacity: 0.08; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes bgGridFade {
          0%, 100% { opacity: 0.02; }
          50% { opacity: 0.06; }
        }
      `}</style>
      <div
        className="absolute right-8 top-1/2 -translate-y-1/2 flex items-end gap-[2px] h-2/5"
      >
        {bars.map((bar) => (
          <div
            key={bar.id}
            className="bg-blue-400 rounded-full"
            style={{
              width: bar.width,
              height: bar.height,
              opacity: 0.03,
              animation: `bgBarPulse 3s ease-in-out ${bar.delay}s infinite`,
            }}
          />
        ))}
      </div>
      <div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent"
        style={{
          animation: "bgScanLine 4s ease-in-out infinite",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(52, 211, 153, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(52, 211, 153, 0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          animation: "bgGridFade 5s ease-in-out infinite",
        }}
      />
    </div>
  );
}

function QuantindaBackground() {
  const [coins] = useState(() =>
    Array.from({ length: 20 }, (_, i) => {
      const s = i * 37 + 13;
      return {
        id: i,
        left: `${(seededRandom(s) * 90 + 5).toFixed(4)}%`,
        size: parseFloat((seededRandom(s + 1) * 4 + 2).toFixed(4)),
        delay: parseFloat((seededRandom(s + 2) * 8).toFixed(4)),
        duration: parseFloat((seededRandom(s + 3) * 6 + 6).toFixed(4)),
        drift: parseFloat((seededRandom(s + 4) * 60 - 30).toFixed(4)),
        gold: seededRandom(s + 5) > 0.4,
      };
    })
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes bgCoinRise {
          0% { transform: translateY(100%) translateX(0); opacity: 0; }
          20% { opacity: 0.12; }
          80% { opacity: 0.12; }
          100% { transform: translateY(-60px) translateX(var(--drift)); opacity: 0; }
        }
        @keyframes bgShelfGlow {
          0%, 100% { opacity: 0.02; }
          50% { opacity: 0.06; }
        }
        @keyframes bgRegisterBlip {
          0%, 100% { opacity: 0.03; transform: scale(1); }
          50% { opacity: 0.08; transform: scale(1.05); }
        }
      `}</style>
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="absolute rounded-full"
          style={{
            left: coin.left,
            bottom: "5%",
            width: coin.size,
            height: coin.size,
            background: coin.gold
              ? "radial-gradient(circle, #fbbf24, #d97706)"
              : "radial-gradient(circle, #9ca3af, #6b7280)",
            opacity: 0,
            animation: `bgCoinRise ${coin.duration}s ease-out ${coin.delay}s infinite`,
            "--drift": `${coin.drift}px`,
          } as React.CSSProperties}
        />
      ))}
      <div
        className="absolute bottom-0 left-0 right-0 h-16"
        style={{
          background: "linear-gradient(to top, rgba(16,185,129,0.06), transparent)",
          animation: "bgShelfGlow 4s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-4 right-8"
        style={{
          animation: "bgRegisterBlip 3s ease-in-out infinite",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-400/30">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M8 8h8M8 12h6M8 16h4" />
        </svg>
      </div>
    </div>
  );
}

function AndorBackground() {
  const [skyline] = useState(() =>
    Array.from({ length: 22 }, (_, i) => {
      const s = i * 43 + 5;
      return {
        id: i,
        width: parseFloat((seededRandom(s) * 5 + 2).toFixed(4)),
        height: `${(seededRandom(s + 1) * 55 + 15).toFixed(4)}%`,
        delay: parseFloat((seededRandom(s + 2) * 5).toFixed(4)),
        lit: seededRandom(s + 3) > 0.5,
        window: seededRandom(s + 4) > 0.5,
      };
    })
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes bgAndorGridPan {
          0% { transform: translate(0, 0); }
          100% { transform: translate(64px, 64px); }
        }
        @keyframes bgAndorLotPulse {
          0% { transform: scale(1); opacity: 0.2; }
          70% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes bgAndorWindow {
          0%, 100% { opacity: 0.02; }
          50% { opacity: 0.10; }
        }
        @keyframes bgAndorGlow {
          0%, 100% { opacity: 0.015; }
          50% { opacity: 0.035; }
        }
      `}</style>
      <div
        className="absolute"
        style={{
          inset: -64,
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.022) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          animation: "bgAndorGridPan 14s linear infinite",
        }}
      />
      <div
        className="absolute border border-amber-300/14"
        style={{ left: "72%", top: "20%", width: 60, height: 60 }}
      >
        <div
          className="absolute inset-0 border border-amber-300/18"
          style={{ animation: "bgAndorLotPulse 5s ease-out infinite" }}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex items-end gap-px h-1/3">
        {skyline.map((b) => (
          <div
            key={b.id}
            className="relative bg-transparent border-x border-t border-cyan-400/[0.05]"
            style={{ width: b.width, height: b.height }}
          >
            {b.lit && b.window && (
              <span
                className="absolute w-[2px] h-[2px] bg-cyan-200/35"
                style={{
                  top: "35%",
                  left: "45%",
                  animation: `bgAndorWindow 4s ease-in-out ${b.delay}s infinite`,
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 70% 30%, rgba(34,211,238,0.035) 0%, transparent 55%)",
          animation: "bgAndorGlow 6s ease-in-out infinite",
        }}
      />
    </div>
  );
}

function UniVerseBackground() {
  const [panels] = useState(() =>
    Array.from({ length: 7 }, (_, i) => {
      const s = i * 53 + 23;
      return {
        id: i,
        left: `${(seededRandom(s) * 70).toFixed(4)}%`,
        top: `${(seededRandom(s + 1) * 65 + 5).toFixed(4)}%`,
        width: `${(seededRandom(s + 2) * 16 + 10).toFixed(4)}%`,
        height: `${(seededRandom(s + 3) * 18 + 10).toFixed(4)}%`,
        drift: parseFloat((seededRandom(s + 4) * 12 - 6).toFixed(4)),
        delay: parseFloat((seededRandom(s + 5) * 6).toFixed(4)),
        duration: parseFloat((seededRandom(s + 6) * 5 + 9).toFixed(4)),
      };
    })
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes bgVerseDrift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(var(--drift), -8px); }
        }
        @keyframes bgVerseTone {
          0% { background-size: 9px 9px; opacity: 0.012; }
          100% { background-size: 15px 15px; opacity: 0.025; }
        }
        @keyframes bgVerseFill {
          0% { width: 5%; opacity: 0.1; }
          60% { width: 72%; opacity: 0.25; }
          100% { width: 5%; opacity: 0.1; }
        }
        @keyframes bgVerseGlow {
          0%, 100% { opacity: 0.015; }
          50% { opacity: 0.035; }
        }
      `}</style>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(167,139,250,0.9) 1px, transparent 1px)",
          animation: "bgVerseTone 12s ease-in-out infinite alternate",
        }}
      />
      {panels.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-[4px] border border-violet-400/[0.05] bg-transparent"
          style={{
            left: p.left,
            top: p.top,
            width: p.width,
            height: p.height,
            "--drift": `${p.drift}px`,
            animation: `bgVerseDrift ${p.duration}s ease-in-out ${p.delay}s infinite`,
          } as React.CSSProperties}
        />
      ))}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 35%, rgba(167,139,250,0.035) 0%, transparent 60%)",
          animation: "bgVerseGlow 7s ease-in-out infinite",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-violet-400/10">
        <div
          className="absolute h-px bg-gradient-to-r from-violet-400/30 to-rose-400/30"
          style={{ width: "5%", animation: "bgVerseFill 11s ease-in-out infinite" }}
        />
      </div>
    </div>
  );
}

function ShimmerBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes bgShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes bgPulse {
          0%, 100% { opacity: 0.02; }
          50% { opacity: 0.05; }
        }
      `}</style>
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent"
        style={{
          animation: "bgShimmer 6s ease-in-out infinite",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.04) 0%, transparent 60%)",
          animation: "bgPulse 4s ease-in-out infinite",
        }}
      />
    </div>
  );
}

interface Props {
  slug: string;
}

export default function ProjectBackground({ slug }: Props) {
  switch (slug) {
    case "luna-ai":
      return <LunaBackground />;
    case "baktag":
      return <BaktagBackground />;
    case "quantinda":
      return <QuantindaBackground />;
    case "em-andor":
      return <AndorBackground />;
    case "uni-verse":
      return <UniVerseBackground />;
    default:
      return <ShimmerBackground />;
  }
}
