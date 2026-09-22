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

## Build steps

Work through these in order; each step is one shippable feature on top of the last.

0. Project setup — scaffold Next.js + TypeScript + Tailwind, create the Supabase project, wire up
   `.env.local`.
1. Static layout — navbar/sidebar/list/detail-panel skeleton with hardcoded fake data.
2. Database + seed data — create the `internships` table, insert ~15 sample rows via `seed.sql`.
3. Real data on the list — replace hardcoded data with a live Supabase fetch.
4. Keyword search — search bar filters by title/company.
5. Filter sidebar — filter by field, city/work_mode, and stipend range.
6. Detail panel — clicking a card shows full details on the right (own page on mobile).
7. Responsive pass — collapse the 3-column layout into a stacked mobile view.
8. Auth — sign up / log in / log out with Supabase email+password; navbar reflects login state.
9. Favorites — favorite button, `favorites` table + RLS policies, "My Favorites" page.
10. Polish + deploy — loading/empty/error states, then deploy to Vercel.

## Commands

Not yet available — this repo is pre-scaffold (step 0 above hasn't run yet). Once the Next.js app
is created, add the actual `npm run dev` / `build` / `lint` commands here.
