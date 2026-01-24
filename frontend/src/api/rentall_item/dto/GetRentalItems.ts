export interface GetRentalItemsRequest {
  category: string
  page: number
  size: number
  sortBy: string
}

export interface GetRentalItemsResponse {
  content: RentalItem[]
  currentPage: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface RentalItem {
  id: number
  sellerId: number
  title: string
  thumbnailImageUrl: string
  address: string
  pricePerDay: number
  pricePerWeek: number
  liked: boolean
  createdAt: Date
  stats: RentalItemStats
}

export interface RentalItemStats {
  rentalCount: number
  likeCount: number
  viewCount: number
}
