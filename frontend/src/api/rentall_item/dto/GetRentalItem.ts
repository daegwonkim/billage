export interface GetRentalItemResponse {
  id: number
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
  isLiked: boolean
  createdAt: Date
}

export interface Seller {
  id: number
  nickname: string
  address: string
  profileImageUrl: string
}
