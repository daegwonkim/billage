import type {
  LocateNeighborhoodRequest,
  LocateNeighborhoodResponse
} from './dto/LocateNeighborhood'
import type {
  NearbyNeighborhoodsRequest,
  NearbyNeighborhoodsResponse
} from './dto/NearbyNeighborhoods'
import { customFetch } from '../fetch'

export async function nearbyNeighborhoods(
  request: NearbyNeighborhoodsRequest
): Promise<NearbyNeighborhoodsResponse> {
  const params = new URLSearchParams({
    latitude: request.latitude,
    longitude: request.longitude
  })
  return await customFetch<NearbyNeighborhoodsResponse>(
    `/api/neighborhoods/nearby?${params}`,
    {
      method: 'GET'
    }
  )
}

export async function locateNeighborhood(
  request: LocateNeighborhoodRequest
): Promise<LocateNeighborhoodResponse> {
  const params = new URLSearchParams({
    latitude: request.latitude,
    longitude: request.longitude
  })
  return await customFetch<LocateNeighborhoodResponse>(
    `/api/neighborhoods/locate?${params}`,
    {
      method: 'GET'
    }
  )
}
