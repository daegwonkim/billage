import { Header } from '../common/Header'

export function HomeSkeleton() {
  return (
    <div className="min-h-screen w-md animate-pulse bg-white">
      <Header />

      {/* FilterSortBar Skeleton */}
      <div className="sticky top-13 z-40 border-b border-gray-100 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="h-5 w-5 rounded-full bg-gray-200" />
            <div className="h-5 w-32 rounded bg-gray-200" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-16 rounded-lg bg-gray-200" />
            <div className="h-8 w-16 rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Rental Items List Skeleton */}
      <div className="pb-[42px]">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div
            key={i}
            className="border-b border-gray-100 bg-white p-4">
            <div className="flex gap-3">
              {/* Image Skeleton */}
              <div className="h-35 w-35 shrink-0 rounded bg-gray-200" />

              {/* Content Skeleton */}
              <div className="flex min-w-0 flex-1 flex-col justify-between py-3">
                <div>
                  {/* Title Skeleton */}
                  <div className="mb-1.5 h-4 w-full rounded bg-gray-200" />
                  <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />

                  {/* Location & Time Skeleton */}
                  <div className="mb-2 h-3 w-2/3 rounded bg-gray-200" />
                </div>

                <div>
                  {/* Price Skeleton */}
                  <div className="mb-1 h-4 w-24 rounded bg-gray-200" />
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-24 rounded bg-gray-200" />
                    <div className="flex gap-2.5">
                      <div className="h-3 w-8 rounded bg-gray-200" />
                      <div className="h-3 w-8 rounded bg-gray-200" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
