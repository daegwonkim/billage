import type { GetRentalItemResponse } from '@/api/rentall_item/dto/GetRentalItem'
import type { GetRentalItemsResponse } from '@/api/rentall_item/dto/GetRentalItems'
import type { GetSimilarRentalItemsResponse } from '@/api/rentall_item/dto/GetSimilarRentalItems'
import {
  getRentalItem,
  getRentalItems,
  getSimilarRentalItems
} from '@/api/rentall_item/rentalItem'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

export function useGetRentalItem(id: string) {
  return useQuery<GetRentalItemResponse>({
    queryKey: ['rentalItem', id],
    queryFn: () => getRentalItem(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000
  })
}

export function useGetRentalItems(category?: string) {
  return useInfiniteQuery<GetRentalItemsResponse>({
    queryKey: ['rentalItems', category],
    queryFn: ({ pageParam }) =>
      getRentalItems(pageParam as number, 10, 'CREATED_AT', 'DESC', category),
    getNextPageParam: lastPage => {
      if (lastPage.hasNext) {
        return lastPage.currentPage + 1
      }
      return undefined
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000
  })
}

export function useGetSimilarRentalItems(rentalItemId: string) {
  return useQuery<GetSimilarRentalItemsResponse>({
    queryKey: ['similarRentalItems', rentalItemId],
    queryFn: () => getSimilarRentalItems(rentalItemId),
    staleTime: 5 * 60 * 1000
  })
}
