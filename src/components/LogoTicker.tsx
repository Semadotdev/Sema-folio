"use client";

const logos = [
  {
    name: "React",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="2.5" />
        <ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(0 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
  {
    name: "Next.js",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-.5-12v8h-2v-8h2zm4 0v8h-2V9.5L14 8h1.5z" />
      </svg>
    ),
  },
  {
    name: "TypeScript",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <rect x="2" y="2" width="20" height="20" rx="2" />
        <path d="M12.5 17.5v2h5v-2h-5zm1.5-8v2h3v6h2v-6h3v-2h-8z" fill="#0f0f0f" />
        <path d="M6.5 11.5h2v7h2v-7h2v-2h-6v2z" />
      </svg>
    ),
  },
  {
    name: "Tailwind",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 4C8 4 5.5 6.5 4 9c1.5-1 3-1.5 4.5-1 1.5.5 2.5 2 3.5 3 1 1 2 2 4 2 3 0 5.5-2 7-4.5-1.5 1-3 1.5-4.5 1-1.5-.5-2.5-2-3.5-3-1-1-2-2-4-2zm-4 6c-3 0-5.5 2-7 4.5 1.5-1 3-1.5 4.5-1 1.5.5 2.5 2 3.5 3 1 1 2 2 4 2 3 0 5.5-2 7-4.5-1.5 1-3 1.5-4.5 1-1.5-.5-2.5-2-3.5-3-1-1-2-2-4-2z" />
      </svg>
    ),
  },
  {
    name: "Node.js",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zm0 2.5l7.5 3.75v7.5L12 19.5l-7.5-3.75v-7.5L12 4.5z" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    name: "Three.js",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <polygon points="12,3 21,19.5 3,19.5" />
        <line x1="12" y1="3" x2="12" y2="19.5" strokeWidth="1" />
      </svg>
    ),
  },
  {
    name: "Python",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2C8.5 2 7 3.5 7 6v3h5v1H6c-2.5 0-4 1.5-4 4v3c0 2.5 1.5 4 4 4h2v-4c0-2.5 1.5-4 4-4h5c2 0 3-1.5 3-4V6c0-2.5-1.5-4-4-4zm-1 3c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z" />
        <path d="M17 22c3.5 0 5-1.5 5-4v-3c0-2.5-1.5-4-4-4h-5c-2 0-3 1.5-3 4v3c0 2.5 1.5 4 4 4h3z" />
      </svg>
    ),
  },
  {
    name: "PostgreSQL",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2C8 2 5 4 5 7v10c0 3 3 5 7 5s7-2 7-5V7c0-3-3-5-7-5zm0 2c2.5 0 4 1.5 4 3v2H8V7c0-1.5 1.5-3 4-3zm-4 7h8v3c0 1.5-1.5 3-4 3s-4-1.5-4-3v-3z" />
      </svg>
    ),
  },
];

export default function LogoTicker() {
  return (
    <div className="scroller" data-animated="true" data-speed="slow">
      <div className="scroller__inner">
        {[...logos, ...logos].map((logo, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-300 text-sm whitespace-nowrap hover:border-blue-500/30 hover:scale-105 transition-all"
          >
            {logo.icon}
            {logo.name}
          </div>
        ))}
      </div>
    </div>
  );
}
