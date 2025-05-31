"use client"

export default function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Hero skeleton */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 bg-gray-600 rounded-xl animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-10 w-64 bg-gray-600 rounded animate-pulse"></div>
              <div className="flex gap-3">
                <div className="h-8 w-20 bg-gray-600 rounded-full animate-pulse"></div>
                <div className="h-8 w-24 bg-gray-600 rounded-full animate-pulse"></div>
                <div className="h-8 w-28 bg-gray-600 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
