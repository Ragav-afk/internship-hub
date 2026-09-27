// Next.js shows this automatically while app/page.tsx's data fetch is in
// flight - no wiring needed on that page itself, just having this file here
// is enough (the App Router convention).
function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-4">
      <div className="h-4 w-2/3 rounded bg-gray-200" />
      <div className="mt-2 h-3 w-1/3 rounded bg-gray-200" />
      <div className="mt-4 h-3 w-1/2 rounded bg-gray-200" />
      <div className="mt-2 h-3 w-1/3 rounded bg-gray-200" />
    </div>
  );
}

export default function Loading() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="h-16 shrink-0 border-b border-gray-200 bg-white" />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden w-64 shrink-0 border-r border-gray-200 bg-white lg:block" />
        <div className="h-full flex-1 min-w-0 overflow-y-auto bg-gray-50 p-4">
          <div className="mx-auto flex max-w-2xl flex-col gap-3">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
        <div className="hidden w-[30rem] shrink-0 border-l border-gray-200 bg-white lg:block" />
      </div>
    </div>
  );
}
