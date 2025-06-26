'use client';

export default function ContributeLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Languages */}
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="h-6 w-20 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="h-6 w-12 bg-gray-200 rounded-md animate-pulse"></div>
            </div>

            {/* Stats */}
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Button */}
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
