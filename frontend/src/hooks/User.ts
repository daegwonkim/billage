import type { GetUserRentalItemsResponse } from '@/api/rentall_item/dto/GetUserRentalItems'
import { getGetUserRentalItems } from '@/api/rentall_item/rentalItem'
import { useQuery } from '@tanstack/react-query'

export function useGetUserRentalItems(
  sellerId: string,
  excludeRentalItemId: string
) {
  return useQuery<GetUserRentalItemsResponse>({
    queryKey: ['sellerRentalItems', sellerId, excludeRentalItemId],
    queryFn: () => getGetUserRentalItems(sellerId, excludeRentalItemId),
    staleTime: 5 * 60 * 1000
  })
}
