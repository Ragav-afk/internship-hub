import { CompanyConfig, ImportRow } from "../types";
import { isInternshipSignal, isInternshipTitle, mapField, resolveCompensation, resolveDefaultCurrency, resolveLocation, resolveWorkMode } from "../mapping";

// Shape confirmed against a live board (api.lever.co/v0/postings/theathletic) -
// descriptionPlain is already plain text (no HTML stripping needed), and
// createdAt is milliseconds since epoch, not an ISO string. No job we
// sampled carried a structured salary field.
interface LeverJob {
  id: string;
  text: string;
  descriptionPlain?: string;
  hostedUrl: string;
  createdAt: number;
  workplaceType?: string;
  categories?: {
    location?: string;
    team?: string;
    commitment?: string;
  };
}

export async function fetchLeverInternships(company: CompanyConfig): Promise<ImportRow[]> {
  const res = await fetch(`https://api.lever.co/v0/postings/${company.slug}?mode=json`);

  if (!res.ok) {
    console.warn(`[import] Lever fetch failed for "${company.slug}": ${res.status}`);
    return [];
  }

  const jobs = (await res.json()) as LeverJob[];

  if (!Array.isArray(jobs)) {
    console.warn(`[import] Lever returned an unexpected response for "${company.slug}"`);
    return [];
  }

  return jobs
    .filter((job) => isInternshipTitle(job.text) || isInternshipSignal(job.categories?.commitment))
    .map((job): ImportRow => {
      const locationText = job.categories?.location ?? "";
      const workMode = resolveWorkMode({ locationText, workplaceType: job.workplaceType });
      const { city, country } = resolveLocation(locationText, workMode);

      return {
        title: job.text,
        company: company.displayName,
        description: (job.descriptionPlain ?? "").trim(),
        field: mapField(job.categories?.team),
        city,
        country,
        work_mode: workMode,
        ...resolveCompensation(null, resolveDefaultCurrency(country, company)),
        duration: null,
        apply_url: job.hostedUrl,
        source: "Lever",
        external_id: job.id,
        posted_at: new Date(job.createdAt).toISOString(),
      };
    });
}
