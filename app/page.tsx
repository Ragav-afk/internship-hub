import { Suspense } from "react";
import InternshipBrowser from "@/components/InternshipBrowser";
import { getCurrentUser, getFavoriteInternshipIds, getInternships } from "@/lib/queries";

export default async function Home() {
  const [internships, user, favoriteIds] = await Promise.all([
    getInternships(),
    getCurrentUser(),
    getFavoriteInternshipIds(),
  ]);

  if (internships.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        No internships found right now. Check back soon.
      </div>
    );
  }

  // InternshipBrowser reads filters from the URL via useSearchParams, which
  // Next.js requires to be inside a Suspense boundary.
  return (
    <Suspense fallback={null}>
      <InternshipBrowser
        internships={internships}
        user={user}
        favoriteIds={[...favoriteIds]}
      />
    </Suspense>
  );
}
