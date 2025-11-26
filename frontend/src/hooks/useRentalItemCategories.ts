import { useQuery } from '@tanstack/react-query'
import type { RentalItemCategoryResponse } from '@/models/RentalItemCategory'
import { getCategories } from '@/api/main'

export function useRentalItemCategories() {
  return useQuery<RentalItemCategoryResponse>({
    queryKey: ['rentalItemCategories'],
    queryFn: () => getCategories(),
    staleTime: 5 * 60 * 1000
  })
}
