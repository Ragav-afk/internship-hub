"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Internship, WorkMode } from "@/lib/types";
import { filterInternships, getCityOptions, getFieldOptions } from "@/lib/filters";
import { parseFiltersFromParams } from "@/lib/searchParams";
import Navbar from "@/components/Navbar";
import FilterSidebar from "@/components/FilterSidebar";
import InternshipList from "@/components/InternshipList";
import InternshipDetailPanel from "@/components/InternshipDetailPanel";

interface InternshipBrowserProps {
  internships: Internship[];
}

// How long to wait after the last keystroke before writing the search text
// into the URL. Filtering itself still happens instantly (see searchText
// below) - this only delays the URL update, so we don't call router.replace
// on every single letter typed.
const SEARCH_DEBOUNCE_MS = 400;

export default function InternshipBrowser({ internships }: InternshipBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(() => parseFiltersFromParams(searchParams), [searchParams]);

  // Always points at the latest URL params, so the debounced search update
  // below never accidentally overwrites a filter the user changed in the
  // meantime with stale data. Synced in an effect (not during render) since
  // refs shouldn't be written while rendering.
  const searchParamsRef = useRef(searchParams);
  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  // The search box is the one piece of state that still needs a local
  // useState: it has to update on every keystroke for typing to feel normal,
  // and we don't want to write to the URL that often (see SEARCH_DEBOUNCE_MS
  // above). Everything else - fields, cities, work modes, stipend, the
  // selected card - is read directly from the URL below, with no useState
  // backing it at all.
  const [searchText, setSearchText] = useState(filters.search);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Keep the input in sync if the URL's search text changes from outside
  // typing - e.g. the user hits the browser back button, or opens a shared
  // link that already has ?q=... in it. This runs during render (React's
  // recommended way to mirror a prop into state), not in an effect, so it
  // takes effect immediately instead of after an extra render.
  const [syncedSearch, setSyncedSearch] = useState(filters.search);
  if (filters.search !== syncedSearch) {
    setSyncedSearch(filters.search);
    setSearchText(filters.search);
  }

  function setParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParamsRef.current.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    const query = params.toString();
    // replace (not push) so filtering and typing never add entries to the
    // browser's back/forward history.
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  useEffect(() => {
    if (searchText === filters.search) return;
    const timeout = setTimeout(() => {
      setParams({ q: searchText });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  function toggleField(field: string) {
    const next = filters.fields.includes(field)
      ? filters.fields.filter((f) => f !== field)
      : [...filters.fields, field];
    setParams({ field: next.join(",") || null });
  }

  function toggleCity(city: string) {
    const next = filters.cities.includes(city)
      ? filters.cities.filter((c) => c !== city)
      : [...filters.cities, city];
    setParams({ city: next.join(",") || null });
  }

  function toggleWorkMode(mode: WorkMode) {
    const next = filters.workModes.includes(mode)
      ? filters.workModes.filter((m) => m !== mode)
      : [...filters.workModes, mode];
    setParams({ mode: next.join(",") || null });
  }

  function setMinStipend(value: number) {
    setParams({ stipend: value > 0 ? String(value) : null });
  }

  function selectInternship(id: string) {
    setParams({ id });
  }

  const fieldOptions = getFieldOptions(internships);
  const cityOptions = getCityOptions(internships);

  const filteredInternships = filterInternships(internships, {
    search: searchText,
    fields: filters.fields,
    cities: filters.cities,
    workModes: filters.workModes,
    minStipend: filters.minStipend,
  });

  const selectedInternship =
    filteredInternships.find((i) => i.id === filters.selectedId) ??
    filteredInternships[0] ??
    null;

  const activeFilterCount =
    filters.fields.length +
    filters.cities.length +
    filters.workModes.length +
    (filters.minStipend > 0 ? 1 : 0);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar searchText={searchText} onSearchChange={setSearchText} />
      <div className="flex flex-1 overflow-hidden">
        <FilterSidebar
          fieldOptions={fieldOptions}
          selectedFields={filters.fields}
          onFieldToggle={toggleField}
          cityOptions={cityOptions}
          selectedCities={filters.cities}
          onCityToggle={toggleCity}
          selectedWorkModes={filters.workModes}
          onWorkModeToggle={toggleWorkMode}
          minStipend={filters.minStipend}
          onMinStipendChange={setMinStipend}
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />
        <InternshipList
          internships={filteredInternships}
          selectedId={selectedInternship?.id ?? null}
          onSelect={selectInternship}
          activeFilterCount={activeFilterCount}
          onOpenFilters={() => setIsFilterOpen(true)}
        />
        <InternshipDetailPanel internship={selectedInternship} />
      </div>
    </div>
  );
}
