'use client';
import { useState, useRef } from 'react';
import VerticalTitle from './sidebar/VerticalTitle';
import SidebarContent from './sidebar/SidebarContent';
import { useSidebarHover } from './sidebar/useSidebarHover';

interface SidebarFilterProps {
  title: string;
  items: string[];
  selectedItems: string[];
  onSelectItems: (items: string[]) => void;
  side: 'left' | 'right';
  loading?: boolean;
}

export default function SidebarFilter({
  title,
  items = [],
  selectedItems = [],
  onSelectItems,
  side,
  loading = false,
}: SidebarFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const sidebarRef = useRef<HTMLDivElement>(null);

  useSidebarHover({ sidebarRef, isExpanded, setIsExpanded });

  // Ensure selectedItems is always an array
  const safeSelectedItems = selectedItems || [];

  const handleSelectItem = (item: string) => {
    if (safeSelectedItems.includes(item)) {
      // Remove item if already selected
      onSelectItems(safeSelectedItems.filter((selected) => selected !== item));
    } else {
      // Add item if not selected
      onSelectItems([...safeSelectedItems, item]);
    }
  };

  const handleClearAll = () => {
    onSelectItems([]);
  };

  const handleClearSearch = () => setSearchTerm('');

  const getPositioning = () => ({
    collapsed: side === 'left' ? 'left-0' : 'right-0',
    expanded: side === 'left' ? 'left-0' : 'right-0',
    borderRadius: side === 'left' ? 'rounded-r-2xl' : 'rounded-l-2xl',
  });

  const positioning = getPositioning();

  const sidebarClasses = `
    fixed z-40 transition-all duration-300 ease-out
    bg-white/70 backdrop-blur-md border border-gray-200 shadow-lg
    ${positioning.borderRadius}
    ${
      isExpanded
        ? `${positioning.expanded} w-[60vw] h-[72vh] top-1/2 transform -translate-y-1/2`
        : `${positioning.collapsed} w-12 h-[60vh] top-1/2 transform -translate-y-1/2`
    }
  `;

  if (loading) {
    return (
      <div className={sidebarClasses}>
        <div className="flex items-center justify-center h-full">
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={sidebarRef} className={sidebarClasses}>
      <div
        className={`h-full flex ${side === 'right' ? 'flex-row-reverse' : ''}`}
      >
        <VerticalTitle
          title={title}
          isExpanded={isExpanded}
          selectedItems={safeSelectedItems}
          side={side}
        />
        <SidebarContent
          title={title}
          items={items || []}
          selectedItems={safeSelectedItems}
          searchTerm={searchTerm}
          isExpanded={isExpanded}
          onSelectItem={handleSelectItem}
          onSearchChange={setSearchTerm}
          onClearSearch={handleClearSearch}
          onClose={() => setIsExpanded(false)}
          onClearAll={handleClearAll}
        />
      </div>
    </div>
  );
}
