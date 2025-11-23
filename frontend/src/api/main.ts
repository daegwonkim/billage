import type { CategoryViewModel } from '@/models/Category'
import type {
  RentalItemCardViewModel,
  RentalItemDetailViewModel
} from '@/models/RentalItem'

export async function getCategories(): Promise<CategoryViewModel[]> {
  const response = await fetch('/api/categories')
  if (!response.ok) throw new Error('Failed to fetch categories')
  return response.json()
}

export async function getRentalItems(): Promise<RentalItemCardViewModel[]> {
  const response = await fetch('/api/rental-items')
  if (!response.ok) throw new Error('Failed to fetch rental items')
  return response.json()
}

export async function getRentalItem(
  id: string
): Promise<RentalItemDetailViewModel> {
  const response = await fetch(`/api/rental-items/${id}`)
  if (!response.ok) throw new Error('Failed to fetch rental items')
  return response.json()
}
