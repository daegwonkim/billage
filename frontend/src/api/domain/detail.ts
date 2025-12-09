import type { UserRentalItemsQueryResponse } from '@/api/dto/UserRentalItemsQuery'
import type {
  RentalItemDetailResponse,
  SimilarRentalItemsQueryResponse
} from '../dto/RentalItemsQuery'

const API_BASE_URL = 'https://billage.onrender.com'

export async function getRentalItem(
  rentalItemId: string
): Promise<RentalItemDetailResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/rental-items/${rentalItemId}`
  )
  if (!response.ok) throw new Error('Failed to fetch rental item')
  return response.json()
}

export async function getSimilarRentalItems(
  rentalItemId: string
): Promise<SimilarRentalItemsQueryResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/rental-items/${rentalItemId}/similar`
  )
  if (!response.ok) throw new Error('Failed to fetch rental item')
  return response.json()
}

export async function getSellerRentalItems(
  sellerId: string,
  excludeRentalItemId: string
): Promise<UserRentalItemsQueryResponse> {
  const params = new URLSearchParams({
    excludeRentalItemId
  })
  const response = await fetch(
    `${API_BASE_URL}/api/users/${sellerId}/rental-items?${params}`
  )
  if (!response.ok) throw new Error('Failed to fetch rental item')
  return response.json()
}
