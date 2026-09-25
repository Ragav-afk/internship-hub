import Navbar from "@/components/Navbar";
import FilterSidebar from "@/components/FilterSidebar";
import InternshipList from "@/components/InternshipList";
import InternshipDetailPanel from "@/components/InternshipDetailPanel";
import { getInternships } from "@/lib/queries";

export default async function Home() {
  const internships = await getInternships();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <FilterSidebar />
        {internships.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-gray-500">
            No internships found right now. Check back soon.
          </div>
        ) : (
          <>
            <InternshipList internships={internships} />
            <InternshipDetailPanel internship={internships[0]} />
          </>
        )}
      </div>
    </div>
  );
}
