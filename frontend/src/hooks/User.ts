import { useQuery } from '@tanstack/react-query'
import { getSellerRentalItems } from '@/api/domain/detail'
import type { UserRentalItemsQueryResponse } from '@/api/dto/UserRentalItemsQuery'

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
