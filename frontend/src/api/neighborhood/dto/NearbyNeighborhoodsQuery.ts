export interface NearbyNeighborhoodsQueryRequest {
  latitude: string
  longitude: string
}

export interface NearbyNeighborhoodsQueryResponse {
  neighborhoods: Neighborhood[]
}

interface Neighborhood {
  name: string
  code: string
}
