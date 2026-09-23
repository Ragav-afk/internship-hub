import { Internship } from "@/lib/types";
import InternshipCard from "@/components/InternshipCard";

interface InternshipListProps {
  internships: Internship[];
}

export default function InternshipList({ internships }: InternshipListProps) {
  return (
    <div className="h-full flex-1 min-w-0 overflow-y-auto bg-gray-50 p-4">
      <div className="flex flex-col gap-3">
        {internships.map((internship) => (
          <InternshipCard key={internship.id} internship={internship} />
        ))}
      </div>
    </div>
  );
}
