import { Search } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-6 border-b border-gray-200 bg-white px-6">
      <span className="text-xl font-bold text-blue-700">Internship Hub</span>

      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search internships..."
          className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="ml-auto flex items-center gap-4">
        <button className="text-sm font-medium text-gray-700 hover:text-blue-700">
          Log in
        </button>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Sign up
        </button>
      </div>
    </header>
  );
}
