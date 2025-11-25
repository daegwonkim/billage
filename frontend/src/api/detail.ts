import type {
  RentalItemDetailResponse,
  RentalItemSimilarResponse
} from '@/models/RentalItem'

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
): Promise<RentalItemSimilarResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/rental-items/${rentalItemId}/similar`
  )
  if (!response.ok) throw new Error('Failed to fetch rental item')
  return response.json()
}

export async function getUserRentalItems(
  userId: string,
  excludeRentalItemId: string
): Promise<RentalItemSimilarResponse> {
  const params = new URLSearchParams({
    excludeRentalItemId
  })
  const response = await fetch(
    `${API_BASE_URL}/api/users/${userId}/rental-items?${params}`
  )
  if (!response.ok) throw new Error('Failed to fetch rental item')
  return response.json()
}
