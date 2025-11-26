import type {
  RentalItemDetailResponse,
  SimilarRentalItemResponse
} from '@/models/RentalItem'
import type { SellerRentalItemsResponse } from '@/models/User'

const API_BASE_URL = 'http://localhost:8080'

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
): Promise<SimilarRentalItemResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/rental-items/${rentalItemId}/similar`
  )
  if (!response.ok) throw new Error('Failed to fetch rental item')
  return response.json()
}

export async function getSellerRentalItems(
  sellerId: string,
  excludeRentalItemId: string
): Promise<SellerRentalItemsResponse> {
  const params = new URLSearchParams({
    excludeRentalItemId
  })
  const response = await fetch(
    `${API_BASE_URL}/api/users/${sellerId}/rental-items?${params}`
  )
  if (!response.ok) throw new Error('Failed to fetch rental item')
  return response.json()
}
