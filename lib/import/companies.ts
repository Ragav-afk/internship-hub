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
  // list is shorter than the candidates checked: Zerodha, Swiggy,
  // Zomato/Eternal, PhonePe, Postman, Zoho, BrowserStack, Hasura,
  // Chargebee, and Darwinbox came back not-found on all three and aren't
  // included).
  { slug: "razorpaysoftwareprivatelimited", source: "Greenhouse", displayName: "Razorpay", defaultCurrency: "INR" },
  { slug: "groww", source: "Greenhouse", displayName: "Groww", defaultCurrency: "INR" },
  { slug: "cred", source: "Lever", displayName: "CRED", defaultCurrency: "INR" },
  { slug: "meesho", source: "Lever", displayName: "Meesho", defaultCurrency: "INR" },
  { slug: "freshworks", source: "Lever", displayName: "Freshworks", defaultCurrency: "INR" },
];
