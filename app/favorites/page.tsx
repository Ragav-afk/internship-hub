import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import FavoritesGrid from "@/components/FavoritesGrid";
import { getCurrentUser, getFavoriteInternships } from "@/lib/queries";

export default async function FavoritesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const internships = await getFavoriteInternships();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar user={user} />
      <div className="mx-auto w-full max-w-3xl flex-1 p-4 lg:p-6">
        <h1 className="mb-4 text-xl font-semibold text-gray-900">My Favourites</h1>

        {internships.length === 0 ? (
          <div className="mt-10 text-center text-gray-500">
            <p>You haven&apos;t saved any internships yet.</p>
            <Link href="/" className="mt-2 inline-block text-blue-700 hover:underline">
              Browse internships
            </Link>
          </div>
        ) : (
          <FavoritesGrid internships={internships} />
        )}
      </div>
    </div>
  );
}
