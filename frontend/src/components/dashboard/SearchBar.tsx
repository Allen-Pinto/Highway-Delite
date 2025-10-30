import { Search, Filter } from 'lucide-react';
import { debounce } from '../../utils/helpers';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export default function SearchBar({ 
  searchQuery, 
  onSearchChange, 
  onToggleFilters 
}: SearchBarProps) {
  
  const handleSearch = debounce((query: string) => {
    onSearchChange(query);
  }, 500);

  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search experiences, locations..."
          defaultValue={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 outline-none transition-all duration-300 text-lg shadow-sm hover:shadow-md"
        />
      </div>
      <button
        onClick={onToggleFilters}
        className="lg:hidden px-6 py-4 rounded-xl border-2 border-gray-200 hover:border-yellow-400 transition-colors flex items-center gap-2"
      >
        <Filter className="w-5 h-5" />
        <span>Filters</span>
      </button>
    </div>
  );
}