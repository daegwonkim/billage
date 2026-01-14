import type { GetRentalItemResponse } from '@/api/rentall_item/dto/GetRentalItem'
import type { GetRentalItemCategoriesResponse } from '@/api/rentall_item/dto/GetRentalItemCategories'
import type { GetRentalItemsResponse } from '@/api/rentall_item/dto/GetRentalItems'
import type { GetRentalItemSortOptionsResponse } from '@/api/rentall_item/dto/GetRentalItemSortOptions'
import type { GetSimilarRentalItemsResponse } from '@/api/rentall_item/dto/GetSimilarRentalItems'
import {
  getRentalItem,
  getRentalItemCategories,
  getRentalItems,
  getRentalItemSortOptions,
  getSimilarRentalItems
} from '@/api/rentall_item/rentalItem'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

export function useGetRentalItemCategories() {
  return useQuery<GetRentalItemCategoriesResponse>({
    queryKey: ['categories'],
    queryFn: () => getRentalItemCategories(),
    staleTime: 5 * 60 * 1000
  })
}

export function useGetRentalItemSortOptions() {
  return useQuery<GetRentalItemSortOptionsResponse>({
    queryKey: ['sortOptions'],
    queryFn: () => getRentalItemSortOptions(),
    staleTime: 5 * 60 * 1000
  })
}

export function useGetRentalItem(id: string) {
  return useQuery<GetRentalItemResponse>({
    queryKey: ['rentalItem', id],
    queryFn: () => getRentalItem(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000
  })
}

export function useGetRentalItems(sortBy: string, category?: string) {
  return useInfiniteQuery<GetRentalItemsResponse>({
    queryKey: ['rentalItems', category, sortBy],
    queryFn: ({ pageParam }) =>
      getRentalItems(pageParam as number, 10, sortBy, category),
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
