import { customFetch } from '../customFetch'
import type { GetMeResponse } from './dto/GetMe'
import type { GetUserRentalItemsResponse } from '../user/dto/GetUserRentalItems'
import type { GetUserLikedRentalItemsResponse } from './dto/GetUserLikedRentalItems'

export async function getMe(): Promise<GetMeResponse> {
  return await customFetch<GetMeResponse>('/api/users/me')
}

export async function getUserRentalItems(
  userId: number,
  excludeRentalItemId?: number
): Promise<GetUserRentalItemsResponse> {
  const params = new URLSearchParams()
  if (excludeRentalItemId !== undefined) {
    params.append('excludeRentalItemId', excludeRentalItemId.toString())
  }

  return await customFetch<GetUserRentalItemsResponse>(
    `/api/users/${userId}/rental-items?${params}`
  )
}

export async function getUserLikedRentalItems(): Promise<GetUserLikedRentalItemsResponse> {
  return await customFetch<GetUserLikedRentalItemsResponse>(
    '/api/users/rental-items/likes'
  )
}
