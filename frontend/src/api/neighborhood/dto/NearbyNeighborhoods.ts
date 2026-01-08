export interface NearbyNeighborhoodsRequest {
  latitude: string
  longitude: string
}

export interface NearbyNeighborhoodsResponse {
  neighborhoods: Neighborhood[]
}

interface Neighborhood {
  name: string
  code: string
}
