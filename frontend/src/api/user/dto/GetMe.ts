export interface GetMeResponse {
  nickname: string
  profileImageUrl: string
  neighborhood: Neighborhood
}

interface Neighborhood {
  sido: string
  sigungu: string
  eupmyeondong: string
}
