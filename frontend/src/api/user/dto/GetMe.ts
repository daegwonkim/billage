export interface GetMeResponse {
  nickname: string
  profileImageUrl: string
  lastActiveAt: string
  neighborhoodVerifiedAt: string
  rentOutCount: number
  rentInCount: number
  createdAt: string
  neighborhood: Neighborhood
}

interface Neighborhood {
  sido: string
  sigungu: string
  eupmyeondong: string
}
