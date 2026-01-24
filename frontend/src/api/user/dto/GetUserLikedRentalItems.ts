export interface GetUserLikedRentalItemsResponse {
  rentalItems: RentalItem[]
}

interface RentalItem {
  id: number
  sellerId: number
  title: string
  thumbnailImageUrl?: string
  pricePerDay?: number
  pricePerWeek?: number
  address: string
  liked: boolean
  stats: RentalItemStats
  createdAt: Date
}

interface RentalItemStats {
  rentalCount: number
  likeCount: number
  viewCount: number
}
