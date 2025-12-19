export interface GetRentalItemResponse {
  id: string
  seller: Seller
  category: string
  title: string
  description: string
  imageUrls: string[]
  pricePerDay: number
  pricePerWeek: number
  rentalCount: number
  likeCount: number
  viewCount: number
  likeed: boolean
  createdAt: Date
}

export interface Seller {
  id: string
  nickname: string
  address: string
  profileImageUrl: string
}
