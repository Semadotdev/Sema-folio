import type { ReactNode } from "react";

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen pt-24 pb-16">{children}</div>;
}
