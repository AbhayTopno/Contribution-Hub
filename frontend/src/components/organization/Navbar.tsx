'use client';
import { Input } from '@/components/ui/input';
import type React from 'react';
import { JetBrains_Mono } from 'next/font/google';
import { Search } from 'lucide-react';

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] });

interface NavbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function Navbar({ searchTerm, setSearchTerm }: NavbarProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchTerm('');
  };

  return (
    <nav className="border-b border-gray-200 bg-white/30 backdrop-blur-md fixed top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Title */}
          <div className="flex-shrink-0">
            <h1
              className={`text-2xl font-bold tracking-tight ${jetbrainsMono.className}`}
            >
              Contribution Hub
            </h1>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center space-x-4 flex-1 max-w-2xl mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 border-gray-300 bg-slate-100 hover:border-black transition-all duration-300 ease-in-out"
              />
              {searchTerm && (
                <button
                  onClick={handleSearchClear}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
