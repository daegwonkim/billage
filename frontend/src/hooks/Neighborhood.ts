import {
  locateNeighborhood,
  nearbyNeighborhoods
} from '@/api/domain/neighborhoods'
import type {
  LocateNeighborhoodQueryRequest,
  LocateNeighborhoodQueryResponse
} from '@/api/dto/LocateNeighborhoodQuery'
import type {
  NearbyNeighborhoodsQueryRequest,
  NearbyNeighborhoodsQueryResponse
} from '@/api/dto/NearbyNeighborhoodsQuery'
import { useQuery } from '@tanstack/react-query'

export function useNearbyNeighborhoods(
  request: NearbyNeighborhoodsQueryRequest,
  enabled: boolean = true
) {
  return useQuery<NearbyNeighborhoodsQueryResponse>({
    queryKey: ['neighborhoods', request.latitude, request.longitude],
    queryFn: () => nearbyNeighborhoods(request),
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!request.latitude && !!request.longitude
  })
}

export function useLocateNeighborhood(
  request: LocateNeighborhoodQueryRequest,
  enabled: boolean = true
) {
  return useQuery<LocateNeighborhoodQueryResponse>({
    queryKey: ['neighborhood', request.latitude, request.longitude],
    queryFn: () => locateNeighborhood(request),
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!request.latitude && !!request.longitude
  })
}
