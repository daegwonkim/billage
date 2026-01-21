import type { GetRentalItemResponse } from '@/api/rentall_item/dto/GetRentalItem'
import type { GetRentalItemCategoriesResponse } from '@/api/rentall_item/dto/GetRentalItemCategories'
import type { GetRentalItemForModifyResponse } from '@/api/rentall_item/dto/GetRentalItemForModify'
import type { GetRentalItemsResponse } from '@/api/rentall_item/dto/GetRentalItems'
import type { GetRentalItemSortOptionsResponse } from '@/api/rentall_item/dto/GetRentalItemSortOptions'
import type { GetSimilarRentalItemsResponse } from '@/api/rentall_item/dto/GetSimilarRentalItems'
import {
  getRentalItem,
  getRentalItemCategories,
  getRentalItemForModify,
  getRentalItems,
  getRentalItemSortOptions,
  getSimilarRentalItems
} from '@/api/rentall_item/rentalItem'
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery
} from '@tanstack/react-query'

interface UseGetRentalItemsOptions {
  keepPreviousData?: boolean
}

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

export function useGetRentalItem(
  id: number,
  options?: { enabled?: boolean }
) {
  return useQuery<GetRentalItemResponse>({
    queryKey: ['rentalItem', id],
    queryFn: () => getRentalItem(id),
    enabled: options?.enabled ?? !!id
  })
}

export function useGetRentalItems(
  sortBy: string,
  category?: string,
  keyword?: string,
  options: UseGetRentalItemsOptions = { keepPreviousData: true }
) {
  return useInfiniteQuery<GetRentalItemsResponse>({
    queryKey: ['rentalItems', category, keyword, sortBy],
    queryFn: ({ pageParam }) =>
      getRentalItems(pageParam as number, 10, sortBy, category, keyword),
    getNextPageParam: lastPage => {
      if (lastPage.hasNext) {
        return lastPage.currentPage + 1
      }
      return undefined
    },
    initialPageParam: 0,
    placeholderData: options.keepPreviousData ? keepPreviousData : undefined
  })
}

export function useGetSimilarRentalItems(rentalItemId: number) {
  return useQuery<GetSimilarRentalItemsResponse>({
    queryKey: ['similarRentalItems', rentalItemId],
    queryFn: () => getSimilarRentalItems(rentalItemId)
  })
}

export function useGetRentalItemForModify(rentalItemId: number) {
  return useQuery<GetRentalItemForModifyResponse>({
    queryKey: ['rentalItemForModify', rentalItemId],
    queryFn: () => getRentalItemForModify(rentalItemId)
  })
}
