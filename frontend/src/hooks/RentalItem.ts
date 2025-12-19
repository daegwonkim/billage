import type {
  GetRentalItemResponse,
  GetRentalItemsResponse,
  GetSimilarRentalItemsResponse
} from '@/api/rentall_item/dto/GetRentalItems'
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

export function useGetRentalItems() {
  return useInfiniteQuery<GetRentalItemsResponse>({
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

export function useGetSimilarRentalItems(rentalItemId: string) {
  return useQuery<GetSimilarRentalItemsResponse>({
    queryKey: ['similarRentalItems', rentalItemId],
    queryFn: () => getSimilarRentalItems(rentalItemId),
    staleTime: 5 * 60 * 1000
  })
}
