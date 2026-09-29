<p align="center">
  <img src="public/Universe-logo.png" alt="UNI-verse" width="120" />
</p>

<h1 align="center">UNI-verse</h1>

<p align="center">
  Grace Lights the Way to Every Story.
</p>

<p align="center">
  A fast, installable manga &amp; manhwa reader for the web.
</p>

<p align="center">
  <code>20 pages</code> · <code>49 API routes</code> · <code>5 content providers</code> ·
  <code>23 database models</code> · <code>25 test files</code>
</p>

---

## Features

### Reading

- **Multi-source reader** — pull chapters from any of 5 providers behind one interface
- **Two reader modes** — paged (swipe) and long-strip, both fully configurable
- **Speech-bubble-aware auto-scroll** — slows down over dialogue using a client-side
  classical-CV text-density analysis (no OCR, no ML — see [Reader internals](#reader-internals))
- **Per-title settings** — override reader direction, brightness, tap zones, and mode
  for a single series without touching your global preferences
- **Chapter filters** — numeric-prefix matching to hide credits and recaps
- **Spatial page comments** — pin a comment to an exact spot on the page image; nearby
  pins auto-cluster
- **Reading history** — continue reading where you left off, per series

### Library

- **Folders** — organize your library, with public share links
- **Batch add** — add a whole provider listing to your library with progress feedback
- **Read tracking** — per-chapter progress, not just a "last read" pointer

### Social

- **Posts feed** — text and images, with `all` / `friends` / `nsfw` tabs
- **6 reaction types** — like, love, haha, wow, sad, angry
- **Threaded comments** — nested replies on posts
- **Friends** — symmetric, added both directions in one transaction (no follow requests)
- **Folder attachments** — attach a library folder to a post for a preview modal
- **Leaderboard** — top posters and top readers
- **Live notifications** — Server-Sent Events with resume cursor, no polling client

### Accounts & personalization

- **Auth** — email registration and sign-in, plus username-based sign-in
- **Age gate** — birth date at registration drives NSFW visibility
- **Coins** — earn 1 coin per chapter read, spent on profile themes
- **13 profile themes** — 7 animation styles; two ship with animated character art and
  honor `prefers-reduced-motion`
- **Onboarding tour** — multi-step, interactive, with tooltips anchored to real elements

### Moderation

- **Reports** — posts, comments, and page comments are all reportable
- **Admin panel** — stats overview and a report queue with dismiss actions

### PWA

- **Installable** — manifest with maskable icons, standalone display
- **Hand-written service worker** — network-first for JS/CSS, cache-first for static assets
- **Not offline-navigable** — see [Known issues](#known-issues)

---

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | [Next.js](https://nextjs.org) **16.2.10** (App Router) |
| UI | React **19.2.4**, [Tailwind CSS](https://tailwindcss.com) **4** |
| Language | TypeScript, Node **20** (`.nvmrc`) |
| Database | [Prisma](https://www.prisma.io) **7.9** + PostgreSQL |
| Auth | [Supabase](https://supabase.com) (SSR + helpers) |
| Validation | [Zod](https://zod.dev) **4** |
| HTML parsing | [cheerio](https://cheerio.js.org) **1.2** |
| Icons | [lucide-react](https://lucide.dev) |
| Tests | [Vitest](https://vitest.dev) **4** |
| Patching | [patch-package](https://github.com/ds300/patch-package) |

> **Why patch-package?** `patches/next+16.2.10.patch` guards three call sites in Next's
> vendored RSC client that invoke `chunk.reason.error(...)` / `.enqueueModel(...)` without
> checking the method exists. Without the guard, a settled or non-promise value rejects
> the stream with `TypeError: chunk.reason.error is not a function`. It is applied
> automatically by `postinstall`.
>
> **If you bump Next.js, regenerate the patch** (rename the file to match the new version)
> or `postinstall` will fail.

---

## Getting Started

### Prerequisites

- Node.js 20+ (see `.nvmrc`)
- A PostgreSQL database and a Supabase project

### Installation

```bash
# 1. Install dependencies (also runs patch-package + prisma generate)
npm install

# 2. Configure environment variables
cp .env.example .env
# then fill in your database + Supabase credentials

# 3. Apply the database schema
#    Fresh database?  -> npm run db:push
#    Existing database? -> npm run db:migrate   (see "Database safety" below)
npm run db:migrate

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

On first authenticated request the app auto-creates your `User` row, deriving a username
from `user_metadata.username` or the email local-part.

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | yes | PostgreSQL connection string (Supabase pooler). Used by the app at runtime. |
| `DIRECT_URL` | yes | Direct PostgreSQL connection (migrations, backups). **The Prisma CLI reads this, not `DATABASE_URL`** — see `prisma.config.ts`. |
| `SHADOW_DATABASE_URL` | no | Separate throwaway DB for `migrate dev` validation. Never point this at the shared DB. |
| `ALLOW_DESTRUCTIVE_MIGRATIONS` | no | Set to `true` to bypass the destructive-command guard. Don't. |
| `SUPABASE_URL` | yes | Supabase project URL (server-side) |
| `SUPABASE_ANON_KEY` | yes | Supabase anon/public key (server-side) |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | Supabase service role key (server-only, never expose) |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Public Supabase URL, exposed to the client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Public anon key, exposed to the client |
| `BACKUP_RETENTION` | no | Number of local DB backups to keep. Default `14`. |
| `IMAGE_CACHE_DIR` | no | On-disk image cache location. Default `.cache/images`. |
| `LOG_LEVEL` | no | `debug` \| `info` \| `warn` \| `error`. Default `info`. |
| `NODE_ENV` | no | Standard Next.js flag. Default `development`. |

The server-side subset is validated with Zod in `src/lib/env.ts` and throws on boot if
invalid.

### Supabase Storage buckets

All three must be created **manually** — nothing provisions them:

| Bucket | Contents | Access |
| --- | --- | --- |
| `post-images` | Post image uploads | public-read (uploaded via service role) |
| `avatars` | Profile avatars | public-read |
| `db-backups` | Nightly `pg_dump` archives | service role only |

---

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Start the production server |
| `npm run test` | Run the test suite once (Vitest) |
| `npm run lint` | Lint with ESLint |
| `npm run typecheck` | Type-check with `tsc --noEmit` |
| `npm run db:migrate` | Apply pending migrations (`prisma migrate deploy`) — safe, never resets |
| `npm run db:migrate:create` | Create a new migration without applying it |
| `npm run db:push` | Push schema changes (guarded) |
| `npm run db:reset` | Reset the DB — **blocked** against the shared Supabase DB |
| `npm run db:backup` | Local `pg_dump` into `backups/` (requires `pg_dump`) |
| `npm run db:grant-admin -- <email>` | Promote a user to `admin` via raw SQL |
| `npm run db:studio` | Open Prisma Studio |

`postinstall` runs `patch-package && prisma generate` automatically.

> **Admin promotion is out-of-band.** There is no in-app path to become an admin. Run
> `db:grant-admin` against the target user's email.

---

## Architecture

Four layers, dependencies pointing inward. The `@/` alias resolves to `src/`.

```
src/
├── domain/           Pure business model. Imports nothing outward.
│   ├── entities/       user, post, comment, page-comment, friend, chapter, ...
│   ├── interfaces/     Provider interface, service contracts
│   ├── constants/      NSFW genres, profile themes, reactions
│   └── types/          API envelope, InstalledProvider
├── application/      Use-case orchestration ("services"), one class per concern
├── infrastructure/   Adapters to the outside world
│   ├── providers/      registry + 5 builtin implementations
│   ├── database/       Prisma client
│   ├── cache/          provider, post, feed
│   ├── proxy/          image proxy + on-disk cache
│   ├── storage/        Supabase admin client
│   └── auth/           Supabase clients
├── app/              Next.js routes. The only composition root.
├── components/       React UI, grouped by feature
├── contexts/         Library, Provider, Settings, Toast
├── hooks/            use-manga, use-manga-settings
├── lib/              App helpers: ApiClient, text-detection, pin-clustering, ...
├── shared/           Cross-cutting: logger, errors, retry, rate limiting
└── middleware.ts     Edge auth gate
```

**The dependency rule, verified:** `domain` imports nothing outward. `infrastructure`
never imports `application`. `application` never imports `app` or `components`. Route
handlers wire the layers together.

**Two honest caveats:**

1. `shared/` is not truly innermost — `rate-limiter.ts` imports the Prisma singleton, and
   `rate-limit.ts` imports from `domain`.
2. Clean architecture is partial on the data side. Services query Prisma directly rather
   than through a repository abstraction, so the contracts in `domain/interfaces/services.ts`
   are aspirational and largely bypassed.

### Authentication

`src/middleware.ts` gates routes. `/login`, `/register`, and `/api/auth` are public;
`/legal/*` and `/s/*` are always public. Unauthenticated requests to a protected route
redirect to `/login`; authenticated users on a public route redirect to `/`.

`/api/*` short-circuits **before** any Supabase call, so API requests skip the network
round-trip. This is a deliberate performance optimization — see the perf plan in
`docs/superpowers/plans/2026-09-06-perf-phase2-request-hotpath.md`.

---

## Content providers

A provider implements the `Provider` interface in `src/domain/interfaces/provider.ts`:
required methods `search`, `getMangaDetails`, `getChapterList`, `getPageList`, plus
optional `getPopular` and `getLatest`, advertised through `hasSearch` / `hasPopular` /
`hasLatest` capability flags.

Five are implemented in `src/infrastructure/providers/builtin/`:

| id | Source | Parsing approach |
| --- | --- | --- |
| `mangadex` | MangaDex | JSON REST API, with rate-limit-aware request pacing |
| `asurascans` | Asura Scans | JSON API |
| `webtoons` | Webtoons | cheerio HTML, canonical-URL pagination |
| `fanfox` | FanFox | cheerio HTML **plus a packed-JS decoder** (see below) |
| `manhwa18` | Manhwa18 | cheerio HTML — the only NSFW-flagged provider |

**Provider caching.** Series details and chapter lists are cached for 6 hours, page lists
for 1 hour, and latest/popular/search for 30 minutes. Concurrent misses for the same key
are coalesced into a single upstream request.

**Adding a provider:** implement the interface, register it in
`src/infrastructure/providers/initialize.ts` and `builtin/index.ts`. The initializer upserts
metadata to the `Provider` table and degrades gracefully to in-memory registration if the
database is unavailable.

> **Do not trust `BUILTIN_PROVIDER_IDS`.** `src/shared/constants/index.ts` lists 10 provider
> ids, but only 5 have implementations — and the constant is referenced nowhere in `src/`.
> It is stale.

---

## Database safety

> **This DB was wiped once already by `prisma migrate dev` running `DROP SCHEMA "public" CASCADE`**
> (no migration history existed because the schema was created with `db push`, so Prisma offered a reset).
> The guard scripts exist to stop that from ever happening again.

All `db:*` scripts route through `scripts/db-guard.mjs`, which blocks a Prisma subcommand
when **both** conditions hold:

1. The command is destructive — `migrate dev`, `migrate reset`, or
   `db push --accept-data-loss` / `--force-reset`. `migrate deploy` is **not** destructive.
2. The target host is not local — any hostname other than `localhost`, `127.0.0.1`, or
   `::1` is treated as the shared production database.

Set `ALLOW_DESTRUCTIVE_MIGRATIONS=true` to override (it prints a warning and proceeds).

**Apply** schema changes with `npm run db:migrate`. **Create** new migrations with
`npm run db:migrate:create`, which validates against `SHADOW_DATABASE_URL` — point that at a
local or throwaway Postgres, never the shared DB.

**Backups:** `npm run db:backup` for an on-demand `pg_dump`. A scheduled GitHub Action
(`.github/workflows/db-backup.yml`) also runs daily at 03:17 UTC, retaining the last 14
dumps in the `db-backups` bucket. It needs `DIRECT_URL`, `SUPABASE_URL`, and
`SUPABASE_SERVICE_ROLE_KEY` as repository secrets, and the bucket created once.

---

## Caching & rate limiting

**Four caches:**

| Cache | Scope | Notes |
| --- | --- | --- |
| Provider | in-process L1 + Postgres L2 | 30 min – 6 h depending on endpoint |
| Post | in-process | Invalidated on post mutation |
| Feed | in-process | Feed page results |
| Image | on-disk under `.cache/images` | 7-day TTL, 500-file cap, 10 MB/file |

**Rate limiting** uses an in-memory-first limiter with best-effort probabilistic sync to a
Postgres `RateLimitBucket` table. Responses carry `X-RateLimit-Limit`, `-Remaining`, and
`-Reset`.

> Because the in-process map is authoritative, **this is not a distributed limiter** — two
> instances each enforce their own quota. The Postgres table is cross-instance state for
> cold starts and pruning, not a shared counter.

---

## Reader internals

The speech-bubble-aware auto-scroll feature runs a **classical computer-vision pipeline on
the client** — it is not OCR, not OCR-via-a-model, and not ML. Roughly:

1. Binarize the page image by luminance.
2. Label connected components with 4-connectivity union-find.
3. Build an enclosed-region mask and an ink-contact mask.
4. Classify each component as a glyph or as a bubble outline.
5. Compute a per-page **text-density profile** (64 bands) from the text rate.
6. Feed that profile into a smoothed multiplier that slows auto-scroll over dialogue.

Analysis is downsampled to 192 px wide, capped at 400k pixels, and scheduled on
`requestIdleCallback` with a small density cache. A dev hook exposes the profile on
`window.__uniTextProfile`.

Design docs: `docs/superpowers/specs/2026-09-22-speech-bubble-auto-scroll-design.md` and
the related text-aware auto-scroll spec.

---

## Testing

25 test files, all colocated next to the source as `<module>.test.ts`. Vitest with
`environment: "node"` — there is no jsdom, no React Testing Library, and no browser mode.

```bash
npm run test
```

Covered: application services, `lib/` helpers, domain constants, the provider registry and
`fanfox` packing, and shared utilities. Several singletons export a `reset*()` helper for
test isolation.

> **There is no component or E2E test coverage.** The user manual under `/legal` and the
> onboarding tour rest on code reading, not tests. If you add UI behavior, consider whether
> it needs a different test setup.

---

## Deployment

Deploys to [Vercel](https://vercel.com). Add the environment variables from
[.env.example](.env.example) to your project settings, and make sure the PostgreSQL
database is reachable from the deployment region. Create the three Storage buckets listed
in [Supabase Storage buckets](#supabase-storage-buckets) before accepting uploads.

> **The on-disk image cache will not persist on Vercel**, whose filesystem is ephemeral —
> that cache simply misses on every cold start. If you deploy somewhere with a persistent
> volume, set `IMAGE_CACHE_DIR` to a mounted path.

---

## Asset pipeline

Animated theme art is generated from source GIFs that are **gitignored** because they are
large:

| Path | Contents |
| --- | --- |
| `assets-source/` | Source GIFs and MP4s. **Local only — not in the repo.** |
| `public/themes/` | Generated derivatives that *are* in the repo |
| `.qa/*.py` | Generation scripts (`make_arthur_assets.py`, `kayden-assets.py`, `arthur-preview.py`) |
| `.qa/out/` | Script output. **Gitignored.** |
| `.qa-venv/` | Python virtualenv (Pillow, numpy, playwright). **Gitignored.** |

Regenerate the theme assets with the scripts in `.qa/` against `assets-source/`. See
`public/themes/README.md` for per-theme notes, including why the Kayden theme's white
background is intentionally preserved.

---

## Design docs

`docs/superpowers/` holds the feature design history:

- `specs/` — 12 design documents
- `plans/` — 10 implementation plans

They cover post NSFW tagging, animated profile themes, the Kayden theme, page comments,
reliable coin rewards, the reader page retry, perf phase 2 (request hot path), speech-bubble
auto-scroll, text-aware auto-scroll, and the reader chapter list.

---

## Known issues

Gotchas a contributor will trip over, verified against the code:

- **`BUILTIN_PROVIDER_IDS` is stale** — 10 ids listed, 5 implemented, referenced nowhere.
  Do not use it as a source of truth.
- **The service worker does not cache navigations**, so the installed PWA will not render
  pages while offline. Only static assets are precached.
- **The image proxy rewrites `Referer` headers** to work around provider hotlink
  protection. Deliberate, but it will look odd in review.
- **Auth logic is split** across `src/lib/auth.ts`, `src/lib/admin.ts`, and
  `src/lib/supabase/*` rather than living in one layer.
- **`npm run test` has one pre-existing failure** in `src/lib/reader-progress.test.ts` —
  the expected value for `computeReaderProgress(93, 100)` does not match the
  implementation. It is not a regression from your change.

---

## Legal

UNI-verse does not host any content. It aggregates publicly available content from
third-party sources. Content rights belong to their respective owners. See the `/dmca` and
`/legal` pages in-app for details.
