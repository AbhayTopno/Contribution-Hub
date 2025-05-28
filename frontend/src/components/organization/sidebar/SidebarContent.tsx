'use client';
import { X } from 'lucide-react';
import SearchBar from './SearchBar';
import FilterGrid from './FilterGrid';

interface SidebarContentProps {
  title: string;
  items: string[];
  selectedItems: string[];
  searchTerm: string;
  isExpanded: boolean;
  onSelectItem: (item: string) => void;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onClose: () => void;
  onClearAll: () => void;
}

export default function SidebarContent({
  title,
  items = [],
  selectedItems = [],
  searchTerm = '',
  isExpanded,
  onSelectItem,
  onSearchChange,
  onClearSearch,
  onClose,
  onClearAll,
}: SidebarContentProps) {
  // Ensure all arrays are defined
  const safeItems = items || [];
  const safeSelectedItems = selectedItems || [];
  const safeSearchTerm = searchTerm || '';

  const filteredItems = safeItems.filter(
    (item) => item && item.toLowerCase().includes(safeSearchTerm.toLowerCase())
  );

  return (
    <div
      className={`
        flex-1 flex flex-col transition-all duration-300 overflow-hidden
        ${isExpanded ? 'opacity-100 p-6' : 'opacity-0 w-0 p-0'}
      `}
    >
      {isExpanded && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <h3 className="text-xl font-semibold text-gray-900">
              Filter by {title === 'Tech Stack' ? 'Technologies' : title}
              {safeSelectedItems.length > 0 && (
                <span className="ml-2 text-sm text-gray-600">
                  ({safeSelectedItems.length} selected)
                </span>
              )}
            </h3>
            <div className="flex items-center space-x-2">
              {safeSelectedItems.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors duration-200"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/50 rounded transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Search */}
          <SearchBar
            title={title}
            searchTerm={safeSearchTerm}
            onSearchChange={onSearchChange}
            onClearSearch={onClearSearch}
          />

          {/* Selected Items Summary */}
          {safeSelectedItems.length > 0 && (
            <div className="mb-4 flex-shrink-0">
              <div className="flex flex-wrap gap-2">
                {safeSelectedItems.slice(0, 6).map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center px-2 py-1 bg-black text-white text-xs rounded cursor-pointer hover:bg-gray-800 transition-colors duration-200"
                    onClick={() => onSelectItem(item)}
                  >
                    {item}
                    <X className="ml-1 h-3 w-3" />
                  </span>
                ))}
                {safeSelectedItems.length > 6 && (
                  <span className="inline-flex items-center px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                    +{safeSelectedItems.length - 6} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Items Grid */}
          <div className="flex-1 overflow-y-auto">
            <FilterGrid
              items={filteredItems}
              selectedItems={safeSelectedItems}
              onSelectItem={onSelectItem}
            />
          </div>
        </>
      )}
    </div>
  );
}
