"use client";

import { useState } from "react";
import { Internship, WorkMode } from "@/lib/types";
import { filterInternships, getCityOptions, getFieldOptions } from "@/lib/filters";
import Navbar from "@/components/Navbar";
import FilterSidebar from "@/components/FilterSidebar";
import InternshipList from "@/components/InternshipList";
import InternshipDetailPanel from "@/components/InternshipDetailPanel";

interface InternshipBrowserProps {
  internships: Internship[];
}

export default function InternshipBrowser({ internships }: InternshipBrowserProps) {
  const [searchText, setSearchText] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedWorkModes, setSelectedWorkModes] = useState<WorkMode[]>([]);
  const [minStipend, setMinStipend] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  function toggleField(field: string) {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  }

  function toggleCity(city: string) {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  }

  function toggleWorkMode(mode: WorkMode) {
    setSelectedWorkModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
  }

  const fieldOptions = getFieldOptions(internships);
  const cityOptions = getCityOptions(internships);

  const filteredInternships = filterInternships(internships, {
    search: searchText,
    fields: selectedFields,
    cities: selectedCities,
    workModes: selectedWorkModes,
    minStipend,
  });

  const selectedInternship =
    filteredInternships.find((i) => i.id === selectedId) ?? filteredInternships[0] ?? null;

  const activeFilterCount =
    selectedFields.length +
    selectedCities.length +
    selectedWorkModes.length +
    (minStipend > 0 ? 1 : 0);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar searchText={searchText} onSearchChange={setSearchText} />
      <div className="flex flex-1 overflow-hidden">
        <FilterSidebar
          fieldOptions={fieldOptions}
          selectedFields={selectedFields}
          onFieldToggle={toggleField}
          cityOptions={cityOptions}
          selectedCities={selectedCities}
          onCityToggle={toggleCity}
          selectedWorkModes={selectedWorkModes}
          onWorkModeToggle={toggleWorkMode}
          minStipend={minStipend}
          onMinStipendChange={setMinStipend}
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />
        <InternshipList
          internships={filteredInternships}
          selectedId={selectedInternship?.id ?? null}
          onSelect={setSelectedId}
          activeFilterCount={activeFilterCount}
          onOpenFilters={() => setIsFilterOpen(true)}
        />
        <InternshipDetailPanel internship={selectedInternship} />
      </div>
    </div>
  );
}
