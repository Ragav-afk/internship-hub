import { useRouter } from "next/navigation";
import { Internship } from "@/lib/types";
import { MOBILE_BREAKPOINT_PX } from "@/lib/constants";
import InternshipCard from "@/components/InternshipCard";

interface InternshipListProps {
  internships: Internship[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  activeFilterCount: number;
  onOpenFilters: () => void;
  favoriteIds: Set<string>;
  isLoggedIn: boolean;
}

export default function InternshipList({
  internships,
  selectedId,
  onSelect,
  activeFilterCount,
  onOpenFilters,
  favoriteIds,
  isLoggedIn,
}: InternshipListProps) {
  const router = useRouter();

  return (
    <div className="h-full flex-1 min-w-0 overflow-y-auto bg-gray-50 p-4">
      <div className="mx-auto flex max-w-2xl flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {internships.length} internship{internships.length === 1 ? "" : "s"}
          </p>
          <button
            type="button"
            onClick={onOpenFilters}
            className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 lg:hidden"
          >
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {internships.length === 0 ? (
          <p className="text-sm text-gray-500">
            No internships match your filters. Try adjusting your search or filters.
          </p>
        ) : (
          internships.map((internship) => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              isSelected={internship.id === selectedId}
              isFavorited={favoriteIds.has(internship.id)}
              isLoggedIn={isLoggedIn}
              onClick={() => {
                if (window.innerWidth < MOBILE_BREAKPOINT_PX) {
                  router.push(`/internships/${internship.id}`);
                } else {
                  onSelect(internship.id);
                }
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
