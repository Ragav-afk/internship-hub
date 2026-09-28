# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Internship Hub — a web app that lists internships aggregated from multiple sources. Students can
search by keyword, filter by field/location/stipend, log in, and save favorite internships.

The developer is a beginner at web development. Explain non-obvious decisions simply when making
changes, and prefer the simplest approach that works over a "more correct" but more complex one.

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase — Postgres database + Auth (email/password only)
- Deployed on Vercel

## Design rules

- Layout inspired by LinkedIn's jobs page, but must NOT use LinkedIn's logo, name, or branding
  anywhere.
- Page structure: top navbar, filter sidebar (left), internship card list (center), detail panel
  (right).
- Color theme: blue and white.
- Must be mobile responsive: on small screens the three-column layout stacks — sidebar becomes a
  collapsible filter drawer, and the detail panel becomes its own page (`/internships/[id]`)
  instead of a side column.
- Keep components small and single-purpose in `components/`. Keep data-fetching and filtering
  logic in `lib/`, not inside components.

## Folder structure

```
app/                    # Routes only (App Router: folder = URL, page.tsx = that page's content)
components/             # Reusable UI pieces, one file per component
lib/
  supabase/              # client.ts (browser) and server.ts (server components)
  types.ts                # shared TypeScript types
  queries.ts               # functions that fetch/filter internships from Supabase
supabase/
  seed.sql                # sample internship rows, inserted manually (no scraping/admin UI yet)
proxy.ts                # keeps the Supabase auth session alive across pages
```

## Database schema (Supabase/Postgres)

### `internships`

| column | type | notes |
|---|---|---|
| id | uuid, PK | |
| title | text | |
| company | text | |
| description | text | |
| field | text | e.g. "Software Development", "Marketing" — powers the field filter |
| city | text | normalized during import (see `lib/import/mapping.ts`'s `resolveLocation`) |
| country | text, nullable | e.g. "India", "United States"; `null` when not determinable — powers the country filter |
| work_mode | text | `Remote` \| `On-site` \| `Hybrid` |
| stipend_min | integer | INR, nullable, 0 = unpaid |
| stipend_max | integer | INR, nullable |
| stipend_note | text | optional free text, e.g. "Performance-based" |
| currency | text, default `'INR'` | e.g. `INR`, `USD` — shown next to the stipend amount |
| duration | text | e.g. "3 months" |
| apply_url | text | external application link |
| source | text | where the listing was collected from, e.g. "Internshala", "Greenhouse" |
| external_id | text, nullable | source's own job id; `null` for hand-seeded rows. Unique per `(source, external_id)` |
| is_active | boolean, default `true` | set `false` when an import run no longer sees the listing (soft delete) |
| posted_at | timestamptz | for "Newest" sorting |
| created_at | timestamptz, default now() | |

### `favorites`

| column | type | notes |
|---|---|---|
| id | uuid, PK | |
| user_id | uuid, FK → `auth.users.id` | |
| internship_id | uuid, FK → `internships.id` | |
| created_at | timestamptz, default now() | |
| — | unique(user_id, internship_id) | prevents duplicate favorites |

No custom `users` table: Supabase Auth already manages `auth.users` for email/password login.
Only add a `profiles` table later if extra fields (name, resume link, etc.) become necessary.

Row-level security: `favorites` needs RLS policies so a user can only read/insert/delete their own
rows (`user_id = auth.uid()`). Add this in the Favorites build step, not before — auth needs to
exist first.

## Current state

- `components/InternshipBrowser.tsx` reads filter/search state from the URL (via `useSearchParams`
  and `router.replace`) instead of `useState`; the search box keeps one small local `useState`
  buffer so typing feels instant before it's debounced into the URL (see `lib/searchParams.ts`).
- `lib/filters.ts` holds the pure filtering logic (`filterInternships`, `getFieldOptions`,
  `getCityOptions`), kept separate from the Supabase-fetching code.
- `lib/queries.ts` has `getInternships()`, `getInternshipById()`, `getCurrentUser()`,
  `getFavoriteInternshipIds()`, and `getFavoriteInternships()` — the last two rely on the
  `favorites` table's RLS policies to scope results to the current user, rather than an explicit
  `user_id` filter.
- Auth (sign up / log in / log out) goes through Server Actions in `lib/authActions.ts`, called
  from `components/LoginForm.tsx`/`SignupForm.tsx` (via `useActionState`) and from a plain
  `<form action={signOut}>` in `Navbar`. Error messages are mapped to friendly text in
  `lib/authErrors.ts`.
- Favorites: the `favorites` table + RLS policies live in `supabase/favorites.sql` (run manually in
  the Supabase dashboard, same as `seed.sql` — not applied automatically).
  `components/FavoriteButton.tsx` is a controlled component: the saved/unsaved boolean lives one
  level up (`InternshipBrowser`'s `favoriteIdSet` state on the desktop browse page, a small
  `useState` in `FavoritesGrid`/`InternshipDetailMobile` elsewhere) and flows in as an `isFavorited`
  prop; the button calls `onToggle(id, next)` to update it and still makes the add/remove Server
  Action calls in `lib/favoriteActions.ts` itself. This keeps the list card and detail panel for the
  same internship always in sync.
- Responsive behavior is driven by Tailwind's `lg` breakpoint (1024px); `MOBILE_BREAKPOINT_PX` in
  `lib/constants.ts` must be kept in sync with it for the mobile-vs-desktop click routing in
  `components/InternshipList.tsx`.
- `lib/queries.ts`'s `getInternships()` and `getInternshipById()` throw on a Supabase error (caught
  by `app/error.tsx`) instead of silently returning an empty result — so a genuine outage now looks
  different from "no rows found." `getCurrentUser()` and `getFavoriteInternshipIds()` still swallow
  errors and fall back to "logged out"/"no favorites," since failing those shouldn't block the whole
  page. `app/loading.tsx` and `app/internships/[id]/loading.tsx` show skeleton placeholders while
  each page's data fetch is in flight.
- Cards (`components/InternshipCard.tsx`) are keyboard-accessible: `role="button"`, `tabIndex={0}`,
  and an `onKeyDown` that activates on Enter/Space (guarded so a bubbled keydown from the focused
  bookmark button doesn't also select the card).
- Real listings are pulled from Greenhouse/Lever/Ashby's public per-company job-board APIs (no
  scraping, no auth needed) via `npm run import:internships`, which runs `scripts/import/run.ts`.
  The actual fetch/map/upsert logic lives in `lib/import/` (`companies.ts` for the curated company
  list, `sources/{greenhouse,lever,ashby}.ts` for per-source fetching, `mapping.ts` for shared
  field-mapping helpers, `runImport.ts` for orchestration, `supabaseAdmin.ts` for the service-role
  client) shared by both entrypoints: the manual script (`scripts/import/run.ts`, run via
  `npm run import:internships`) and the scheduled route (`app/api/cron/import/route.ts`, triggered
  daily by Vercel Cron per `vercel.json`, protected by a `CRON_SECRET` bearer-token check — Vercel
  sends that header automatically, so a stranger guessing the URL gets a 401). The importer upserts
  on `(source, external_id)` — a plain `unique(source, external_id)` constraint, not a partial index;
  a partial index can't be targeted by Supabase's `.upsert(..., { onConflict })`, which emits a plain
  `ON CONFLICT (source, external_id)` — and soft-deletes rows that drop out of a source's feed by
  setting `is_active = false`. `getInternships()` filters to `is_active = true`, but
  `getInternshipById()` doesn't, so an existing favorite never 404s just because the listing was
  removed upstream. Needs `SUPABASE_SERVICE_ROLE_KEY` and `CRON_SECRET` in `.env.local` (never
  `NEXT_PUBLIC_`, only read from `lib/import/supabaseAdmin.ts` and the cron route) — both also need
  to be added to Vercel's project env vars for the scheduled route to work in production — and the
  `supabase/external_import.sql` migration run manually first, same convention as
  `seed.sql`/`favorites.sql`. Indian government sources (data.gov.in, NCS, PM Internship Scheme) were
  investigated but none had a confirmed usable public API as of this writing.
- Location normalization: source location strings are inconsistent (e.g. "Bengaluru-VTP, India",
  "New York, NY (HQ)", "Bellevue, WA; Menlo Park, CA" for one posting spanning multiple offices).
  `resolveLocation()` in `lib/import/mapping.ts` strips office-code suffixes and parenthetical notes,
  keeps only the first office when a posting lists several, and derives a `country` from a small
  growable dictionary (country names/aliases plus US state codes) — unrecognized text becomes
  `country: null` rather than a guess. `CITY_ALIASES` in the same file canonicalizes known spelling
  variants (e.g. "Bengaluru" → "Bangalore", matching `seed.sql`'s spelling). The country filter
  (`FilterSidebar.tsx`, above Location) only restricts results when at least one country checkbox is
  checked, same pattern as the other filters — a `null`-country row just doesn't match any checkbox.
- Stipend filtering across currencies: `lib/currency.ts` holds a small hand-maintained
  `EXCHANGE_RATES_TO_INR` table, used only by `lib/filters.ts`'s minimum-stipend comparison (the
  slider in `FilterSidebar.tsx` is INR-denominated). `formatStipend()` in `lib/format.ts` is
  unaffected — display always shows the listing's real currency/amount, never a converted one.

## Build steps

Work through these in order; each step is one shippable feature on top of the last.

0. Project setup — scaffold Next.js + TypeScript + Tailwind, create the Supabase project, wire up
   `.env.local`. (done)
1. Static layout — navbar/sidebar/list/detail-panel skeleton with hardcoded fake data. (done)
2. Database + seed data — create the `internships` table, insert ~15 sample rows via `seed.sql`. (done)
3. Real data on the list — replace hardcoded data with a live Supabase fetch. (done)
4. Keyword search — search bar filters by title/company. (done)
5. Filter sidebar — filter by field, city/work_mode, and stipend range. (done)
6. Detail panel — clicking a card shows full details on the right (own page on mobile). (done)
7. Responsive pass — collapse the 3-column layout into a stacked mobile view. (done)
7.5. Move filter and search state into URL query parameters so filtered views survive a refresh
     and can be shared as links. (done)
8. Auth — sign up / log in / log out with Supabase email+password; navbar reflects login state. (done)
9. Favorites — favorite button, `favorites` table + RLS policies, "My Favorites" page. (done)
10. Polish + deploy — loading/empty/error states, keyboard accessibility, fix favorite-state sync,
    rename `middleware.ts` to `proxy.ts`, then deploy to Vercel. (done)
11. Real listings — import from Greenhouse/Lever/Ashby via a manual script and a scheduled Vercel
    Cron route (`lib/import/`, `scripts/import/`, `app/api/cron/import/`), `currency`/`external_id`/
    `is_active`/`last_seen_at` columns added via `supabase/external_import.sql`, multi-currency
    stipend filtering via `lib/currency.ts`. (done — Indian government sources still pending, see
    "Current state" above)

## Commands

- `npm run dev` — start the local dev server.
- `npm run lint` — run ESLint.
- `npm run import:internships` — fetch/import real listings from Greenhouse/Lever/Ashby (needs
  `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` and `supabase/external_import.sql` run first).
