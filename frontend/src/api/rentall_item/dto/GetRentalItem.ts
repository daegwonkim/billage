export interface GetRentalItemResponse {
  id: number
  seller: Seller
  category: string
  title: string
  description: string
  imageUrls: string[]
  pricePerDay: number
  pricePerWeek: number
  liked: boolean
  createdAt: Date
  stats: RentalItemDetailStats
}

export interface RentalItemDetailStats {
  rentalCount: number
  likeCount: number
  viewCount: number
}

export interface Seller {
  id: number
  nickname: string
  address: string
  profileImageUrl: string
}
