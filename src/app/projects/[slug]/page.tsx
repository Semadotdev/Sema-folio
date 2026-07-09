const proseBase =
  "prose prose-invert prose-sm max-w-none text-zinc-300 " +
  "[&_strong]:text-zinc-100 [&_code]:text-blue-300 [&_code]:bg-zinc-800 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded " +
  "[&_pre]:bg-zinc-800 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-zinc-700 " +
  "[&_a]:text-blue-400 [&_a:hover]:text-blue-300 " +
  "[&_blockquote]:border-l-blue-500 [&_blockquote]:text-zinc-400 " +
  "[&_h3]:text-zinc-200 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 " +
  "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 " +
  "[&_table]:w-full [&_th]:text-left [&_th]:text-blue-400 [&_th]:text-xs [&_th]:font-mono [&_th]:uppercase [&_th]:pb-2 [&_th]:pr-4 " +
  "[&_td]:text-zinc-300 [&_td]:text-sm [&_td]:py-1.5 [&_td]:pr-4 [&_td]:border-b [&_td]:border-zinc-800";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { findProjectBySlug } from "@/lib/projects";
import {
  parseReadme,
  extractTable,
  extractListItems,
  extractCodeBlock,
} from "@/lib/parse-readme";
import type { ParsedSection } from "@/lib/parse-readme";
import fs from "fs";
import path from "path";
import BentoGrid from "@/components/projects/BentoGrid";
import BentoCell from "@/components/projects/BentoCell";
import ProjectHero from "@/components/projects/ProjectHero";
import TechStackCell from "@/components/projects/TechStackCell";
import FeaturesCell from "@/components/projects/FeaturesCell";
import QuickStartCell from "@/components/projects/QuickStartCell";
import ProjectStructureCell from "@/components/projects/ProjectStructureCell";
import ProjectBackground from "@/components/projects/ProjectBackground";
import { block as mdBlock, inline as mdInline } from "@/components/Md";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = findProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = findProjectBySlug(slug);
  if (!project) notFound();

  let sections: ParsedSection[] = [];

  if (project.readmeUrl) {
    try {
      const filePath = path.join(process.cwd(), "public", project.readmeUrl);
      const markdown = fs.readFileSync(filePath, "utf-8");
      sections = parseReadme(markdown);
    } catch {
      // README not found, render fallback
    }
  }

  const techStack = sections.find((s) => s.type === "techStack");
  const features = sections.filter((s) => s.type === "features");
  const quickStart = sections.find((s) => s.type === "quickStart");
  const projectStructure = sections.find((s) => s.type === "projectStructure");

  return (
    <div className="max-w-5xl mx-auto px-6 relative z-10">
      <a
        href="/#projects"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-8"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Projects
      </a>

      <ProjectHero project={project} />

      <ProjectBackground slug={slug} />
      {sections.length > 0 ? (
        <BentoGrid>
          {features.length > 0 &&
            (() => {
              const items = features.flatMap((s) => extractListItems(s.content));
              if (items.length === 0) return null;
              const title = features.length > 1 ? `${features[0].title} & ${features.slice(1).length} More` : features[0].title;
              return (
                <div className="md:col-span-2">
                  <BentoCell title={title}>
                    <FeaturesCell items={items} />
                  </BentoCell>
                </div>
              );
            })()}
          {techStack &&
            (() => {
              const table = extractTable(techStack.content);
              if (!table) return null;
              return (
                <div className="md:col-span-1">
                  <BentoCell title="Tech Stack">
                    <TechStackCell rows={table.rows} />
                  </BentoCell>
                </div>
              );
            })()}

          {projectStructure &&
            (() => {
              const tree = extractCodeBlock(projectStructure.content);
              if (!tree) return null;
              return (
                <div className="md:col-span-1">
                  <BentoCell title="Project Structure">
                    <ProjectStructureCell tree={tree} />
                  </BentoCell>
                </div>
              );
            })()}

          {quickStart &&
            (() => {
              const items = extractListItems(quickStart.content);
              if (items.length > 0) {
                return (
                  <div className="md:col-span-2">
                    <BentoCell title="Quick Start">
                      <QuickStartCell steps={items} />
                    </BentoCell>
                  </div>
                );
              }
              return (
                <div className="md:col-span-2">
                  <BentoCell title="Quick Start">
                    <div
                      className={proseBase}
                      dangerouslySetInnerHTML={{ __html: mdBlock(quickStart.content) }}
                    />
                  </BentoCell>
                </div>
              );
            })()}

          {sections
            .filter((s) => s.type === "generic")
            .map((section, i) => {
              const isNarrow = /^(license|need help)/i.test(section.title);
              return (
                <div key={`generic-${i}`} className={isNarrow ? "md:col-span-1" : "md:col-span-2"}>
                  <BentoCell title={section.title}>
                    <div
                      className={proseBase}
                        dangerouslySetInnerHTML={{ __html: mdBlock(section.content) }}
                    />
                  </BentoCell>
                </div>
              );
            })}
        </BentoGrid>
      ) : (
        <div className="text-center py-16">
          <p className="text-zinc-500">
            No detailed documentation available for this project yet.
          </p>
        </div>
      )}
    </div>
  );
}


