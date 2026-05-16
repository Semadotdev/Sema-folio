"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { marked } from "marked";

function parseChatMD(content: string): string {
  const renderer = new marked.Renderer();
  renderer.strong = ({ text }) => `<strong class="text-white font-semibold">${text}</strong>`;
  return marked.parse(content, { async: false, renderer }) as string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const TOPIC_META: Record<string, { icon: string; label: string; headingColor: string; bodyColor: string; borderColor: string }> = {
  contact:   { icon: "📬", label: "Contact Information", headingColor: "text-blue-400", bodyColor: "text-blue-200/70", borderColor: "border-blue-500/40" },
  skills:    { icon: "🛠️", label: "Skills", headingColor: "text-indigo-400", bodyColor: "text-indigo-200/70", borderColor: "border-indigo-500/40" },
  project:   { icon: "💻", label: "Project", headingColor: "text-cyan-400", bodyColor: "text-cyan-200/70", borderColor: "border-cyan-500/40" },
  timeline:  { icon: "📅", label: "Timeline", headingColor: "text-emerald-400", bodyColor: "text-emerald-200/70", borderColor: "border-emerald-500/40" },
  cta:       { icon: "🚀", label: "Get in Touch", headingColor: "text-amber-400", bodyColor: "text-amber-200/70", borderColor: "border-amber-500/40" },
  about:     { icon: "👤", label: "About", headingColor: "text-violet-400", bodyColor: "text-violet-200/70", borderColor: "border-violet-500/40" },
};

function renderCard(type: string, inner: string): string {
  const meta = TOPIC_META[type];
  if (!meta) return parseChatMD(inner);

  const renderer = new marked.Renderer();
  renderer.strong = ({ text }) => `<strong class="text-white font-semibold">${text}</strong>`;
  renderer.code = ({ text }) =>
    `<pre class="rounded-lg border-l-2 ${meta.borderColor} bg-zinc-800/50 p-3 my-3 overflow-x-auto"><code class="text-sm text-zinc-200 font-mono leading-relaxed">${text}</code></pre>`;
  renderer.codespan = ({ text }) =>
    `<code class="text-blue-300 bg-zinc-800/80 px-1.5 py-0.5 rounded text-xs font-mono">${text}</code>`;

  const md = marked.parse(inner, { async: false, renderer }) as string;
  return `<div class="my-2 pl-3 border-l-2 ${meta.borderColor}">
    <p class="${meta.headingColor} font-semibold text-sm">${meta.icon} ${meta.label}</p>
    <div class="${meta.bodyColor} text-sm leading-relaxed prose prose-invert prose-sm max-w-none prose-a:text-blue-300 prose-a:font-semibold prose-p:my-1 prose-ul:my-1 prose-li:my-0">${md}</div>
  </div>`;
}

function formatContent(content: string): string {
  content = content.replace(/[`']+\s*$/, "").trim();
  const parts = content.split(/(:::contact|:::skills|:::project|:::timeline|:::cta|:::about|:::)/);
  if (parts.length <= 1) {
    return parseChatMD(content);
  }

  let html = "";
  let i = 0;
  while (i < parts.length) {
    const part = parts[i];
    const match = part.match(/^:::(contact|skills|project|timeline|cta|about)$/);
    if (match) {
      const type = match[1];
      i++;
      let inner = "";
      while (i < parts.length && parts[i] !== ":::") {
        inner += parts[i];
        i++;
      }
      if (i < parts.length && parts[i] === ":::") {
        html += renderCard(type, inner);
        i++;
      } else {
        html += `<div class="text-zinc-300 text-sm">${inner}</div>`;
      }
    } else if (part === ":::") {
      html += part;
      i++;
    } else {
      html += parseChatMD(part);
      i++;
    }
  }
  return html;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-zinc-800/50 w-fit">
      <div className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "0s" }} />
      <div className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "0.15s" }} />
      <div className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "0.3s" }} />
    </div>
  );
}

export default function ChatModal({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm Semadotdev's portfolio assistant. Ask me about Jiro's background, skills, projects, or hiring.",
    },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamContent, setStreamContent] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamContent]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");

    const newMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(newMessages);
    setStreaming(true);
    setStreamContent("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error("Failed");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setStreamContent(full);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: full }]);
    } catch {
      setStreamContent("Sorry, I couldn't process that. Please try again.");
    } finally {
      setStreaming(false);
      setStreamContent("");
      inputRef.current?.focus();
    }
  }, [input, messages, streaming]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-6rem)] rounded-2xl border border-zinc-700/50 bg-zinc-900/95 backdrop-blur shadow-2xl shadow-blue-500/5 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
            S
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Semadotdev</p>
            <p className="text-[10px] text-zinc-500">Portfolio Assistant</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-white transition-colors p-1"
          aria-label="Close chat"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "user" ? (
              <div className="max-w-[80%] rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2.5 text-sm text-white leading-relaxed">
                {msg.content}
              </div>
            ) : (
              <div className="max-w-[85%] rounded-2xl bg-zinc-800/50 px-4 py-2.5 text-sm leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }} />
              </div>
            )}
          </div>
        ))}

        {streaming && (
          <div className="flex justify-start">
            {streamContent ? (
              <div className="max-w-[85%] rounded-2xl bg-zinc-800/50 px-4 py-2.5 text-sm leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: formatContent(streamContent) }} />
                <span className="inline-block w-1.5 h-4 bg-blue-400 ml-0.5 animate-pulse align-text-bottom" />
              </div>
            ) : (
              <TypingIndicator />
            )}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-zinc-800 p-3">
        <div className="flex items-center gap-2 bg-zinc-800/50 rounded-xl px-3 py-2 focus-within:ring-1 focus-within:ring-blue-500/50 transition-shadow">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Jiro..."
            disabled={streaming}
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || streaming}
            className="text-blue-400 hover:text-blue-300 disabled:text-zinc-600 transition-colors p-0.5"
            aria-label="Send"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
