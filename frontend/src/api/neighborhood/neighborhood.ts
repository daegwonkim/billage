import type {
  LocateNeighborhoodRequest,
  LocateNeighborhoodResponse
} from './dto/LocateNeighborhood'
import type {
  NearbyNeighborhoodsRequest,
  NearbyNeighborhoodsResponse
} from './dto/NearbyNeighborhoods'
import { ApiError, type ApiErrorResponse } from '../error'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL!

export async function nearbyNeighborhoods(
  request: NearbyNeighborhoodsRequest
): Promise<NearbyNeighborhoodsResponse> {
  const params = new URLSearchParams({
    latitude: request.latitude,
    longitude: request.longitude
  })
  const response = await fetch(
    `${API_BASE_URL}/api/neighborhoods/nearby?${params}`,
    {
      method: 'GET'
    }
  )
  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json()
    throw new ApiError(
      errorData.code,
      errorData.message,
      response.status,
      errorData.path,
      errorData.errors
    )
  }

  return response.json()
}

export async function locateNeighborhood(
  request: LocateNeighborhoodRequest
): Promise<LocateNeighborhoodResponse> {
  const params = new URLSearchParams({
    latitude: request.latitude,
    longitude: request.longitude
  })
  const response = await fetch(
    `${API_BASE_URL}/api/neighborhoods/locate?${params}`,
    {
      method: 'GET'
    }
  )
  if (!response.ok) throw new Error('Failed to query locate neighborhoods')

  return response.json()
}
