import type { GetOtherRentalItemsBySellerResponse } from '@/api/rentall_item/dto/GetOtherRentalItemsBySeller'
import { getOtherRentalItemsBySeller } from '@/api/rentall_item/rentalItem'
import { useQuery } from '@tanstack/react-query'

export function useGetUserRentalItems(
  excludeRentalItemId: string,
  sellerId: string
) {
  return useQuery<GetOtherRentalItemsBySellerResponse>({
    queryKey: ['sellerRentalItems', excludeRentalItemId, sellerId],
    queryFn: () => getOtherRentalItemsBySeller(excludeRentalItemId, sellerId),
    staleTime: 5 * 60 * 1000
  })
}
