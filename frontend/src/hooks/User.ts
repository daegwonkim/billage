import type { UserRentalItemsQueryResponse } from '@/api/rentall_item/dto/UserRentalItemsQuery'
import { getSellerRentalItems } from '@/api/rentall_item/rentalItem'
import { useQuery } from '@tanstack/react-query'

export function useSellerRentalItems(
  sellerId: string,
  excludeRentalItemId: string
) {
  return useQuery<UserRentalItemsQueryResponse>({
    queryKey: ['sellerRentalItems', sellerId, excludeRentalItemId],
    queryFn: () => getSellerRentalItems(sellerId, excludeRentalItemId),
    staleTime: 5 * 60 * 1000
  })
}
