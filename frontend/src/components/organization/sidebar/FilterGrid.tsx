'use client';

interface FilterGridProps {
  items: string[];
  selectedItems: string[];
  onSelectItem: (item: string) => void;
}

export default function FilterGrid({
  items,
  selectedItems = [],
  onSelectItem,
}: FilterGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="text-gray-500 text-sm text-center py-8">
        No items found
      </div>
    );
  }

  // Ensure selectedItems is always an array
  const safeSelectedItems = selectedItems || [];

  return (
    <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-3">
      {items.map((item) => (
        <label
          key={item}
          className="flex items-center space-x-3 cursor-pointer hover:bg-white/30 p-3 rounded transition-colors duration-200"
        >
          <div className="relative">
            <input
              type="checkbox"
              checked={safeSelectedItems.includes(item)}
              onChange={() => onSelectItem(item)}
              className="sr-only"
            />
            <div
              className={`
                w-4 h-4 border-2 rounded cursor-pointer transition-all duration-200
                ${
                  safeSelectedItems.includes(item)
                    ? 'bg-black border-black'
                    : 'bg-white border-gray-400 hover:border-gray-600'
                }
              `}
            >
              {safeSelectedItems.includes(item) && (
                <svg
                  className="w-3 h-3 text-white absolute top-0.5 left-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>
          <span className="text-sm text-gray-800 flex-1 min-w-0 font-medium cursor-pointer">
            {item}
          </span>
        </label>
      ))}
    </div>
  );
}
