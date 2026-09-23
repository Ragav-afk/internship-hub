import Navbar from "@/components/Navbar";
import FilterSidebar from "@/components/FilterSidebar";
import InternshipList from "@/components/InternshipList";
import InternshipDetailPanel from "@/components/InternshipDetailPanel";
import { fakeInternships } from "@/lib/fakeData";

export default function Home() {
  const selectedInternship = fakeInternships[0];

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <FilterSidebar />
        <InternshipList internships={fakeInternships} />
        <InternshipDetailPanel internship={selectedInternship} />
      </div>
    </div>
  );
}
