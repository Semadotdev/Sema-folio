import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  title?: string;
  accent?: boolean;
}

export default function BentoCell({ children, className, title, accent = true }: Props) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 overflow-hidden",
        accent && "before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-blue-500/50 before:via-indigo-500/30 before:to-transparent",
        className
      )}
    >
      {title && (
        <div className="flex items-center gap-2 mb-5">
          <div className="h-px flex-1 bg-gradient-to-r from-blue-500/20 to-transparent" />
          <span className="text-xs text-blue-400 font-mono tracking-widest uppercase font-semibold">
            {title}
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-blue-500/20 to-transparent" />
        </div>
      )}
      {children}
    </div>
  );
}
