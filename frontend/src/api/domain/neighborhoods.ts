import type { LocateNeighborhoodQueryRequest } from '../dto/LocateNeighborhoodQuery'
import type {
  NearbyNeighborhoodsQueryRequest,
  NearbyNeighborhoodsQueryResponse
} from '../dto/NearbyNeighborhoodsQuery'

// const API_BASE_URL = 'https://billage.onrender.com'
const API_BASE_URL = 'http://localhost:8080'

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
  if (!response.ok) throw new Error('Failed to query nearby neighborhoods')

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
