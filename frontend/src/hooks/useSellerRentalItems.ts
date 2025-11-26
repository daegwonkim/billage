import { useQuery } from '@tanstack/react-query'
import { getSellerRentalItems } from '@/api/detail'
import type { SellerRentalItemsResponse } from '@/models/User'

export function useSellerRentalItems(
  sellerId: string,
  excludeRentalItemId: string
) {
  return useQuery<SellerRentalItemsResponse>({
    queryKey: ['sellerRentalItems', sellerId, excludeRentalItemId],
    queryFn: () => getSellerRentalItems(sellerId, excludeRentalItemId),
    staleTime: 5 * 60 * 1000
  })
}
