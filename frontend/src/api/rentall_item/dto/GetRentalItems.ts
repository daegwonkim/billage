export interface GetRentalItemsResponse {
  content: GetRentalItemsItem[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface GetRentalItemsItem {
  id: string
  name: string
  thumbnailImageUrl: string
  address: string
  pricePerDay: number
  pricePerWeek: number
  rentals: number
  chats: number
  likes: number
  createdAt: Date
}
