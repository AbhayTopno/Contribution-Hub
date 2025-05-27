'use client';

import { Badge } from '@/components/ui/badge';

export default function FilterBar() {
  return (
    <div className="border-b border-gray-100 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center space-x-2 overflow-x-auto">
          <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
            Tech Stack:
          </span>
          <div className="flex space-x-2">
            {['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript'].map(
              (tech) => (
                <Badge
                  key={tech}
                  variant="outline"
                  className="cursor-pointer hover:bg-black hover:text-white transition-colors border-gray-300"
                >
                  {tech}
                </Badge>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
