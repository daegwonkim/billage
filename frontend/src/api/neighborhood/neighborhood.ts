import type { LocateNeighborhoodQueryRequest } from './dto/LocateNeighborhoodQuery'
import type {
  NearbyNeighborhoodsQueryRequest,
  NearbyNeighborhoodsQueryResponse
} from './dto/NearbyNeighborhoodsQuery'
import { ApiError, type ApiErrorResponse } from '../error'

const API_BASE_URL = import.meta.env.API_BASE_URL!

export async function nearbyNeighborhoods(
  request: NearbyNeighborhoodsQueryRequest
): Promise<NearbyNeighborhoodsQueryResponse> {
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
  request: LocateNeighborhoodQueryRequest
) {
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
