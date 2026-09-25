import { Internship, WorkMode } from "./types";

export interface InternshipFilters {
  search: string;
  fields: string[];
  cities: string[];
  workModes: WorkMode[];
  minStipend: number;
}

function passesSearch(internship: Internship, search: string): boolean {
  const query = search.trim().toLowerCase();
  if (query === "") return true;
  return (
    internship.title.toLowerCase().includes(query) ||
    internship.company.toLowerCase().includes(query)
  );
}

function passesMinStipend(internship: Internship, minStipend: number): boolean {
  if (minStipend === 0) return true;
  if (internship.stipend_max === null) return true;
  return internship.stipend_max >= minStipend;
}

export function filterInternships(
  internships: Internship[],
  filters: InternshipFilters
): Internship[] {
  return internships.filter((internship) => {
    if (!passesSearch(internship, filters.search)) return false;
    if (filters.fields.length > 0 && !filters.fields.includes(internship.field)) return false;
    if (filters.cities.length > 0 && !filters.cities.includes(internship.city)) return false;
    if (
      filters.workModes.length > 0 &&
      !filters.workModes.includes(internship.work_mode)
    ) {
      return false;
    }
    if (!passesMinStipend(internship, filters.minStipend)) return false;
    return true;
  });
}

export function getFieldOptions(internships: Internship[]): string[] {
  return Array.from(new Set(internships.map((i) => i.field))).sort();
}

export function getCityOptions(internships: Internship[]): string[] {
  return Array.from(new Set(internships.map((i) => i.city))).sort();
}
