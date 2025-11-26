import { useInfiniteQuery } from '@tanstack/react-query'
import type { RentalItemsQueryResponse } from '@/models/RentalItem'
import { getRentalItems } from '@/api/main'

export function useRentalItems() {
  return useInfiniteQuery<RentalItemsQueryResponse>({
    queryKey: ['rentalItems'],
    queryFn: ({ pageParam }) => getRentalItems(pageParam as number),
    getNextPageParam: lastPage => {
      if (lastPage.page + 1 < lastPage.totalPages) {
        return lastPage.page + 1
      }
      return undefined
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000
  })
}
