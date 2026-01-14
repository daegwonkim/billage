import {
  locateNeighborhood,
  nearbyNeighborhoods
} from '@/api/neighborhood/neighborhood'
import type {
  LocateNeighborhoodRequest,
  LocateNeighborhoodResponse
} from '@/api/neighborhood/dto/LocateNeighborhood'
import type {
  NearbyNeighborhoodsRequest,
  NearbyNeighborhoodsResponse
} from '@/api/neighborhood/dto/NearbyNeighborhoods'
import { useQuery } from '@tanstack/react-query'

export function useNearbyNeighborhoods(
  request: NearbyNeighborhoodsRequest,
  enabled: boolean = true
) {
  return useQuery<NearbyNeighborhoodsResponse>({
    queryKey: ['neighborhoods', request.latitude, request.longitude],
    queryFn: () => nearbyNeighborhoods(request),
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!request.latitude && !!request.longitude
  })
}

export function useLocateNeighborhood(
  request: LocateNeighborhoodRequest,
  enabled: boolean = true
) {
  return useQuery<LocateNeighborhoodResponse>({
    queryKey: ['neighborhood', request.latitude, request.longitude],
    queryFn: () => locateNeighborhood(request),
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!request.latitude && !!request.longitude
  })
}
