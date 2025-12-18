export interface SignUpRequest {
  phoneNo: string
  verifiedToken: string
  neighborhood: Neighborhood
}

interface Neighborhood {
  latitude?: string
  longitude?: string
  code: string
}
