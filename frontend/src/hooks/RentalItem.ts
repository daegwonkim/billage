import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import type { RentalItemCategoryResponse } from '@/models/RentalItemCategory'
import { getCategories, getRentalItems } from '@/api/main'
import type {
  RentalItemDetailResponse,
  RentalItemsQueryResponse,
  SimilarRentalItemResponse
} from '@/models/RentalItem'
import { getRentalItem, getSimilarRentalItems } from '@/api/detail'

export function useRentalItemCategories() {
  return useQuery<RentalItemCategoryResponse>({
    queryKey: ['rentalItemCategories'],
    queryFn: () => getCategories(),
    staleTime: 5 * 60 * 1000
  })
}

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
  return useQuery<SimilarRentalItemResponse>({
    queryKey: ['similarRentalItems', rentalItemId],
    queryFn: () => getSimilarRentalItems(rentalItemId),
    staleTime: 5 * 60 * 1000
  })
}
