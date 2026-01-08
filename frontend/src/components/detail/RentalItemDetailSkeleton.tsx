export function RentalItemDetailSkeleton() {
  return (
    <div className="min-h-screen w-md animate-pulse bg-white pb-[115px]">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="h-6 w-6 rounded-full bg-gray-200" />
        <div className="flex gap-3">
          <div className="h-6 w-6 rounded-full bg-gray-200" />
          <div className="h-6 w-6 rounded-full bg-gray-200" />
        </div>
      </div>

      {/* Image Skeleton */}
      <div className="aspect-square w-full bg-gray-200" />

      {/* Seller Info Skeleton */}
      <div className="border-b border-gray-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gray-200" />
          <div className="flex-1">
            <div className="mb-2 h-4 w-24 rounded bg-gray-200" />
            <div className="h-3 w-32 rounded bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Info Skeleton */}
      <div className="px-4 py-5">
        <div className="mb-3 h-6 w-3/4 rounded bg-gray-200" />
        <div className="mb-4 h-4 w-1/4 rounded bg-gray-200" />

        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="h-4 w-24 rounded bg-gray-200" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="h-4 w-24 rounded bg-gray-200" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="h-4 w-32 rounded bg-gray-200" />
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />
        </div>
      </div>

      <hr className="mx-auto h-[0.5px] w-[90%] border-none bg-gray-200" />

      {/* Similar Items Skeleton */}
      <div className="px-4 py-5">
        <div className="mb-4 h-5 w-32 rounded bg-gray-200" />
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="w-32 flex-shrink-0">
              <div className="mb-2 aspect-square w-full rounded-lg bg-gray-200" />
              <div className="mb-1 h-4 w-full rounded bg-gray-200" />
              <div className="h-3 w-2/3 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      <hr className="mx-auto h-[0.5px] w-[90%] border-none bg-gray-200" />

      {/* Seller Items Skeleton */}
      <div className="px-4 py-5">
        <div className="mb-4 h-5 w-40 rounded bg-gray-200" />
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="w-32 flex-shrink-0">
              <div className="mb-2 aspect-square w-full rounded-lg bg-gray-200" />
              <div className="mb-1 h-4 w-full rounded bg-gray-200" />
              <div className="h-3 w-2/3 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar Skeleton */}
      <div className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 border-t border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200" />
            <div>
              <div className="mb-1 h-3 w-16 rounded bg-gray-200" />
              <div className="h-5 w-24 rounded bg-gray-200" />
            </div>
          </div>
          <div className="h-12 w-32 rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  )
}
