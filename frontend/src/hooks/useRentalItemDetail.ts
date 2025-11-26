import { useQuery } from '@tanstack/react-query'
import { getRentalItem } from '@/api/detail'
import type { RentalItemDetailResponse } from '@/models/RentalItem'

export function useRentalItemDetail(id: string) {
  return useQuery<RentalItemDetailResponse>({
    queryKey: ['rentalItem', id],
    queryFn: () => getRentalItem(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000
  })
}
