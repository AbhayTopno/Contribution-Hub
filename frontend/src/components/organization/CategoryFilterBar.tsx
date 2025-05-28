'use client';

import { Button } from '@/components/ui/button';
import { RotateCcw, X } from 'lucide-react';

interface CategoryFilterBarProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  loading?: boolean;
}

export default function CategoryFilterBar({
  categories = [],
  selectedCategory,
  onSelectCategory,
  onResetFilters,
  hasActiveFilters,
  loading = false,
}: CategoryFilterBarProps) {
  if (loading) {
    return (
      <div className="border-b border-gray-200 bg-white/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-7 w-16 bg-gray-200 rounded-full animate-pulse"
              ></div>
            ))}
            <div className="h-7 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-gray-200 bg-white/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {/* Title - Top Left */}
          <h3 className="text-sm font-medium text-gray-700">Categories</h3>

          {/* Categories - Wrapped Center */}
          <div className="flex flex-wrap gap-2 mx-8">
            {categories.length === 0 ? (
              <span className="text-gray-500 text-xs">
                No categories available
              </span>
            ) : (
              categories.map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    onSelectCategory(
                      selectedCategory === category ? null : category
                    )
                  }
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200
                    flex items-center gap-1.5
                    ${
                      selectedCategory === category
                        ? 'bg-black text-white'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <span>{category}</span>
                  {selectedCategory === category && (
                    <X className="h-3 w-3 text-white" />
                  )}
                </button>
              ))
            )}
          </div>

          {/* Reset Button - Bottom Right */}
          {hasActiveFilters ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="text-gray-600 hover:text-white h-7"
            >
              <RotateCcw className="mr-1 h-3 w-3" />
              Reset
            </Button>
          ) : (
            <div className="h-7 w-16"></div> // Placeholder to maintain layout
          )}
        </div>
      </div>
    </div>
  );
}
