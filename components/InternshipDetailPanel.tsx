import { Internship } from "@/lib/types";
import InternshipDetails from "@/components/InternshipDetails";

interface InternshipDetailPanelProps {
  internship: Internship | null;
}

export default function InternshipDetailPanel({ internship }: InternshipDetailPanelProps) {
  return (
    <div className="hidden h-full w-[30rem] shrink-0 overflow-y-auto border-l border-gray-200 bg-white p-6 lg:block">
      {internship === null ? (
        <p className="text-sm text-gray-500">Select an internship to see details here.</p>
      ) : (
        <InternshipDetails internship={internship} />
      )}
    </div>
  );
}
