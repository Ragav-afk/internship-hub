export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="h-16 shrink-0 border-b border-gray-200 bg-white" />
      <div className="mx-auto w-full max-w-3xl animate-pulse p-6">
        <div className="h-4 w-32 rounded bg-gray-200" />
        <div className="mt-6 h-6 w-2/3 rounded bg-gray-200" />
        <div className="mt-2 h-4 w-1/3 rounded bg-gray-200" />
        <div className="mt-6 h-4 w-1/2 rounded bg-gray-200" />
        <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
        <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
        <div className="mt-6 h-10 w-32 rounded bg-gray-200" />
      </div>
    </div>
  );
}
