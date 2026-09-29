# Project Detail Pages with Bento Grid Layout

## Summary

Add dedicated project detail pages at `/projects/[slug]` with a bento-grid layout that renders README sections as visual cards. The homepage Projects section becomes a simple listing that navigates to these pages.

## Motivation

The current ProjectModal opens a rich README renderer, but it's a modal overlay with limited space. Dedicated pages give each project room to breathe, improve SEO, and support deep linking.

## Architecture

### New Pages

- `src/app/projects/[slug]/page.tsx` — Server component that reads the project manifest, fetches the README markdown, parses it into sections, and renders the bento grid
- `src/app/projects/layout.tsx` — Minimal layout wrapper for the projects section

### Data Flow

1. `src/lib/projects.ts` — Central project manifest (moved from Projects.tsx inline data)
2. `src/lib/parse-readme.ts` — Parse README markdown into typed sections: `{type: "features" | "techStack" | "quickStart" | "projectStructure" | "generic", content: ...}`
3. `src/components/projects/` — New component directory:
   - `BentoGrid.tsx` — Responsive grid container
   - `BentoCell.tsx` — Generic bento cell wrapper
   - `TechStackCell.tsx` — Renders tech stack table as cards
   - `FeaturesCell.tsx` — Renders feature list with icons
   - `QuickStartCell.tsx` — Renders numbered setup steps
   - `ProjectStructureCell.tsx` — Renders file tree
   - `ProjectHero.tsx` — Project header with title, description, links

### Changes to Existing Files

#### `src/components/Projects.tsx`
- Replace modal open with `<Link>` navigation to `/projects/[slug]`
- Keep the same card grid layout and ProjectHoverEffect
- Remove the `selected` state and ProjectModal import

#### `src/context/ContentContext.tsx`
- Add `readmeUrl` field to `UserProject` interface for admin-added projects (optional)
- User-added projects with no README get a simple fallback page

#### `src/components/ProjectModal.tsx`
- Can remain but unused by the main flow; may be removed later

## Bento Grid Layout

The grid adapts based on available README sections:

```
┌──────────────────────┬──────────────────────┐
│                      │                      │
│   Features           │    Tech Stack        │
│   (span 2 rows)      │    (span 2 rows)     │
│                      │                      │
│                      │                      │
├──────────────────────┴──────────────────────┤
│                                              │
│   Quick Start (numbered cards in a row)       │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│   Project Structure / Architecture            │
│   (file tree or additional content)           │
│                                              │
└──────────────────────────────────────────────┘
```

### Responsive Behavior
- Desktop: 2-column grid (Features left, Tech Stack right), full-width rows below
- Tablet: Same layout, smaller padding
- Mobile: Single column, all cells stack vertically

### Cell Styling
- Dark glassmorphism: `bg-zinc-900/50 border border-zinc-800 rounded-2xl`
- Gradient accent bar at top of each cell
- Hover: subtle glow effect
- Consistent padding and typography

## Parsing Strategy

The README parser (`parse-readme.ts`) uses section headings to classify content:

| Heading pattern | Cell type |
|---|---|
| `## Featu*` / `## What You Can Do` | FeaturesCell |
| `## Tech Stack` / `## Stack` / `## Built With` | TechStackCell |
| `## Quick Start` / `## Getting Started` / `## Setup` | QuickStartCell |
| `## Project Structure` | ProjectStructureCell |
| Everything else | GenericCell (rendered as markdown) |

### Edge Cases
- Missing section → cell omitted from grid (grid reflows)
- No README at all → fallback page with just ProjectHero + description
- Admin-added projects without readmeUrl → fallback page
- Malformed tables → rendered as plain markdown

## Implementation Plan

| Step | File | Description |
|------|------|-------------|
| 1 | `src/lib/projects.ts` | Extract project manifest from Projects.tsx into shared module |
| 2 | `src/lib/parse-readme.ts` | Build README section parser |
| 3 | `src/components/projects/` | Create all bento components |
| 4 | `src/app/projects/layout.tsx` | Projects layout wrapper |
| 5 | `src/app/projects/[slug]/page.tsx` | Project detail page |
| 6 | `src/components/Projects.tsx` | Replace modal with Link navigation |
| 7 | `src/context/ContentContext.tsx` | Update UserProject type |
| 8 | Cleanup | Remove ProjectModal import from Projects.tsx (component stays for potential future use) |

## Verification

- `npm run build` passes with no errors
- `/projects/luna-ai` renders bento grid with features + tech stack + quick start + project structure
- `/projects/quantinda` renders correctly with its own sections
- `/projects/franklin-baker` renders correctly (different sections)
- Clicking project card on homepage navigates to `/projects/[slug]`
- Mobile viewport renders single-column layout
- Admin-added projects without README show fallback page
