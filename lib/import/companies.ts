import { CompanyConfig } from "./types";

// Small, hand-picked starter list - Greenhouse/Lever/Ashby don't offer a way
// to search across companies (see the plan doc), so this has to grow slug by
// slug as you notice companies worth pulling from. Each slug below was
// checked live and returns real postings as of when this list was written;
// a slug can go stale if a company switches ATS or renames their board, in
// which case the importer just logs a fetch warning and skips it.
export const COMPANIES: CompanyConfig[] = [
  { slug: "robinhood", source: "Greenhouse", displayName: "Robinhood", defaultCurrency: "USD" },
  { slug: "ramp", source: "Ashby", displayName: "Ramp", defaultCurrency: "USD" },
  { slug: "theathletic", source: "Lever", displayName: "The Athletic", defaultCurrency: "USD" },
  { slug: "bhg-inc", source: "Lever", displayName: "BHG Financial", defaultCurrency: "USD" },

  // Indian companies - verified individually against all three platforms
  // (many well-known Indian companies use something else entirely, e.g.
  // BrowserStack uses Workday and Chargebee uses LinkedIn Jobs, so this
  // list is shorter than the candidates checked). Not found on any of the
  // three, across two rounds: Zerodha, Swiggy, Zomato/Eternal, PhonePe,
  // Postman, Zoho, BrowserStack, Hasura, Chargebee, Darwinbox, Flipkart,
  // Myntra, Nykaa, Ola, Oyo, Dream11, Unacademy, PhysicsWallah, Zepto,
  // Blinkit, Urban Company, Lenskart, Pine Labs, Juspay, Setu, Jupiter,
  // Sprinklr, Innovaccer, Uniphore, Gupshup, MoEngage, WebEngage, CleverTap,
  // Whatfix, LeadSquared, Wingify, Zluri, Arcesium, Quadeye.
  { slug: "razorpaysoftwareprivatelimited", source: "Greenhouse", displayName: "Razorpay", defaultCurrency: "INR" },
  { slug: "groww", source: "Greenhouse", displayName: "Groww", defaultCurrency: "INR" },
  { slug: "cred", source: "Lever", displayName: "CRED", defaultCurrency: "INR" },
  { slug: "meesho", source: "Lever", displayName: "Meesho", defaultCurrency: "INR" },
  { slug: "freshworks", source: "Lever", displayName: "Freshworks", defaultCurrency: "INR" },
  { slug: "paytm", source: "Lever", displayName: "Paytm", defaultCurrency: "INR" },

  // These four also checked out as real, correctly-identified companies
  // (confirmed via hostedUrl/applyUrl/location data, not just a name match -
  // several common-word slugs turned out to be a different company entirely,
  // see the exclusions below), but their boards mix India with other
  // countries. defaultCurrency here is what non-India rows get; India rows
  // are always promoted to INR by resolveDefaultCurrency() regardless of
  // this value (see lib/import/mapping.ts), so it only needs to be right for
  // the non-India minority of each board.
  { slug: "zeta", source: "Lever", displayName: "Zeta", defaultCurrency: "USD" },
  { slug: "mindtickle", source: "Lever", displayName: "Mindtickle", defaultCurrency: "USD" },
  { slug: "atlan", source: "Ashby", displayName: "Atlan", defaultCurrency: "USD" },
  { slug: "towerresearchcapital", source: "Greenhouse", displayName: "Tower Research Capital", defaultCurrency: "USD" },
  { slug: "gravitonresearchcapital", source: "Greenhouse", displayName: "Graviton Research Capital", defaultCurrency: "USD" },

  // Checked and explicitly excluded, not just "not found": these slugs return
  // real data, but for a DIFFERENT company than the intended one -
  // "navi" on Ashby is San-Francisco-only (not Sachin Bansal's Navi
  // Technologies), and "slice" on Greenhouse is a North Macedonia/US company
  // (not the Bangalore fintech). A slug returning jobs isn't enough
  // verification on its own - the location/URL data has to actually match
  // the company you meant.
];
