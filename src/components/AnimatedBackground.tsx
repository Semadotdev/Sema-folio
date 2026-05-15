"use client";

import { useState } from "react";

const particles = [
  "{", "}", "<", "/>", "_", ".", "/*", "*/", "=>", "()",
  "[]", "!=", "===", "const", "let", "=>", "...", "$",
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateItems() {
  return Array.from({ length: 20 }, (_, i) => {
    const seed = i * 137 + 42;
    return {
      id: i,
      content: particles[i % particles.length],
      left: `${(seededRandom(seed) * 90 + 5).toFixed(4)}%`,
      size: parseFloat((seededRandom(seed + 1) * 12 + 8).toFixed(4)),
      delay: parseFloat((seededRandom(seed + 2) * 12).toFixed(4)),
      duration: parseFloat((seededRandom(seed + 3) * 20 + 15).toFixed(4)),
      opacity: parseFloat((seededRandom(seed + 4) * 0.12 + 0.04).toFixed(4)),
    };
  });
}

export default function AnimatedBackground() {
  const [items] = useState(generateItems);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute text-blue-400 font-mono"
          style={{
            left: item.left,
            bottom: "-20px",
            fontSize: item.size,
            opacity: 0,
            animation: `float-up ${item.duration}s linear ${item.delay}s infinite`,
            color: `rgba(59, 130, 246, ${item.opacity})`,
          }}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
