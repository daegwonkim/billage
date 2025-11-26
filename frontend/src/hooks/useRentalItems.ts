import { useQuery } from '@tanstack/react-query'
import type { RentalItemsQueryResponse } from '@/models/RentalItem'
import { getRentalItems } from '@/api/main'

export function useRentalItems() {
  return useQuery<RentalItemsQueryResponse>({
    queryKey: ['rentalItems'],
    queryFn: () => getRentalItems(),
    staleTime: 5 * 60 * 1000
  })
}
