# Indian government internship portals — investigation (2026-09-28)

Investigated as a possible data source for the importer (`lib/import/`), since the Greenhouse/
Lever/Ashby sources skew American. **Conclusion: none are worth building against right now.**
Re-check this from scratch if revisited later — gov sites change without notice, so don't assume
these findings are still accurate rather than re-verifying.

Each portal was checked against four gates before considering any code: robots.txt (fetched, not
assumed), terms of use, whether listings are public or login-gated, and whether the page is
server-rendered or depends on a background API call.

## AICTE National Internship Portal (`internship.aicte-india.org`) — skip

- **robots.txt**: `Allow: /` broadly, `Disallow: /api/`, `/_next/`, `/student/`, `/admin/`,
  `/candidates/`, several `/dashboards/*` paths, a couple of `/auth/*` paths. Declares
  `Sitemap: https://internship.aicte-india.org/sitemap.xml`. Verified genuine (matches what a real
  browser shows).
- **Terms of use** (`/terms-and-conditions`): prohibits automated collection of "other users' data"
  (i.e. student personal data) — doesn't prohibit reading the public internship postings themselves,
  which the portal exists to publish. Standard copyright notice over site text/design, not an
  anti-scraping clause.
- **Public vs. login-gated**: `/internships/*` pages are public, no auth needed. Only
  account-specific/admin paths require login.
- **Server-rendered vs. API**: this is where it falls apart, and why AICTE is being skipped instead
  of built:
  - `/internships/{partner}` — ~35 per-partner **programme** pages (e.g. `/internships/google`,
    `/internships/nhai`), listed in `sitemap.xml`. Fully server-rendered, real prose content
    (stipend/duration described in text, no API call needed) — technically compliant, but each page
    is one *programme* description, not individual postings, and most don't state a numeric stipend
    ("Stipend, where declared, paid monthly via the portal").
  - `/internships/recent` — looks like the real listing page (distinct titled postings, real filter
    UI for type/stipend/location). But confirmed via a plain `curl` fetch (no JS execution) that only
    posting **titles** are in the server-rendered HTML — stipend, duration, and any per-posting
    apply/detail link are not present anywhere in the raw response. That data almost certainly comes
    from a client-side call to the `/api/` path robots.txt explicitly disallows. **Not usable.**
  - Net result: the only compliant path (programme pages) gives ~35 coarse, mostly-null-stipend rows
    — not worth the ongoing parsing-fragility cost for that little data.

## PM Internship Scheme (`pminternship.mca.gov.in`) — skip

- **robots.txt**: none (genuine 404).
- **Terms of use**: no terms/privacy page found at any common path.
- **Public vs. login-gated**: fails outright. No public listing view found anywhere —
  `/internships`, `/opportunities`, `/companies`, `/jobs` all 404. Homepage has zero navigation to
  any listing page, only a login flow and static banner images. It's a citizen application portal
  (₹9,000/month + ₹6,000 one-time stipend, per public reporting), not a browsable job board.
- **Server-rendered vs. API**: moot — no public content exists either way.

## NCS — National Career Service (`ncs.gov.in`) — skip

- **robots.txt**: none.
- **Terms of use**: not conclusively located — moot given the next point.
- **Public vs. login-gated**: `/job-listing` is publicly reachable (200, no auth, substantial
  content) — an Angular SPA, so full confirmation would need JS execution.
- **Server-rendered vs. API**: the SPA's own Content-Security-Policy header reveals it calls
  `api.ncs.gov.in` (plus an Azure-hosted backend) to render listings client-side. That's the
  **internal backend for NCS's own frontend**, not a published, documented public API for outside
  use — meaningfully different from Greenhouse/Lever/Ashby, which explicitly publish their board
  APIs for third-party consumption. Undocumented internal endpoints can change or get blocked
  without notice.

## Other portals found — not investigated individually

Searched for other central-government internship portals: MEA Internship Portal
(`internship.mea.gov.in`), NIOS/MoSPI (`internship.mospi.gov.in`), NITI Aayog
(`workforindia.niti.gov.in`), an NHAI-specific portal. All narrower single-ministry sites. AICTE's
own portal describes itself as aggregating "internships from ministries, PSUs, ULBs and industry,"
and its partner list already includes NHAI, MoRTH, AMRUT and others from this set — they appear to
feed into AICTE's aggregation rather than being independent sources. Worth a look only if AICTE
coverage is ever revisited and found to be missing a specific ministry.
