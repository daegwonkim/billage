import type {
  RentalItemDetailResponse,
  RentalItemsQueryResponse,
  SimilarRentalItemsQueryResponse
} from '@/api/rentall_item/dto/RentalItemsQuery'
import {
  getRentalItem,
  getRentalItems,
  getSimilarRentalItems
} from '@/api/rentall_item/rentalItem'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

export function useRentalItemDetail(id: string) {
  return useQuery<RentalItemDetailResponse>({
    queryKey: ['rentalItem', id],
    queryFn: () => getRentalItem(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000
  })
}

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

export function useSimilarRentalItems(rentalItemId: string) {
  return useQuery<SimilarRentalItemsQueryResponse>({
    queryKey: ['similarRentalItems', rentalItemId],
    queryFn: () => getSimilarRentalItems(rentalItemId),
    staleTime: 5 * 60 * 1000
  })
}
