import type { GetUserRentalItemsResponse } from '@/api/user/dto/GetUserRentalItems'
import { getUserRentalItems } from '@/api/user/user'
import { useQuery } from '@tanstack/react-query'

export function useGetUserRentalItems(
  userId: number,
  excludeRentalItemId?: number
) {
  return useQuery<GetUserRentalItemsResponse>({
    queryKey: ['userRentalItems', userId, excludeRentalItemId],
    queryFn: () => getUserRentalItems(userId, excludeRentalItemId)
  })
}
