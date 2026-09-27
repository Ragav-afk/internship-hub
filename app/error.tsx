"use client";

// Next.js implements this file convention with a React error boundary,
// which can only be a client component - that's a React requirement, not
// a Next.js one. This catches any error thrown while rendering this route
// (e.g. getInternships() failing in app/page.tsx) and shows this instead
// of a blank/crashed page. reset() re-runs the page without a full reload.
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 text-gray-500">
      <p>We couldn&apos;t reach the database right now. Please try again in a moment.</p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  );
}
