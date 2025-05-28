'use client';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  title: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
}

export default function SearchBar({
  title,
  searchTerm,
  onSearchChange,
  onClearSearch,
}: SearchBarProps) {
  return (
    <div className="relative mb-6 flex-shrink-0">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder={`Search ${
          title === 'Tech Stack' ? 'technologies' : title.toLowerCase()
        }...`}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-10 border-gray-300 bg-white/50 backdrop-blur-sm"
      />
      {searchTerm && (
        <button
          onClick={onClearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
