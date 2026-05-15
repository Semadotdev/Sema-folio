"use client";

export default function SectionDivider() {
  return (
    <div className="relative h-16 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 40px,
            rgba(59, 130, 246, 0.03) 40px,
            rgba(99, 102, 241, 0.03) 80px
          )`,
        }}
      />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 max-w-xs h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1/4 max-w-[80px] h-[2px] bg-gradient-to-r from-blue-500/40 via-indigo-400/40 to-cyan-400/40 blur-sm"
        style={{
          animation: "shimmer 3s ease-in-out infinite",
        }}
      />
    </div>
  );
}
