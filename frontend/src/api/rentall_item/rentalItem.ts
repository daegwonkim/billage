import type {
  RegisterRentalItemRequest,
  RegisterRentalItemResponse
} from './dto/RegisterRentalItem'
import type { GetRentalItemsResponse } from './dto/GetRentalItems'
import type { GetOtherRentalItemsBySellerResponse } from './dto/GetOtherRentalItemsBySeller'
import type { GetSimilarRentalItemsResponse } from './dto/GetSimilarRentalItems'
import type { GetRentalItemResponse } from './dto/GetRentalItem'
import type { GetRentalItemCategoriesResponse } from './dto/GetRentalItemCategories'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL!

export async function getRentalItemCategories(): Promise<GetRentalItemCategoriesResponse> {
  const response = await fetch(`${API_BASE_URL}/api/rental-items/categories`)
  if (!response.ok) throw new Error('Failed to fetch rental items')
  return response.json()
}

export async function getRentalItems(
  page = 0,
  size = 10,
  sortBy = 'CREATED_AT',
  sortDirection = 'DESC',
  category?: string
): Promise<GetRentalItemsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortDirection
  })
  if (category) {
    params.append('category', category)
  }
  const response = await fetch(`${API_BASE_URL}/api/rental-items?${params}`)
  if (!response.ok) throw new Error('Failed to fetch rental items')
  return response.json()
}

export async function getRentalItem(
  rentalItemId: string
): Promise<GetRentalItemResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/rental-items/${rentalItemId}`
  )
  if (!response.ok) throw new Error('Failed to fetch rental item')
  return response.json()
}

export async function getSimilarRentalItems(
  rentalItemId: string
): Promise<GetSimilarRentalItemsResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/rental-items/${rentalItemId}/similar`
  )
  if (!response.ok) throw new Error('Failed to fetch rental item')
  return response.json()
}

export async function getOtherRentalItemsBySeller(
  excludeRentalItemId: string,
  sellerId: string
): Promise<GetOtherRentalItemsBySellerResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/rental-items/${excludeRentalItemId}/other/${sellerId}`
  )
  if (!response.ok) throw new Error('Failed to fetch rental item')
  return response.json()
}

export async function register(
  request: RegisterRentalItemRequest
): Promise<RegisterRentalItemResponse> {
  const response = await fetch(`${API_BASE_URL}/api/rental-items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })

  if (!response.ok) throw new Error('Failed to fetch rental item')
  return response.json()
}
