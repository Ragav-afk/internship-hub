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
middleware.ts            # keeps the Supabase auth session alive across pages
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
| city | text | |
| work_mode | text | `Remote` \| `On-site` \| `Hybrid` |
| stipend_min | integer | INR, nullable, 0 = unpaid |
| stipend_max | integer | INR, nullable |
| stipend_note | text | optional free text, e.g. "Performance-based" |
| duration | text | e.g. "3 months" |
| apply_url | text | external application link |
| source | text | where the listing was collected from, e.g. "Internshala" |
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
  `components/FavoriteButton.tsx` is self-contained: it holds its own local saved/unsaved
  `useState`, initialized once from a server-fetched prop, and calls the add/remove Server Actions
  in `lib/favoriteActions.ts` itself.
- Responsive behavior is driven by Tailwind's `lg` breakpoint (1024px); `MOBILE_BREAKPOINT_PX` in
  `lib/constants.ts` must be kept in sync with it for the mobile-vs-desktop click routing in
  `components/InternshipList.tsx`.

### Known issues

- Each `FavoriteButton` holds its own local state instead of sharing one central store, so on
  desktop the list card and the detail panel can briefly show different saved/unsaved states for
  the *same* internship — toggling one doesn't update the other until you reselect the card or
  refresh.
- `middleware.ts` uses a file convention Next.js 16 has deprecated in favor of `proxy.ts` (same
  behavior, new name/export). It still works today, but should be renamed before deploying — see
  the deprecation warning `npm run build` prints.

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
10. Polish + deploy — loading/empty/error states, then deploy to Vercel. (rename `middleware.ts` to
    `proxy.ts` as part of this step — see Known issues above)

## Commands

- `npm run dev` — start the local dev server.
- `npm run lint` — run ESLint.
