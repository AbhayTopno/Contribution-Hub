'use client';

interface VerticalTitleProps {
  title: string;
  isExpanded: boolean;
  selectedItems: string[];
  side: 'left' | 'right';
}

export default function VerticalTitle({
  title,
  isExpanded,
  selectedItems = [],
  side,
}: VerticalTitleProps) {
  // Ensure selectedItems is always an array
  const safeSelectedItems = selectedItems || [];

  const getVerticalLetters = (text: string) => {
    if (text.toLowerCase().includes('tech stack')) {
      return ['T', 'E', 'C', 'H', '', 'S', 'T', 'A', 'C', 'K'];
    } else if (text.toLowerCase().includes('topics')) {
      return ['T', 'O', 'P', 'I', 'C', 'S'];
    }
    return text.replace(/\s+/g, '').split('');
  };

  const verticalLetters = getVerticalLetters(title);

  return (
    <div
      className={`
        flex flex-col items-center justify-center py-4 border-gray-200/50 transition-all duration-300
        ${isExpanded ? 'w-16' : 'w-12'}
        ${isExpanded && side === 'left' ? 'border-r' : ''}
        ${isExpanded && side === 'right' ? 'border-l' : ''}
      `}
    >
      <div className="flex flex-col items-center space-y-1">
        {verticalLetters.map((letter, index) => (
          <span
            key={index}
            className={`
              font-medium text-gray-700 tracking-wider flex items-center transition-all duration-300
              ${isExpanded ? 'text-sm h-4' : 'text-xs h-3'}
            `}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Multiple Selection Indicators */}
      {safeSelectedItems.length > 0 && (
        <div className="mt-4 flex flex-col items-center space-y-1">
          {safeSelectedItems.length <= 3 ? (
            // Show individual dots for 1-3 selections
            safeSelectedItems.map((item, index) => (
              <div
                key={index}
                className={`
                  bg-black rounded-full transition-all duration-300
                  ${isExpanded ? 'w-2 h-2' : 'w-1.5 h-1.5'}
                `}
                title={item}
              />
            ))
          ) : (
            // Show count for 4+ selections
            <div
              className={`
                bg-black text-white rounded-full flex items-center justify-center font-bold transition-all duration-300
                ${isExpanded ? 'w-6 h-6 text-xs' : 'w-5 h-5 text-[10px]'}
              `}
              title={`${safeSelectedItems.length} items selected`}
            >
              {safeSelectedItems.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
