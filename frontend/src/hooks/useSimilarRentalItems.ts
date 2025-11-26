import { useQuery } from '@tanstack/react-query'
import type { SimilarRentalItemResponse } from '@/models/RentalItem'
import { getSimilarRentalItems } from '@/api/detail'

export function useSimilarRentalItems(rentalItemId: string) {
  return useQuery<SimilarRentalItemResponse>({
    queryKey: ['similarRentalItems', rentalItemId],
    queryFn: () => getSimilarRentalItems(rentalItemId),
    staleTime: 5 * 60 * 1000
  })
}
