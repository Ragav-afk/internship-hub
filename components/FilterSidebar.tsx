import { WorkMode } from "@/lib/types";

const workModes: WorkMode[] = ["Remote", "On-site", "Hybrid"];

interface FilterSidebarProps {
  fieldOptions: string[];
  selectedFields: string[];
  onFieldToggle: (field: string) => void;

  cityOptions: string[];
  selectedCities: string[];
  onCityToggle: (city: string) => void;

  selectedWorkModes: WorkMode[];
  onWorkModeToggle: (mode: WorkMode) => void;

  minStipend: number;
  onMinStipendChange: (value: number) => void;
}

export default function FilterSidebar({
  fieldOptions,
  selectedFields,
  onFieldToggle,
  cityOptions,
  selectedCities,
  onCityToggle,
  selectedWorkModes,
  onWorkModeToggle,
  minStipend,
  onMinStipendChange,
}: FilterSidebarProps) {
  return (
    <aside className="h-full w-64 shrink-0 overflow-y-auto border-r border-gray-200 bg-white p-4">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Filters</h2>

      <fieldset className="mb-6">
        <legend className="mb-2 text-sm font-semibold text-gray-700">Field</legend>
        <div className="flex flex-col gap-2">
          {fieldOptions.map((field) => (
            <label key={field} className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                className="accent-blue-600"
                checked={selectedFields.includes(field)}
                onChange={() => onFieldToggle(field)}
              />
              {field}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-6">
        <legend className="mb-2 text-sm font-semibold text-gray-700">Location</legend>
        <div className="flex flex-col gap-2">
          {cityOptions.map((city) => (
            <label key={city} className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                className="accent-blue-600"
                checked={selectedCities.includes(city)}
                onChange={() => onCityToggle(city)}
              />
              {city}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-6">
        <legend className="mb-2 text-sm font-semibold text-gray-700">Work mode</legend>
        <div className="flex flex-col gap-2">
          {workModes.map((mode) => (
            <label key={mode} className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                className="accent-blue-600"
                checked={selectedWorkModes.includes(mode)}
                onChange={() => onWorkModeToggle(mode)}
              />
              {mode}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-gray-700">Minimum stipend</legend>
        <div className="flex flex-col gap-2">
          <input
            type="range"
            min={0}
            max={50000}
            step={5000}
            value={minStipend}
            onChange={(e) => onMinStipendChange(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <p className="text-xs text-gray-500">
            ₹{minStipend.toLocaleString("en-IN")}/month and up
          </p>
        </div>
      </fieldset>
    </aside>
  );
}
