import { WorkMode } from "./types";

export interface ParsedFilters {
  search: string;
  fields: string[];
  cities: string[];
  workModes: WorkMode[];
  minStipend: number;
  selectedId: string | null;
}

const VALID_WORK_MODES: WorkMode[] = ["Remote", "On-site", "Hybrid"];

function parseList(value: string | null): string[] {
  if (!value) return [];
  return value.split(",").filter((entry) => entry !== "");
}

// Reads the filter/search/selection state out of the URL's query string.
// This is the single source of truth for that state - there's no useState
// mirroring it, so a page refresh or a shared link always shows the same
// view as when the URL was copied.
export function parseFiltersFromParams(params: URLSearchParams): ParsedFilters {
  const stipend = Number(params.get("stipend"));

  return {
    search: params.get("q") ?? "",
    fields: parseList(params.get("field")),
    cities: parseList(params.get("city")),
    workModes: parseList(params.get("mode")).filter(
      (mode): mode is WorkMode => VALID_WORK_MODES.includes(mode as WorkMode)
    ),
    minStipend: Number.isFinite(stipend) && stipend > 0 ? stipend : 0,
    selectedId: params.get("id"),
  };
}
