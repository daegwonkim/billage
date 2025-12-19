import fetchWithToken from '../fetchWithToken'
import type {
  RegisterRentalItemRequest,
  RegisterRentalItemResponse
} from './dto/RentalItemRegister'
import type {
  GetRentalItemResponse,
  GetRentalItemsResponse,
  GetSimilarRentalItemsResponse
} from './dto/RentalItemsQuery'
import type { GetUserRentalItemsResponse } from './dto/UserRentalItemsQuery'

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL!
const API_BASE_URL = 'http://localhost:8080'

export async function getRentalItems(
  page = 0,
  size = 10,
  sortBy = 'CREATED_AT',
  sortDirection = 'DESC'
): Promise<GetRentalItemsResponse> {
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

export async function getGetUserRentalItems(
  sellerId: string,
  excludeRentalItemId: string
): Promise<GetUserRentalItemsResponse> {
  const params = new URLSearchParams({
    excludeRentalItemId
  })
  const response = await fetch(
    `${API_BASE_URL}/api/users/${sellerId}/rental-items?${params}`
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
