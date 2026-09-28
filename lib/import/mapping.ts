import { WorkMode } from "@/lib/types";

// Greenhouse's `content` field comes back as HTML with its tags/quotes
// entity-escaped (e.g. "&lt;div&gt;"), so entities need decoding before the
// tags can be stripped. InternshipDetails.tsx renders `description` inside a
// plain <p> (no dangerouslySetInnerHTML), so leftover tags would otherwise
// show up as literal text on the page.
export function stripHtml(html: string): string {
  return html
    // &amp; goes first: some descriptions are double-escaped (e.g. a real
    // "&amp;nbsp;" that should become "&nbsp;" and then a space), so
    // decoding &amp; first lets the entities below catch what it reveals.
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;|&ndash;/g, "-")
    .replace(/&rsquo;|&lsquo;/g, "'")
    .replace(/&rdquo;|&ldquo;/g, '"')
    .replace(/&hellip;/g, "...")
    .replace(/<[^>]*>/g, " ")
    // Catch-all for any other named/numeric entity we didn't list above -
    // better to drop it than show "&something;" literally on the page.
    .replace(/&#?\w+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// \b keeps this from matching "International"/"Internal".
const INTERN_TITLE_REGEX = /\bintern(ship)?\b/i;

export function isInternshipTitle(title: string): boolean {
  return INTERN_TITLE_REGEX.test(title);
}

export function isInternshipSignal(text: string | null | undefined): boolean {
  return !!text && /intern/i.test(text);
}

// Our field taxonomy is small and fixed (see supabase/seed.sql); each source
// uses its own department/team names, so this maps the common ones we've
// seen. Anything unrecognized falls back to "Other" and gets logged so the
// dictionary can be extended.
const FIELD_KEYWORDS: [RegExp, string][] = [
  [/engineer|developer|software|technology|technical|\beng\b/i, "Software Development"],
  [/data science|data analy|machine learning|\bml\b|\bai\b/i, "Data Science"],
  [/design|\bux\b|\bui\b/i, "Design"],
  [/market|\bgrowth\b/i, "Marketing"],
  [/content|writ|editor/i, "Content Writing"],
  [/financ|account|\brisk\b|insurance/i, "Finance"],
  [/business development|sales|partnership/i, "Business Development"],
];

export function mapField(rawDepartment: string | null | undefined): string {
  if (!rawDepartment) return "Other";

  for (const [pattern, field] of FIELD_KEYWORDS) {
    if (pattern.test(rawDepartment)) return field;
  }

  console.warn(`[import] Unmapped department "${rawDepartment}" -> defaulting to "Other"`);
  return "Other";
}

export function resolveWorkMode(options: {
  locationText: string;
  isRemote?: boolean | null;
  workplaceType?: string | null;
}): WorkMode {
  const { locationText, isRemote, workplaceType } = options;
  const normalizedType = workplaceType?.toLowerCase();

  // workplaceType is the most specific signal when a source gives us one -
  // check it before the coarser isRemote boolean (we've seen sources where
  // isRemote:true and workplaceType:"Hybrid" both appear on the same job).
  if (normalizedType === "remote") return "Remote";
  if (normalizedType === "hybrid") return "Hybrid";
  if (normalizedType === "onsite" || normalizedType === "on-site") return "On-site";
  if (isRemote === true) return "Remote";
  if (/remote/i.test(locationText)) return "Remote";
  return "On-site";
}

export interface ResolvedLocation {
  city: string;
  country: string | null;
}

// Some boards tack an internal office/building code onto the city name
// (e.g. Razorpay's Greenhouse board lists "Bengaluru-VTP"). Strip a trailing
// "-XXXX" all-caps suffix rather than the whole hyphenated name, so a real
// hyphenated city name wouldn't be affected (an all-caps suffix like "-VTP"
// doesn't read as part of a place name the way "-Salem" would).
function stripOfficeCodeSuffix(city: string): string {
  return city.replace(/-[A-Z]{2,6}$/, "").trim();
}

// Same idea as FIELD_KEYWORDS above - a small, growable dictionary mapping
// known spelling variants to the one name we want everywhere (matching the
// "Bangalore" spelling already used in supabase/seed.sql).
const CITY_ALIASES: Record<string, string> = {
  bengaluru: "Bangalore",
  bangalore: "Bangalore",
  gurgaon: "Gurgaon",
  gurugram: "Gurgaon",
};

function canonicalizeCity(city: string): string {
  return CITY_ALIASES[city.toLowerCase()] ?? city;
}

const COUNTRY_PATTERNS: [RegExp, string][] = [
  [/\bindia\b/i, "India"],
  [/\b(usa|u\.s\.a\.|united states)\b/i, "United States"],
  [/\b(uk|united kingdom)\b/i, "United Kingdom"],
  [/\bcanada\b/i, "Canada"],
];

const US_STATE_CODES = new Set([
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL",
  "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT",
  "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI",
  "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC",
]);

// Best-effort: recognizes a small set of country names/aliases, plus a US
// state code as a signal for "United States" (e.g. "New York, NY"). Anything
// else comes back null rather than a guess - grow COUNTRY_PATTERNS as new
// source countries show up.
function detectCountry(locationSegment: string): string | null {
  for (const [pattern, country] of COUNTRY_PATTERNS) {
    if (pattern.test(locationSegment)) return country;
  }

  const stateMatch = locationSegment.match(/\b([A-Z]{2})\b/);
  if (stateMatch && US_STATE_CODES.has(stateMatch[1])) return "United States";

  return null;
}

// Fallback for when a location is just a bare city name with no country or
// state attached at all - confirmed happening for real (Tower Research
// Capital's Greenhouse board gives "Gift City"/"gurgaon" with no suffix,
// Paytm's Lever board gives bare "Bangalore"/"Noida"/"Gurugram"). Without
// this, those rows silently fall back to the company's defaultCurrency
// instead of being recognized as India - which is a real correctness bug,
// not just a cosmetic one, for a company whose board mixes countries. Keyed
// on the same canonical city name CITY_ALIASES produces.
const CITY_COUNTRY_FALLBACK: Record<string, string> = {
  bangalore: "India",
  mumbai: "India",
  delhi: "India",
  "new delhi": "India",
  noida: "India",
  gurgaon: "India", // canonicalizeCity() already folds "Gurugram" into this
  hyderabad: "India",
  pune: "India",
  chennai: "India",
  kolkata: "India",
  ahmedabad: "India",
  "gift city": "India",
};

// Source location strings are messy and inconsistent - real examples we've
// seen include "Bengaluru-VTP, India", "New York, NY (HQ)", and "Bellevue,
// WA; Menlo Park, CA" (multiple offices on one posting). This turns that
// into one clean city plus a country, so the filter sidebar doesn't end up
// with a separate checkbox per raw string variant.
export function resolveLocation(rawLocationText: string, workMode: WorkMode): ResolvedLocation {
  const cleaned = rawLocationText.replace(/\([^)]*\)/g, "").trim();

  if (!cleaned) {
    return { city: workMode === "Remote" ? "Remote" : "Unspecified", country: null };
  }

  // A job can list multiple offices separated by ";" - keep just the first,
  // and read the country off that same first location (not the whole
  // string), so a posting spanning two countries doesn't get a country that
  // doesn't match the city we kept.
  const firstLocation = cleaned.split(";")[0].trim();
  const textCountry = detectCountry(firstLocation);

  if (workMode === "Remote") {
    return { city: "Remote", country: textCountry };
  }

  const cityPart = firstLocation.split(",")[0] ?? "";
  const strippedCity = stripOfficeCodeSuffix(cityPart);
  const city = strippedCity ? canonicalizeCity(strippedCity) : "Unspecified";

  // Text-based detection (explicit "India"/state code) takes priority; only
  // fall back to the city-name lookup when the raw text gave no signal at
  // all, so an explicitly-stated different country is never overridden.
  const country = textCountry ?? CITY_COUNTRY_FALLBACK[city.toLowerCase()] ?? null;

  return { city, country };
}

// A single per-company default currency isn't granular enough for companies
// whose board spans multiple countries (e.g. a US-HQ'd firm with an India
// office, or vice versa - confirmed happening for real: Tower Research
// Capital's board mixes New York/London/Singapore/Gurgaon postings). When a
// job's own resolved location is India, use INR regardless of the company's
// overall default - a safer per-job signal than the company-wide fallback.
export function resolveDefaultCurrency(country: string | null, company: { defaultCurrency: string }): string {
  return country === "India" ? "INR" : company.defaultCurrency;
}

interface RawCompensation {
  min?: number | null;
  max?: number | null;
  currencyCode?: string | null;
  rawText?: string | null;
}

interface ResolvedCompensation {
  stipend_min: number | null;
  stipend_max: number | null;
  currency: string;
  stipend_note: string | null;
}

function detectCurrencyFromText(text: string): string | null {
  if (text.includes("₹")) return "INR";
  if (text.includes("$")) return "USD";
  if (text.includes("£")) return "GBP";
  if (text.includes("€")) return "EUR";
  return null;
}

// Most listings on these boards don't state compensation in a clean numeric
// form (confirmed by spot-checking live Greenhouse/Lever/Ashby responses -
// none of the intern postings we sampled carried a structured pay field).
// We only fill in stipend_min/max when a source hands us a trustworthy
// numeric range; everything else goes in stipend_note instead of guessing.
export function resolveCompensation(raw: RawCompensation | null, defaultCurrency: string): ResolvedCompensation {
  if (raw?.min != null && raw?.max != null) {
    return {
      stipend_min: raw.min,
      stipend_max: raw.max,
      currency: raw.currencyCode ?? defaultCurrency,
      stipend_note: null,
    };
  }

  if (raw?.rawText) {
    return {
      stipend_min: null,
      stipend_max: null,
      currency: detectCurrencyFromText(raw.rawText) ?? defaultCurrency,
      stipend_note: raw.rawText,
    };
  }

  return {
    stipend_min: null,
    stipend_max: null,
    currency: defaultCurrency,
    stipend_note: "Not specified by source",
  };
}
