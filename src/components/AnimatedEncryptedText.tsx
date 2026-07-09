"use client";

import { useState, useEffect } from "react";
import { inline as mdInline } from "@/components/Md";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

function randomChar(): string {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

interface Segment {
  type: "text" | "encrypted";
  value: string;
}

function parseSegments(text: string): Segment[] {
  const segments: Segment[] = [];
  let current = "";
  let inEncrypted = false;

  for (const char of text) {
    if (char === "\u2588") {
      if (!inEncrypted && current) {
        segments.push({ type: "text", value: current });
        current = "";
      }
      inEncrypted = true;
      current += char;
    } else {
      if (inEncrypted && current) {
        segments.push({ type: "encrypted", value: current });
        current = "";
      }
      inEncrypted = false;
      current += char;
    }
  }
  if (current) {
    segments.push({ type: inEncrypted ? "encrypted" : "text", value: current });
  }

  return segments;
}

interface Props {
  text: string;
}

export default function AnimatedEncryptedText({ text }: Props) {
  const segments = parseSegments(text);
  const hasEncrypted = segments.some((s) => s.type === "encrypted");

  if (!hasEncrypted) {
    return <span dangerouslySetInnerHTML={{ __html: mdInline(text) }} />;
  }

  return (
    <>
      {segments.map((segment, i) => {
        if (segment.type === "text") {
          return <span key={i} dangerouslySetInnerHTML={{ __html: mdInline(segment.value) }} />;
        }
        return <EncryptedBlock key={i} length={segment.value.length} />;
      })}
    </>
  );
}

function EncryptedBlock({ length }: { length: number }) {
  const [chars, setChars] = useState<string[]>(() =>
    Array.from({ length }, () => randomChar())
  );

  useEffect(() => {
    const intervals: number[] = [];
    const timeouts: number[] = [];

    for (let i = 0; i < length; i++) {
      const timeout = window.setTimeout(() => {
        const id = window.setInterval(() => {
          setChars((prev) => {
            const next = [...prev];
            next[i] = randomChar();
            return next;
          });
        }, 2000);
        intervals.push(id);
      }, i * 200);
      timeouts.push(timeout);
    }

    return () => {
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [length]);

  return (
    <span className="text-blue-400 font-mono">
      {chars.map((char, i) => (
        <span key={i}>{char}</span>
      ))}
    </span>
  );
}
