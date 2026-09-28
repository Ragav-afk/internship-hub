import { CompanyConfig, ImportRow } from "../types";
import { isInternshipSignal, isInternshipTitle, mapField, resolveCompensation, resolveDefaultCurrency, resolveLocation, resolveWorkMode } from "../mapping";

// Shape confirmed against a live board (api.ashbyhq.com/posting-api/job-board/ramp) -
// descriptionPlain is already plain text. workplaceType is capitalized
// ("Hybrid"/"Remote"/"Onsite") and isRemote can disagree with it, which
// resolveWorkMode accounts for. No job we sampled carried a compensation field.
interface AshbyJob {
  id: string;
  title: string;
  department?: string;
  team?: string;
  employmentType?: string;
  location?: string;
  isRemote?: boolean;
  workplaceType?: string;
  applyUrl: string;
  publishedAt: string;
  descriptionPlain?: string;
}

interface AshbyResponse {
  jobs: AshbyJob[];
}

export async function fetchAshbyInternships(company: CompanyConfig): Promise<ImportRow[]> {
  const res = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${company.slug}`);

  if (!res.ok) {
    console.warn(`[import] Ashby fetch failed for "${company.slug}": ${res.status}`);
    return [];
  }

  const data = (await res.json()) as AshbyResponse;

  return data.jobs
    .filter((job) => isInternshipTitle(job.title) || isInternshipSignal(job.employmentType))
    .map((job): ImportRow => {
      const locationText = job.location ?? "";
      const workMode = resolveWorkMode({
        locationText,
        isRemote: job.isRemote,
        workplaceType: job.workplaceType,
      });
      const { city, country } = resolveLocation(locationText, workMode);

      return {
        title: job.title,
        company: company.displayName,
        description: (job.descriptionPlain ?? "").trim(),
        field: mapField(job.department ?? job.team),
        city,
        country,
        work_mode: workMode,
        ...resolveCompensation(null, resolveDefaultCurrency(country, company)),
        duration: null,
        apply_url: job.applyUrl,
        source: "Ashby",
        external_id: job.id,
        posted_at: job.publishedAt,
      };
    });
}
