"use client";

import { useMemo } from "react";

function LunaTheme() {
  const stars = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 90 + 5}%`,
      left: `${Math.random() * 90 + 5}%`,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 1.5,
    }));
  }, []);

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

function BaktagTheme() {
  const bars = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      width: Math.random() * 6 + 2,
      height: `${Math.random() * 40 + 20}%`,
      bottom: `${Math.random() * 30 + 5}%`,
      delay: Math.random() * 0.5,
    }));
  }, []);

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
  return <ShimmerTheme />;
}
