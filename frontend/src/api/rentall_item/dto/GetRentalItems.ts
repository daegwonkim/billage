export interface GetRentalItemsRequest {
  category: string
  page: number
  size: number
  sortBy: string
  sortDirection: string
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
  id: string
  title: string
  thumbnailImageUrl: string
  address: string
  pricePerDay: number
  pricePerWeek: number
  rentalCount: number
  likeCount: number
  viewCount: number
  createdAt: Date
}
