import { CompanyConfig, ImportRow } from "../types";
import { isInternshipTitle, mapField, resolveCompensation, resolveLocation, resolveWorkMode, stripHtml } from "../mapping";

// Shape confirmed against a live board (boards-api.greenhouse.io/v1/boards/robinhood/jobs) -
// Greenhouse doesn't expose a structured compensation field on any of the
// intern postings we sampled, so we don't attempt to parse one.
interface GreenhouseJob {
  id: number;
  title: string;
  content?: string;
  absolute_url: string;
  updated_at: string;
  location?: { name?: string };
  departments?: { name: string }[];
}

interface GreenhouseResponse {
  jobs: GreenhouseJob[];
}

export async function fetchGreenhouseInternships(company: CompanyConfig): Promise<ImportRow[]> {
  const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${company.slug}/jobs?content=true`);

  if (!res.ok) {
    console.warn(`[import] Greenhouse fetch failed for "${company.slug}": ${res.status}`);
    return [];
  }

  const data = (await res.json()) as GreenhouseResponse;

  return data.jobs
    .filter((job) => isInternshipTitle(job.title))
    .map((job): ImportRow => {
      const locationText = job.location?.name ?? "";
      const workMode = resolveWorkMode({ locationText });
      const { city, country } = resolveLocation(locationText, workMode);

      return {
        title: job.title,
        company: company.displayName,
        description: stripHtml(job.content ?? ""),
        field: mapField(job.departments?.[0]?.name),
        city,
        country,
        work_mode: workMode,
        ...resolveCompensation(null, company.defaultCurrency),
        duration: null,
        apply_url: job.absolute_url,
        source: "Greenhouse",
        external_id: String(job.id),
        posted_at: job.updated_at,
      };
    });
}
