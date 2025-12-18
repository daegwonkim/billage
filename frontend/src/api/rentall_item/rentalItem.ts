import type {
  RentalItemDetailResponse,
  RentalItemsQueryResponse,
  SimilarRentalItemsQueryResponse
} from './dto/RentalItemsQuery'
import type { UserRentalItemsQueryResponse } from './dto/UserRentalItemsQuery'

const API_BASE_URL = import.meta.env.API_BASE_URL!

export async function getRentalItems(
  page = 0,
  size = 10,
  sortBy = 'CREATED_AT',
  sortDirection = 'DESC'
): Promise<RentalItemsQueryResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortDirection
  })
  const response = await fetch(`${API_BASE_URL}/api/rental-items?${params}`)
  if (!response.ok) throw new Error('Failed to fetch rental items')
  return response.json()
}

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
