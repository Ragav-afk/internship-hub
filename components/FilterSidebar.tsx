import { WorkMode } from "@/lib/types";

const fields = [
  "Software Development",
  "Marketing",
  "Design",
  "Data Science",
  "Finance",
  "Content Writing",
  "Business Development",
];

const cities = ["Bangalore", "Chennai", "Pune", "Remote"];

const workModes: WorkMode[] = ["Remote", "On-site", "Hybrid"];

export default function FilterSidebar() {
  return (
    <aside className="h-full w-64 shrink-0 overflow-y-auto border-r border-gray-200 bg-white p-4">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Filters</h2>

      <fieldset className="mb-6">
        <legend className="mb-2 text-sm font-semibold text-gray-700">Field</legend>
        <div className="flex flex-col gap-2">
          {fields.map((field) => (
            <label key={field} className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" className="accent-blue-600" />
              {field}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-6">
        <legend className="mb-2 text-sm font-semibold text-gray-700">Location</legend>
        <div className="flex flex-col gap-2">
          {cities.map((city) => (
            <label key={city} className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" className="accent-blue-600" />
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
              <input type="checkbox" className="accent-blue-600" />
              {mode}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-gray-700">Stipend (₹/month)</legend>
        <div className="flex flex-col gap-2">
          <input
            type="range"
            min={0}
            max={50000}
            defaultValue={0}
            className="w-full accent-blue-600"
          />
          <input
            type="range"
            min={0}
            max={50000}
            defaultValue={50000}
            className="w-full accent-blue-600"
          />
          <p className="text-xs text-gray-500">₹0 – ₹50,000+ /month</p>
        </div>
      </fieldset>
    </aside>
  );
}
