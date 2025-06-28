"use client"

export default function RepositoryLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Hero skeleton */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 mb-8">
          <div className="space-y-4">
            <div className="h-6 w-32 bg-gray-600 rounded animate-pulse"></div>
            <div className="h-12 w-64 bg-gray-600 rounded animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-600 rounded animate-pulse"></div>
            <div className="flex gap-3">
              <div className="h-8 w-20 bg-gray-600 rounded-full animate-pulse"></div>
              <div className="h-8 w-24 bg-gray-600 rounded-full animate-pulse"></div>
              <div className="h-8 w-28 bg-gray-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Contributors skeleton */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Issues skeleton */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Stats skeleton */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
