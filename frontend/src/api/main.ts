import type { RentalItemCategoryResponse } from '@/models/RentalItemCategory'
import type { RentalItemsQueryResponse } from '@/models/RentalItem'

const API_BASE_URL = 'http://localhost:8080'

export async function getCategories(): Promise<RentalItemCategoryResponse> {
  const response = await fetch(`${API_BASE_URL}/api/rental-items/category`)
  if (!response.ok) throw new Error('Failed to fetch categories')
  return response.json()
}

export async function getRentalItems(
  page = 0,
  size = 20,
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
