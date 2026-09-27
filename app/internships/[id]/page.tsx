import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import InternshipDetailMobile from "@/components/InternshipDetailMobile";
import { getCurrentUser, getFavoriteInternshipIds, getInternshipById } from "@/lib/queries";

interface InternshipDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function InternshipDetailPage({ params }: InternshipDetailPageProps) {
  const { id } = await params;
  const [internship, user, favoriteIds] = await Promise.all([
    getInternshipById(id),
    getCurrentUser(),
    getFavoriteInternshipIds(),
  ]);

  if (internship === null) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar user={user} />
        <div className="mx-auto max-w-3xl p-6 text-center">
          <p className="text-gray-500">Internship not found.</p>
          <Link href="/" className="mt-2 inline-block text-sm text-blue-700 hover:underline">
            Back to internships
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <div className="mx-auto max-w-3xl p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-blue-700 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to internships
        </Link>
        <div className="mt-4">
          <InternshipDetailMobile
            internship={internship}
            initialFavorited={favoriteIds.has(internship.id)}
            isLoggedIn={user !== null}
          />
        </div>
      </div>
    </div>
  );
}
