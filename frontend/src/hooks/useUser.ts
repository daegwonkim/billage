import type { GetMeResponse } from '@/api/user/dto/GetMe'
import type { GetUserRentalItemsResponse } from '@/api/user/dto/GetUserRentalItems'
import { getMe, getUserRentalItems } from '@/api/user/user'
import { useQuery } from '@tanstack/react-query'

export function useGetMe() {
  return useQuery<GetMeResponse>({
    queryKey: ['me'],
    queryFn: () => getMe()
  })
}

export function useGetUserRentalItems(
  userId: number | undefined,
  excludeRentalItemId?: number
) {
  return useQuery<GetUserRentalItemsResponse>({
    queryKey: ['userRentalItems', userId, excludeRentalItemId],
    queryFn: () => getUserRentalItems(userId!, excludeRentalItemId),
    enabled: !!userId
  })
}
