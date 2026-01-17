import type {
  RegisterRentalItemRequest,
  RegisterRentalItemResponse
} from './dto/RegisterRentalItem'
import type { GetRentalItemsResponse } from './dto/GetRentalItems'
import type { GetOtherRentalItemsBySellerResponse } from './dto/GetOtherRentalItemsBySeller'
import type { GetSimilarRentalItemsResponse } from './dto/GetSimilarRentalItems'
import type { GetRentalItemResponse } from './dto/GetRentalItem'
import type { GetRentalItemCategoriesResponse } from './dto/GetRentalItemCategories'
import type { GetRentalItemSortOptionsResponse } from './dto/GetRentalItemSortOptions'
import { customFetch } from '../customFetch'

export async function getRentalItemCategories(): Promise<GetRentalItemCategoriesResponse> {
  return await customFetch<GetRentalItemCategoriesResponse>(
    `/api/rental-items/categories`
  )
}

export async function getRentalItemSortOptions(): Promise<GetRentalItemSortOptionsResponse> {
  return await customFetch<GetRentalItemSortOptionsResponse>(
    `/api/rental-items/sort-options`
  )
}

export async function getRentalItems(
  page = 0,
  size = 10,
  sortBy = 'LATEST',
  category?: string
): Promise<GetRentalItemsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy
  })
  if (category) {
    params.append('category', category)
  }
  return await customFetch<GetRentalItemsResponse>(
    `/api/rental-items?${params}`
  )
}

export async function getRentalItem(
  rentalItemId: string
): Promise<GetRentalItemResponse> {
  return await customFetch<GetRentalItemResponse>(
    `/api/rental-items/${rentalItemId}`
  )
}

export async function getSimilarRentalItems(
  rentalItemId: string
): Promise<GetSimilarRentalItemsResponse> {
  return await customFetch<GetSimilarRentalItemsResponse>(
    `/api/rental-items/${rentalItemId}/similar`
  )
}

export async function getOtherRentalItemsBySeller(
  excludeRentalItemId: string,
  sellerId: string
): Promise<GetOtherRentalItemsBySellerResponse> {
  return await customFetch<GetOtherRentalItemsBySellerResponse>(
    `/api/rental-items/${excludeRentalItemId}/other/${sellerId}`
  )
}

export async function register(
  request: RegisterRentalItemRequest
): Promise<RegisterRentalItemResponse> {
  return await customFetch<RegisterRentalItemResponse>(`/api/rental-items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })
}
