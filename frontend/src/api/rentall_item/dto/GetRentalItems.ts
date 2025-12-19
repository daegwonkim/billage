export interface GetRentalItemsResponse {
  content: RentalItem[]
  page: number
  size: number
  totalElements: number
  totalPages: number
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
