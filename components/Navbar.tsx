import { Search } from "lucide-react";

interface NavbarProps {
  searchText: string;
  onSearchChange: (value: string) => void;
}

export default function Navbar({ searchText, onSearchChange }: NavbarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-4 lg:gap-6 lg:px-6">
      <span className="shrink-0 text-lg font-bold text-blue-700 lg:text-xl">Internship Hub</span>

      <div className="relative min-w-0 flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search internships..."
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2 lg:gap-4">
        <button className="shrink-0 whitespace-nowrap text-xs font-medium text-gray-700 hover:text-blue-700 lg:text-sm">
          Log in
        </button>
        <button className="shrink-0 whitespace-nowrap rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 lg:px-4 lg:py-2 lg:text-sm">
          Sign up
        </button>
      </div>
    </header>
  );
}
